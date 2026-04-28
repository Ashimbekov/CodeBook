export default {
  id: 14,
  title: 'Proxy',
  description: 'Паттерн Proxy: контроль доступа, lazy loading, кэширование, логирование через заместителей',
  lessons: [
    {
      id: 1,
      title: 'Что такое Proxy?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Proxy (Заместитель) — структурный паттерн, предоставляющий объект-заместитель, который контролирует доступ к другому объекту. Proxy имеет тот же интерфейс, что и оригинал, поэтому клиент не замечает разницы.' },
        { type: 'heading', value: 'Виды Proxy' },
        { type: 'list', items: [
          'Virtual Proxy — отложенная (lazy) загрузка тяжёлого объекта',
          'Protection Proxy — контроль доступа (проверка прав)',
          'Caching Proxy — кэширование результатов',
          'Logging Proxy — логирование вызовов',
          'Remote Proxy — доступ к удалённому объекту (RPC, gRPC)'
        ]},
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Lazy initialization — объект дорого создавать, но может не понадобиться',
          'Access control — проверка прав перед выполнением операции',
          'Caching — сохранение результатов повторяющихся запросов',
          'Logging/Monitoring — отслеживание вызовов без изменения объекта'
        ]},
        { type: 'note', value: 'Proxy vs Decorator: оба оборачивают объект, но Proxy контролирует доступ, а Decorator добавляет функциональность. Proxy обычно сам управляет жизненным циклом объекта.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java',
      type: 'theory',
      content: [
        { type: 'heading', value: 'Virtual Proxy: отложенная загрузка' },
        { type: 'code', language: 'java', value: 'interface Image {\n    void display();\n    int getWidth();\n}\n\n// Реальный объект — долго загружается\nclass HighResImage implements Image {\n    private String filename;\n    private byte[] data;\n\n    HighResImage(String filename) {\n        this.filename = filename;\n        loadFromDisk(); // Долгая операция!\n    }\n\n    private void loadFromDisk() {\n        System.out.println("⏳ Загрузка " + filename + " (3 секунды)...");\n        this.data = new byte[10_000_000]; // 10 MB\n    }\n\n    public void display() { System.out.println("🖼️ Отображение: " + filename); }\n    public int getWidth() { return 1920; }\n}\n\n// Proxy — откладывает загрузку до первого использования\nclass ImageProxy implements Image {\n    private String filename;\n    private HighResImage realImage; // null до первого вызова\n\n    ImageProxy(String filename) {\n        this.filename = filename;\n        System.out.println("📎 Создан proxy для: " + filename);\n    }\n\n    private HighResImage getRealImage() {\n        if (realImage == null) {\n            realImage = new HighResImage(filename);\n        }\n        return realImage;\n    }\n\n    public void display() { getRealImage().display(); }\n    public int getWidth() { return getRealImage().getWidth(); }\n}\n\n// Использование\nList<Image> gallery = List.of(\n    new ImageProxy("photo1.jpg"),  // Быстро — не загружает\n    new ImageProxy("photo2.jpg"),\n    new ImageProxy("photo3.jpg")\n);\n\n// Загрузка произойдёт только при display()\ngallery.get(0).display(); // Вот тут загрузится photo1.jpg' },
        { type: 'heading', value: 'Protection Proxy: проверка доступа' },
        { type: 'code', language: 'java', value: 'interface Document {\n    String read();\n    void write(String content);\n    void delete();\n}\n\nclass RealDocument implements Document {\n    private String content;\n    RealDocument(String content) { this.content = content; }\n    public String read() { return content; }\n    public void write(String c) { this.content = c; }\n    public void delete() { System.out.println("Документ удалён"); }\n}\n\nclass SecureDocumentProxy implements Document {\n    private final RealDocument doc;\n    private final String userRole;\n\n    SecureDocumentProxy(RealDocument doc, String role) {\n        this.doc = doc;\n        this.userRole = role;\n    }\n\n    public String read() {\n        System.out.println("🔍 Проверка прав на чтение... ✅");\n        return doc.read();\n    }\n\n    public void write(String content) {\n        if (!"ADMIN".equals(userRole) && !"EDITOR".equals(userRole)) {\n            System.out.println("🚫 Нет прав на запись! Роль: " + userRole);\n            return;\n        }\n        System.out.println("✅ Запись разрешена для роли: " + userRole);\n        doc.write(content);\n    }\n\n    public void delete() {\n        if (!"ADMIN".equals(userRole)) {\n            System.out.println("🚫 Удаление доступно только ADMIN!");\n            return;\n        }\n        doc.delete();\n    }\n}' },
        { type: 'tip', value: 'Spring AOP, JPA lazy-loading, JDK Dynamic Proxy — все используют паттерн Proxy. В Hibernate entity загружаются через proxy для отложенной загрузки связей.' }
      ]
    },
    {
      id: 3,
      title: 'Proxy на TypeScript с ES6 Proxy',
      type: 'theory',
      content: [
        { type: 'text', value: 'JavaScript имеет встроенный объект Proxy, который позволяет перехватывать операции с объектом.' },
        { type: 'code', language: 'typescript', value: '// Caching Proxy через ES6 Proxy\nclass ApiService {\n    async fetchUser(id: number): Promise<{ id: number; name: string }> {\n        console.log(`🌐 HTTP GET /users/${id}`);\n        return { id, name: `User ${id}` };\n    }\n\n    async fetchPosts(userId: number): Promise<any[]> {\n        console.log(`🌐 HTTP GET /users/${userId}/posts`);\n        return [{ id: 1, title: "Post 1" }];\n    }\n}\n\nfunction createCachingProxy<T extends object>(target: T, ttl: number = 5000): T {\n    const cache = new Map<string, { data: any; timestamp: number }>();\n\n    return new Proxy(target, {\n        get(obj, prop) {\n            const original = (obj as any)[prop];\n            if (typeof original !== "function") return original;\n\n            return async (...args: any[]) => {\n                const key = `${String(prop)}_${JSON.stringify(args)}`;\n                const cached = cache.get(key);\n\n                if (cached && Date.now() - cached.timestamp < ttl) {\n                    console.log(`💾 Cache hit: ${key}`);\n                    return cached.data;\n                }\n\n                console.log(`🔄 Cache miss: ${key}`);\n                const result = await original.apply(obj, args);\n                cache.set(key, { data: result, timestamp: Date.now() });\n                return result;\n            };\n        }\n    });\n}\n\n// Использование\nconst api = createCachingProxy(new ApiService(), 10000);\n\nasync function demo() {\n    await api.fetchUser(1);  // Cache miss → HTTP запрос\n    await api.fetchUser(1);  // Cache hit → из кэша\n    await api.fetchUser(2);  // Cache miss → HTTP запрос\n    await api.fetchUser(1);  // Cache hit → из кэша\n}\n\ndemo();' },
        { type: 'heading', value: 'Logging Proxy' },
        { type: 'code', language: 'typescript', value: 'function createLoggingProxy<T extends object>(target: T, label: string): T {\n    return new Proxy(target, {\n        get(obj, prop) {\n            const original = (obj as any)[prop];\n            if (typeof original !== "function") return original;\n\n            return (...args: any[]) => {\n                console.log(`[${label}] ${String(prop)}(${args.map(a => JSON.stringify(a)).join(", ")})`);\n                const start = performance.now();\n                const result = original.apply(obj, args);\n                const duration = (performance.now() - start).toFixed(2);\n                console.log(`[${label}] → ${duration}ms`);\n                return result;\n            };\n        }\n    });\n}' },
        { type: 'note', value: 'ES6 Proxy — мощный инструмент для создания reactive-систем. Vue 3 использует Proxy для реактивности вместо Object.defineProperty (Vue 2).' }
      ]
    },
    {
      id: 4,
      title: 'Практика: Caching Proxy для API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте кэширующий proxy для сервиса погоды на Java.',
      requirements: [
        'Интерфейс WeatherService с методом getWeather(city): WeatherData',
        'RealWeatherService — имитирует HTTP-запрос (медленный)',
        'CachingWeatherProxy — кэширует результаты с TTL',
        'Если данные в кэше свежие (< TTL) — вернуть из кэша',
        'Если устарели — запросить заново'
      ],
      hint: 'Храните пары (данные, время_запроса) в Map. При вызове проверяйте: если currentTime - cacheTime < TTL, возвращайте кэш.',
      expectedOutput: '🌐 Запрос погоды: Алматы (HTTP)...\nАлматы: +25°C\n💾 Из кэша: Алматы\nАлматы: +25°C\n🌐 Запрос погоды: Астана (HTTP)...\nАстана: +18°C',
      solution: 'import java.util.*;\n\nclass WeatherData {\n    String city; double temp;\n    WeatherData(String city, double temp) { this.city = city; this.temp = temp; }\n    public String toString() { return city + ": +" + (int)temp + "°C"; }\n}\n\ninterface WeatherService {\n    WeatherData getWeather(String city);\n}\n\nclass RealWeatherService implements WeatherService {\n    public WeatherData getWeather(String city) {\n        System.out.println("🌐 Запрос погоды: " + city + " (HTTP)...");\n        return new WeatherData(city, 15 + new Random().nextInt(15));\n    }\n}\n\nclass CachingWeatherProxy implements WeatherService {\n    private final WeatherService real;\n    private final long ttlMs;\n    private final Map<String, WeatherData> dataCache = new HashMap<>();\n    private final Map<String, Long> timeCache = new HashMap<>();\n\n    CachingWeatherProxy(WeatherService real, long ttlMs) {\n        this.real = real;\n        this.ttlMs = ttlMs;\n    }\n\n    public WeatherData getWeather(String city) {\n        Long cachedAt = timeCache.get(city);\n        if (cachedAt != null && System.currentTimeMillis() - cachedAt < ttlMs) {\n            System.out.println("💾 Из кэша: " + city);\n            return dataCache.get(city);\n        }\n        WeatherData data = real.getWeather(city);\n        dataCache.put(city, data);\n        timeCache.put(city, System.currentTimeMillis());\n        return data;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        WeatherService service = new CachingWeatherProxy(new RealWeatherService(), 60000);\n        System.out.println(service.getWeather("Алматы"));\n        System.out.println(service.getWeather("Алматы")); // Из кэша\n        System.out.println(service.getWeather("Астана"));  // Новый запрос\n    }\n}',
      explanation: 'CachingWeatherProxy перехватывает вызовы и проверяет кэш. Повторный запрос для Алматы возвращает кэшированные данные без HTTP-запроса. Для нового города делает реальный запрос. TTL контролирует свежесть кэша.'
    },
    {
      id: 5,
      title: 'Практика: Validation Proxy на TypeScript',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте Proxy, который валидирует данные при записи в объект.',
      requirements: [
        'Используйте ES6 Proxy с handler set для перехвата присваиваний',
        'Правила валидации: age (0-150), email (содержит @), name (непустая строка)',
        'При невалидном значении выбросить Error с описанием',
        'Валидные значения записываются нормально',
        'Создайте типобезопасную обёртку createValidated<T>()'
      ],
      hint: 'В handler set проверяйте prop и value. Для email проверяйте value.includes("@"). Возвращайте true при успехе или throw Error.',
      expectedOutput: 'user.name = "Иван" → OK\nuser.email = "ivan@mail.com" → OK\nuser.age = 25 → OK\nuser.age = -5 → Error: age должен быть 0-150\nuser.email = "invalid" → Error: email должен содержать @',
      solution: 'interface User {\n    name: string;\n    email: string;\n    age: number;\n}\n\ntype ValidationRules<T> = {\n    [K in keyof T]?: (value: T[K]) => string | null; // null = valid\n};\n\nfunction createValidated<T extends object>(target: T, rules: ValidationRules<T>): T {\n    return new Proxy(target, {\n        set(obj, prop, value) {\n            const rule = (rules as any)[prop];\n            if (rule) {\n                const error = rule(value);\n                if (error) {\n                    console.log(`${String(prop)} = ${JSON.stringify(value)} → Error: ${error}`);\n                    throw new Error(error);\n                }\n            }\n            console.log(`${String(prop)} = ${JSON.stringify(value)} → OK`);\n            (obj as any)[prop] = value;\n            return true;\n        }\n    });\n}\n\nconst user = createValidated<User>(\n    { name: "", email: "", age: 0 },\n    {\n        name: (v) => v.trim().length === 0 ? "name не может быть пустым" : null,\n        email: (v) => !v.includes("@") ? "email должен содержать @" : null,\n        age: (v) => v < 0 || v > 150 ? "age должен быть 0-150" : null\n    }\n);\n\nuser.name = "Иван";\nuser.email = "ivan@mail.com";\nuser.age = 25;\n\ntry { user.age = -5; } catch (e) {}\ntry { user.email = "invalid"; } catch (e) {}',
      explanation: 'ES6 Proxy перехватывает присваивание через handler set. Правила валидации определяются декларативно. При невалидном значении proxy выбрасывает ошибку, не позволяя записать данные. Это основа валидации во многих frontend-фреймворках.'
    },
    {
      id: 6,
      title: 'Практика: Rate Limiting Proxy',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Proxy, ограничивающий частоту вызовов метода (rate limiter).',
      requirements: [
        'Интерфейс ApiClient с методами search(query) и getDetails(id)',
        'RateLimitingProxy ограничивает: maxCalls в windowMs',
        'При превышении лимита выбросить RateLimitExceededException',
        'Отслеживать лимиты отдельно для каждого метода',
        'Метод getRemainingCalls() показывает оставшиеся вызовы'
      ],
      hint: 'Храните список timestamp-ов вызовов для каждого метода. Перед вызовом удалите устаревшие (старше windowMs) и проверьте количество.',
      expectedOutput: 'search("java") → OK (осталось: 2)\nsearch("kotlin") → OK (осталось: 1)\nsearch("python") → OK (осталось: 0)\nsearch("go") → RateLimitExceeded: Лимит 3 вызовов исчерпан',
      solution: 'interface ApiClient {\n    search(query: string): string[];\n    getDetails(id: number): object;\n}\n\nclass RealApiClient implements ApiClient {\n    search(query: string): string[] {\n        return [`Result for "${query}"`];\n    }\n    getDetails(id: number): object {\n        return { id, name: `Item ${id}` };\n    }\n}\n\nclass RateLimitExceeded extends Error {\n    constructor(msg: string) { super(msg); this.name = "RateLimitExceeded"; }\n}\n\nclass RateLimitingProxy implements ApiClient {\n    private calls = new Map<string, number[]>();\n\n    constructor(\n        private client: ApiClient,\n        private maxCalls: number,\n        private windowMs: number\n    ) {}\n\n    private checkLimit(method: string): void {\n        const now = Date.now();\n        const timestamps = this.calls.get(method) || [];\n        const valid = timestamps.filter(t => now - t < this.windowMs);\n        this.calls.set(method, valid);\n\n        if (valid.length >= this.maxCalls) {\n            throw new RateLimitExceeded(`Лимит ${this.maxCalls} вызовов исчерпан`);\n        }\n        valid.push(now);\n    }\n\n    getRemainingCalls(method: string): number {\n        const now = Date.now();\n        const timestamps = (this.calls.get(method) || []).filter(t => now - t < this.windowMs);\n        return Math.max(0, this.maxCalls - timestamps.length);\n    }\n\n    search(query: string): string[] {\n        this.checkLimit("search");\n        const result = this.client.search(query);\n        console.log(`search("${query}") → OK (осталось: ${this.getRemainingCalls("search")})`);\n        return result;\n    }\n\n    getDetails(id: number): object {\n        this.checkLimit("getDetails");\n        return this.client.getDetails(id);\n    }\n}\n\nconst api = new RateLimitingProxy(new RealApiClient(), 3, 60000);\n\ntry {\n    api.search("java");\n    api.search("kotlin");\n    api.search("python");\n    api.search("go"); // Превышение!\n} catch (e: any) {\n    console.log(`search("go") → ${e.name}: ${e.message}`);\n}',
      explanation: 'RateLimitingProxy отслеживает время каждого вызова. Устаревшие вызовы (за пределами окна) удаляются. Если количество вызовов в окне >= maxCalls — операция блокируется. Это стандартный подход для API rate limiting.'
    }
  ]
}
