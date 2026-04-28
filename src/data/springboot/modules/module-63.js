export default {
  id: 63,
  title: 'Практикум: Мониторинг и метрики',
  description: 'Практические задачи по мониторингу Spring Boot приложений: Actuator, custom health indicators, Micrometer метрики, Prometheus, Grafana, distributed tracing и alerting.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Настройка Spring Actuator',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте Spring Boot Actuator для мониторинга приложения: health, info, metrics и другие эндпоинты.',
      requirements: [
        'Подключение spring-boot-starter-actuator зависимости',
        'Настройка доступных эндпоинтов через application.yml',
        'Кастомизация /actuator/info с версией приложения и описанием',
        'Защита Actuator эндпоинтов через Spring Security'
      ],
      expectedOutput: 'GET /actuator/health → { "status":"UP", "components":{ "db":{"status":"UP"}, "redis":{"status":"UP"} } }\n\nGET /actuator/info → { "app":{"name":"Task Manager","version":"1.0.0"}, "java":{"version":"21"} }\n\nGET /actuator/metrics → { "names":["jvm.memory.used","http.server.requests",...] }',
      hint: 'Используйте management.endpoints.web.exposure.include для выбора эндпоинтов. management.endpoint.health.show-details=always для детального health.',
      solution: `// --- application.yml ---
// management:
//   endpoints:
//     web:
//       exposure:
//         include: health,info,metrics,env,loggers,prometheus
//       base-path: /actuator
//   endpoint:
//     health:
//       show-details: always
//       show-components: always
//     info:
//       enabled: true
//   info:
//     env:
//       enabled: true
//     java:
//       enabled: true
//     os:
//       enabled: true
//
// info:
//   app:
//     name: Task Manager
//     description: REST API для управления задачами
//     version: 1.0.0
//   contact:
//     email: dev@example.com

// --- pom.xml ---
// <dependency>
//     <groupId>org.springframework.boot</groupId>
//     <artifactId>spring-boot-starter-actuator</artifactId>
// </dependency>

// --- Security Config для Actuator ---
@Configuration
@EnableWebSecurity
public class ActuatorSecurityConfig {

    @Bean
    public SecurityFilterChain actuatorSecurityFilterChain(HttpSecurity http) throws Exception {
        http.securityMatcher("/actuator/**")
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health").permitAll()
                .requestMatchers("/actuator/info").permitAll()
                .requestMatchers("/actuator/prometheus").permitAll()
                .requestMatchers("/actuator/**").hasRole("ADMIN"))
            .httpBasic(Customizer.withDefaults());
        return http.build();
    }
}

// --- Custom Info Contributor ---
@Component
public class CustomInfoContributor implements InfoContributor {

    @Autowired
    private DataSource dataSource;

    @Override
    public void contribute(Info.Builder builder) {
        builder.withDetail("database", Map.of(
                "type", "PostgreSQL",
                "pool", "HikariCP"
        ));
        builder.withDetail("startup", Map.of(
                "time", LocalDateTime.now().toString(),
                "activeProfiles", System.getProperty("spring.profiles.active", "default")
        ));
    }
}`,
      explanation: 'Spring Actuator предоставляет готовые эндпоинты для мониторинга. /health показывает состояние компонентов (DB, Redis, Disk). /info показывает информацию о приложении. /metrics предоставляет метрики JVM и HTTP. Защита через Security ограничивает доступ: health и info публичные, остальное для админов.'
    },
    {
      id: 2,
      title: 'Задача: Кастомные Health Indicators',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте кастомные health indicators для проверки состояния базы данных, Redis, и внешних API.',
      requirements: [
        'HealthIndicator для проверки доступности базы данных через простой запрос',
        'HealthIndicator для проверки Redis подключения',
        'HealthIndicator для внешнего API с timeout и retry',
        'CompositeHealthContributor для группировки связанных проверок'
      ],
      expectedOutput: 'GET /actuator/health → {\n  "status": "UP",\n  "components": {\n    "database": { "status":"UP", "details":{"responseTime":"5ms"} },\n    "redis": { "status":"UP", "details":{"version":"7.0"} },\n    "paymentApi": { "status":"DOWN", "details":{"error":"Connection timeout"} }\n  }\n}\n\n→ Общий статус: DOWN (один компонент DOWN)',
      hint: 'Реализуйте интерфейс HealthIndicator с методом health(). Используйте Health.up().withDetail("key","value").build() для UP и Health.down(exception).build() для DOWN.',
      solution: `// --- Database Health Indicator ---
@Component("database")
@RequiredArgsConstructor
public class DatabaseHealthIndicator implements HealthIndicator {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public Health health() {
        long start = System.currentTimeMillis();
        try {
            jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            long responseTime = System.currentTimeMillis() - start;

            return Health.up()
                    .withDetail("responseTime", responseTime + "ms")
                    .withDetail("database", "PostgreSQL")
                    .build();
        } catch (Exception e) {
            return Health.down(e)
                    .withDetail("error", e.getMessage())
                    .build();
        }
    }
}

// --- Redis Health Indicator ---
@Component("redis")
@RequiredArgsConstructor
public class RedisHealthIndicator implements HealthIndicator {

    private final StringRedisTemplate redisTemplate;

    @Override
    public Health health() {
        try {
            String pong = redisTemplate.getConnectionFactory()
                    .getConnection().ping();

            Properties info = redisTemplate.getConnectionFactory()
                    .getConnection().serverCommands().info();

            return Health.up()
                    .withDetail("version", info.getProperty("redis_version"))
                    .withDetail("connectedClients", info.getProperty("connected_clients"))
                    .withDetail("usedMemory", info.getProperty("used_memory_human"))
                    .build();
        } catch (Exception e) {
            return Health.down(e)
                    .withDetail("error", "Redis недоступен: " + e.getMessage())
                    .build();
        }
    }
}

// --- External API Health Indicator ---
@Component("paymentApi")
@RequiredArgsConstructor
public class PaymentApiHealthIndicator implements HealthIndicator {

    private final RestTemplate restTemplate;

    @Value("\${payment.api.health-url:http://payment-service/health}")
    private String healthUrl;

    @Override
    public Health health() {
        long start = System.currentTimeMillis();
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    healthUrl, HttpMethod.GET, null, String.class);

            long responseTime = System.currentTimeMillis() - start;

            if (response.getStatusCode().is2xxSuccessful()) {
                return Health.up()
                        .withDetail("responseTime", responseTime + "ms")
                        .withDetail("url", healthUrl)
                        .build();
            } else {
                return Health.down()
                        .withDetail("statusCode", response.getStatusCode().value())
                        .withDetail("responseTime", responseTime + "ms")
                        .build();
            }
        } catch (Exception e) {
            return Health.down(e)
                    .withDetail("error", e.getMessage())
                    .withDetail("url", healthUrl)
                    .build();
        }
    }
}

// --- Disk Space Health с порогом ---
@Component("diskSpace")
public class CustomDiskSpaceHealthIndicator implements HealthIndicator {

    private static final long THRESHOLD_BYTES = 1024L * 1024L * 1024L; // 1 GB

    @Override
    public Health health() {
        File root = new File("/");
        long freeSpace = root.getFreeSpace();
        long totalSpace = root.getTotalSpace();
        double usedPercent = ((double)(totalSpace - freeSpace) / totalSpace) * 100;

        Health.Builder builder = freeSpace > THRESHOLD_BYTES ? Health.up() : Health.down();

        return builder
                .withDetail("freeSpace", formatBytes(freeSpace))
                .withDetail("totalSpace", formatBytes(totalSpace))
                .withDetail("usedPercent", String.format("%.1f%%", usedPercent))
                .withDetail("threshold", formatBytes(THRESHOLD_BYTES))
                .build();
    }

    private String formatBytes(long bytes) {
        return String.format("%.2f GB", bytes / (1024.0 * 1024 * 1024));
    }
}`,
      explanation: 'HealthIndicator.health() возвращает Health со статусом UP или DOWN и деталями. Spring Actuator вызывает все HealthIndicator beans и агрегирует результат. Если хотя бы один компонент DOWN — общий статус DOWN. Детали (responseTime, version) помогают диагностировать проблемы. Bean name определяет имя компонента в ответе.'
    },
    {
      id: 3,
      title: 'Задача: Micrometer метрики',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте кастомные метрики с помощью Micrometer: счётчики, таймеры, gauges и distribution summaries.',
      requirements: [
        'Counter для подсчёта количества запросов по типу операции',
        'Timer для измерения длительности обработки запросов',
        'Gauge для отслеживания текущего количества активных пользователей',
        'DistributionSummary для распределения размеров ответов'
      ],
      expectedOutput: 'Metrics:\n  api.requests.total{method="GET",endpoint="/tasks"} = 150\n  api.requests.total{method="POST",endpoint="/tasks"} = 42\n  api.request.duration{endpoint="/tasks"} = {count:192, mean:45.2ms, max:350ms}\n  app.users.active = 25\n  api.response.size{endpoint="/tasks"} = {count:192, mean:2048, max:15360}',
      hint: 'Используйте MeterRegistry для создания метрик. Counter.builder("name").tag("key","value").register(registry). Timer.record() для измерения времени.',
      solution: `// --- MetricsService ---
@Service
@RequiredArgsConstructor
public class MetricsService {

    private final MeterRegistry meterRegistry;
    private final AtomicInteger activeUsers = new AtomicInteger(0);

    @PostConstruct
    public void init() {
        // Gauge для активных пользователей
        Gauge.builder("app.users.active", activeUsers, AtomicInteger::get)
                .description("Количество активных пользователей")
                .register(meterRegistry);
    }

    // Counter
    public void incrementRequestCount(String method, String endpoint, int status) {
        Counter.builder("api.requests.total")
                .description("Общее количество API запросов")
                .tag("method", method)
                .tag("endpoint", endpoint)
                .tag("status", String.valueOf(status))
                .register(meterRegistry)
                .increment();
    }

    // Timer
    public <T> T measureTime(String metricName, String endpoint, Supplier<T> operation) {
        return Timer.builder(metricName)
                .description("Время выполнения операции")
                .tag("endpoint", endpoint)
                .register(meterRegistry)
                .record(operation);
    }

    // Distribution Summary
    public void recordResponseSize(String endpoint, long sizeBytes) {
        DistributionSummary.builder("api.response.size")
                .description("Размер ответа в байтах")
                .tag("endpoint", endpoint)
                .baseUnit("bytes")
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(meterRegistry)
                .record(sizeBytes);
    }

    public void userLoggedIn() { activeUsers.incrementAndGet(); }
    public void userLoggedOut() { activeUsers.decrementAndGet(); }
}

// --- Metrics Filter ---
@Component
@RequiredArgsConstructor
public class MetricsFilter extends OncePerRequestFilter {

    private final MetricsService metricsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        long start = System.currentTimeMillis();

        ContentCachingResponseWrapper wrappedResponse =
                new ContentCachingResponseWrapper(response);

        try {
            filterChain.doFilter(request, wrappedResponse);
        } finally {
            long duration = System.currentTimeMillis() - start;
            String endpoint = request.getRequestURI();
            String method = request.getMethod();

            metricsService.incrementRequestCount(method, endpoint, wrappedResponse.getStatus());
            metricsService.recordResponseSize(endpoint, wrappedResponse.getContentSize());

            wrappedResponse.copyBodyToResponse();
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return request.getRequestURI().startsWith("/actuator");
    }
}

// --- Timed annotation на методах ---
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    @Timed(value = "task.list.time", description = "Время получения списка задач",
            percentiles = {0.5, 0.95, 0.99})
    public ResponseEntity<Page<TaskDto>> list(Pageable pageable) {
        return ResponseEntity.ok(taskService.findAll(pageable));
    }

    @PostMapping
    @Timed(value = "task.create.time", description = "Время создания задачи")
    public ResponseEntity<TaskDto> create(@RequestBody TaskCreateDto dto) {
        return ResponseEntity.status(201).body(taskService.create(dto));
    }
}`,
      explanation: 'Micrometer — библиотека метрик, агностичная к системе мониторинга. Counter считает события (запросы, ошибки). Timer измеряет длительность операций. Gauge показывает текущее значение (активные пользователи, размер очереди). DistributionSummary анализирует распределение значений (размеры ответов). @Timed — декларативный Timer на методах.'
    },
    {
      id: 4,
      title: 'Задача: Prometheus эндпоинт',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настройте экспорт метрик в формате Prometheus через /actuator/prometheus эндпоинт.',
      requirements: [
        'Зависимость micrometer-registry-prometheus',
        'Настройка /actuator/prometheus эндпоинта',
        'Кастомные метрики в формате Prometheus',
        'Конфигурация prometheus.yml для scrape'
      ],
      expectedOutput: 'GET /actuator/prometheus →\n# HELP api_requests_total Общее количество API запросов\n# TYPE api_requests_total counter\napi_requests_total{method="GET",endpoint="/tasks"} 150.0\n\n# HELP api_request_duration_seconds Время выполнения\n# TYPE api_request_duration_seconds summary\napi_request_duration_seconds{endpoint="/tasks",quantile="0.5"} 0.045\napi_request_duration_seconds{endpoint="/tasks",quantile="0.95"} 0.250',
      hint: 'Добавьте micrometer-registry-prometheus и включите prometheus эндпоинт. Метрики Micrometer автоматически конвертируются в формат Prometheus.',
      solution: `// --- pom.xml ---
// <dependency>
//     <groupId>io.micrometer</groupId>
//     <artifactId>micrometer-registry-prometheus</artifactId>
// </dependency>

// --- application.yml ---
// management:
//   endpoints:
//     web:
//       exposure:
//         include: health,info,metrics,prometheus
//   metrics:
//     export:
//       prometheus:
//         enabled: true
//     tags:
//       application: task-manager
//       environment: \${ENVIRONMENT:dev}
//     distribution:
//       percentiles-histogram:
//         http.server.requests: true
//       sla:
//         http.server.requests: 50ms,100ms,200ms,500ms,1s

// --- Prometheus Config ---
@Configuration
public class PrometheusConfig {

    @Bean
    public MeterRegistryCustomizer<PrometheusMeterRegistry> prometheusCustomizer() {
        return registry -> registry.config()
                .commonTags("application", "task-manager")
                .commonTags("region", System.getenv().getOrDefault("REGION", "local"));
    }
}

// --- prometheus.yml (Docker) ---
// global:
//   scrape_interval: 15s
//
// scrape_configs:
//   - job_name: \`spring-boot-app\`
//     metrics_path: \`/actuator/prometheus\`
//     scrape_interval: 5s
//     static_configs:
//       - targets: ['app:8080']
//         labels:
//           environment: \`dev\`
//
//   - job_name: \`spring-boot-app-prod\`
//     metrics_path: \`/actuator/prometheus\`
//     scrape_interval: 10s
//     static_configs:
//       - targets: ['prod-app-1:8080', 'prod-app-2:8080']
//         labels:
//           environment: \`production\`

// --- Docker Compose ---
// services:
//   prometheus:
//     image: prom/prometheus
//     ports: ["9090:9090"]
//     volumes:
//       - ./prometheus.yml:/etc/prometheus/prometheus.yml
//
//   app:
//     build: .
//     ports: ["8080:8080"]

// --- Метрики приложения ---
@Component
@RequiredArgsConstructor
public class AppMetrics {

    private final MeterRegistry registry;

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        Gauge.builder("app.info", () -> 1)
                .tag("version", "1.0.0")
                .tag("jdk", System.getProperty("java.version"))
                .description("Application info")
                .register(registry);
    }
}`,
      explanation: 'micrometer-registry-prometheus автоматически конвертирует все метрики Micrometer в формат Prometheus. Prometheus scrapes /actuator/prometheus каждые N секунд. Common tags (application, environment) добавляются ко всем метрикам. Distribution percentiles-histogram создаёт гистограммы для HTTP запросов. SLA buckets позволяют считать процент запросов быстрее порога.'
    },
    {
      id: 5,
      title: 'Задача: Бизнес-метрики',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте метрики бизнес-процессов: количество созданных заказов, время обработки, конверсия и средний чек.',
      requirements: [
        'Counter: orders_created_total с тегами status и payment_method',
        'Timer: order_processing_seconds для измерения времени обработки заказа',
        'Gauge: orders_pending — текущее количество необработанных заказов',
        'DistributionSummary: order_amount для среднего чека и распределения'
      ],
      expectedOutput: 'Prometheus metrics:\n  orders_created_total{status="completed",payment="card"} 1250\n  orders_created_total{status="cancelled"} 89\n  order_processing_seconds_count 1339\n  order_processing_seconds_sum 45230.5\n  orders_pending 42\n  order_amount_sum 156789.50\n  order_amount_count 1250\n  order_amount{quantile="0.5"} 125.00',
      hint: 'Инжектируйте MeterRegistry в сервис заказов. Записывайте метрики при каждом действии: создание, завершение, отмена заказа.',
      solution: `// --- OrderMetrics ---
@Component
@RequiredArgsConstructor
public class OrderMetrics {

    private final MeterRegistry registry;
    private final AtomicInteger pendingOrders = new AtomicInteger(0);

    @PostConstruct
    public void init() {
        Gauge.builder("orders.pending", pendingOrders, AtomicInteger::get)
                .description("Текущее количество необработанных заказов")
                .register(registry);
    }

    public void orderCreated(String paymentMethod) {
        Counter.builder("orders.created.total")
                .description("Общее количество созданных заказов")
                .tag("payment_method", paymentMethod)
                .register(registry)
                .increment();
        pendingOrders.incrementAndGet();
    }

    public void orderCompleted(String paymentMethod, BigDecimal amount) {
        Counter.builder("orders.completed.total")
                .tag("payment_method", paymentMethod)
                .register(registry)
                .increment();

        DistributionSummary.builder("order.amount")
                .description("Сумма заказа")
                .baseUnit("rub")
                .tag("payment_method", paymentMethod)
                .publishPercentiles(0.5, 0.75, 0.95, 0.99)
                .minimumExpectedValue(1.0)
                .maximumExpectedValue(100000.0)
                .register(registry)
                .record(amount.doubleValue());

        pendingOrders.decrementAndGet();
    }

    public void orderCancelled(String reason) {
        Counter.builder("orders.cancelled.total")
                .tag("reason", reason)
                .register(registry)
                .increment();
        pendingOrders.decrementAndGet();
    }

    public Timer.Sample startProcessingTimer() {
        return Timer.start(registry);
    }

    public void stopProcessingTimer(Timer.Sample sample, String status) {
        sample.stop(Timer.builder("order.processing.seconds")
                .description("Время обработки заказа")
                .tag("status", status)
                .publishPercentiles(0.5, 0.95, 0.99)
                .register(registry));
    }
}

// --- OrderService с метриками ---
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMetrics metrics;

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        Timer.Sample timer = metrics.startProcessingTimer();

        try {
            Order order = Order.builder()
                    .userId(request.getUserId())
                    .items(request.getItems())
                    .total(request.getTotal())
                    .paymentMethod(request.getPaymentMethod())
                    .status(OrderStatus.CREATED)
                    .build();
            order = orderRepository.save(order);

            metrics.orderCreated(request.getPaymentMethod());
            metrics.stopProcessingTimer(timer, "success");

            log.info("Заказ создан: id={}, total={}", order.getId(), order.getTotal());
            return order;
        } catch (Exception e) {
            metrics.stopProcessingTimer(timer, "error");
            throw e;
        }
    }

    @Transactional
    public Order completeOrder(Long orderId) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(OrderStatus.COMPLETED);
        orderRepository.save(order);

        metrics.orderCompleted(order.getPaymentMethod(), order.getTotal());
        return order;
    }

    @Transactional
    public void cancelOrder(Long orderId, String reason) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(OrderStatus.CANCELLED);
        orderRepository.save(order);

        metrics.orderCancelled(reason);
    }
}`,
      explanation: 'Бизнес-метрики отражают состояние бизнес-процессов, а не только технические характеристики. Counter считает заказы по типу оплаты и статусу. Timer.Sample позволяет измерить время между двумя точками в коде. Gauge показывает текущие pending заказы. DistributionSummary с перцентилями даёт средний чек и распределение сумм.'
    },
    {
      id: 6,
      title: 'Задача: Grafana dashboard',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте Grafana dashboard с панелями для визуализации метрик Spring Boot приложения через PromQL.',
      requirements: [
        'JSON-конфигурация Grafana dashboard с основными панелями',
        'PromQL запросы для RPS, latency, error rate, JVM метрик',
        'Переменные dashboard для выбора application и environment',
        'Provisioning через Docker Compose для автоматического импорта'
      ],
      expectedOutput: 'Dashboard "Spring Boot Application":\n  Row 1: RPS (rate), Error Rate (%), Avg Latency (ms), P99 Latency (ms)\n  Row 2: JVM Memory Used, GC Pause Time, Active Threads\n  Row 3: Orders Created/min, Pending Orders, Avg Order Amount\n  Row 4: HTTP Status Codes (pie), Top Slow Endpoints (table)',
      hint: 'Используйте rate(metric[5m]) для RPS, histogram_quantile(0.99, ...) для перцентилей. Grafana JSON model описывает panels с targets (PromQL).',
      solution: `// --- Docker Compose ---
// services:
//   grafana:
//     image: grafana/grafana
//     ports: ["3000:3000"]
//     volumes:
//       - ./grafana/provisioning:/etc/grafana/provisioning
//       - ./grafana/dashboards:/var/lib/grafana/dashboards
//     environment:
//       GF_SECURITY_ADMIN_PASSWORD: admin
//
//   prometheus:
//     image: prom/prometheus
//     ports: ["9090:9090"]
//     volumes:
//       - ./prometheus.yml:/etc/prometheus/prometheus.yml

// --- grafana/provisioning/datasources/prometheus.yml ---
// apiVersion: 1
// datasources:
//   - name: Prometheus
//     type: prometheus
//     url: http://prometheus:9090
//     isDefault: true

// --- grafana/provisioning/dashboards/default.yml ---
// apiVersion: 1
// providers:
//   - name: Default
//     folder: \`\`
//     type: file
//     options:
//       path: /var/lib/grafana/dashboards

// --- GrafanaDashboardConfig (Java helper) ---
@Component
public class GrafanaDashboardConfig {

    public String generateDashboardJson() {
        return """
        {
          "dashboard": {
            "title": "Spring Boot Application",
            "tags": ["spring-boot", "java"],
            "timezone": "browser",
            "refresh": "10s",
            "templating": {
              "list": [
                {
                  "name": "application",
                  "type": "query",
                  "query": "label_values(jvm_info, application)",
                  "datasource": "Prometheus"
                },
                {
                  "name": "instance",
                  "type": "query",
                  "query": "label_values(jvm_info{application=\\"$application\\"}, instance)"
                }
              ]
            },
            "panels": [
              {
                "title": "Request Rate (RPS)",
                "type": "timeseries",
                "gridPos": {"h": 8, "w": 6, "x": 0, "y": 0},
                "targets": [{
                  "expr": "sum(rate(http_server_requests_seconds_count{application=\\"$application\\"}[5m]))",
                  "legendFormat": "Total RPS"
                }]
              },
              {
                "title": "Error Rate (%)",
                "type": "gauge",
                "gridPos": {"h": 8, "w": 6, "x": 6, "y": 0},
                "targets": [{
                  "expr": "sum(rate(http_server_requests_seconds_count{application=\\"$application\\",status=~\\"5..\\"}[5m])) / sum(rate(http_server_requests_seconds_count{application=\\"$application\\"}[5m])) * 100"
                }]
              },
              {
                "title": "Avg Latency (ms)",
                "type": "stat",
                "gridPos": {"h": 8, "w": 6, "x": 12, "y": 0},
                "targets": [{
                  "expr": "sum(rate(http_server_requests_seconds_sum{application=\\"$application\\"}[5m])) / sum(rate(http_server_requests_seconds_count{application=\\"$application\\"}[5m])) * 1000"
                }]
              },
              {
                "title": "P99 Latency (ms)",
                "type": "stat",
                "gridPos": {"h": 8, "w": 6, "x": 18, "y": 0},
                "targets": [{
                  "expr": "histogram_quantile(0.99, sum(rate(http_server_requests_seconds_bucket{application=\\"$application\\"}[5m])) by (le)) * 1000"
                }]
              },
              {
                "title": "JVM Memory",
                "type": "timeseries",
                "gridPos": {"h": 8, "w": 12, "x": 0, "y": 8},
                "targets": [
                  {"expr": "jvm_memory_used_bytes{application=\\"$application\\",area=\\"heap\\"}", "legendFormat": "Heap Used"},
                  {"expr": "jvm_memory_max_bytes{application=\\"$application\\",area=\\"heap\\"}", "legendFormat": "Heap Max"}
                ]
              },
              {
                "title": "Orders per minute",
                "type": "timeseries",
                "gridPos": {"h": 8, "w": 12, "x": 12, "y": 8},
                "targets": [{
                  "expr": "sum(rate(orders_created_total{application=\\"$application\\"}[1m])) * 60",
                  "legendFormat": "Orders/min"
                }]
              }
            ]
          }
        }
        """;
    }
}`,
      explanation: 'Grafana визуализирует метрики из Prometheus. PromQL запросы: rate() вычисляет скорость изменения, histogram_quantile() — перцентили. Переменные ($application, $instance) позволяют фильтровать данные. Provisioning автоматически импортирует datasource и dashboard при старте Grafana через Docker Compose.'
    },
    {
      id: 7,
      title: 'Задача: Distributed tracing',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте распределённый трacing с помощью Micrometer Tracing для отслеживания запросов через микросервисы.',
      requirements: [
        'Настройка Micrometer Tracing с Brave (Zipkin) bridge',
        'Автоматическая пропагация trace-id и span-id между сервисами',
        'Логирование с trace-id в MDC через logback pattern',
        'Кастомные span-ы для бизнес-операций'
      ],
      expectedOutput: 'Логи:\n[trace-id=abc123, span-id=def456] OrderService: Создание заказа #1\n[trace-id=abc123, span-id=ghi789] PaymentService: Обработка оплаты для заказа #1\n[trace-id=abc123, span-id=jkl012] NotificationService: Отправка email для заказа #1\n\nZipkin UI: trace abc123 → OrderService(50ms) → PaymentService(200ms) → NotificationService(30ms)',
      hint: 'Добавьте micrometer-tracing-bridge-brave и zipkin-reporter-brave. Используйте Tracer для создания кастомных span-ов. logback: %X{traceId} для вывода trace-id.',
      solution: `// --- pom.xml ---
// <dependency>
//     <groupId>io.micrometer</groupId>
//     <artifactId>micrometer-tracing-bridge-brave</artifactId>
// </dependency>
// <dependency>
//     <groupId>io.zipkin.reporter2</groupId>
//     <artifactId>zipkin-reporter-brave</artifactId>
// </dependency>

// --- application.yml ---
// management:
//   tracing:
//     sampling:
//       probability: 1.0
//   zipkin:
//     tracing:
//       endpoint: http://localhost:9411/api/v2/spans
//
// logging:
//   pattern:
//     level: "%5p [%X{traceId:-},%X{spanId:-}]"

// --- logback-spring.xml ---
// <configuration>
//   <appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
//     <encoder>
//       <pattern>%d{HH:mm:ss.SSS} [%thread] %-5level [traceId=%X{traceId},spanId=%X{spanId}] %logger{36} - %msg%n</pattern>
//     </encoder>
//   </appender>
//   <root level="INFO"><appender-ref ref="CONSOLE"/></root>
// </configuration>

// --- Service с кастомным span ---
@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final Tracer tracer;
    private final OrderRepository orderRepository;
    private final PaymentClient paymentClient;
    private final NotificationClient notificationClient;
    private final ObservationRegistry observationRegistry;

    public Order createOrder(CreateOrderRequest request) {
        // Кастомный span для бизнес-операции
        Observation observation = Observation.createNotStarted("order.create", observationRegistry)
                .lowCardinalityKeyValue("payment.method", request.getPaymentMethod())
                .start();

        try (Observation.Scope scope = observation.openScope()) {
            log.info("Создание заказа для userId={}", request.getUserId());

            // Сохранение заказа (автоматический span от JPA)
            Order order = orderRepository.save(buildOrder(request));

            // Кастомный span для оплаты
            processPayment(order);

            // Кастомный span для уведомления
            sendNotification(order);

            observation.event(Observation.Event.of("order.created"));
            log.info("Заказ #{} создан успешно", order.getId());
            return order;
        } catch (Exception e) {
            observation.error(e);
            throw e;
        } finally {
            observation.stop();
        }
    }

    private void processPayment(Order order) {
        Span paymentSpan = tracer.nextSpan().name("payment.process").start();
        try (Tracer.SpanInScope ws = tracer.withSpan(paymentSpan)) {
            log.info("Обработка оплаты для заказа #{}", order.getId());
            paymentClient.charge(order.getTotal(), order.getPaymentMethod());
            paymentSpan.tag("order.id", order.getId().toString());
            paymentSpan.tag("amount", order.getTotal().toString());
        } catch (Exception e) {
            paymentSpan.error(e);
            throw e;
        } finally {
            paymentSpan.end();
        }
    }

    private void sendNotification(Order order) {
        Span notifSpan = tracer.nextSpan().name("notification.send").start();
        try (Tracer.SpanInScope ws = tracer.withSpan(notifSpan)) {
            log.info("Отправка уведомления для заказа #{}", order.getId());
            notificationClient.sendOrderConfirmation(order);
        } finally {
            notifSpan.end();
        }
    }
}

// --- RestClient с пропагацией trace ---
@Configuration
public class RestClientConfig {

    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        return builder.build();
        // Micrometer Tracing автоматически добавляет
        // interceptor для пропагации trace headers
    }
}`,
      explanation: 'Distributed tracing отслеживает запрос через все микросервисы. TraceId — уникальный ID запроса, SpanId — ID операции внутри trace. Micrometer Tracing автоматически пропагирует trace headers (B3/W3C) через RestTemplate/WebClient. Кастомные span-ы через Tracer.nextSpan() детализируют бизнес-операции. MDC добавляет traceId в каждую строку лога.'
    },
    {
      id: 8,
      title: 'Задача: Фильтр логирования запросов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте фильтр для логирования HTTP-запросов с MDC контекстом, длительностью и статусом ответа.',
      requirements: [
        'OncePerRequestFilter с логированием: метод, URI, статус, длительность',
        'MDC контекст: requestId, userId, clientIp для всех логов в рамках запроса',
        'Логирование тела запроса и ответа для DEBUG уровня',
        'Метрики: slow request logging (>500ms)'
      ],
      expectedOutput: 'INFO  [requestId=abc-123, userId=42, ip=192.168.1.1] RequestLogFilter - → GET /api/tasks?page=0&size=20\nINFO  [requestId=abc-123, userId=42, ip=192.168.1.1] RequestLogFilter - ← 200 OK (45ms)\n\nWARN  [requestId=def-456] RequestLogFilter - SLOW REQUEST: GET /api/reports/export (2350ms)\n\nDEBUG [requestId=abc-123] RequestLogFilter - Request Body: {"title":"New task"}\nDEBUG [requestId=abc-123] RequestLogFilter - Response Body: {"id":1,"title":"New task"}',
      hint: 'Используйте MDC.put("requestId", uuid) в начале фильтра и MDC.clear() в finally. ContentCachingRequestWrapper позволяет прочитать body запроса.',
      solution: `@Component
@Slf4j
public class RequestLogFilter extends OncePerRequestFilter {

    private static final long SLOW_REQUEST_THRESHOLD_MS = 500;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String requestId = UUID.randomUUID().toString().substring(0, 8);
        long startTime = System.currentTimeMillis();

        // MDC контекст
        MDC.put("requestId", requestId);
        MDC.put("clientIp", getClientIp(request));
        MDC.put("method", request.getMethod());
        MDC.put("uri", request.getRequestURI());

        // Извлечение userId из JWT если есть
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetails user) {
            MDC.put("userId", user.getUsername());
        }

        // Обёртки для чтения body
        ContentCachingRequestWrapper wrappedRequest =
                new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedResponse =
                new ContentCachingResponseWrapper(response);

        try {
            log.info("→ {} {} {}",
                    request.getMethod(),
                    request.getRequestURI(),
                    request.getQueryString() != null ? "?" + request.getQueryString() : "");

            filterChain.doFilter(wrappedRequest, wrappedResponse);

            long duration = System.currentTimeMillis() - startTime;
            int status = wrappedResponse.getStatus();

            if (duration > SLOW_REQUEST_THRESHOLD_MS) {
                log.warn("SLOW REQUEST: {} {} ({}ms)",
                        request.getMethod(), request.getRequestURI(), duration);
            }

            log.info("← {} {} ({}ms)", status,
                    HttpStatus.valueOf(status).getReasonPhrase(), duration);

            // Debug: логирование body
            if (log.isDebugEnabled()) {
                logRequestBody(wrappedRequest);
                logResponseBody(wrappedResponse);
            }

        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("✗ {} {} — {} ({}ms)",
                    request.getMethod(), request.getRequestURI(),
                    e.getMessage(), duration);
            throw e;
        } finally {
            wrappedResponse.copyBodyToResponse();
            MDC.clear();
        }
    }

    private void logRequestBody(ContentCachingRequestWrapper request) {
        byte[] content = request.getContentAsByteArray();
        if (content.length > 0) {
            String body = new String(content, StandardCharsets.UTF_8);
            log.debug("Request Body: {}", truncate(body, 1000));
        }
    }

    private void logResponseBody(ContentCachingResponseWrapper response) {
        byte[] content = response.getContentAsByteArray();
        if (content.length > 0) {
            String body = new String(content, StandardCharsets.UTF_8);
            log.debug("Response Body: {}", truncate(body, 1000));
        }
    }

    private String getClientIp(HttpServletRequest request) {
        String xff = request.getHeader("X-Forwarded-For");
        return xff != null ? xff.split(",")[0].trim() : request.getRemoteAddr();
    }

    private String truncate(String s, int maxLength) {
        return s.length() > maxLength ? s.substring(0, maxLength) + "..." : s;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path.startsWith("/actuator") || path.startsWith("/swagger");
    }
}`,
      explanation: 'RequestLogFilter логирует каждый HTTP-запрос с контекстом. MDC (Mapped Diagnostic Context) добавляет requestId, userId, clientIp ко всем логам в рамках запроса — даже в вызываемых сервисах. ContentCachingRequestWrapper/ResponseWrapper позволяют прочитать body без нарушения потока. Slow request detection предупреждает о медленных запросах.'
    },
    {
      id: 9,
      title: 'Задача: Детекция медленных запросов к БД',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте обнаружение и логирование медленных SQL-запросов с помощью Hibernate statistics и кастомного interceptor.',
      requirements: [
        'Включение Hibernate statistics для сбора информации о запросах',
        'Кастомный StatementInspector для логирования медленных запросов',
        'Порог: запросы дольше 100ms логируются как WARNING',
        'Endpoint /api/admin/slow-queries для просмотра статистики'
      ],
      expectedOutput: `WARN  SlowQueryDetector - Slow query (250ms): SELECT p FROM Product p WHERE p.category = :cat\nWARN  SlowQueryDetector - Slow query (1200ms): SELECT * FROM orders WHERE status = \\'PENDING\\' ORDER BY created_at\n\nGET /api/admin/slow-queries → [\n  { "sql":"SELECT p FROM...", "duration":250, "count":15, "timestamp":"..." },\n  { "sql":"SELECT * FROM...", "duration":1200, "count":3, "timestamp":"..." }\n]`,
      hint: 'Используйте spring.jpa.properties.hibernate.generate_statistics=true и DataSource proxy через datasource-proxy библиотеку для перехвата SQL.',
      solution: `// --- application.yml ---
// spring:
//   jpa:
//     properties:
//       hibernate:
//         generate_statistics: true
//     show-sql: false
// logging:
//   level:
//     org.hibernate.stat: DEBUG

// --- SlowQueryLog Entity ---
@Entity
@Table(name = "slow_query_logs")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class SlowQueryLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 2000)
    private String sql;
    private long durationMs;
    private LocalDateTime detectedAt;
    private String stackTrace;
}

// --- DataSource Proxy Config ---
@Configuration
public class DataSourceProxyConfig {

    @Bean
    public DataSource dataSource(DataSource originalDataSource) {
        SLF4JQueryLoggingListener listener = new SLF4JQueryLoggingListener();
        listener.setLogLevel(SLF4JLogLevel.INFO);

        return ProxyDataSourceBuilder.create(originalDataSource)
                .name("slow-query-detector")
                .listener(new SlowQueryListener())
                .build();
    }
}

// --- Slow Query Listener ---
@Slf4j
public class SlowQueryListener implements QueryExecutionListener {

    private static final long SLOW_QUERY_THRESHOLD_MS = 100;

    @Autowired(required = false)
    private SlowQueryLogRepository slowQueryLogRepository;

    private final List<SlowQueryInfo> recentSlowQueries =
            Collections.synchronizedList(new ArrayList<>());

    @Override
    public void beforeQuery(ExecutionInfo execInfo, List<QueryInfo> queryInfoList) {}

    @Override
    public void afterQuery(ExecutionInfo execInfo, List<QueryInfo> queryInfoList) {
        long duration = execInfo.getElapsedTime();

        if (duration >= SLOW_QUERY_THRESHOLD_MS) {
            for (QueryInfo queryInfo : queryInfoList) {
                String sql = queryInfo.getQuery();
                log.warn("Slow query ({}ms): {}", duration, sql);

                SlowQueryInfo info = new SlowQueryInfo(
                        sql, duration, LocalDateTime.now(),
                        getSimpleStackTrace());

                recentSlowQueries.add(info);

                // Ограничиваем размер списка
                if (recentSlowQueries.size() > 100) {
                    recentSlowQueries.remove(0);
                }

                // Сохраняем в БД если доступно
                if (slowQueryLogRepository != null) {
                    slowQueryLogRepository.save(SlowQueryLog.builder()
                            .sql(sql.substring(0, Math.min(sql.length(), 2000)))
                            .durationMs(duration)
                            .detectedAt(LocalDateTime.now())
                            .build());
                }
            }
        }
    }

    public List<SlowQueryInfo> getRecentSlowQueries() {
        return new ArrayList<>(recentSlowQueries);
    }

    private String getSimpleStackTrace() {
        return Arrays.stream(Thread.currentThread().getStackTrace())
                .filter(e -> e.getClassName().startsWith("com.example"))
                .limit(5)
                .map(e -> e.getClassName() + "." + e.getMethodName() + ":" + e.getLineNumber())
                .collect(Collectors.joining(" → "));
    }
}

// --- Admin Controller ---
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class SlowQueryController {

    private final SlowQueryListener slowQueryListener;

    @GetMapping("/slow-queries")
    public ResponseEntity<List<SlowQueryInfo>> getSlowQueries(
            @RequestParam(defaultValue = "50") int limit) {
        List<SlowQueryInfo> queries = slowQueryListener.getRecentSlowQueries();
        return ResponseEntity.ok(queries.stream()
                .sorted(Comparator.comparing(SlowQueryInfo::getDuration).reversed())
                .limit(limit)
                .collect(Collectors.toList()));
    }
}`,
      explanation: 'datasource-proxy перехватывает все SQL-запросы и измеряет их длительность. QueryExecutionListener вызывается после каждого запроса. Запросы дольше порога (100ms) логируются и сохраняются. Stack trace помогает найти место в коде, вызвавшее медленный запрос. Административный endpoint позволяет просматривать статистику без доступа к логам.'
    },
    {
      id: 10,
      title: 'Задача: Правила алертинга',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте правила алертинга в Prometheus и Alertmanager для оповещения о проблемах в приложении.',
      requirements: [
        'Prometheus alerting rules для: high error rate, high latency, instance down',
        'Alertmanager конфигурация для отправки в Slack и email',
        'Custom alerts для бизнес-метрик (мало заказов, высокий % отмен)',
        'Spring Boot endpoint для ручного триггера алертов'
      ],
      expectedOutput: 'Prometheus Alert: HighErrorRate FIRING\n  error rate 5.2% > threshold 1%\n  duration: 5m\n\nSlack notification: "🔴 ALERT: HighErrorRate на task-manager-prod"\n  "Error rate 5.2% за последние 5 минут. Порог: 1%"\n\nEmail: "CRITICAL: Instance Down — task-manager-prod-2 не отвечает 3 минуты"',
      hint: 'Alerting rules в prometheus.yml проверяют условия через PromQL. Alertmanager route направляет алерты в нужный receiver (Slack webhook, email SMTP).',
      solution: `// --- prometheus/alert-rules.yml ---
// groups:
//   - name: spring-boot-alerts
//     rules:
//       - alert: HighErrorRate
//         expr: >
//           sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m]))
//           / sum(rate(http_server_requests_seconds_count[5m])) * 100 > 1
//         for: 5m
//         labels:
//           severity: critical
//         annotations:
//           summary: "Высокий процент ошибок ({{ $value | printf \\"%.1f\\" }}%)"
//           description: "Error rate > 1% за последние 5 минут"
//
//       - alert: HighLatency
//         expr: >
//           histogram_quantile(0.95,
//             sum(rate(http_server_requests_seconds_bucket[5m])) by (le)
//           ) > 0.5
//         for: 3m
//         labels:
//           severity: warning
//         annotations:
//           summary: "P95 latency {{ $value | printf \\"%.0f\\" }}ms > 500ms"
//
//       - alert: InstanceDown
//         expr: up == 0
//         for: 2m
//         labels:
//           severity: critical
//         annotations:
//           summary: "Instance {{ $labels.instance }} не отвечает"
//
//       - alert: HighMemoryUsage
//         expr: >
//           jvm_memory_used_bytes{area="heap"}
//           / jvm_memory_max_bytes{area="heap"} * 100 > 85
//         for: 5m
//         labels:
//           severity: warning
//         annotations:
//           summary: "Heap usage {{ $value | printf \\"%.0f\\" }}% > 85%"
//
//       - alert: LowOrderRate
//         expr: >
//           sum(rate(orders_created_total[30m])) * 60 < 1
//         for: 30m
//         labels:
//           severity: warning
//         annotations:
//           summary: "Менее 1 заказа в минуту за последние 30 минут"

// --- alertmanager.yml ---
// global:
//   smtp_smarthost: \`smtp.gmail.com:587\`
//   smtp_from: \`alerts@example.com\`
//   smtp_auth_username: \`alerts@example.com\`
//   smtp_auth_password: \`password\`
//
// route:
//   group_by: ['alertname']
//   group_wait: 30s
//   group_interval: 5m
//   repeat_interval: 4h
//   receiver: \`slack-default\`
//   routes:
//     - match: { severity: critical }
//       receiver: \`slack-critical\`
//     - match: { severity: warning }
//       receiver: \`slack-default\`
//
// receivers:
//   - name: \`slack-critical\`
//     slack_configs:
//       - api_url: \`https://hooks.slack.com/services/xxx\`
//         channel: \`#alerts-critical\`
//         title: \`🔴 {{ .GroupLabels.alertname }}\`
//         text: \`{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}\`
//     email_configs:
//       - to: \`oncall@example.com\`
//         subject: \`CRITICAL: {{ .GroupLabels.alertname }}\`
//
//   - name: \`slack-default\`
//     slack_configs:
//       - api_url: \`https://hooks.slack.com/services/xxx\`
//         channel: \`#alerts\`
//         title: \`⚠️ {{ .GroupLabels.alertname }}\`

// --- Spring Boot Alert Service ---
@Service
@RequiredArgsConstructor
@Slf4j
public class AlertService {

    private final MeterRegistry meterRegistry;

    @Value("\${alerting.slack.webhook-url:}")
    private String slackWebhookUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendAlert(String title, String message, String severity) {
        log.warn("ALERT [{}]: {} - {}", severity, title, message);

        Counter.builder("alerts.sent.total")
                .tag("severity", severity)
                .register(meterRegistry)
                .increment();

        if (!slackWebhookUrl.isEmpty()) {
            sendSlackAlert(title, message, severity);
        }
    }

    private void sendSlackAlert(String title, String message, String severity) {
        String emoji = "critical".equals(severity) ? ":red_circle:" : ":warning:";
        Map<String, String> payload = Map.of(
                "text", emoji + " *" + title + "*\\n" + message);
        try {
            restTemplate.postForEntity(slackWebhookUrl, payload, String.class);
        } catch (Exception e) {
            log.error("Ошибка отправки Slack alert: {}", e.getMessage());
        }
    }
}

// --- Alert Controller ---
@RestController
@RequestMapping("/api/admin/alerts")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @PostMapping("/test")
    public ResponseEntity<Map<String, String>> testAlert(
            @RequestBody AlertRequest request) {
        alertService.sendAlert(request.getTitle(), request.getMessage(), request.getSeverity());
        return ResponseEntity.ok(Map.of("status", "sent"));
    }
}`,
      explanation: 'Prometheus alerting rules проверяют PromQL-условия. expr — условие, for — минимальная длительность. Alertmanager маршрутизирует алерты по severity в разные каналы: critical → Slack + email, warning → только Slack. group_by агрегирует однотипные алерты. repeat_interval определяет частоту повторных уведомлений. Spring Boot AlertService позволяет отправлять алерты программно.'
    }
  ]
}
