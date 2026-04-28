export default {
  id: 8,
  title: 'Adapter',
  description: 'Паттерн Adapter: преобразование интерфейсов, интеграция несовместимых компонентов',
  lessons: [
    {
      id: 1,
      title: 'Что такое Adapter?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Adapter (Адаптер) — структурный паттерн, который позволяет объектам с несовместимыми интерфейсами работать вместе. Адаптер оборачивает один из объектов и переводит вызовы в формат, понятный другому объекту.' },
        { type: 'heading', value: 'Аналогия из жизни' },
        { type: 'text', value: 'Переходник для розетки — классический пример адаптера. Европейская вилка не подходит к американской розетке, но адаптер-переходник решает проблему, не изменяя ни вилку, ни розетку.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Интеграция сторонней библиотеки с несовместимым интерфейсом',
          'Замена одного сервиса другим (например, смена платёжной системы)',
          'Работа с legacy-кодом, который нельзя менять',
          'Приведение разных источников данных к единому формату'
        ]},
        { type: 'code', language: 'text', value: '┌────────────┐     ┌──────────┐     ┌────────────┐\n│  Client    │────>│ Adapter  │────>│ Adaptee    │\n│            │     │ (Target) │     │ (чужой API)│\n└────────────┘     └──────────┘     └────────────┘\n\nClient знает только Target-интерфейс.\nAdapter транслирует вызовы к Adaptee.' },
        { type: 'note', value: 'Adapter не изменяет ни клиентский код, ни адаптируемый. Он создаёт промежуточный слой, который «переводит» один интерфейс в другой.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим Adapter на примере интеграции старого XML-аналитического сервиса с новой системой, работающей с JSON.' },
        { type: 'heading', value: 'Существующий (legacy) сервис' },
        { type: 'code', language: 'java', value: '// Legacy-сервис, который работает только с XML\npublic class XmlAnalyticsService {\n    public String analyzeXml(String xmlData) {\n        System.out.println("Анализ XML данных...");\n        return "<result><score>85</score><status>ok</status></result>";\n    }\n}' },
        { type: 'heading', value: 'Новый интерфейс системы' },
        { type: 'code', language: 'java', value: '// Интерфейс, который ожидает клиент\npublic interface AnalyticsService {\n    AnalyticsResult analyze(Map<String, Object> jsonData);\n}\n\npublic class AnalyticsResult {\n    private int score;\n    private String status;\n\n    public AnalyticsResult(int score, String status) {\n        this.score = score;\n        this.status = status;\n    }\n\n    @Override\n    public String toString() {\n        return "Score: " + score + ", Status: " + status;\n    }\n}' },
        { type: 'heading', value: 'Адаптер' },
        { type: 'code', language: 'java', value: '// Адаптер: преобразует JSON → XML, вызывает legacy, преобразует XML → Result\npublic class XmlToJsonAdapter implements AnalyticsService {\n    private final XmlAnalyticsService xmlService;\n\n    public XmlToJsonAdapter(XmlAnalyticsService xmlService) {\n        this.xmlService = xmlService;\n    }\n\n    @Override\n    public AnalyticsResult analyze(Map<String, Object> jsonData) {\n        // 1. Конвертируем JSON → XML\n        String xml = convertToXml(jsonData);\n\n        // 2. Вызываем legacy-сервис\n        String xmlResult = xmlService.analyzeXml(xml);\n\n        // 3. Конвертируем XML результат → наш формат\n        return parseXmlResult(xmlResult);\n    }\n\n    private String convertToXml(Map<String, Object> data) {\n        StringBuilder sb = new StringBuilder("<data>");\n        data.forEach((k, v) -> sb.append("<").append(k).append(">").append(v)\n            .append("</").append(k).append(">"));\n        sb.append("</data>");\n        return sb.toString();\n    }\n\n    private AnalyticsResult parseXmlResult(String xml) {\n        // Упрощённый парсинг\n        int score = Integer.parseInt(\n            xml.substring(xml.indexOf("<score>") + 7, xml.indexOf("</score>")));\n        String status = xml.substring(\n            xml.indexOf("<status>") + 8, xml.indexOf("</status>"));\n        return new AnalyticsResult(score, status);\n    }\n}\n\n// Клиентский код\npublic class App {\n    public static void main(String[] args) {\n        // Подключаем legacy через адаптер\n        AnalyticsService service = new XmlToJsonAdapter(new XmlAnalyticsService());\n\n        Map<String, Object> data = Map.of("users", 1500, "revenue", 50000);\n        AnalyticsResult result = service.analyze(data);\n        System.out.println(result); // Score: 85, Status: ok\n    }\n}' },
        { type: 'tip', value: 'Клиент работает только с интерфейсом AnalyticsService. Он не знает о XML, legacy-коде или адаптере. Когда legacy заменят новым сервисом, достаточно будет создать новую реализацию AnalyticsService.' }
      ]
    },
    {
      id: 3,
      title: 'Adapter на TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим адаптер для интеграции разных библиотек логирования.' },
        { type: 'code', language: 'typescript', value: '// Наш внутренний интерфейс логгера\ninterface AppLogger {\n    info(message: string, context?: Record<string, any>): void;\n    error(message: string, error?: Error): void;\n    warn(message: string): void;\n}\n\n// Сторонняя библиотека #1 (Winston-подобная)\nclass WinstonLogger {\n    log(level: string, msg: string, meta?: object): void {\n        console.log(`[Winston][${level}] ${msg}`, meta || "");\n    }\n}\n\n// Сторонняя библиотека #2 (Pino-подобная)\nclass PinoLogger {\n    child(bindings: object): PinoLogger { return this; }\n    info(obj: object, msg?: string): void {\n        console.log(`[Pino][INFO] ${msg}`, obj);\n    }\n    error(obj: object, msg?: string): void {\n        console.log(`[Pino][ERROR] ${msg}`, obj);\n    }\n    warn(obj: object, msg?: string): void {\n        console.log(`[Pino][WARN] ${msg}`, obj);\n    }\n}\n\n// Адаптер для Winston\nclass WinstonAdapter implements AppLogger {\n    constructor(private logger: WinstonLogger) {}\n\n    info(message: string, context?: Record<string, any>): void {\n        this.logger.log("info", message, context);\n    }\n    error(message: string, error?: Error): void {\n        this.logger.log("error", message, { error: error?.message });\n    }\n    warn(message: string): void {\n        this.logger.log("warn", message);\n    }\n}\n\n// Адаптер для Pino\nclass PinoAdapter implements AppLogger {\n    constructor(private logger: PinoLogger) {}\n\n    info(message: string, context?: Record<string, any>): void {\n        this.logger.info(context || {}, message);\n    }\n    error(message: string, error?: Error): void {\n        this.logger.error({ err: error }, message);\n    }\n    warn(message: string): void {\n        this.logger.warn({}, message);\n    }\n}\n\n// Клиентский код — не зависит от конкретной библиотеки\nclass UserService {\n    constructor(private logger: AppLogger) {}\n\n    createUser(name: string): void {\n        this.logger.info("Создание пользователя", { name });\n        // ... логика\n        this.logger.info("Пользователь создан", { name });\n    }\n}\n\n// Легко переключаемся между логгерами\nconst winstonLogger: AppLogger = new WinstonAdapter(new WinstonLogger());\nconst pinoLogger: AppLogger = new PinoAdapter(new PinoLogger());\n\nnew UserService(winstonLogger).createUser("Иван");\nnew UserService(pinoLogger).createUser("Пётр");' },
        { type: 'note', value: 'В реальных проектах адаптеры логгеров — очень частый случай. Это позволяет менять логгер (Winston → Pino → Bunyan) без изменения бизнес-логики.' }
      ]
    },
    {
      id: 4,
      title: 'Адаптер класса vs адаптер объекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существуют два подхода к реализации адаптера: через наследование (адаптер класса) и через композицию (адаптер объекта).' },
        { type: 'heading', value: 'Адаптер объекта (композиция) — рекомендуемый' },
        { type: 'code', language: 'java', value: '// Адаптер содержит ссылку на адаптируемый объект\nclass PayPalAdapter implements PaymentProcessor {\n    private final PayPalSDK paypal; // Композиция\n\n    PayPalAdapter(PayPalSDK paypal) {\n        this.paypal = paypal;\n    }\n\n    @Override\n    public void pay(double amount, String currency) {\n        paypal.sendPayment(amount, currency, "merchant-123");\n    }\n}' },
        { type: 'heading', value: 'Адаптер класса (наследование)' },
        { type: 'code', language: 'java', value: '// Адаптер наследуется от адаптируемого класса\nclass PayPalAdapter extends PayPalSDK implements PaymentProcessor {\n    @Override\n    public void pay(double amount, String currency) {\n        // Вызываем унаследованный метод\n        sendPayment(amount, currency, "merchant-123");\n    }\n}' },
        { type: 'heading', value: 'Сравнение' },
        { type: 'list', items: [
          'Композиция (объект): более гибкая, можно адаптировать подклассы, следует принципу «предпочитай композицию наследованию»',
          'Наследование (класс): проще, не нужно делегировать вызовы, но привязана к одному конкретному классу',
          'Композиция работает с интерфейсами (можно адаптировать любой объект, реализующий интерфейс)',
          'Наследование не работает в языках без множественного наследования (Java)'
        ]},
        { type: 'warning', value: 'В подавляющем большинстве случаев используйте адаптер объекта (композицию). Адаптер класса (наследование) — редкий случай, который имеет смысл только в C++.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: адаптер платёжных систем',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте адаптеры для интеграции разных платёжных систем (Stripe, PayPal) с единым интерфейсом.',
      requirements: [
        'Интерфейс PaymentGateway с методами charge(amount, currency) и refund(transactionId)',
        'Класс StripeSDK с методами createCharge(cents, cur) и createRefund(chargeId)',
        'Класс PayPalSDK с методами sendPayment(amount, currencyCode) и reversePayment(paymentId)',
        'Адаптеры StripeAdapter и PayPalAdapter, реализующие PaymentGateway',
        'Stripe работает в центах, PayPal в обычных единицах — адаптер конвертирует'
      ],
      hint: 'StripeAdapter должен умножать amount на 100 (доллары → центы). PayPalAdapter может просто передавать amount напрямую.',
      expectedOutput: 'Stripe: Charge $10.00 (1000 cents) USD → txn_stripe_123\nStripe: Refund txn_stripe_123 → OK\nPayPal: Payment $10.00 USD → txn_paypal_456\nPayPal: Reverse txn_paypal_456 → OK',
      solution: 'interface PaymentGateway {\n    String charge(double amount, String currency);\n    boolean refund(String transactionId);\n}\n\nclass StripeSDK {\n    public String createCharge(int cents, String cur) {\n        String txn = "txn_stripe_123";\n        System.out.printf("Stripe: Charge $%.2f (%d cents) %s → %s%n",\n            cents / 100.0, cents, cur, txn);\n        return txn;\n    }\n    public boolean createRefund(String chargeId) {\n        System.out.println("Stripe: Refund " + chargeId + " → OK");\n        return true;\n    }\n}\n\nclass PayPalSDK {\n    public String sendPayment(double amount, String currencyCode) {\n        String txn = "txn_paypal_456";\n        System.out.printf("PayPal: Payment $%.2f %s → %s%n", amount, currencyCode, txn);\n        return txn;\n    }\n    public boolean reversePayment(String paymentId) {\n        System.out.println("PayPal: Reverse " + paymentId + " → OK");\n        return true;\n    }\n}\n\nclass StripeAdapter implements PaymentGateway {\n    private final StripeSDK stripe;\n    StripeAdapter(StripeSDK stripe) { this.stripe = stripe; }\n\n    public String charge(double amount, String currency) {\n        int cents = (int) (amount * 100);\n        return stripe.createCharge(cents, currency);\n    }\n    public boolean refund(String transactionId) {\n        return stripe.createRefund(transactionId);\n    }\n}\n\nclass PayPalAdapter implements PaymentGateway {\n    private final PayPalSDK paypal;\n    PayPalAdapter(PayPalSDK paypal) { this.paypal = paypal; }\n\n    public String charge(double amount, String currency) {\n        return paypal.sendPayment(amount, currency);\n    }\n    public boolean refund(String transactionId) {\n        return paypal.reversePayment(transactionId);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        PaymentGateway stripe = new StripeAdapter(new StripeSDK());\n        String txn1 = stripe.charge(10.00, "USD");\n        stripe.refund(txn1);\n\n        PaymentGateway paypal = new PayPalAdapter(new PayPalSDK());\n        String txn2 = paypal.charge(10.00, "USD");\n        paypal.refund(txn2);\n    }\n}',
      explanation: 'Адаптеры скрывают различия API: Stripe работает в центах, PayPal — в долларах. Клиентский код использует единый интерфейс PaymentGateway и не знает о деталях реализации. Замена платёжной системы — одна строка кода.'
    },
    {
      id: 6,
      title: 'Практика: адаптер API на TypeScript',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте адаптеры для работы с разными HTTP-клиентами (fetch, axios) через единый интерфейс.',
      requirements: [
        'Интерфейс HttpClient с методами get(url), post(url, body), put(url, body), delete(url)',
        'Класс FetchAdapter — адаптер над fetch API',
        'Класс AxiosLikeClient — имитация axios с методами request(config)',
        'Класс AxiosAdapter — адаптер над AxiosLikeClient',
        'Сервис ApiService, использующий HttpClient'
      ],
      hint: 'FetchAdapter использует стандартный fetch API. AxiosAdapter транслирует вызовы get/post/put/delete в формат config-объекта axios.',
      expectedOutput: 'GET https://api.example.com/users → 200\nPOST https://api.example.com/users → 201\n--- Switch to Axios ---\nGET https://api.example.com/users → 200\nPOST https://api.example.com/users → 201',
      solution: 'interface HttpResponse {\n    status: number;\n    data: any;\n}\n\ninterface HttpClient {\n    get(url: string): Promise<HttpResponse>;\n    post(url: string, body: any): Promise<HttpResponse>;\n}\n\n// Имитация fetch\nclass FetchAdapter implements HttpClient {\n    async get(url: string): Promise<HttpResponse> {\n        console.log(`GET ${url} → 200`);\n        return { status: 200, data: [] };\n    }\n    async post(url: string, body: any): Promise<HttpResponse> {\n        console.log(`POST ${url} → 201`);\n        return { status: 201, data: body };\n    }\n}\n\n// Имитация axios-подобного клиента\nclass AxiosLikeClient {\n    async request(config: { method: string; url: string; data?: any }): Promise<{ status: number; data: any }> {\n        const status = config.method === "POST" ? 201 : 200;\n        console.log(`${config.method} ${config.url} → ${status}`);\n        return { status, data: config.data || [] };\n    }\n}\n\nclass AxiosAdapter implements HttpClient {\n    constructor(private axios: AxiosLikeClient) {}\n\n    async get(url: string): Promise<HttpResponse> {\n        return this.axios.request({ method: "GET", url });\n    }\n    async post(url: string, body: any): Promise<HttpResponse> {\n        return this.axios.request({ method: "POST", url, data: body });\n    }\n}\n\n// Клиент не знает, какой HTTP-клиент используется\nclass ApiService {\n    constructor(private http: HttpClient) {}\n\n    async getUsers() {\n        return this.http.get("https://api.example.com/users");\n    }\n    async createUser(name: string) {\n        return this.http.post("https://api.example.com/users", { name });\n    }\n}\n\nasync function main() {\n    const fetchApi = new ApiService(new FetchAdapter());\n    await fetchApi.getUsers();\n    await fetchApi.createUser("Иван");\n\n    console.log("--- Switch to Axios ---");\n    const axiosApi = new ApiService(new AxiosAdapter(new AxiosLikeClient()));\n    await axiosApi.getUsers();\n    await axiosApi.createUser("Пётр");\n}\n\nmain();',
      explanation: 'Adapter позволяет переключаться между HTTP-клиентами (fetch, axios, got) без изменения бизнес-логики. ApiService зависит только от интерфейса HttpClient. Это особенно полезно для тестирования — легко подставить mock-клиент.'
    }
  ]
}
