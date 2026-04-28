export default {
  id: 22,
  title: 'Strategy',
  description: 'Паттерн Strategy: взаимозаменяемые алгоритмы, выбор поведения во время выполнения',
  lessons: [
    {
      id: 1,
      title: 'Что такое Strategy?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Strategy (Стратегия) — поведенческий паттерн, который определяет семейство алгоритмов, инкапсулирует каждый из них и делает взаимозаменяемыми. Strategy позволяет менять алгоритм независимо от клиентов.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Нужно выбирать алгоритм во время выполнения',
          'Есть несколько вариантов одного поведения (сортировка, шифрование, сжатие)',
          'Хотите избавиться от switch/if-else для выбора алгоритма',
          'Нужно тестировать алгоритмы независимо от контекста'
        ]},
        { type: 'code', language: 'java', value: '// ❌ Без Strategy — switch в каждом месте\ndouble calculateDiscount(String type, double price) {\n    switch (type) {\n        case "percentage": return price * 0.1;\n        case "fixed": return 50;\n        case "bogo": return price / 2;\n        default: return 0;\n    }\n}\n\n// ✅ Со Strategy — чистый полиморфизм\ninterface DiscountStrategy {\n    double calculate(double price);\n}\n\nclass PercentDiscount implements DiscountStrategy {\n    double calculate(double price) { return price * 0.1; }\n}\n\n// Контекст просто делегирует стратегии\nclass PriceCalculator {\n    private DiscountStrategy strategy;\n    double getFinalPrice(double price) {\n        return price - strategy.calculate(price);\n    }\n}' },
        { type: 'note', value: 'Strategy — один из самых часто используемых паттернов. В функциональных языках стратегия — это просто функция высшего порядка (callback).' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java: система оплаты',
      type: 'theory',
      content: [
        { type: 'code', language: 'java', value: 'interface PaymentStrategy {\n    void pay(double amount);\n    String getName();\n}\n\nclass CreditCardPayment implements PaymentStrategy {\n    private String cardNumber;\n    CreditCardPayment(String card) { this.cardNumber = card; }\n    public void pay(double amount) {\n        System.out.printf("💳 Оплата картой %s: %.2f тг%n", cardNumber, amount);\n    }\n    public String getName() { return "Банковская карта"; }\n}\n\nclass PayPalPayment implements PaymentStrategy {\n    private String email;\n    PayPalPayment(String email) { this.email = email; }\n    public void pay(double amount) {\n        System.out.printf("🅿️ PayPal %s: %.2f тг%n", email, amount);\n    }\n    public String getName() { return "PayPal"; }\n}\n\nclass CryptoPayment implements PaymentStrategy {\n    private String wallet;\n    CryptoPayment(String wallet) { this.wallet = wallet; }\n    public void pay(double amount) {\n        System.out.printf("₿ Крипто %s: %.2f тг%n", wallet, amount);\n    }\n    public String getName() { return "Криптовалюта"; }\n}\n\nclass ShoppingCart {\n    private List<String> items = new ArrayList<>();\n    private double total = 0;\n    private PaymentStrategy paymentStrategy;\n\n    void addItem(String item, double price) {\n        items.add(item);\n        total += price;\n    }\n\n    void setPaymentStrategy(PaymentStrategy strategy) {\n        this.paymentStrategy = strategy;\n    }\n\n    void checkout() {\n        if (paymentStrategy == null) throw new RuntimeException("Выберите способ оплаты");\n        System.out.println("Корзина: " + items + " | Итого: " + total + " тг");\n        System.out.println("Способ оплаты: " + paymentStrategy.getName());\n        paymentStrategy.pay(total);\n    }\n}\n\nShoppingCart cart = new ShoppingCart();\ncart.addItem("Ноутбук", 500000);\ncart.addItem("Мышь", 15000);\ncart.setPaymentStrategy(new CreditCardPayment("4111-****-****-1234"));\ncart.checkout();\n\n// Или переключить на PayPal\ncart.setPaymentStrategy(new PayPalPayment("user@mail.com"));\ncart.checkout();' },
        { type: 'tip', value: 'Стратегию можно менять на лету через setPaymentStrategy(). Это отличает Strategy от Factory Method, где выбор делается при создании.' }
      ]
    },
    {
      id: 3,
      title: 'Strategy на TypeScript: функциональный стиль',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// В TypeScript стратегия — просто функция\ntype SortStrategy<T> = (a: T, b: T) => number;\n\nclass SortableList<T> {\n    private items: T[];\n\n    constructor(items: T[]) {\n        this.items = [...items];\n    }\n\n    sort(strategy: SortStrategy<T>): T[] {\n        return [...this.items].sort(strategy);\n    }\n}\n\ninterface Product {\n    name: string;\n    price: number;\n    rating: number;\n}\n\nconst products: Product[] = [\n    { name: "Ноутбук", price: 500000, rating: 4.5 },\n    { name: "Телефон", price: 300000, rating: 4.8 },\n    { name: "Наушники", price: 50000, rating: 4.2 },\n];\n\n// Стратегии — просто функции\nconst byPriceAsc: SortStrategy<Product> = (a, b) => a.price - b.price;\nconst byPriceDesc: SortStrategy<Product> = (a, b) => b.price - a.price;\nconst byRating: SortStrategy<Product> = (a, b) => b.rating - a.rating;\nconst byName: SortStrategy<Product> = (a, b) => a.name.localeCompare(b.name);\n\nconst list = new SortableList(products);\n\nconsole.log("По цене (↑):", list.sort(byPriceAsc).map(p => p.name));\nconsole.log("По рейтингу:", list.sort(byRating).map(p => p.name));\nconsole.log("По имени:", list.sort(byName).map(p => p.name));' },
        { type: 'heading', value: 'Strategy с Map-реестром' },
        { type: 'code', language: 'typescript', value: '// Реестр стратегий — удобно для конфигурации\ntype Compressor = (data: string) => string;\n\nconst compressors = new Map<string, Compressor>([\n    ["gzip", (data) => `gzip(${data.length}→${Math.floor(data.length * 0.3)})` ],\n    ["brotli", (data) => `brotli(${data.length}→${Math.floor(data.length * 0.2)})` ],\n    ["none", (data) => data ],\n]);\n\nfunction compress(data: string, algorithm: string): string {\n    const compressor = compressors.get(algorithm);\n    if (!compressor) throw new Error(`Неизвестный алгоритм: ${algorithm}`);\n    return compressor(data);\n}\n\nconsole.log(compress("Hello World!", "gzip"));\nconsole.log(compress("Hello World!", "brotli"));' },
        { type: 'note', value: 'В TypeScript/JavaScript стратегии естественно представляются как функции (callback-и). Полноценные классы стратегий нужны, когда у стратегии есть собственное состояние или конфигурация.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: система авторизации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Strategy для разных способов аутентификации.',
      requirements: [
        'Интерфейс AuthStrategy с методом authenticate(credentials): AuthResult',
        'Стратегии: PasswordAuth, OAuthAuth, ApiKeyAuth, JwtAuth',
        'Класс AuthService с setStrategy() и login()',
        'AuthResult содержит success, token, message',
        'Демонстрация переключения между стратегиями'
      ],
      hint: 'Каждая стратегия проверяет credentials по-своему: пароль — через хеш, OAuth — через провайдер, JWT — через подпись.',
      expectedOutput: '--- Пароль ---\n🔐 Проверка пароля для user@mail.com\n✅ Успех! Токен: pwd_abc123\n--- OAuth ---\n🔗 OAuth через Google для user@mail.com\n✅ Успех! Токен: oauth_xyz789\n--- API Key ---\n🔑 Проверка API Key: sk-****\n✅ Успех! Токен: api_key_valid',
      solution: 'interface AuthResult {\n    success: boolean;\n    token?: string;\n    message: string;\n}\n\ninterface AuthStrategy {\n    authenticate(credentials: Record<string, string>): AuthResult;\n}\n\nclass PasswordAuth implements AuthStrategy {\n    authenticate(creds: Record<string, string>): AuthResult {\n        console.log("🔐 Проверка пароля для " + creds.email);\n        if (creds.email && creds.password) {\n            return { success: true, token: "pwd_abc123", message: "Успех!" };\n        }\n        return { success: false, message: "Неверные данные" };\n    }\n}\n\nclass OAuthAuth implements AuthStrategy {\n    constructor(private provider: string) {}\n    authenticate(creds: Record<string, string>): AuthResult {\n        console.log(`🔗 OAuth через ${this.provider} для ${creds.email}`);\n        return { success: true, token: "oauth_xyz789", message: "Успех!" };\n    }\n}\n\nclass ApiKeyAuth implements AuthStrategy {\n    authenticate(creds: Record<string, string>): AuthResult {\n        const key = creds.apiKey || "";\n        console.log("🔑 Проверка API Key: " + key.substring(0, 3) + "****");\n        return key.startsWith("sk-")\n            ? { success: true, token: "api_key_valid", message: "Успех!" }\n            : { success: false, message: "Невалидный ключ" };\n    }\n}\n\nclass AuthService {\n    private strategy!: AuthStrategy;\n\n    setStrategy(s: AuthStrategy): void { this.strategy = s; }\n\n    login(credentials: Record<string, string>): AuthResult {\n        const result = this.strategy.authenticate(credentials);\n        console.log(result.success\n            ? `✅ ${result.message} Токен: ${result.token}`\n            : `❌ ${result.message}`);\n        return result;\n    }\n}\n\nconst auth = new AuthService();\n\nconsole.log("--- Пароль ---");\nauth.setStrategy(new PasswordAuth());\nauth.login({ email: "user@mail.com", password: "secret" });\n\nconsole.log("--- OAuth ---");\nauth.setStrategy(new OAuthAuth("Google"));\nauth.login({ email: "user@mail.com" });\n\nconsole.log("--- API Key ---");\nauth.setStrategy(new ApiKeyAuth());\nauth.login({ apiKey: "sk-test-12345" });',
      explanation: 'AuthService не знает деталей аутентификации — он делегирует стратегии. Переключение с пароля на OAuth — одна строка. Для добавления нового метода (биометрия) — один новый класс.'
    },
    {
      id: 5,
      title: 'Практика: валидатор данных на Java',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте Strategy для валидации данных разных типов.',
      requirements: [
        'Интерфейс ValidationStrategy с validate(value) → ValidationResult',
        'EmailValidation, PhoneValidation, UrlValidation, PasswordValidation',
        'Класс Validator контекст с setStrategy() и validate()',
        'ValidationResult: isValid, errorMessage',
        'Каждая стратегия проверяет формат данных'
      ],
      hint: 'Каждая стратегия содержит regex или логику проверки. validate() возвращает результат с описанием ошибки.',
      expectedOutput: 'Email "test@mail.com": ✅\nEmail "invalid": ❌ Должен содержать @\nТелефон "+7-777-123-4567": ✅\nURL "https://google.com": ✅\nПароль "weak": ❌ Минимум 8 символов',
      solution: 'interface ValidationResult {\n    boolean isValid();\n    String errorMessage();\n}\n\nrecord Valid() implements ValidationResult {\n    public boolean isValid() { return true; }\n    public String errorMessage() { return ""; }\n}\n\nrecord Invalid(String error) implements ValidationResult {\n    public boolean isValid() { return false; }\n    public String errorMessage() { return error; }\n}\n\ninterface ValidationStrategy {\n    ValidationResult validate(String value);\n}\n\nclass EmailValidation implements ValidationStrategy {\n    public ValidationResult validate(String v) {\n        if (!v.contains("@")) return new Invalid("Должен содержать @");\n        if (!v.contains(".")) return new Invalid("Должен содержать домен");\n        return new Valid();\n    }\n}\n\nclass PhoneValidation implements ValidationStrategy {\n    public ValidationResult validate(String v) {\n        String digits = v.replaceAll("[^0-9]", "");\n        if (digits.length() < 10) return new Invalid("Минимум 10 цифр");\n        return new Valid();\n    }\n}\n\nclass UrlValidation implements ValidationStrategy {\n    public ValidationResult validate(String v) {\n        if (!v.startsWith("http://") && !v.startsWith("https://"))\n            return new Invalid("Должен начинаться с http(s)://");\n        return new Valid();\n    }\n}\n\nclass PasswordValidation implements ValidationStrategy {\n    public ValidationResult validate(String v) {\n        if (v.length() < 8) return new Invalid("Минимум 8 символов");\n        return new Valid();\n    }\n}\n\nclass Validator {\n    private ValidationStrategy strategy;\n    Validator(ValidationStrategy s) { this.strategy = s; }\n    void setStrategy(ValidationStrategy s) { this.strategy = s; }\n\n    void validate(String label, String value) {\n        ValidationResult r = strategy.validate(value);\n        System.out.println(label + " \\"" + value + "\\": " +\n            (r.isValid() ? "✅" : "❌ " + r.errorMessage()));\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Validator v = new Validator(new EmailValidation());\n        v.validate("Email", "test@mail.com");\n        v.validate("Email", "invalid");\n\n        v.setStrategy(new PhoneValidation());\n        v.validate("Телефон", "+7-777-123-4567");\n\n        v.setStrategy(new UrlValidation());\n        v.validate("URL", "https://google.com");\n\n        v.setStrategy(new PasswordValidation());\n        v.validate("Пароль", "weak");\n    }\n}',
      explanation: 'Каждая стратегия инкапсулирует логику валидации одного типа данных. Validator переключается между стратегиями через setStrategy(). Новые правила — новые классы, без изменения Validator.'
    },
    {
      id: 6,
      title: 'Практика: компрессия данных на TypeScript',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Strategy для сжатия данных с бенчмаркингом стратегий.',
      requirements: [
        'Интерфейс CompressionStrategy с compress(data) и decompress(data)',
        'Стратегии: RunLengthEncoding, HuffmanSimple, NoCompression',
        'Класс DataProcessor с setCompression() и processFile()',
        'Метод benchmark() — сравнивает все стратегии по размеру результата',
        'Показать коэффициент сжатия для каждой стратегии'
      ],
      hint: 'RunLengthEncoding: "AAABBC" → "3A2B1C". benchmark() запускает каждую стратегию и сравнивает размеры.',
      expectedOutput: 'Benchmark для "AAABBBCCCCDDDDDDDD":\n  NoCompression: 18 → 18 (100%)\n  RLE: 18 → 12 (67%)\n  Huffman: 18 → 10 (56%)',
      solution: 'interface CompressionStrategy {\n    compress(data: string): string;\n    decompress(data: string): string;\n    getName(): string;\n}\n\nclass NoCompression implements CompressionStrategy {\n    compress(data: string): string { return data; }\n    decompress(data: string): string { return data; }\n    getName(): string { return "NoCompression"; }\n}\n\nclass RunLengthEncoding implements CompressionStrategy {\n    compress(data: string): string {\n        let result = "";\n        let count = 1;\n        for (let i = 1; i <= data.length; i++) {\n            if (i < data.length && data[i] === data[i - 1]) {\n                count++;\n            } else {\n                result += count + data[i - 1];\n                count = 1;\n            }\n        }\n        return result;\n    }\n\n    decompress(data: string): string {\n        let result = "";\n        for (let i = 0; i < data.length; i += 2) {\n            const count = parseInt(data[i]);\n            result += data[i + 1].repeat(count);\n        }\n        return result;\n    }\n\n    getName(): string { return "RLE"; }\n}\n\nclass SimpleHuffman implements CompressionStrategy {\n    compress(data: string): string {\n        const freq = new Map<string, number>();\n        for (const c of data) freq.set(c, (freq.get(c) || 0) + 1);\n        const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1]);\n        const codes = new Map<string, string>();\n        sorted.forEach(([char], i) => codes.set(char, i.toString(36)));\n        return [...data].map(c => codes.get(c)).join("");\n    }\n\n    decompress(data: string): string { return data; }\n    getName(): string { return "Huffman"; }\n}\n\nclass DataProcessor {\n    private strategy: CompressionStrategy = new NoCompression();\n\n    setCompression(s: CompressionStrategy): void { this.strategy = s; }\n\n    processFile(data: string): string {\n        return this.strategy.compress(data);\n    }\n\n    static benchmark(data: string, strategies: CompressionStrategy[]): void {\n        console.log(`Benchmark для "${data}":`);\n        for (const s of strategies) {\n            const compressed = s.compress(data);\n            const ratio = Math.round((compressed.length / data.length) * 100);\n            console.log(`  ${s.getName()}: ${data.length} → ${compressed.length} (${ratio}%)`);\n        }\n    }\n}\n\nconst testData = "AAABBBCCCCDDDDDDDD";\nDataProcessor.benchmark(testData, [\n    new NoCompression(),\n    new RunLengthEncoding(),\n    new SimpleHuffman()\n]);',
      explanation: 'Три стратегии сжатия сравниваются на одних данных. benchmark() — утилита для выбора лучшей стратегии. В production используют аналогичный подход для выбора алгоритма сжатия (gzip vs brotli vs zstd).'
    }
  ]
}
