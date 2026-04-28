export default {
  id: 6,
  title: 'Builder',
  description: 'Паттерн Builder: пошаговое создание сложных объектов, fluent API, Director',
  lessons: [
    {
      id: 1,
      title: 'Что такое Builder?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Builder (Строитель) — порождающий паттерн, который позволяет создавать сложные объекты пошагово. Он особенно полезен, когда у объекта много параметров, часть из которых необязательна.' },
        { type: 'heading', value: 'Проблема: телескопический конструктор' },
        { type: 'code', language: 'java', value: '// ❌ Конструктор с 8 параметрами — кошмар!\nnew Pizza("large", true, false, true, false, true, false, "thin");\n// Что значит true на 3-й позиции? А false на 4-й?' },
        { type: 'heading', value: 'Решение: Builder' },
        { type: 'code', language: 'java', value: '// ✅ Читаемый и понятный код\nPizza pizza = new Pizza.Builder("large")\n    .cheese(true)\n    .pepperoni(true)\n    .mushrooms(true)\n    .crust("thin")\n    .build();' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'У объекта много параметров (особенно необязательных)',
          'Объект нужно создавать в несколько шагов',
          'Нужны разные представления одного и того же объекта',
          'Хотите сделать объект неизменяемым (immutable) после создания'
        ]},
        { type: 'note', value: 'Builder — один из самых популярных паттернов в Java. Его использует Lombok (@Builder), библиотеки OkHttp, Retrofit, Protocol Buffers и многие другие.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java: fluent API',
      type: 'theory',
      content: [
        { type: 'text', value: 'Самый популярный вариант Builder в Java — вложенный статический класс с fluent API (метод возвращает this для цепочки вызовов).' },
        { type: 'code', language: 'java', value: 'public class HttpRequest {\n    private final String method;\n    private final String url;\n    private final Map<String, String> headers;\n    private final String body;\n    private final int timeout;\n    private final boolean followRedirects;\n\n    // Приватный конструктор — только через Builder\n    private HttpRequest(Builder builder) {\n        this.method = builder.method;\n        this.url = builder.url;\n        this.headers = Collections.unmodifiableMap(builder.headers);\n        this.body = builder.body;\n        this.timeout = builder.timeout;\n        this.followRedirects = builder.followRedirects;\n    }\n\n    // Getters...\n    public String getMethod() { return method; }\n    public String getUrl() { return url; }\n    public Map<String, String> getHeaders() { return headers; }\n\n    @Override\n    public String toString() {\n        return method + " " + url + " (timeout=" + timeout + "ms)";\n    }\n\n    // Вложенный Builder\n    public static class Builder {\n        // Обязательные параметры\n        private final String method;\n        private final String url;\n\n        // Необязательные с значениями по умолчанию\n        private Map<String, String> headers = new HashMap<>();\n        private String body = "";\n        private int timeout = 30000;\n        private boolean followRedirects = true;\n\n        public Builder(String method, String url) {\n            this.method = method;\n            this.url = url;\n        }\n\n        public Builder header(String key, String value) {\n            headers.put(key, value);\n            return this; // Возвращаем this для fluent API\n        }\n\n        public Builder body(String body) {\n            this.body = body;\n            return this;\n        }\n\n        public Builder timeout(int timeout) {\n            this.timeout = timeout;\n            return this;\n        }\n\n        public Builder followRedirects(boolean follow) {\n            this.followRedirects = follow;\n            return this;\n        }\n\n        public HttpRequest build() {\n            // Валидация перед созданием\n            if (url == null || url.isEmpty()) {\n                throw new IllegalStateException("URL обязателен");\n            }\n            return new HttpRequest(this);\n        }\n    }\n}\n\n// Использование\nHttpRequest request = new HttpRequest.Builder("POST", "https://api.example.com/users")\n    .header("Content-Type", "application/json")\n    .header("Authorization", "Bearer token123")\n    .body("{\\"name\\": \\"Иван\\"}")\n    .timeout(5000)\n    .build();\n\nSystem.out.println(request);' },
        { type: 'tip', value: 'Обратите внимание: HttpRequest — immutable объект. После создания его нельзя изменить. Все поля final, конструктор приватный. Это делает объект потокобезопасным.' }
      ]
    },
    {
      id: 3,
      title: 'Builder на TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'В TypeScript Builder удобно реализовать с использованием дженериков и метода build(), возвращающего финальный объект.' },
        { type: 'code', language: 'typescript', value: 'interface QueryConfig {\n    table: string;\n    fields: string[];\n    conditions: string[];\n    orderBy?: string;\n    limit?: number;\n    offset?: number;\n}\n\nclass QueryBuilder {\n    private config: Partial<QueryConfig> = {};\n    private _fields: string[] = [];\n    private _conditions: string[] = [];\n\n    from(table: string): this {\n        this.config.table = table;\n        return this;\n    }\n\n    select(...fields: string[]): this {\n        this._fields.push(...fields);\n        return this;\n    }\n\n    where(condition: string): this {\n        this._conditions.push(condition);\n        return this;\n    }\n\n    orderBy(field: string): this {\n        this.config.orderBy = field;\n        return this;\n    }\n\n    limit(n: number): this {\n        this.config.limit = n;\n        return this;\n    }\n\n    offset(n: number): this {\n        this.config.offset = n;\n        return this;\n    }\n\n    build(): string {\n        if (!this.config.table) {\n            throw new Error("Таблица обязательна");\n        }\n\n        const fields = this._fields.length > 0\n            ? this._fields.join(", ")\n            : "*";\n\n        let sql = `SELECT ${fields} FROM ${this.config.table}`;\n\n        if (this._conditions.length > 0) {\n            sql += " WHERE " + this._conditions.join(" AND ");\n        }\n        if (this.config.orderBy) {\n            sql += " ORDER BY " + this.config.orderBy;\n        }\n        if (this.config.limit) {\n            sql += " LIMIT " + this.config.limit;\n        }\n        if (this.config.offset) {\n            sql += " OFFSET " + this.config.offset;\n        }\n\n        return sql;\n    }\n}\n\n// Использование\nconst query = new QueryBuilder()\n    .from("users")\n    .select("id", "name", "email")\n    .where("age > 18")\n    .where("active = true")\n    .orderBy("name")\n    .limit(10)\n    .offset(20)\n    .build();\n\nconsole.log(query);\n// SELECT id, name, email FROM users WHERE age > 18 AND active = true ORDER BY name LIMIT 10 OFFSET 20' },
        { type: 'heading', value: 'Builder с Readonly результатом' },
        { type: 'code', language: 'typescript', value: 'class UserBuilder {\n    private name: string = "";\n    private email: string = "";\n    private age: number = 0;\n    private roles: string[] = [];\n\n    setName(name: string): this { this.name = name; return this; }\n    setEmail(email: string): this { this.email = email; return this; }\n    setAge(age: number): this { this.age = age; return this; }\n    addRole(role: string): this { this.roles.push(role); return this; }\n\n    build(): Readonly<{ name: string; email: string; age: number; roles: readonly string[] }> {\n        return Object.freeze({\n            name: this.name,\n            email: this.email,\n            age: this.age,\n            roles: Object.freeze([...this.roles])\n        });\n    }\n}\n\nconst user = new UserBuilder()\n    .setName("Алексей")\n    .setEmail("alex@mail.com")\n    .setAge(25)\n    .addRole("admin")\n    .addRole("editor")\n    .build();\n\n// user.name = "другое"; // Ошибка! Объект заморожен' },
        { type: 'tip', value: 'В TypeScript Builder часто сочетается с Object.freeze() для создания по-настоящему неизменяемых объектов.' }
      ]
    },
    {
      id: 4,
      title: 'Паттерн Director',
      type: 'theory',
      content: [
        { type: 'text', value: 'Director (Директор) — необязательный участник паттерна Builder. Он знает, в каком порядке вызывать шаги строителя для создания типовых конфигураций.' },
        { type: 'code', language: 'java', value: '// Builder для компьютера\npublic interface ComputerBuilder {\n    ComputerBuilder setCPU(String cpu);\n    ComputerBuilder setRAM(int gb);\n    ComputerBuilder setStorage(String storage);\n    ComputerBuilder setGPU(String gpu);\n    ComputerBuilder setOS(String os);\n    Computer build();\n}\n\npublic class PCBuilder implements ComputerBuilder {\n    private String cpu, storage, gpu, os;\n    private int ram;\n\n    public ComputerBuilder setCPU(String cpu) { this.cpu = cpu; return this; }\n    public ComputerBuilder setRAM(int gb) { this.ram = gb; return this; }\n    public ComputerBuilder setStorage(String storage) { this.storage = storage; return this; }\n    public ComputerBuilder setGPU(String gpu) { this.gpu = gpu; return this; }\n    public ComputerBuilder setOS(String os) { this.os = os; return this; }\n\n    public Computer build() {\n        return new Computer(cpu, ram, storage, gpu, os);\n    }\n}\n\n// Director знает типовые конфигурации\npublic class ComputerDirector {\n    private final ComputerBuilder builder;\n\n    public ComputerDirector(ComputerBuilder builder) {\n        this.builder = builder;\n    }\n\n    public Computer buildGamingPC() {\n        return builder\n            .setCPU("Intel i9-13900K")\n            .setRAM(32)\n            .setStorage("SSD 2TB NVMe")\n            .setGPU("RTX 4090")\n            .setOS("Windows 11")\n            .build();\n    }\n\n    public Computer buildOfficePC() {\n        return builder\n            .setCPU("Intel i5-13400")\n            .setRAM(16)\n            .setStorage("SSD 512GB")\n            .setGPU("Integrated")\n            .setOS("Windows 11")\n            .build();\n    }\n\n    public Computer buildDevServer() {\n        return builder\n            .setCPU("AMD EPYC 7763")\n            .setRAM(128)\n            .setStorage("SSD 4TB RAID")\n            .setGPU("None")\n            .setOS("Ubuntu Server 22.04")\n            .build();\n    }\n}\n\n// Использование\nComputerDirector director = new ComputerDirector(new PCBuilder());\nComputer gaming = director.buildGamingPC();\nComputer office = director.buildOfficePC();' },
        { type: 'note', value: 'Director не обязателен. Если у вас нет типовых конфигураций, можно использовать Builder напрямую. Director полезен, когда одни и те же комбинации повторяются часто.' },
        { type: 'tip', value: 'В реальных проектах роль Director часто выполняют конфигурационные файлы (application.yml) или методы-фабрики в сервисных классах.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Builder для конфигурации сервера',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Builder для класса ServerConfig с валидацией параметров.',
      requirements: [
        'Обязательные: host, port',
        'Необязательные: maxConnections (default 100), timeout (default 30000), ssl (default false), logLevel (default INFO)',
        'Валидация: port 1-65535, maxConnections > 0, timeout > 0',
        'Fluent API с методом build(), выбрасывающим исключение при невалидных данных',
        'ServerConfig должен быть immutable'
      ],
      hint: 'Используйте вложенный статический класс Builder. В build() проверьте все обязательные поля и диапазоны значений.',
      expectedOutput: 'Server: localhost:8080 (SSL: true, max: 200, timeout: 5000ms, log: DEBUG)\nServer: api.example.com:443 (SSL: true, max: 100, timeout: 30000ms, log: INFO)',
      solution: 'public final class ServerConfig {\n    private final String host;\n    private final int port;\n    private final int maxConnections;\n    private final int timeout;\n    private final boolean ssl;\n    private final String logLevel;\n\n    private ServerConfig(Builder builder) {\n        this.host = builder.host;\n        this.port = builder.port;\n        this.maxConnections = builder.maxConnections;\n        this.timeout = builder.timeout;\n        this.ssl = builder.ssl;\n        this.logLevel = builder.logLevel;\n    }\n\n    @Override\n    public String toString() {\n        return String.format("Server: %s:%d (SSL: %b, max: %d, timeout: %dms, log: %s)",\n            host, port, ssl, maxConnections, timeout, logLevel);\n    }\n\n    public static class Builder {\n        private String host;\n        private int port;\n        private int maxConnections = 100;\n        private int timeout = 30000;\n        private boolean ssl = false;\n        private String logLevel = "INFO";\n\n        public Builder(String host, int port) {\n            this.host = host;\n            this.port = port;\n        }\n\n        public Builder maxConnections(int max) { this.maxConnections = max; return this; }\n        public Builder timeout(int ms) { this.timeout = ms; return this; }\n        public Builder ssl(boolean ssl) { this.ssl = ssl; return this; }\n        public Builder logLevel(String level) { this.logLevel = level; return this; }\n\n        public ServerConfig build() {\n            if (host == null || host.isEmpty()) throw new IllegalStateException("Host обязателен");\n            if (port < 1 || port > 65535) throw new IllegalStateException("Port: 1-65535");\n            if (maxConnections <= 0) throw new IllegalStateException("maxConnections > 0");\n            if (timeout <= 0) throw new IllegalStateException("timeout > 0");\n            return new ServerConfig(this);\n        }\n    }\n\n    public static void main(String[] args) {\n        ServerConfig dev = new ServerConfig.Builder("localhost", 8080)\n            .ssl(true).maxConnections(200).timeout(5000).logLevel("DEBUG")\n            .build();\n        System.out.println(dev);\n\n        ServerConfig prod = new ServerConfig.Builder("api.example.com", 443)\n            .ssl(true)\n            .build();\n        System.out.println(prod);\n    }\n}',
      explanation: 'Builder позволяет создать immutable ServerConfig с понятным API. Обязательные параметры передаются в конструктор Builder, необязательные — через fluent-методы. Валидация в build() гарантирует корректность объекта.'
    },
    {
      id: 6,
      title: 'Практика: Builder для SQL-запросов на TypeScript',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте типобезопасный QueryBuilder на TypeScript с поддержкой SELECT, INSERT и UPDATE.',
      requirements: [
        'Метод select(...fields) для SELECT-запросов',
        'Метод insertInto(table).values(record) для INSERT-запросов',
        'Метод update(table).set(record).where(condition) для UPDATE',
        'Метод build() возвращающий SQL-строку',
        'Цепочка вызовов для всех операций'
      ],
      hint: 'Используйте union type или отдельные builder-классы для каждого типа запроса. build() формирует SQL-строку на основе накопленных данных.',
      expectedOutput: 'SELECT name, email FROM users WHERE active = true ORDER BY name LIMIT 10\nINSERT INTO users (name, email, age) VALUES (\'Иван\', \'ivan@mail.com\', 25)\nUPDATE users SET name = \'Пётр\', age = 30 WHERE id = 1',
      solution: 'class SelectBuilder {\n    private _table = "";\n    private _fields: string[] = [];\n    private _conditions: string[] = [];\n    private _orderBy = "";\n    private _limit = 0;\n\n    from(table: string): this { this._table = table; return this; }\n    fields(...f: string[]): this { this._fields = f; return this; }\n    where(cond: string): this { this._conditions.push(cond); return this; }\n    orderBy(field: string): this { this._orderBy = field; return this; }\n    limit(n: number): this { this._limit = n; return this; }\n\n    build(): string {\n        let sql = `SELECT ${this._fields.join(", ")} FROM ${this._table}`;\n        if (this._conditions.length) sql += ` WHERE ${this._conditions.join(" AND ")}`;\n        if (this._orderBy) sql += ` ORDER BY ${this._orderBy}`;\n        if (this._limit) sql += ` LIMIT ${this._limit}`;\n        return sql;\n    }\n}\n\nclass InsertBuilder {\n    private _table = "";\n    private _record: Record<string, any> = {};\n\n    into(table: string): this { this._table = table; return this; }\n    values(record: Record<string, any>): this { this._record = record; return this; }\n\n    build(): string {\n        const keys = Object.keys(this._record);\n        const vals = Object.values(this._record).map(v =>\n            typeof v === "string" ? `\'${v}\'` : String(v)\n        );\n        return `INSERT INTO ${this._table} (${keys.join(", ")}) VALUES (${vals.join(", ")})`;\n    }\n}\n\nclass UpdateBuilder {\n    private _table = "";\n    private _sets: Record<string, any> = {};\n    private _conditions: string[] = [];\n\n    table(table: string): this { this._table = table; return this; }\n    set(record: Record<string, any>): this { this._sets = record; return this; }\n    where(cond: string): this { this._conditions.push(cond); return this; }\n\n    build(): string {\n        const sets = Object.entries(this._sets).map(([k, v]) =>\n            `${k} = ${typeof v === "string" ? `\'${v}\'` : v}`\n        );\n        let sql = `UPDATE ${this._table} SET ${sets.join(", ")}`;\n        if (this._conditions.length) sql += ` WHERE ${this._conditions.join(" AND ")}`;\n        return sql;\n    }\n}\n\n// Использование\nconst select = new SelectBuilder()\n    .from("users").fields("name", "email")\n    .where("active = true").orderBy("name").limit(10)\n    .build();\nconsole.log(select);\n\nconst insert = new InsertBuilder()\n    .into("users")\n    .values({ name: "Иван", email: "ivan@mail.com", age: 25 })\n    .build();\nconsole.log(insert);\n\nconst update = new UpdateBuilder()\n    .table("users")\n    .set({ name: "Пётр", age: 30 })\n    .where("id = 1")\n    .build();\nconsole.log(update);',
      explanation: 'Три отдельных Builder-класса для разных типов SQL-запросов. Каждый предоставляет fluent API и метод build(). В реальных проектах SQL-билдеры (Knex.js, JOOQ, QueryDSL) используют именно этот паттерн.'
    }
  ]
}
