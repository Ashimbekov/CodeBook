export default {
  id: 20,
  title: 'Observer',
  description: 'Паттерн Observer: подписка на события, реактивное программирование, event-driven архитектура',
  lessons: [
    {
      id: 1,
      title: 'Что такое Observer?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Observer (Наблюдатель) — поведенческий паттерн, который определяет зависимость «один ко многим» между объектами. Когда один объект меняет состояние, все зависимые объекты автоматически уведомляются.' },
        { type: 'heading', value: 'Аналогия' },
        { type: 'text', value: 'Подписка на YouTube-канал: когда автор публикует видео, все подписчики получают уведомление. Вы не проверяете канал каждые 5 минут — вас оповещают автоматически.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Изменение в одном объекте должно обновить другие объекты',
          'Количество подписчиков заранее неизвестно или меняется динамически',
          'UI-фреймворки: React (setState → re-render), Vue (reactive), Angular (RxJS)',
          'DOM события (addEventListener), Node.js EventEmitter, Webhook-и'
        ]},
        { type: 'note', value: 'Observer — один из самых важных паттернов. Он лежит в основе реактивного программирования, event-driven архитектуры и паттерна Pub/Sub.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java',
      type: 'theory',
      content: [
        { type: 'code', language: 'java', value: '// Интерфейс наблюдателя\ninterface Observer<T> {\n    void update(T data);\n}\n\n// Издатель (Observable / Subject)\nclass EventEmitter<T> {\n    private final List<Observer<T>> observers = new ArrayList<>();\n\n    void subscribe(Observer<T> observer) {\n        observers.add(observer);\n    }\n\n    void unsubscribe(Observer<T> observer) {\n        observers.remove(observer);\n    }\n\n    void notify(T data) {\n        for (Observer<T> observer : observers) {\n            observer.update(data);\n        }\n    }\n}\n\n// Конкретный издатель: магазин с товарами\nclass ProductStore extends EventEmitter<Product> {\n    private List<Product> products = new ArrayList<>();\n\n    void addProduct(Product product) {\n        products.add(product);\n        System.out.println("🏪 Новый товар: " + product.name);\n        notify(product); // Уведомляем всех подписчиков\n    }\n}\n\nclass Product {\n    String name;\n    double price;\n    Product(String name, double price) {\n        this.name = name;\n        this.price = price;\n    }\n}\n\n// Конкретные наблюдатели\nclass EmailNotifier implements Observer<Product> {\n    public void update(Product p) {\n        System.out.println("📧 Email: Новый товар \\\"" + p.name + "\\\" за " + p.price + " тг");\n    }\n}\n\nclass AnalyticsTracker implements Observer<Product> {\n    public void update(Product p) {\n        System.out.println("📊 Аналитика: добавлен товар, цена " + p.price);\n    }\n}\n\nclass PushNotifier implements Observer<Product> {\n    public void update(Product p) {\n        System.out.println("🔔 Push: Смотрите \\\"" + p.name + "\\\"!");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        ProductStore store = new ProductStore();\n        store.subscribe(new EmailNotifier());\n        store.subscribe(new AnalyticsTracker());\n        store.subscribe(new PushNotifier());\n\n        store.addProduct(new Product("MacBook Pro", 850000));\n    }\n}' },
        { type: 'tip', value: 'Java имеет встроенные Observer и Observable (deprecated с Java 9). Вместо них используйте свою реализацию, java.beans.PropertyChangeListener или библиотеки реактивного программирования (RxJava, Project Reactor).' }
      ]
    },
    {
      id: 3,
      title: 'Observer на TypeScript: реактивный стейт',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// Reactive State — основа Vue/MobX\nclass ReactiveState<T extends object> {\n    private listeners = new Map<string, Set<Function>>();\n    private state: T;\n\n    constructor(initialState: T) {\n        this.state = { ...initialState };\n    }\n\n    get<K extends keyof T>(key: K): T[K] {\n        return this.state[key];\n    }\n\n    set<K extends keyof T>(key: K, value: T[K]): void {\n        const oldValue = this.state[key];\n        if (oldValue !== value) {\n            this.state[key] = value;\n            this.emit(key as string, value, oldValue);\n        }\n    }\n\n    watch<K extends keyof T>(key: K, callback: (newVal: T[K], oldVal: T[K]) => void): () => void {\n        const k = key as string;\n        if (!this.listeners.has(k)) this.listeners.set(k, new Set());\n        this.listeners.get(k)!.add(callback);\n        return () => this.listeners.get(k)?.delete(callback);\n    }\n\n    private emit(key: string, newVal: any, oldVal: any): void {\n        this.listeners.get(key)?.forEach(cb => cb(newVal, oldVal));\n    }\n}\n\n// Использование — как Vue reactive()\ninterface AppState {\n    count: number;\n    user: string;\n    theme: string;\n}\n\nconst state = new ReactiveState<AppState>({\n    count: 0,\n    user: "Гость",\n    theme: "light"\n});\n\n// Подписка на изменения\nstate.watch("count", (newVal, oldVal) => {\n    console.log(`Счётчик: ${oldVal} → ${newVal}`);\n});\n\nstate.watch("theme", (newVal) => {\n    console.log(`🎨 Тема изменена: ${newVal}`);\n});\n\n// Изменения автоматически уведомляют подписчиков\nstate.set("count", 1);  // Счётчик: 0 → 1\nstate.set("count", 2);  // Счётчик: 1 → 2\nstate.set("theme", "dark"); // 🎨 Тема изменена: dark' },
        { type: 'note', value: 'Vue 3 reactivity, MobX, Svelte stores, Angular Signals — все построены на Observer. Понимание паттерна даёт фундаментальное понимание всех frontend-фреймворков.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: биржевые котировки',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему биржевых котировок с несколькими типами подписчиков.',
      requirements: [
        'Класс StockExchange (Observable) с методами subscribe, unsubscribe, updatePrice',
        'Observer: PriceDisplay — отображает текущую цену',
        'Observer: PriceAlert — срабатывает при достижении порога',
        'Observer: TradingBot — автоматически покупает при падении > 5%',
        'Каждый подписчик получает: символ акции, новую цену, изменение в %'
      ],
      hint: 'updatePrice() вычисляет процент изменения и уведомляет всех подписчиков. PriceAlert проверяет threshold.',
      expectedOutput: '📈 AAPL: $150.00\n📈 AAPL: $145.00 (-3.33%)\n🚨 Алерт: AAPL упала до $140.00 (порог: $142)\n🤖 Бот: покупаю AAPL по $138.00 (падение -8.00%)',
      solution: 'interface StockObserver {\n    onPriceUpdate(symbol: string, price: number, changePercent: number): void;\n}\n\nclass StockExchange {\n    private observers: StockObserver[] = [];\n    private prices = new Map<string, number>();\n\n    subscribe(o: StockObserver): void { this.observers.push(o); }\n    unsubscribe(o: StockObserver): void {\n        this.observers = this.observers.filter(x => x !== o);\n    }\n\n    updatePrice(symbol: string, newPrice: number): void {\n        const oldPrice = this.prices.get(symbol) || newPrice;\n        const change = ((newPrice - oldPrice) / oldPrice) * 100;\n        this.prices.set(symbol, newPrice);\n        this.observers.forEach(o => o.onPriceUpdate(symbol, newPrice, change));\n    }\n}\n\nclass PriceDisplay implements StockObserver {\n    onPriceUpdate(symbol: string, price: number, change: number): void {\n        const arrow = change >= 0 ? "📈" : "📉";\n        const pct = change !== 0 ? ` (${change >= 0 ? "+" : ""}${change.toFixed(2)}%)` : "";\n        console.log(`${arrow} ${symbol}: $${price.toFixed(2)}${pct}`);\n    }\n}\n\nclass PriceAlert implements StockObserver {\n    constructor(private symbol: string, private threshold: number) {}\n\n    onPriceUpdate(symbol: string, price: number): void {\n        if (symbol === this.symbol && price <= this.threshold) {\n            console.log(`🚨 Алерт: ${symbol} упала до $${price.toFixed(2)} (порог: $${this.threshold})`);\n        }\n    }\n}\n\nclass TradingBot implements StockObserver {\n    constructor(private dropThreshold: number = -5) {}\n\n    onPriceUpdate(symbol: string, price: number, change: number): void {\n        if (change <= this.dropThreshold) {\n            console.log(`🤖 Бот: покупаю ${symbol} по $${price.toFixed(2)} (падение ${change.toFixed(2)}%)`);\n        }\n    }\n}\n\nconst exchange = new StockExchange();\nexchange.subscribe(new PriceDisplay());\nexchange.subscribe(new PriceAlert("AAPL", 142));\nexchange.subscribe(new TradingBot(-5));\n\nexchange.updatePrice("AAPL", 150);\nexchange.updatePrice("AAPL", 145);\nexchange.updatePrice("AAPL", 140);\nexchange.updatePrice("AAPL", 138);',
      explanation: 'StockExchange уведомляет всех подписчиков при изменении цены. PriceDisplay показывает все изменения, PriceAlert срабатывает при пороге, TradingBot — при падении > 5%. Каждый подписчик реагирует по-своему на одно и то же событие.'
    },
    {
      id: 5,
      title: 'Практика: Observer для формы на Java',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте Observer для автоматической валидации формы при изменении полей.',
      requirements: [
        'Класс FormField — поле формы, уведомляет при изменении значения',
        'Интерфейс FieldObserver с методом onFieldChanged(name, value)',
        'FormValidator — проверяет все поля и обновляет статус валидности',
        'SubmitButton — активируется/деактивируется в зависимости от валидности',
        'Демонстрация: изменение полей email и password'
      ],
      hint: 'FormField хранит список Observer-ов. При setValue() уведомляет всех. FormValidator проверяет правила.',
      expectedOutput: 'email = "test" → ❌ Невалидный email\n  🔒 Кнопка заблокирована\nemail = "a@b.com" → ✅ Email валиден\n  🔒 Кнопка заблокирована (пароль пуст)\npassword = "12345678" → ✅ Пароль валиден\n  🔓 Кнопка активна!',
      solution: 'import java.util.*;\n\ninterface FieldObserver {\n    void onFieldChanged(String fieldName, String value);\n}\n\nclass FormField {\n    private String name;\n    private String value = "";\n    private List<FieldObserver> observers = new ArrayList<>();\n\n    FormField(String name) { this.name = name; }\n\n    void addObserver(FieldObserver o) { observers.add(o); }\n\n    void setValue(String value) {\n        this.value = value;\n        for (FieldObserver o : observers) {\n            o.onFieldChanged(name, value);\n        }\n    }\n\n    String getValue() { return value; }\n}\n\nclass FormValidator implements FieldObserver {\n    private Map<String, Boolean> validity = new HashMap<>();\n    private List<FieldObserver> statusObservers = new ArrayList<>();\n\n    void addStatusObserver(FieldObserver o) { statusObservers.add(o); }\n\n    public void onFieldChanged(String name, String value) {\n        boolean valid = switch (name) {\n            case "email" -> value.contains("@") && value.contains(".");\n            case "password" -> value.length() >= 8;\n            default -> !value.isEmpty();\n        };\n        validity.put(name, valid);\n        String status = valid ? "✅ " + name + " валиден" : "❌ Невалидный " + name;\n        System.out.println(name + " = \\"" + value + "\\" → " + status);\n\n        boolean allValid = validity.size() >= 2 && validity.values().stream().allMatch(v -> v);\n        for (FieldObserver o : statusObservers) {\n            o.onFieldChanged("formValid", String.valueOf(allValid));\n        }\n    }\n}\n\nclass SubmitButton implements FieldObserver {\n    public void onFieldChanged(String name, String value) {\n        if ("formValid".equals(name)) {\n            if ("true".equals(value)) {\n                System.out.println("  🔓 Кнопка активна!");\n            } else {\n                System.out.println("  🔒 Кнопка заблокирована");\n            }\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        FormField email = new FormField("email");\n        FormField password = new FormField("password");\n        FormValidator validator = new FormValidator();\n        SubmitButton button = new SubmitButton();\n\n        email.addObserver(validator);\n        password.addObserver(validator);\n        validator.addStatusObserver(button);\n\n        email.setValue("test");\n        email.setValue("a@b.com");\n        password.setValue("12345678");\n    }\n}',
      explanation: 'FormField уведомляет FormValidator при изменении. FormValidator проверяет правила и уведомляет SubmitButton о общей валидности. Цепочка: Field → Validator → Button. Компоненты связаны только через Observer-интерфейс.'
    },
    {
      id: 6,
      title: 'Практика: RxJS-подобный Observable на TypeScript',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте упрощённую версию Observable с операторами map, filter, debounce.',
      requirements: [
        'Класс Observable<T> с методом subscribe(callback)',
        'Статический метод Observable.from(array) и Observable.interval(ms)',
        'Оператор map(fn) — преобразование значений',
        'Оператор filter(fn) — фильтрация',
        'Оператор take(n) — взять первые n значений и завершить',
        'Метод unsubscribe() для отписки'
      ],
      hint: 'Observable хранит producer-функцию. subscribe() запускает producer. Операторы создают новый Observable, оборачивающий предыдущий.',
      expectedOutput: 'Четные квадраты (первые 3): 4, 16, 36',
      solution: 'type Subscriber<T> = (value: T) => void;\ntype Unsubscribe = () => void;\ntype Producer<T> = (emit: Subscriber<T>) => Unsubscribe | void;\n\nclass Observable<T> {\n    constructor(private producer: Producer<T>) {}\n\n    subscribe(callback: Subscriber<T>): Unsubscribe {\n        const cleanup = this.producer(callback);\n        return cleanup || (() => {});\n    }\n\n    map<U>(fn: (value: T) => U): Observable<U> {\n        return new Observable<U>((emit) => {\n            return this.subscribe((value) => emit(fn(value)));\n        });\n    }\n\n    filter(predicate: (value: T) => boolean): Observable<T> {\n        return new Observable<T>((emit) => {\n            return this.subscribe((value) => {\n                if (predicate(value)) emit(value);\n            });\n        });\n    }\n\n    take(count: number): Observable<T> {\n        return new Observable<T>((emit) => {\n            let taken = 0;\n            let unsub: Unsubscribe = () => {};\n            unsub = this.subscribe((value) => {\n                if (taken < count) {\n                    emit(value);\n                    taken++;\n                    if (taken >= count) unsub();\n                }\n            });\n            return unsub;\n        });\n    }\n\n    static from<T>(values: T[]): Observable<T> {\n        return new Observable<T>((emit) => {\n            values.forEach(v => emit(v));\n        });\n    }\n}\n\n// Использование\nconst results: number[] = [];\n\nObservable.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])\n    .filter(n => n % 2 === 0)\n    .map(n => n * n)\n    .take(3)\n    .subscribe(value => results.push(value));\n\nconsole.log("Четные квадраты (первые 3): " + results.join(", "));',
      explanation: 'Observable — ленивый контейнер значений. Вычисления запускаются только при subscribe(). Операторы (map, filter, take) создают новые Observable, формируя пайплайн. Это основа RxJS, используемого в Angular.'
    }
  ]
}
