export default {
  id: 15,
  title: 'Chain of Responsibility',
  description: 'Паттерн Chain of Responsibility: цепочка обработчиков, передача запросов по цепочке',
  lessons: [
    {
      id: 1,
      title: 'Что такое Chain of Responsibility?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Chain of Responsibility (Цепочка обязанностей) — поведенческий паттерн, позволяющий передавать запросы последовательно по цепочке обработчиков. Каждый обработчик решает: обработать запрос самому или передать дальше.' },
        { type: 'heading', value: 'Аналогия' },
        { type: 'text', value: 'Техподдержка: сначала бот, потом оператор 1-й линии, потом 2-й линии, потом инженер. Если текущий уровень не может решить — передаёт выше.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Набор обработчиков определяется динамически',
          'Нужно обработать запрос одним из нескольких обработчиков, не зная заранее каким',
          'Middleware в веб-фреймворках (Express, Spring, Django)',
          'Валидация с несколькими этапами, система логирования'
        ]},
        { type: 'note', value: 'В отличие от Decorator, обработчик в CoR может прервать цепочку и не передавать запрос дальше. Decorator всегда передаёт вызов обёрнутому объекту.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java',
      type: 'theory',
      content: [
        { type: 'code', language: 'java', value: '// Базовый обработчик\nabstract class SupportHandler {\n    private SupportHandler next;\n\n    public SupportHandler setNext(SupportHandler next) {\n        this.next = next;\n        return next; // Для цепочки\n    }\n\n    public void handle(Ticket ticket) {\n        if (canHandle(ticket)) {\n            process(ticket);\n        } else if (next != null) {\n            next.handle(ticket);\n        } else {\n            System.out.println("❌ Никто не смог обработать: " + ticket.issue);\n        }\n    }\n\n    protected abstract boolean canHandle(Ticket ticket);\n    protected abstract void process(Ticket ticket);\n}\n\nclass Ticket {\n    String issue;\n    int severity; // 1-low, 2-medium, 3-high, 4-critical\n\n    Ticket(String issue, int severity) {\n        this.issue = issue;\n        this.severity = severity;\n    }\n}\n\nclass BotHandler extends SupportHandler {\n    protected boolean canHandle(Ticket t) { return t.severity == 1; }\n    protected void process(Ticket t) {\n        System.out.println("🤖 Бот: Решено автоматически — " + t.issue);\n    }\n}\n\nclass FirstLineHandler extends SupportHandler {\n    protected boolean canHandle(Ticket t) { return t.severity == 2; }\n    protected void process(Ticket t) {\n        System.out.println("👨‍💻 1-я линия: Обработано — " + t.issue);\n    }\n}\n\nclass SecondLineHandler extends SupportHandler {\n    protected boolean canHandle(Ticket t) { return t.severity == 3; }\n    protected void process(Ticket t) {\n        System.out.println("👨‍🔧 2-я линия: Эскалировано и решено — " + t.issue);\n    }\n}\n\nclass ManagerHandler extends SupportHandler {\n    protected boolean canHandle(Ticket t) { return t.severity >= 4; }\n    protected void process(Ticket t) {\n        System.out.println("👔 Менеджер: Критический инцидент — " + t.issue);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        SupportHandler bot = new BotHandler();\n        bot.setNext(new FirstLineHandler())\n           .setNext(new SecondLineHandler())\n           .setNext(new ManagerHandler());\n\n        bot.handle(new Ticket("Забыл пароль", 1));\n        bot.handle(new Ticket("Не работает отчёт", 2));\n        bot.handle(new Ticket("Сервер тормозит", 3));\n        bot.handle(new Ticket("Утечка данных!", 4));\n    }\n}' },
        { type: 'tip', value: 'setNext() возвращает next, что позволяет строить цепочку: a.setNext(b).setNext(c).setNext(d).' }
      ]
    },
    {
      id: 3,
      title: 'CoR на TypeScript: middleware',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// Express-подобный middleware\ninterface Request {\n    url: string;\n    method: string;\n    headers: Record<string, string>;\n    user?: { id: number; role: string };\n}\n\ninterface Response {\n    status: number;\n    body: any;\n}\n\ntype NextFunction = () => void;\ntype Middleware = (req: Request, res: Response, next: NextFunction) => void;\n\nclass MiddlewareChain {\n    private middlewares: Middleware[] = [];\n\n    use(middleware: Middleware): this {\n        this.middlewares.push(middleware);\n        return this;\n    }\n\n    execute(req: Request): Response {\n        const res: Response = { status: 200, body: null };\n        let index = 0;\n\n        const next = () => {\n            if (index < this.middlewares.length) {\n                const mw = this.middlewares[index++];\n                mw(req, res, next);\n            }\n        };\n\n        next();\n        return res;\n    }\n}\n\n// Middleware: логирование\nconst logger: Middleware = (req, res, next) => {\n    console.log(`📋 ${req.method} ${req.url}`);\n    next();\n    console.log(`📋 Ответ: ${res.status}`);\n};\n\n// Middleware: аутентификация\nconst auth: Middleware = (req, res, next) => {\n    const token = req.headers["Authorization"];\n    if (!token) {\n        res.status = 401;\n        res.body = { error: "Unauthorized" };\n        console.log("🚫 Нет токена — цепочка прервана");\n        return; // Не вызываем next() — прерываем цепочку!\n    }\n    req.user = { id: 1, role: "admin" };\n    console.log("✅ Аутентифицирован");\n    next();\n};\n\n// Middleware: обработка\nconst handler: Middleware = (req, res, next) => {\n    res.body = { message: "Данные получены", user: req.user };\n    console.log("📨 Запрос обработан");\n};\n\nconst app = new MiddlewareChain()\n    .use(logger)\n    .use(auth)\n    .use(handler);\n\nconsole.log("--- С токеном ---");\napp.execute({ url: "/api/data", method: "GET", headers: { Authorization: "Bearer xxx" } });\n\nconsole.log("\\n--- Без токена ---");\napp.execute({ url: "/api/data", method: "GET", headers: {} });' },
        { type: 'note', value: 'Middleware в Express, Koa, NestJS — это CoR. Каждый middleware может: обработать запрос, модифицировать его и передать дальше (next()), или прервать цепочку (не вызывая next()).' }
      ]
    },
    {
      id: 4,
      title: 'Практика: валидация формы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте цепочку валидаторов для формы регистрации.',
      requirements: [
        'Базовый класс Validator с методами setNext() и validate(data)',
        'NotEmptyValidator — проверяет, что поле не пустое',
        'EmailValidator — проверяет формат email',
        'PasswordStrengthValidator — проверяет длину >= 8 и наличие цифры',
        'AgeValidator — проверяет, что возраст 18-120',
        'Каждый валидатор либо возвращает ошибку, либо передаёт дальше'
      ],
      hint: 'validate() возвращает String (ошибку) или null (всё ок, передать дальше).',
      expectedOutput: 'Валидация: {email: "", password: "123", age: 15}\n  ❌ Поле email не может быть пустым\nВалидация: {email: "test", password: "weak", age: 25}\n  ❌ Неверный формат email\nВалидация: {email: "a@b.com", password: "short", age: 25}\n  ❌ Пароль должен быть >= 8 символов\nВалидация: {email: "a@b.com", password: "strong12", age: 25}\n  ✅ Все проверки пройдены',
      solution: 'import java.util.Map;\n\nabstract class Validator {\n    private Validator next;\n\n    Validator setNext(Validator next) {\n        this.next = next;\n        return next;\n    }\n\n    String validate(Map<String, String> data) {\n        String error = check(data);\n        if (error != null) return error;\n        if (next != null) return next.validate(data);\n        return null;\n    }\n\n    protected abstract String check(Map<String, String> data);\n}\n\nclass NotEmptyValidator extends Validator {\n    private String field;\n    NotEmptyValidator(String field) { this.field = field; }\n    protected String check(Map<String, String> data) {\n        String val = data.getOrDefault(field, "");\n        return val.isEmpty() ? "Поле " + field + " не может быть пустым" : null;\n    }\n}\n\nclass EmailValidator extends Validator {\n    protected String check(Map<String, String> data) {\n        String email = data.getOrDefault("email", "");\n        return (!email.contains("@") || !email.contains(".")) ? "Неверный формат email" : null;\n    }\n}\n\nclass PasswordValidator extends Validator {\n    protected String check(Map<String, String> data) {\n        String pwd = data.getOrDefault("password", "");\n        if (pwd.length() < 8) return "Пароль должен быть >= 8 символов";\n        if (!pwd.matches(".*\\\\d.*")) return "Пароль должен содержать цифру";\n        return null;\n    }\n}\n\nclass AgeValidator extends Validator {\n    protected String check(Map<String, String> data) {\n        int age = Integer.parseInt(data.getOrDefault("age", "0"));\n        return (age < 18 || age > 120) ? "Возраст должен быть 18-120" : null;\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Validator chain = new NotEmptyValidator("email");\n        chain.setNext(new EmailValidator())\n             .setNext(new PasswordValidator())\n             .setNext(new AgeValidator());\n\n        var tests = List.of(\n            Map.of("email", "", "password", "123", "age", "15"),\n            Map.of("email", "test", "password", "weak", "age", "25"),\n            Map.of("email", "a@b.com", "password", "short", "age", "25"),\n            Map.of("email", "a@b.com", "password", "strong12", "age", "25")\n        );\n\n        for (var data : tests) {\n            System.out.println("Валидация: " + data);\n            String error = chain.validate(data);\n            System.out.println(error == null ? "  ✅ Все проверки пройдены" : "  ❌ " + error);\n        }\n    }\n}',
      explanation: 'Цепочка валидаторов проверяет данные последовательно. Первый обнаруживший ошибку — прерывает цепочку и возвращает сообщение. Если все проверки пройдены — возвращается null. Порядок валидаторов легко менять.'
    },
    {
      id: 5,
      title: 'Практика: обработка логов на TypeScript',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте цепочку обработчиков логов с разными уровнями и назначениями.',
      requirements: [
        'Базовый класс LogHandler с setNext() и log(level, message)',
        'ConsoleHandler — выводит все логи в консоль',
        'FileHandler — записывает WARNING и ERROR в файл',
        'EmailHandler — отправляет только ERROR на email',
        'Каждый обработчик обрабатывает И передаёт дальше (не прерывает)'
      ],
      hint: 'В отличие от предыдущего примера, здесь каждый обработчик решает, обработать ли сообщение, но ВСЕГДА передаёт его дальше.',
      expectedOutput: '[Console] INFO: Приложение запущено\n[Console] WARNING: Мало памяти\n[File] WARNING: Мало памяти\n[Console] ERROR: Сбой БД\n[File] ERROR: Сбой БД\n[Email] ERROR: Сбой БД → admin@company.com',
      solution: 'type LogLevel = "INFO" | "WARNING" | "ERROR";\n\nabstract class LogHandler {\n    private next: LogHandler | null = null;\n\n    setNext(handler: LogHandler): LogHandler {\n        this.next = handler;\n        return handler;\n    }\n\n    log(level: LogLevel, message: string): void {\n        if (this.shouldHandle(level)) {\n            this.write(level, message);\n        }\n        this.next?.log(level, message);\n    }\n\n    protected abstract shouldHandle(level: LogLevel): boolean;\n    protected abstract write(level: LogLevel, message: string): void;\n}\n\nclass ConsoleHandler extends LogHandler {\n    protected shouldHandle(): boolean { return true; }\n    protected write(level: LogLevel, msg: string): void {\n        console.log(`[Console] ${level}: ${msg}`);\n    }\n}\n\nclass FileHandler extends LogHandler {\n    protected shouldHandle(level: LogLevel): boolean {\n        return level === "WARNING" || level === "ERROR";\n    }\n    protected write(level: LogLevel, msg: string): void {\n        console.log(`[File] ${level}: ${msg}`);\n    }\n}\n\nclass EmailHandler extends LogHandler {\n    constructor(private adminEmail: string) { super(); }\n\n    protected shouldHandle(level: LogLevel): boolean {\n        return level === "ERROR";\n    }\n    protected write(level: LogLevel, msg: string): void {\n        console.log(`[Email] ${level}: ${msg} → ${this.adminEmail}`);\n    }\n}\n\nconst chain = new ConsoleHandler();\nchain.setNext(new FileHandler()).setNext(new EmailHandler("admin@company.com"));\n\nchain.log("INFO", "Приложение запущено");\nchain.log("WARNING", "Мало памяти");\nchain.log("ERROR", "Сбой БД");',
      explanation: 'Здесь каждый обработчик ВСЕГДА передаёт сообщение дальше (не прерывает). Но каждый решает, обрабатывать ли его. Console обрабатывает всё, File — только WARNING+ERROR, Email — только ERROR. Это «фильтрующая» вариация CoR.'
    },
    {
      id: 6,
      title: 'Практика: HTTP interceptors',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте систему HTTP interceptors в стиле Angular/Axios.',
      requirements: [
        'Интерфейс HttpInterceptor с методом intercept(req, next)',
        'AuthInterceptor — добавляет Authorization header',
        'RetryInterceptor — повторяет запрос при ошибке (max 3 раза)',
        'LoggingInterceptor — логирует запрос и ответ',
        'InterceptorChain связывает interceptors в цепочку'
      ],
      hint: 'next — это функция, вызывающая следующий interceptor. Каждый interceptor может модифицировать request перед вызовом next и response после.',
      expectedOutput: '[Log] → GET /api/users\n[Auth] Добавлен токен\n[Retry] Попытка 1/3\n📨 Запрос выполнен\n[Log] ← 200 (15ms)',
      solution: 'interface HttpRequest {\n    url: string;\n    method: string;\n    headers: Record<string, string>;\n}\n\ninterface HttpResponse {\n    status: number;\n    data: any;\n}\n\ntype HttpHandler = (req: HttpRequest) => HttpResponse;\n\ninterface HttpInterceptor {\n    intercept(req: HttpRequest, next: HttpHandler): HttpResponse;\n}\n\nclass AuthInterceptor implements HttpInterceptor {\n    intercept(req: HttpRequest, next: HttpHandler): HttpResponse {\n        req.headers["Authorization"] = "Bearer token123";\n        console.log("[Auth] Добавлен токен");\n        return next(req);\n    }\n}\n\nclass RetryInterceptor implements HttpInterceptor {\n    constructor(private maxRetries = 3) {}\n\n    intercept(req: HttpRequest, next: HttpHandler): HttpResponse {\n        for (let i = 1; i <= this.maxRetries; i++) {\n            try {\n                console.log(`[Retry] Попытка ${i}/${this.maxRetries}`);\n                return next(req);\n            } catch (e) {\n                if (i === this.maxRetries) throw e;\n                console.log(`[Retry] Ошибка, повтор...`);\n            }\n        }\n        throw new Error("Unreachable");\n    }\n}\n\nclass LoggingInterceptor implements HttpInterceptor {\n    intercept(req: HttpRequest, next: HttpHandler): HttpResponse {\n        console.log(`[Log] → ${req.method} ${req.url}`);\n        const start = Date.now();\n        const res = next(req);\n        console.log(`[Log] ← ${res.status} (${Date.now() - start}ms)`);\n        return res;\n    }\n}\n\nclass InterceptorChain {\n    private interceptors: HttpInterceptor[] = [];\n\n    add(interceptor: HttpInterceptor): this {\n        this.interceptors.push(interceptor);\n        return this;\n    }\n\n    execute(req: HttpRequest, finalHandler: HttpHandler): HttpResponse {\n        const chain = this.interceptors.reduceRight<HttpHandler>(\n            (next, interceptor) => (r) => interceptor.intercept(r, next),\n            finalHandler\n        );\n        return chain(req);\n    }\n}\n\nconst chain = new InterceptorChain()\n    .add(new LoggingInterceptor())\n    .add(new AuthInterceptor())\n    .add(new RetryInterceptor(3));\n\nconst response = chain.execute(\n    { url: "/api/users", method: "GET", headers: {} },\n    (req) => {\n        console.log("📨 Запрос выполнен");\n        return { status: 200, data: [{ id: 1 }] };\n    }\n);',
      explanation: 'InterceptorChain строит цепочку через reduceRight — каждый interceptor оборачивает следующий обработчик. LoggingInterceptor логирует до и после вызова. AuthInterceptor модифицирует request. RetryInterceptor повторяет при ошибке. Это точная модель Angular HttpInterceptor.'
    }
  ]
}
