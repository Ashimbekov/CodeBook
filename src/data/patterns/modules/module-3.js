export default {
  id: 3,
  title: 'Singleton',
  description: 'Паттерн Singleton: гарантия единственного экземпляра, потокобезопасность, проблемы и альтернативы',
  lessons: [
    {
      id: 1,
      title: 'Что такое Singleton?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Singleton (Одиночка) — порождающий паттерн, который гарантирует, что у класса есть только один экземпляр, и предоставляет глобальную точку доступа к нему.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Подключение к базе данных — не нужно создавать множество соединений',
          'Логгер — один объект для записи логов со всего приложения',
          'Конфигурация — единственный источник настроек',
          'Кэш — общее хранилище данных в памяти',
          'Пул потоков — единый менеджер потоков'
        ]},
        { type: 'heading', value: 'Структура паттерна' },
        { type: 'code', language: 'text', value: '┌──────────────────────────┐\n│       Singleton           │\n├──────────────────────────┤\n│ - instance: Singleton    │\n├──────────────────────────┤\n│ - Singleton()            │  ← приватный конструктор\n│ + getInstance(): Singleton│ ← статический метод доступа\n└──────────────────────────┘' },
        { type: 'text', value: 'Ключевые элементы: приватный конструктор (запрещает создание через new), статическое поле для хранения единственного экземпляра, статический метод getInstance() для доступа.' },
        { type: 'note', value: 'Singleton — самый простой и самый спорный паттерн. Его легко понять, но легко и злоупотребить. В современной разработке часто заменяется Dependency Injection.' }
      ]
    },
    {
      id: 2,
      title: 'Реализации Singleton в Java',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существует несколько способов реализации Singleton в Java, каждый со своими плюсами и минусами.' },
        { type: 'heading', value: '1. Eager Initialization (жадная инициализация)' },
        { type: 'code', language: 'java', value: 'public class DatabaseConnection {\n    // Экземпляр создаётся при загрузке класса\n    private static final DatabaseConnection INSTANCE = new DatabaseConnection();\n\n    private DatabaseConnection() {\n        System.out.println("Подключение к БД создано");\n    }\n\n    public static DatabaseConnection getInstance() {\n        return INSTANCE;\n    }\n\n    public void query(String sql) {\n        System.out.println("Выполняю запрос: " + sql);\n    }\n}' },
        { type: 'tip', value: 'Eager — самый простой и потокобезопасный вариант. Минус: объект создаётся даже если он не понадобится.' },
        { type: 'heading', value: '2. Lazy Initialization (ленивая инициализация)' },
        { type: 'code', language: 'java', value: 'public class Logger {\n    private static Logger instance;\n\n    private Logger() {}\n\n    // ⚠️ НЕ потокобезопасно!\n    public static Logger getInstance() {\n        if (instance == null) {\n            instance = new Logger();\n        }\n        return instance;\n    }\n\n    public void log(String message) {\n        System.out.println("[LOG] " + message);\n    }\n}' },
        { type: 'warning', value: 'Lazy Initialization без синхронизации опасна в многопоточной среде! Два потока могут одновременно проверить instance == null и создать два экземпляра.' },
        { type: 'heading', value: '3. Double-Checked Locking (потокобезопасный)' },
        { type: 'code', language: 'java', value: 'public class AppConfig {\n    private static volatile AppConfig instance;\n\n    private AppConfig() {\n        // Загрузка конфигурации\n    }\n\n    public static AppConfig getInstance() {\n        if (instance == null) {                // Первая проверка (без блокировки)\n            synchronized (AppConfig.class) {\n                if (instance == null) {        // Вторая проверка (с блокировкой)\n                    instance = new AppConfig();\n                }\n            }\n        }\n        return instance;\n    }\n}' },
        { type: 'note', value: 'Ключевое слово volatile необходимо для корректной работы Double-Checked Locking. Без него JVM может переупорядочить операции и вернуть частично инициализированный объект.' },
        { type: 'heading', value: '4. Enum Singleton (рекомендуемый способ)' },
        { type: 'code', language: 'java', value: '// Рекомендация Джошуа Блоха (Effective Java)\npublic enum CacheManager {\n    INSTANCE;\n\n    private final Map<String, Object> cache = new HashMap<>();\n\n    public void put(String key, Object value) {\n        cache.put(key, value);\n    }\n\n    public Object get(String key) {\n        return cache.get(key);\n    }\n}\n\n// Использование\nCacheManager.INSTANCE.put("user", user);\nObject cached = CacheManager.INSTANCE.get("user");' },
        { type: 'tip', value: 'Enum Singleton — лучший способ в Java. Он потокобезопасен, защищён от рефлексии и сериализации. Его рекомендует Джошуа Блох в книге «Effective Java».' }
      ]
    },
    {
      id: 3,
      title: 'Singleton в TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'В TypeScript Singleton реализуется через приватный конструктор и статический метод. В экосистеме JavaScript/TypeScript Singleton часто заменяется модульным паттерном.' },
        { type: 'heading', value: 'Классический Singleton' },
        { type: 'code', language: 'typescript', value: 'class Database {\n    private static instance: Database;\n    private connectionString: string;\n\n    private constructor(connectionString: string) {\n        this.connectionString = connectionString;\n        console.log("Подключение к БД: " + connectionString);\n    }\n\n    static getInstance(connectionString: string = "default"): Database {\n        if (!Database.instance) {\n            Database.instance = new Database(connectionString);\n        }\n        return Database.instance;\n    }\n\n    query(sql: string): void {\n        console.log(`[${this.connectionString}] Запрос: ${sql}`);\n    }\n}\n\n// Использование\nconst db1 = Database.getInstance("postgres://localhost:5432/mydb");\nconst db2 = Database.getInstance(); // Возвращает тот же экземпляр\nconsole.log(db1 === db2); // true' },
        { type: 'heading', value: 'Модульный Singleton (идиоматичный JS/TS)' },
        { type: 'code', language: 'typescript', value: '// config.ts — модуль уже является singleton по умолчанию!\nclass AppConfig {\n    private settings = new Map<string, string>();\n\n    set(key: string, value: string): void {\n        this.settings.set(key, value);\n    }\n\n    get(key: string): string | undefined {\n        return this.settings.get(key);\n    }\n}\n\n// Экспортируем единственный экземпляр\nexport const config = new AppConfig();\n\n// app.ts\nimport { config } from "./config";\nconfig.set("apiUrl", "https://api.example.com");\n\n// service.ts\nimport { config } from "./config";\nconst url = config.get("apiUrl"); // Тот же экземпляр!' },
        { type: 'tip', value: 'В Node.js/TypeScript модули кэшируются при первом импорте. Поэтому экспорт экземпляра из модуля — это простейший и идиоматичный Singleton без лишнего кода.' },
        { type: 'heading', value: 'Generic Singleton (продвинутый вариант)' },
        { type: 'code', language: 'typescript', value: '// Универсальный Singleton через декоратор (experimental)\nfunction Singleton<T extends new (...args: any[]) => any>(constructor: T) {\n    let instance: InstanceType<T> | null = null;\n\n    return class extends constructor {\n        constructor(...args: any[]) {\n            if (instance) return instance;\n            super(...args);\n            instance = this;\n        }\n    } as T;\n}\n\n@Singleton\nclass Logger {\n    log(msg: string) {\n        console.log(`[LOG] ${msg}`);\n    }\n}\n\nconst a = new Logger();\nconst b = new Logger();\nconsole.log(a === b); // true' },
        { type: 'warning', value: 'Декораторы в TypeScript — экспериментальная функция. Для продакшена лучше использовать модульный подход или классический Singleton.' }
      ]
    },
    {
      id: 4,
      title: 'Проблемы и антипаттерны Singleton',
      type: 'theory',
      content: [
        { type: 'text', value: 'Singleton — один из самых критикуемых паттернов. Многие считают его антипаттерном из-за ряда серьёзных проблем.' },
        { type: 'heading', value: 'Проблема 1: Скрытые зависимости' },
        { type: 'code', language: 'java', value: '// ❌ Зависимость скрыта внутри метода\npublic class OrderService {\n    public void processOrder(Order order) {\n        // Кто знает, что OrderService зависит от Logger?\n        Logger.getInstance().log("Обработка заказа");\n        Database.getInstance().save(order);\n    }\n}\n\n// ✅ Зависимости видны явно через конструктор\npublic class OrderService {\n    private final Logger logger;\n    private final Database database;\n\n    public OrderService(Logger logger, Database database) {\n        this.logger = logger;\n        this.database = database;\n    }\n}' },
        { type: 'heading', value: 'Проблема 2: Сложность тестирования' },
        { type: 'text', value: 'Singleton трудно подменить mock-объектом в тестах, потому что getInstance() возвращает конкретный класс, а не интерфейс. Это делает юнит-тестирование болезненным.' },
        { type: 'heading', value: 'Проблема 3: Нарушение SRP' },
        { type: 'text', value: 'Класс-Singleton отвечает и за свою основную логику, и за управление своим жизненным циклом (создание единственного экземпляра). Это две ответственности.' },
        { type: 'heading', value: 'Альтернатива: Dependency Injection' },
        { type: 'code', language: 'java', value: '// Spring Boot — DI контейнер управляет синглтонами за вас\n@Service // По умолчанию singleton scope\npublic class UserService {\n    private final UserRepository repository;\n    private final EmailService emailService;\n\n    // Spring автоматически инжектит зависимости\n    public UserService(UserRepository repository, EmailService emailService) {\n        this.repository = repository;\n        this.emailService = emailService;\n    }\n}' },
        { type: 'tip', value: 'Если вам нужен единственный экземпляр — используйте DI-контейнер (Spring, Dagger, Angular DI). Он управляет синглтонами правильно: через интерфейсы, с возможностью подмены в тестах.' },
        { type: 'warning', value: 'Глобальное изменяемое состояние (а Singleton — это по сути глобальная переменная) — источник множества багов. Избегайте мутабельных синглтонов.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: потокобезопасный Singleton',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте потокобезопасный Singleton для класса ConnectionPool на Java.',
      requirements: [
        'Используйте подход Bill Pugh (Initialization-on-demand holder)',
        'Приватный конструктор, инициализирующий пул из 5 соединений',
        'Метод getConnection() — получить соединение из пула',
        'Метод releaseConnection() — вернуть соединение в пул',
        'Singleton должен быть защищён от создания через рефлексию'
      ],
      hint: 'Bill Pugh Singleton использует статический внутренний класс. JVM гарантирует потокобезопасную загрузку внутреннего класса при первом обращении.',
      expectedOutput: 'Пул создан: 5 соединений\nПолучено соединение: conn-1\nПолучено соединение: conn-2\nСоединение возвращено: conn-2\nВ пуле: 4 соединения',
      solution: 'import java.util.LinkedList;\nimport java.util.Queue;\n\npublic class ConnectionPool {\n    private final Queue<String> pool = new LinkedList<>();\n    private final int maxSize;\n    private int counter = 0;\n\n    // Приватный конструктор\n    private ConnectionPool(int size) {\n        this.maxSize = size;\n        for (int i = 1; i <= size; i++) {\n            pool.add("conn-" + i);\n        }\n        System.out.println("Пул создан: " + size + " соединений");\n    }\n\n    // Bill Pugh Singleton — внутренний класс-holder\n    private static class Holder {\n        private static final ConnectionPool INSTANCE = new ConnectionPool(5);\n    }\n\n    public static ConnectionPool getInstance() {\n        return Holder.INSTANCE;\n    }\n\n    public synchronized String getConnection() {\n        if (pool.isEmpty()) {\n            throw new RuntimeException("Нет доступных соединений");\n        }\n        String conn = pool.poll();\n        System.out.println("Получено соединение: " + conn);\n        return conn;\n    }\n\n    public synchronized void releaseConnection(String conn) {\n        pool.offer(conn);\n        System.out.println("Соединение возвращено: " + conn);\n    }\n\n    public int availableConnections() {\n        return pool.size();\n    }\n\n    public static void main(String[] args) {\n        ConnectionPool pool = ConnectionPool.getInstance();\n        String c1 = pool.getConnection();\n        String c2 = pool.getConnection();\n        pool.releaseConnection(c2);\n        System.out.println("В пуле: " + pool.availableConnections() + " соединения");\n    }\n}',
      explanation: 'Bill Pugh Singleton использует статический внутренний класс Holder. JVM гарантирует, что класс Holder загружается только при первом обращении к getInstance(), и загрузка класса потокобезопасна. Это сочетает ленивую инициализацию с потокобезопасностью без synchronized.'
    },
    {
      id: 6,
      title: 'Практика: Singleton Logger на TypeScript',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте Singleton-логгер на TypeScript с поддержкой уровней логирования.',
      requirements: [
        'Класс Logger с приватным конструктором',
        'Статический метод getInstance()',
        'Поддержка уровней: INFO, WARN, ERROR',
        'Метод setLevel() для изменения минимального уровня логирования',
        'Сообщения ниже установленного уровня не выводятся'
      ],
      hint: 'Используйте числовые приоритеты для уровней: INFO=0, WARN=1, ERROR=2. Выводите только сообщения с приоритетом >= текущего уровня.',
      expectedOutput: '[INFO] Приложение запущено\n[WARN] Мало памяти\n[ERROR] Критическая ошибка\n--- Уровень: WARN ---\n[WARN] Мало памяти\n[ERROR] Критическая ошибка',
      solution: 'enum LogLevel {\n    INFO = 0,\n    WARN = 1,\n    ERROR = 2\n}\n\nclass Logger {\n    private static instance: Logger;\n    private level: LogLevel = LogLevel.INFO;\n\n    private constructor() {}\n\n    static getInstance(): Logger {\n        if (!Logger.instance) {\n            Logger.instance = new Logger();\n        }\n        return Logger.instance;\n    }\n\n    setLevel(level: LogLevel): void {\n        this.level = level;\n    }\n\n    info(message: string): void {\n        if (this.level <= LogLevel.INFO) {\n            console.log(`[INFO] ${message}`);\n        }\n    }\n\n    warn(message: string): void {\n        if (this.level <= LogLevel.WARN) {\n            console.log(`[WARN] ${message}`);\n        }\n    }\n\n    error(message: string): void {\n        if (this.level <= LogLevel.ERROR) {\n            console.log(`[ERROR] ${message}`);\n        }\n    }\n}\n\n// Использование\nconst logger = Logger.getInstance();\nlogger.info("Приложение запущено");\nlogger.warn("Мало памяти");\nlogger.error("Критическая ошибка");\n\nconsole.log("--- Уровень: WARN ---");\nlogger.setLevel(LogLevel.WARN);\nlogger.info("Это не выведется");\nlogger.warn("Мало памяти");\nlogger.error("Критическая ошибка");',
      explanation: 'Logger реализован как классический Singleton с приватным конструктором. Уровни логирования представлены enum с числовыми значениями, что позволяет просто сравнивать приоритеты. getInstance() гарантирует единственный экземпляр.'
    }
  ]
}
