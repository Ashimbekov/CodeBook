export default {
  id: 18,
  title: 'Mediator',
  description: 'Паттерн Mediator: уменьшение связанности между компонентами через посредника',
  lessons: [
    {
      id: 1,
      title: 'Что такое Mediator?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Mediator (Посредник) — поведенческий паттерн, который уменьшает связанность между компонентами системы, заставляя их общаться через специальный объект-посредник. Компоненты не знают друг о друге напрямую.' },
        { type: 'heading', value: 'Аналогия' },
        { type: 'text', value: 'Диспетчер аэропорта — медиатор. Самолёты не общаются друг с другом напрямую (было бы хаотично). Вместо этого все связываются с диспетчером, который координирует взлёты и посадки.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Множество объектов тесно связаны — каждый знает о каждом',
          'Переиспользование компонента невозможно из-за зависимостей',
          'Чат-системы, диалоговые окна, формы с зависимыми полями',
          'Event bus / Event emitter в приложениях'
        ]},
        { type: 'warning', value: 'Медиатор может стать «объектом-богом» (God Object), если в него переместится слишком много логики. Следите за размером медиатора.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java: чат-комната',
      type: 'theory',
      content: [
        { type: 'code', language: 'java', value: '// Медиатор\ninterface ChatMediator {\n    void sendMessage(String message, User sender);\n    void addUser(User user);\n}\n\n// Компонент\nabstract class User {\n    protected ChatMediator mediator;\n    protected String name;\n\n    User(ChatMediator mediator, String name) {\n        this.mediator = mediator;\n        this.name = name;\n    }\n\n    abstract void receive(String message, String from);\n\n    void send(String message) {\n        System.out.println(name + " отправляет: " + message);\n        mediator.sendMessage(message, this);\n    }\n\n    String getName() { return name; }\n}\n\nclass RegularUser extends User {\n    RegularUser(ChatMediator mediator, String name) {\n        super(mediator, name);\n    }\n\n    void receive(String message, String from) {\n        System.out.println("  " + name + " получил от " + from + ": " + message);\n    }\n}\n\n// Конкретный медиатор\nclass ChatRoom implements ChatMediator {\n    private List<User> users = new ArrayList<>();\n\n    public void addUser(User user) {\n        users.add(user);\n        System.out.println(user.getName() + " присоединился к чату");\n    }\n\n    public void sendMessage(String message, User sender) {\n        for (User user : users) {\n            if (user != sender) {\n                user.receive(message, sender.getName());\n            }\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        ChatMediator chat = new ChatRoom();\n\n        User alice = new RegularUser(chat, "Алиса");\n        User bob = new RegularUser(chat, "Борис");\n        User charlie = new RegularUser(chat, "Чарли");\n\n        chat.addUser(alice);\n        chat.addUser(bob);\n        chat.addUser(charlie);\n\n        alice.send("Привет всем!");\n        bob.send("Привет, Алиса!");\n    }\n}' },
        { type: 'tip', value: 'Без медиатора каждый пользователь хранил бы ссылки на всех остальных. При 100 пользователях — 9900 связей. С медиатором — 100 связей (каждый знает только о медиаторе).' }
      ]
    },
    {
      id: 3,
      title: 'Mediator на TypeScript: Event Bus',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// Event Bus — универсальный медиатор\nclass EventBus {\n    private handlers = new Map<string, Set<Function>>();\n\n    on(event: string, handler: Function): void {\n        if (!this.handlers.has(event)) {\n            this.handlers.set(event, new Set());\n        }\n        this.handlers.get(event)!.add(handler);\n    }\n\n    off(event: string, handler: Function): void {\n        this.handlers.get(event)?.delete(handler);\n    }\n\n    emit(event: string, data?: any): void {\n        console.log(`📡 Event: ${event}`);\n        this.handlers.get(event)?.forEach(h => h(data));\n    }\n}\n\n// Компоненты не знают друг о друге\nclass AuthService {\n    constructor(private bus: EventBus) {\n        this.bus.on("login:request", (creds: any) => this.login(creds));\n    }\n\n    private login(creds: { email: string; password: string }) {\n        console.log("🔐 Аутентификация: " + creds.email);\n        this.bus.emit("login:success", { userId: 1, email: creds.email });\n    }\n}\n\nclass NotificationService {\n    constructor(private bus: EventBus) {\n        this.bus.on("login:success", (user: any) => {\n            console.log("📧 Уведомление: " + user.email + " вошёл в систему");\n        });\n    }\n}\n\nclass AnalyticsService {\n    constructor(private bus: EventBus) {\n        this.bus.on("login:success", (user: any) => {\n            console.log("📊 Аналитика: пользователь " + user.userId + " авторизовался");\n        });\n    }\n}\n\nconst bus = new EventBus();\nnew AuthService(bus);\nnew NotificationService(bus);\nnew AnalyticsService(bus);\n\nbus.emit("login:request", { email: "user@mail.com", password: "secret" });' },
        { type: 'note', value: 'Event Bus — самая популярная реализация Mediator. Vue 2 использовал Event Bus, Redux — это медиатор для состояния, NgRx/MobX — тоже.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: форма с зависимыми полями',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте медиатор для формы, где поля зависят друг от друга.',
      requirements: [
        'FormMediator координирует компоненты формы',
        'Компоненты: CountrySelect, CitySelect, ZipCodeInput, ShippingCostLabel',
        'При смене страны: обновляется список городов и формат ZIP-кода',
        'При смене города: обновляется стоимость доставки',
        'Компоненты уведомляют медиатор о своих изменениях'
      ],
      hint: 'Медиатор содержит ссылки на все компоненты. При notify(sender, event) медиатор определяет, какие компоненты нужно обновить.',
      expectedOutput: 'Страна: Казахстан\n  → Города обновлены: [Алматы, Астана, Шымкент]\n  → ZIP формат: 6 цифр\nГород: Алматы\n  → Стоимость доставки: 1500 тг',
      solution: 'interface Component {\n    setMediator(m: FormMediator): void;\n    getName(): string;\n}\n\nclass FormMediator {\n    private country!: CountrySelect;\n    private city!: CitySelect;\n    private zip!: ZipCodeInput;\n    private shipping!: ShippingLabel;\n\n    register(c: CountrySelect, ci: CitySelect, z: ZipCodeInput, s: ShippingLabel) {\n        this.country = c; this.city = ci; this.zip = z; this.shipping = s;\n        [c, ci, z, s].forEach(comp => comp.setMediator(this));\n    }\n\n    notify(sender: string, event: string, data: any): void {\n        if (sender === "country" && event === "change") {\n            const cities = data === "Казахстан"\n                ? ["Алматы", "Астана", "Шымкент"]\n                : ["Москва", "Санкт-Петербург"];\n            this.city.update(cities);\n            this.zip.setFormat(data === "Казахстан" ? "6 цифр" : "6 цифр (XXX-XXX)");\n        }\n        if (sender === "city" && event === "change") {\n            const costs: Record<string, number> = { "Алматы": 1500, "Астана": 2000, "Шымкент": 2500 };\n            this.shipping.update(costs[data] || 3000);\n        }\n    }\n}\n\nclass CountrySelect {\n    private mediator!: FormMediator;\n    setMediator(m: FormMediator) { this.mediator = m; }\n    getName() { return "country"; }\n    select(country: string) {\n        console.log("Страна: " + country);\n        this.mediator.notify("country", "change", country);\n    }\n}\n\nclass CitySelect {\n    private mediator!: FormMediator;\n    setMediator(m: FormMediator) { this.mediator = m; }\n    getName() { return "city"; }\n    update(cities: string[]) {\n        console.log("  → Города обновлены: [" + cities.join(", ") + "]");\n    }\n    select(city: string) {\n        console.log("Город: " + city);\n        this.mediator.notify("city", "change", city);\n    }\n}\n\nclass ZipCodeInput {\n    private mediator!: FormMediator;\n    setMediator(m: FormMediator) { this.mediator = m; }\n    getName() { return "zip"; }\n    setFormat(format: string) {\n        console.log("  → ZIP формат: " + format);\n    }\n}\n\nclass ShippingLabel {\n    private mediator!: FormMediator;\n    setMediator(m: FormMediator) { this.mediator = m; }\n    getName() { return "shipping"; }\n    update(cost: number) {\n        console.log("  → Стоимость доставки: " + cost + " тг");\n    }\n}\n\nconst mediator = new FormMediator();\nconst country = new CountrySelect();\nconst city = new CitySelect();\nconst zip = new ZipCodeInput();\nconst shipping = new ShippingLabel();\nmediator.register(country, city, zip, shipping);\n\ncountry.select("Казахстан");\ncity.select("Алматы");',
      explanation: 'FormMediator координирует 4 компонента. При изменении страны обновляются города и формат ZIP. При изменении города обновляется стоимость доставки. Компоненты не знают друг о друге — всё через медиатор.'
    },
    {
      id: 5,
      title: 'Практика: диспетчер самолётов на Java',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте диспетчерскую башню аэропорта как Mediator.',
      requirements: [
        'Интерфейс AirTrafficControl (медиатор) с методами requestLanding и requestTakeoff',
        'Класс Airport — конкретный медиатор с ограниченным числом полос',
        'Класс Aircraft — самолёт, запрашивающий посадку/взлёт через медиатор',
        'При занятых полосах — самолёт встаёт в очередь',
        'При освобождении полосы — следующий из очереди получает разрешение'
      ],
      hint: 'Airport хранит runways (количество свободных полос) и Queue<Aircraft> waitingQueue.',
      expectedOutput: '✈️ SU-100 запрашивает посадку\n✅ SU-100: разрешение на посадку (полоса 1)\n✈️ KC-200 запрашивает посадку\n✅ KC-200: разрешение на посадку (полоса 2)\n✈️ UA-300 запрашивает посадку\n⏳ UA-300: все полосы заняты, ожидайте\n✈️ SU-100 запрашивает взлёт\n✅ SU-100: взлёт разрешён\n✅ UA-300: полоса освободилась, посадка разрешена',
      solution: 'import java.util.*;\n\ninterface AirTrafficControl {\n    void requestLanding(Aircraft a);\n    void requestTakeoff(Aircraft a);\n}\n\nclass Aircraft {\n    String id;\n    AirTrafficControl atc;\n\n    Aircraft(String id, AirTrafficControl atc) {\n        this.id = id;\n        this.atc = atc;\n    }\n\n    void land() {\n        System.out.println("✈️ " + id + " запрашивает посадку");\n        atc.requestLanding(this);\n    }\n\n    void takeoff() {\n        System.out.println("✈️ " + id + " запрашивает взлёт");\n        atc.requestTakeoff(this);\n    }\n}\n\nclass Airport implements AirTrafficControl {\n    private int totalRunways;\n    private int usedRunways = 0;\n    private Queue<Aircraft> waitingQueue = new LinkedList<>();\n\n    Airport(int runways) { this.totalRunways = runways; }\n\n    public void requestLanding(Aircraft a) {\n        if (usedRunways < totalRunways) {\n            usedRunways++;\n            System.out.println("✅ " + a.id + ": разрешение на посадку (полоса " + usedRunways + ")");\n        } else {\n            waitingQueue.add(a);\n            System.out.println("⏳ " + a.id + ": все полосы заняты, ожидайте");\n        }\n    }\n\n    public void requestTakeoff(Aircraft a) {\n        usedRunways--;\n        System.out.println("✅ " + a.id + ": взлёт разрешён");\n        if (!waitingQueue.isEmpty()) {\n            Aircraft next = waitingQueue.poll();\n            usedRunways++;\n            System.out.println("✅ " + next.id + ": полоса освободилась, посадка разрешена");\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Airport airport = new Airport(2);\n        Aircraft su = new Aircraft("SU-100", airport);\n        Aircraft kc = new Aircraft("KC-200", airport);\n        Aircraft ua = new Aircraft("UA-300", airport);\n\n        su.land();\n        kc.land();\n        ua.land();\n        su.takeoff();\n    }\n}',
      explanation: 'Airport (медиатор) управляет доступом к полосам. Самолёты не общаются друг с другом — всё через диспетчера. При освобождении полосы медиатор автоматически уведомляет следующий самолёт из очереди.'
    },
    {
      id: 6,
      title: 'Практика: типобезопасный Event Bus на TypeScript',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте типобезопасный Event Bus с типизированными событиями.',
      requirements: [
        'Определите map типов событий: Events = { "user:login": User; "order:created": Order; }',
        'TypedEventBus<Events> — emit и on с проверкой типов',
        'on("user:login", callback) — callback должен принимать User, а не any',
        'emit("order:created", order) — order должен быть типа Order',
        'Метод off() для отписки'
      ],
      hint: 'Используйте mapped types и keyof. on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void).',
      expectedOutput: '[Auth] Пользователь вошёл: Иван (ivan@mail.com)\n[Analytics] Логин: 1\n[Notification] Заказ #101 создан на сумму 5000',
      solution: 'interface User { id: number; name: string; email: string; }\ninterface Order { id: number; userId: number; total: number; }\n\ninterface AppEvents {\n    "user:login": User;\n    "user:logout": { userId: number };\n    "order:created": Order;\n}\n\nclass TypedEventBus<Events extends Record<string, any>> {\n    private handlers = new Map<string, Set<Function>>();\n\n    on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): () => void {\n        const key = event as string;\n        if (!this.handlers.has(key)) {\n            this.handlers.set(key, new Set());\n        }\n        this.handlers.get(key)!.add(handler);\n        return () => this.handlers.get(key)?.delete(handler);\n    }\n\n    emit<K extends keyof Events>(event: K, data: Events[K]): void {\n        const key = event as string;\n        this.handlers.get(key)?.forEach(h => h(data));\n    }\n}\n\nconst bus = new TypedEventBus<AppEvents>();\n\nbus.on("user:login", (user) => {\n    console.log(`[Auth] Пользователь вошёл: ${user.name} (${user.email})`);\n});\n\nbus.on("user:login", (user) => {\n    console.log(`[Analytics] Логин: ${user.id}`);\n});\n\nbus.on("order:created", (order) => {\n    console.log(`[Notification] Заказ #${order.id} создан на сумму ${order.total}`);\n});\n\nbus.emit("user:login", { id: 1, name: "Иван", email: "ivan@mail.com" });\nbus.emit("order:created", { id: 101, userId: 1, total: 5000 });\n\n// bus.emit("user:login", { wrong: true }); // ❌ Ошибка TypeScript!',
      explanation: 'TypedEventBus использует generic mapped types для типобезопасности. on() и emit() проверяют соответствие типа данных типу события на этапе компиляции. on() возвращает функцию отписки. Это production-ready паттерн для Angular, React и NestJS.'
    }
  ]
}
