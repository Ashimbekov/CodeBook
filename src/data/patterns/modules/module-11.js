export default {
  id: 11,
  title: 'Decorator',
  description: 'Паттерн Decorator: динамическое добавление функциональности, обёртки, вложенные декораторы',
  lessons: [
    {
      id: 1,
      title: 'Что такое Decorator?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Decorator (Декоратор) — структурный паттерн, который позволяет динамически добавлять объектам новую функциональность, оборачивая их в объекты-обёртки. Декоратор — альтернатива наследованию для расширения поведения.' },
        { type: 'heading', value: 'Аналогия' },
        { type: 'text', value: 'Одежда — декоратор для человека. Базовый объект (человек) не меняется, но его можно «обернуть» в футболку, затем в куртку, затем в пальто. Каждый слой добавляет функциональность (тепло).' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Нужно добавлять обязанности объектам динамически и прозрачно',
          'Наследование невозможно или приводит к взрыву подклассов',
          'Нужно комбинировать несколько расширений (A+B, A+C, B+C, A+B+C...)',
          'Java I/O streams, middleware в Express/Koa, логирование, кэширование'
        ]},
        { type: 'code', language: 'text', value: '┌───────────────┐\n│  Component     │ ← Общий интерфейс\n└───────┬───────┘\n   ┌────┴────┐\n┌──┴──┐  ┌───┴──────────┐\n│Conc.│  │  Decorator    │ ← содержит Component\n│Comp.│  └───┬──────────┘\n└─────┘  ┌───┴────┐  ┌───┴────┐\n         │DecorA  │  │DecorB  │\n         └────────┘  └────────┘' },
        { type: 'note', value: 'Decorator и наследование оба расширяют поведение, но Decorator делает это во время выполнения (runtime), а наследование — во время компиляции. Декораторы можно комбинировать произвольно.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java',
      type: 'theory',
      content: [
        { type: 'text', value: 'Классический пример — система обработки данных с декораторами для сжатия, шифрования и логирования.' },
        { type: 'code', language: 'java', value: '// Компонент\ninterface DataSource {\n    void writeData(String data);\n    String readData();\n}\n\n// Конкретный компонент\nclass FileDataSource implements DataSource {\n    private String filename;\n    private String content = "";\n\n    FileDataSource(String filename) { this.filename = filename; }\n\n    public void writeData(String data) {\n        this.content = data;\n        System.out.println("Записано в " + filename + ": " + data);\n    }\n\n    public String readData() {\n        System.out.println("Чтение из " + filename);\n        return content;\n    }\n}\n\n// Базовый декоратор\nabstract class DataSourceDecorator implements DataSource {\n    protected DataSource wrappee;\n\n    DataSourceDecorator(DataSource source) {\n        this.wrappee = source;\n    }\n\n    public void writeData(String data) { wrappee.writeData(data); }\n    public String readData() { return wrappee.readData(); }\n}\n\n// Декоратор шифрования\nclass EncryptionDecorator extends DataSourceDecorator {\n    EncryptionDecorator(DataSource source) { super(source); }\n\n    public void writeData(String data) {\n        String encrypted = encrypt(data);\n        System.out.println("🔐 Шифрование: " + data + " → " + encrypted);\n        super.writeData(encrypted);\n    }\n\n    public String readData() {\n        String data = super.readData();\n        String decrypted = decrypt(data);\n        System.out.println("🔓 Расшифровка: " + data + " → " + decrypted);\n        return decrypted;\n    }\n\n    private String encrypt(String data) {\n        return new StringBuilder(data).reverse().toString(); // Простая имитация\n    }\n\n    private String decrypt(String data) {\n        return new StringBuilder(data).reverse().toString();\n    }\n}\n\n// Декоратор сжатия\nclass CompressionDecorator extends DataSourceDecorator {\n    CompressionDecorator(DataSource source) { super(source); }\n\n    public void writeData(String data) {\n        String compressed = compress(data);\n        System.out.println("📦 Сжатие: " + data.length() + " → " + compressed.length() + " символов");\n        super.writeData(compressed);\n    }\n\n    public String readData() {\n        String data = super.readData();\n        return decompress(data);\n    }\n\n    private String compress(String data) { return data.substring(0, Math.min(data.length(), 10)) + "..."; }\n    private String decompress(String data) { return data; }\n}\n\n// Использование: вложенные декораторы\npublic class Main {\n    public static void main(String[] args) {\n        // Файл → сжатие → шифрование\n        DataSource source = new EncryptionDecorator(\n            new CompressionDecorator(\n                new FileDataSource("data.txt")\n            )\n        );\n\n        source.writeData("Секретные данные для хранения");\n        System.out.println("---");\n        source.readData();\n    }\n}' },
        { type: 'tip', value: 'Порядок декораторов важен! Шифрование(Сжатие(Файл)) — сначала сжимает, потом шифрует. Это как слои луковицы — запись идёт снаружи внутрь, чтение — изнутри наружу.' }
      ]
    },
    {
      id: 3,
      title: 'Decorator на TypeScript: middleware',
      type: 'theory',
      content: [
        { type: 'text', value: 'В TypeScript/JavaScript паттерн Decorator часто реализуется как middleware — цепочка обработчиков запросов.' },
        { type: 'code', language: 'typescript', value: 'interface HttpHandler {\n    handle(request: Request): Response;\n}\n\ninterface Request {\n    url: string;\n    method: string;\n    headers: Record<string, string>;\n    body?: any;\n}\n\ninterface Response {\n    status: number;\n    body: any;\n}\n\n// Базовый обработчик\nclass ApiHandler implements HttpHandler {\n    handle(request: Request): Response {\n        console.log(`📨 Обработка: ${request.method} ${request.url}`);\n        return { status: 200, body: { message: "OK" } };\n    }\n}\n\n// Декоратор: логирование\nclass LoggingDecorator implements HttpHandler {\n    constructor(private inner: HttpHandler) {}\n\n    handle(request: Request): Response {\n        console.log(`📋 LOG: ${request.method} ${request.url}`);\n        const start = Date.now();\n        const response = this.inner.handle(request);\n        console.log(`📋 LOG: Ответ ${response.status} за ${Date.now() - start}ms`);\n        return response;\n    }\n}\n\n// Декоратор: аутентификация\nclass AuthDecorator implements HttpHandler {\n    constructor(private inner: HttpHandler) {}\n\n    handle(request: Request): Response {\n        const token = request.headers["Authorization"];\n        if (!token) {\n            console.log("🚫 AUTH: Нет токена!");\n            return { status: 401, body: { error: "Unauthorized" } };\n        }\n        console.log("✅ AUTH: Токен проверен");\n        return this.inner.handle(request);\n    }\n}\n\n// Декоратор: кэширование\nclass CacheDecorator implements HttpHandler {\n    private cache = new Map<string, Response>();\n\n    constructor(private inner: HttpHandler) {}\n\n    handle(request: Request): Response {\n        if (request.method === "GET") {\n            const cached = this.cache.get(request.url);\n            if (cached) {\n                console.log("💾 CACHE: Возврат из кэша");\n                return cached;\n            }\n        }\n        const response = this.inner.handle(request);\n        if (request.method === "GET") {\n            this.cache.set(request.url, response);\n        }\n        return response;\n    }\n}\n\n// Композиция декораторов\nconst handler: HttpHandler = new LoggingDecorator(\n    new AuthDecorator(\n        new CacheDecorator(\n            new ApiHandler()\n        )\n    )\n);\n\nhandler.handle({\n    url: "/api/users",\n    method: "GET",\n    headers: { Authorization: "Bearer token123" }\n});' },
        { type: 'note', value: 'Express/Koa middleware — это Decorator в чистом виде. Каждый middleware оборачивает следующий обработчик и может модифицировать запрос/ответ или прервать цепочку.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: декоратор для текста',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему форматирования текста с помощью вложенных декораторов.',
      requirements: [
        'Интерфейс TextComponent с методом format(): String',
        'Класс PlainText — базовый текст',
        'Декораторы: BoldDecorator, ItalicDecorator, UnderlineDecorator, ColorDecorator',
        'Декораторы должны комбинироваться в любом порядке',
        'Каждый декоратор оборачивает текст в соответствующие HTML-теги'
      ],
      hint: 'BoldDecorator оборачивает результат в <b>...</b>, ItalicDecorator — в <i>...</i>. Вложенность определяет порядок тегов.',
      expectedOutput: '<b><i><u>Привет, мир!</u></i></b>\n<span style="color:red"><b>Ошибка!</b></span>',
      solution: 'interface TextComponent {\n    String format();\n}\n\nclass PlainText implements TextComponent {\n    private String text;\n    PlainText(String text) { this.text = text; }\n    public String format() { return text; }\n}\n\nabstract class TextDecorator implements TextComponent {\n    protected TextComponent wrapped;\n    TextDecorator(TextComponent wrapped) { this.wrapped = wrapped; }\n}\n\nclass BoldDecorator extends TextDecorator {\n    BoldDecorator(TextComponent w) { super(w); }\n    public String format() { return "<b>" + wrapped.format() + "</b>"; }\n}\n\nclass ItalicDecorator extends TextDecorator {\n    ItalicDecorator(TextComponent w) { super(w); }\n    public String format() { return "<i>" + wrapped.format() + "</i>"; }\n}\n\nclass UnderlineDecorator extends TextDecorator {\n    UnderlineDecorator(TextComponent w) { super(w); }\n    public String format() { return "<u>" + wrapped.format() + "</u>"; }\n}\n\nclass ColorDecorator extends TextDecorator {\n    private String color;\n    ColorDecorator(TextComponent w, String color) { super(w); this.color = color; }\n    public String format() {\n        return "<span style=\\"color:" + color + "\\">" + wrapped.format() + "</span>";\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        TextComponent text1 = new BoldDecorator(\n            new ItalicDecorator(\n                new UnderlineDecorator(\n                    new PlainText("Привет, мир!")\n                )\n            )\n        );\n        System.out.println(text1.format());\n\n        TextComponent text2 = new ColorDecorator(\n            new BoldDecorator(new PlainText("Ошибка!")),\n            "red"\n        );\n        System.out.println(text2.format());\n    }\n}',
      explanation: 'Каждый декоратор добавляет один HTML-тег вокруг текста. Комбинируя декораторы, можно получить любое форматирование. Bold(Italic(Underline(text))) → <b><i><u>text</u></i></b>.'
    },
    {
      id: 5,
      title: 'Практика: декоратор кофе на TypeScript',
      type: 'practice',
      difficulty: 'easy',
      description: 'Классическая задача — система заказа кофе с добавками, используя Decorator.',
      requirements: [
        'Интерфейс Coffee с методами cost() и description()',
        'BaseCoffee — базовый кофе (эспрессо, 100 руб)',
        'Декораторы: MilkDecorator (+30), SugarDecorator (+10), WhipCreamDecorator (+50), SyrupDecorator(flavour, +40)',
        'Демонстрация разных комбинаций',
        'Итоговая стоимость — сумма базы и всех добавок'
      ],
      hint: 'Каждый декоратор добавляет свою стоимость к cost() и своё описание к description() обёрнутого объекта.',
      expectedOutput: 'Эспрессо + молоко + сахар + сахар = 150 руб\nЭспрессо + молоко + взбитые сливки + сироп (карамель) = 220 руб',
      solution: 'interface Coffee {\n    cost(): number;\n    description(): string;\n}\n\nclass BaseCoffee implements Coffee {\n    cost(): number { return 100; }\n    description(): string { return "Эспрессо"; }\n}\n\nclass MilkDecorator implements Coffee {\n    constructor(private coffee: Coffee) {}\n    cost(): number { return this.coffee.cost() + 30; }\n    description(): string { return this.coffee.description() + " + молоко"; }\n}\n\nclass SugarDecorator implements Coffee {\n    constructor(private coffee: Coffee) {}\n    cost(): number { return this.coffee.cost() + 10; }\n    description(): string { return this.coffee.description() + " + сахар"; }\n}\n\nclass WhipCreamDecorator implements Coffee {\n    constructor(private coffee: Coffee) {}\n    cost(): number { return this.coffee.cost() + 50; }\n    description(): string { return this.coffee.description() + " + взбитые сливки"; }\n}\n\nclass SyrupDecorator implements Coffee {\n    constructor(private coffee: Coffee, private flavour: string) {}\n    cost(): number { return this.coffee.cost() + 40; }\n    description(): string { return this.coffee.description() + ` + сироп (${this.flavour})`; }\n}\n\nconst order1: Coffee = new SugarDecorator(\n    new SugarDecorator(\n        new MilkDecorator(new BaseCoffee())\n    )\n);\nconsole.log(`${order1.description()} = ${order1.cost()} руб`);\n\nconst order2: Coffee = new SyrupDecorator(\n    new WhipCreamDecorator(\n        new MilkDecorator(new BaseCoffee())\n    ),\n    "карамель"\n);\nconsole.log(`${order2.description()} = ${order2.cost()} руб`);',
      explanation: 'Каждый декоратор добавляет свою стоимость и описание. Можно добавить сахар дважды (два декоратора), и стоимость увеличится на 20. Это невозможно сделать наследованием без комбинаторного взрыва классов.'
    },
    {
      id: 6,
      title: 'Практика: декоратор потоков данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте систему обработки потока данных с декораторами фильтрации, трансформации и агрегации.',
      requirements: [
        'Интерфейс DataStream<T> с методом process(items: T[]): T[]',
        'Класс PassthroughStream — пропускает данные без изменений',
        'FilterDecorator — фильтрует элементы по предикату',
        'MapDecorator — трансформирует каждый элемент',
        'SortDecorator — сортирует элементы',
        'LimitDecorator — ограничивает количество элементов'
      ],
      hint: 'Каждый декоратор вызывает process() обёрнутого потока, затем применяет свою операцию к результату.',
      expectedOutput: '[{name:"Алиса",age:30},{name:"Борис",age:25}]',
      solution: 'interface DataStream<T> {\n    process(items: T[]): T[];\n}\n\nclass PassthroughStream<T> implements DataStream<T> {\n    process(items: T[]): T[] { return [...items]; }\n}\n\nclass FilterDecorator<T> implements DataStream<T> {\n    constructor(\n        private inner: DataStream<T>,\n        private predicate: (item: T) => boolean\n    ) {}\n\n    process(items: T[]): T[] {\n        return this.inner.process(items).filter(this.predicate);\n    }\n}\n\nclass MapDecorator<T> implements DataStream<T> {\n    constructor(\n        private inner: DataStream<T>,\n        private transform: (item: T) => T\n    ) {}\n\n    process(items: T[]): T[] {\n        return this.inner.process(items).map(this.transform);\n    }\n}\n\nclass SortDecorator<T> implements DataStream<T> {\n    constructor(\n        private inner: DataStream<T>,\n        private comparator: (a: T, b: T) => number\n    ) {}\n\n    process(items: T[]): T[] {\n        return this.inner.process(items).sort(this.comparator);\n    }\n}\n\nclass LimitDecorator<T> implements DataStream<T> {\n    constructor(private inner: DataStream<T>, private max: number) {}\n\n    process(items: T[]): T[] {\n        return this.inner.process(items).slice(0, this.max);\n    }\n}\n\ninterface User { name: string; age: number; }\n\nconst pipeline: DataStream<User> = new LimitDecorator(\n    new SortDecorator(\n        new FilterDecorator(\n            new PassthroughStream<User>(),\n            user => user.age >= 20\n        ),\n        (a, b) => b.age - a.age\n    ),\n    2\n);\n\nconst users: User[] = [\n    { name: "Алиса", age: 30 },\n    { name: "Борис", age: 25 },\n    { name: "Вера", age: 17 },\n    { name: "Денис", age: 22 }\n];\n\nconsole.log(JSON.stringify(pipeline.process(users)));',
      explanation: 'Цепочка декораторов: PassThrough → Filter (age >= 20) → Sort (по убыванию возраста) → Limit (2). Каждый декоратор обрабатывает результат предыдущего. Это аналог Java Stream API, но реализованный через Decorator.'
    }
  ]
}
