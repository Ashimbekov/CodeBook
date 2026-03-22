export default {
  id: 22,
  title: 'Планировщик задач: @Scheduled',
  description: 'Автоматический запуск задач по расписанию с помощью @Scheduled, настройка cron-выражений, управление пулом потоков и мониторинг задач',
  lessons: [
    {
      id: 1,
      title: 'Основы @Scheduled',
      type: 'theory',
      content: [
        { type: 'text', value: '@Scheduled позволяет запускать методы автоматически: каждые N секунд, в определённое время, по cron-расписанию. Применяется для: очистки старых данных, отправки дайджестов, синхронизации с внешними системами.' },
        { type: 'heading', value: 'Включение планировщика' },
        { type: 'code', language: 'java', value: '@SpringBootApplication\n@EnableScheduling  // обязательно!\npublic class Application {\n    public static void main(String[] args) {\n        SpringApplication.run(Application.class, args);\n    }\n}' },
        { type: 'heading', value: 'Основные режимы запуска' },
        { type: 'code', language: 'java', value: '@Component\npublic class ReportScheduler {\n\n    // Каждые 5 секунд (фиксированная задержка между ЗАВЕРШЕНИЕМ задачи)\n    @Scheduled(fixedDelay = 5000)\n    public void taskWithDelay() {\n        System.out.println("Выполняется: " + LocalDateTime.now());\n    }\n\n    // Каждые 10 секунд (фиксированный интервал между НАЧАЛОМ задачи)\n    @Scheduled(fixedRate = 10000)\n    public void taskWithRate() {\n        System.out.println("Периодическая задача");\n    }\n\n    // Первый запуск через 30 секунд, затем каждые 60 секунд\n    @Scheduled(initialDelay = 30000, fixedRate = 60000)\n    public void taskWithInitialDelay() {\n        System.out.println("Запускается с задержкой");\n    }\n}' },
        { type: 'tip', value: 'fixedDelay — ждёт завершения предыдущего запуска. fixedRate — запускает строго каждые N мс, даже если предыдущий ещё не завершился. Для обычных задач — используй fixedDelay.' }
      ]
    },
    {
      id: 2,
      title: 'Cron-выражения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Cron — мощный синтаксис расписания. Состоит из 6 полей: секунды, минуты, часы, дни, месяцы, дни недели. Позволяет задавать любое расписание.' },
        { type: 'heading', value: 'Синтаксис cron' },
        { type: 'code', language: 'java', value: '// Формат: секунды минуты часы день-месяца месяц день-недели\n//           0-59   0-59  0-23  1-31        1-12  0-7(0=вс)\n\n@Scheduled(cron = "0 0 9 * * MON-FRI")    // Каждый рабочий день в 9:00\n@Scheduled(cron = "0 0 0 1 * *")          // Первое число каждого месяца в полночь\n@Scheduled(cron = "0 */15 * * * *")       // Каждые 15 минут\n@Scheduled(cron = "0 0 8,12,18 * * *")   // В 8:00, 12:00 и 18:00 каждый день\n@Scheduled(cron = "0 30 23 L * *")        // Последний день месяца в 23:30\n\n// Специальные символы:\n// * — любое значение\n// */5 — каждые 5 единиц (например, каждые 5 минут)\n// 1-5 — диапазон (с 1 по 5)\n// 1,3,5 — конкретные значения\n// L — последний (только для дня месяца и дня недели)\n// ? — не указано (только для дня месяца или дня недели)' },
        { type: 'heading', value: 'Примеры cron-расписаний' },
        { type: 'code', language: 'java', value: '@Component\npublic class BusinessScheduler {\n\n    @Scheduled(cron = "0 0 9 * * MON-FRI")\n    public void sendMorningReport() {\n        // Ежедневный отчёт для менеджеров в 9 утра по рабочим дням\n        reportService.generateDailyReport();\n        emailService.sendToManagers();\n    }\n\n    @Scheduled(cron = "0 0 0 * * *")\n    public void cleanupExpiredSessions() {\n        // Каждую ночь очищать истёкшие сессии\n        sessionRepository.deleteExpired();\n    }\n\n    @Scheduled(cron = "0 0 1 1 * *")\n    public void monthlyInvoice() {\n        // Первого числа каждого месяца генерировать счета\n        invoiceService.generateMonthlyInvoices();\n    }\n}' }
      ]
    },
    {
      id: 3,
      title: 'Cron из конфигурации и часовые пояса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая практика — хранить cron-выражения в application.properties, а не в коде. Это позволяет менять расписание без перекомпиляции. Также важно указывать часовой пояс.' },
        { type: 'heading', value: 'Cron из properties' },
        { type: 'code', language: 'java', value: '# application.properties\napp.schedule.report=0 0 9 * * MON-FRI\napp.schedule.cleanup=0 0 2 * * *' },
        { type: 'code', language: 'java', value: '@Component\npublic class ConfigurableScheduler {\n\n    // Читать cron из конфига\n    @Scheduled(cron = "${app.schedule.report}", zone = "Asia/Almaty")\n    public void sendReport() {\n        reportService.send();\n    }\n\n    @Scheduled(cron = "${app.schedule.cleanup}", zone = "Asia/Almaty")\n    public void cleanupData() {\n        dataService.cleanup();\n    }\n}' },
        { type: 'heading', value: 'Отключение задачи в тестах' },
        { type: 'code', language: 'java', value: '# Отключить все scheduled задачи в тестах\n# application-test.properties\napp.schedule.report=-  # "-" отключает задачу\n\n# Или через условие\n@ConditionalOnProperty(\n    name = "app.scheduling.enabled",\n    havingValue = "true",\n    matchIfMissing = true\n)\n@Component\npublic class ScheduledTasks { ... }' }
      ]
    },
    {
      id: 4,
      title: 'Асинхронные задачи и пул потоков',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию Spring использует один поток для всех @Scheduled задач. Если задача долгая — она блокирует другие задачи. @Async + настройка пула решают эту проблему.' },
        { type: 'heading', value: 'Настройка ThreadPoolTaskScheduler' },
        { type: 'code', language: 'java', value: '@Configuration\n@EnableScheduling\n@EnableAsync\npublic class SchedulingConfig implements SchedulingConfigurer {\n\n    @Override\n    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {\n        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();\n        scheduler.setPoolSize(5);  // 5 потоков для задач\n        scheduler.setThreadNamePrefix("scheduled-");\n        scheduler.initialize();\n        taskRegistrar.setTaskScheduler(scheduler);\n    }\n}' },
        { type: 'heading', value: 'Асинхронные задачи' },
        { type: 'code', language: 'java', value: '@Component\npublic class AsyncScheduler {\n\n    @Async("taskExecutor")  // выполнять в отдельном потоке\n    @Scheduled(fixedRate = 10000)\n    public void asyncTask() {\n        // Даже если эта задача долгая —\n        // она не блокирует другие @Scheduled задачи\n        longRunningOperation();\n    }\n}\n\n@Configuration\npublic class AsyncConfig {\n    @Bean("taskExecutor")\n    public Executor taskExecutor() {\n        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();\n        executor.setCorePoolSize(5);\n        executor.setMaxPoolSize(10);\n        executor.setQueueCapacity(100);\n        executor.setThreadNamePrefix("async-task-");\n        executor.initialize();\n        return executor;\n    }\n}' }
      ]
    },
    {
      id: 5,
      title: 'Обработка ошибок и логирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Если @Scheduled метод выбросит исключение — следующие запуски продолжатся, но исключение нужно правильно обработать. Важно логировать начало, конец и ошибки задач.' },
        { type: 'heading', value: 'Паттерн обработки ошибок' },
        { type: 'code', language: 'java', value: '@Component\n@Slf4j\npublic class RobustScheduler {\n\n    @Scheduled(cron = "0 0 * * * *")  // каждый час\n    public void hourlySync() {\n        log.info("Начало синхронизации: {}", LocalDateTime.now());\n        try {\n            syncService.synchronize();\n            log.info("Синхронизация завершена успешно");\n        } catch (Exception e) {\n            log.error("Ошибка синхронизации: {}", e.getMessage(), e);\n            // Не пробрасываем исключение — следующий запуск всё равно произойдёт\n            alertService.sendAlert("Ошибка синхронизации: " + e.getMessage());\n        }\n    }\n}' },
        { type: 'heading', value: 'Метрики задач' },
        { type: 'code', language: 'java', value: '@Component\n@Slf4j\npublic class MetricsScheduler {\n\n    @Autowired\n    private MeterRegistry meterRegistry;\n\n    @Scheduled(fixedRate = 60000)\n    public void trackedTask() {\n        long start = System.currentTimeMillis();\n        try {\n            performWork();\n            meterRegistry.counter("scheduled.task.success", "task", "tracked").increment();\n        } catch (Exception e) {\n            meterRegistry.counter("scheduled.task.error", "task", "tracked").increment();\n        } finally {\n            long duration = System.currentTimeMillis() - start;\n            meterRegistry.timer("scheduled.task.duration", "task", "tracked")\n                .record(duration, TimeUnit.MILLISECONDS);\n        }\n    }\n\n    private void performWork() {\n        // Бизнес-логика\n    }\n}' }
      ]
    },
    {
      id: 6,
      title: 'Практика: планировщик для отчётов и очистки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему планировщиков: ежедневный отчёт в 9 утра, еженедельный дайджест в понедельник, ежечасная очистка истёкших токенов и ежесекундный счётчик активных пользователей.',
      requirements: [
        'Включи @EnableScheduling в конфигурации',
        'Задача 1: каждый рабочий день в 9:00 по Asia/Almaty — вызывать reportService.sendDaily()',
        'Задача 2: каждый понедельник в 10:00 — sendWeeklyDigest()',
        'Задача 3: каждый час — cleanupExpiredTokens() с логированием',
        'Задача 4: каждые 30 секунд — updateActiveUserCount()',
        'Cron выражения хранить в application.properties',
        'Обернуть каждую задачу в try-catch с логированием'
      ],
      hint: 'Cron для рабочих дней: "0 0 9 * * MON-FRI". Для понедельника: "0 0 10 * * MON". Ежечасно: "0 0 * * * *".',
      solution: '# application.properties\napp.schedule.daily-report=0 0 9 * * MON-FRI\napp.schedule.weekly-digest=0 0 10 * * MON\napp.schedule.cleanup-tokens=0 0 * * * *\napp.schedule.active-users=*/30 * * * * *\n\n@Component @Slf4j\npublic class AppScheduler {\n    @Autowired ReportService reportService;\n    @Autowired TokenService tokenService;\n    @Autowired UserService userService;\n\n    @Scheduled(cron = "${app.schedule.daily-report}", zone = "Asia/Almaty")\n    public void sendDailyReport() {\n        log.info("Запуск ежедневного отчёта");\n        try { reportService.sendDaily(); }\n        catch (Exception e) { log.error("Ошибка отчёта: {}", e.getMessage()); }\n    }\n\n    @Scheduled(cron = "${app.schedule.weekly-digest}", zone = "Asia/Almaty")\n    public void sendWeeklyDigest() {\n        try { reportService.sendWeeklyDigest(); }\n        catch (Exception e) { log.error("Ошибка дайджеста: {}", e.getMessage()); }\n    }\n\n    @Scheduled(cron = "${app.schedule.cleanup-tokens}")\n    public void cleanupTokens() {\n        log.info("Очистка токенов: {}", LocalDateTime.now());\n        try { int count = tokenService.deleteExpired(); log.info("Удалено: {}", count); }\n        catch (Exception e) { log.error("Ошибка очистки: {}", e.getMessage()); }\n    }\n\n    @Scheduled(cron = "${app.schedule.active-users}")\n    public void updateActiveUsers() {\n        try { userService.updateActiveCount(); }\n        catch (Exception e) { log.error("Ошибка счётчика: {}", e.getMessage()); }\n    }\n}',
      explanation: 'Cron в properties позволяет менять расписание без перекомпиляции. zone = "Asia/Almaty" гарантирует запуск по алматинскому времени. try-catch в каждой задаче предотвращает остановку планировщика при ошибках.'
    }
  ]
}
