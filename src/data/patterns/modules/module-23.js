export default {
  id: 23,
  title: 'Template Method',
  description: 'Паттерн Template Method: скелет алгоритма в базовом классе, переопределение шагов в подклассах',
  lessons: [
    {
      id: 1,
      title: 'Что такое Template Method?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Template Method (Шаблонный метод) — поведенческий паттерн, который определяет скелет алгоритма в базовом классе, позволяя подклассам переопределять отдельные шаги алгоритма, не изменяя его общую структуру.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Несколько классов имеют похожий алгоритм с отличиями в деталях',
          'Хотите зафиксировать порядок шагов, но позволить менять отдельные шаги',
          'Есть общий «скелет» обработки данных: парсинг файлов, обработка запросов',
          'JUnit (@Before, @Test, @After), Spring template classes (JdbcTemplate, RestTemplate)'
        ]},
        { type: 'heading', value: 'Template Method vs Strategy' },
        { type: 'list', items: [
          'Template Method — наследование: подклассы переопределяют шаги',
          'Strategy — композиция: алгоритм передаётся как объект',
          'Template Method фиксирует структуру алгоритма, Strategy — нет'
        ]},
        { type: 'note', value: 'Template Method использует принцип Голливуда: «Не звоните нам, мы позвоним вам». Базовый класс вызывает методы подклассов, а не наоборот.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java',
      type: 'theory',
      content: [
        { type: 'code', language: 'java', value: '// Базовый класс с шаблонным методом\npublic abstract class DataMiner {\n\n    // Шаблонный метод — определяет скелет алгоритма\n    public final void mine(String path) {\n        String rawData = extractData(path);\n        String[] parsed = parseData(rawData);\n        Map<String, Object> analyzed = analyzeData(parsed);\n        generateReport(analyzed);\n        System.out.println("✅ Обработка завершена\\n");\n    }\n\n    // Шаги, которые переопределяются подклассами\n    protected abstract String extractData(String path);\n    protected abstract String[] parseData(String raw);\n\n    // Шаг с реализацией по умолчанию (hook)\n    protected Map<String, Object> analyzeData(String[] data) {\n        System.out.println("📊 Анализ: " + data.length + " записей");\n        return Map.of("count", data.length);\n    }\n\n    // Общий шаг для всех\n    private void generateReport(Map<String, Object> data) {\n        System.out.println("📝 Отчёт: " + data);\n    }\n}\n\nclass CsvMiner extends DataMiner {\n    protected String extractData(String path) {\n        System.out.println("📄 Чтение CSV: " + path);\n        return "name,age\\nIvan,25\\nMaria,30";\n    }\n\n    protected String[] parseData(String raw) {\n        String[] lines = raw.split("\\n");\n        System.out.println("🔍 CSV парсинг: " + (lines.length - 1) + " строк");\n        return java.util.Arrays.copyOfRange(lines, 1, lines.length);\n    }\n}\n\nclass JsonMiner extends DataMiner {\n    protected String extractData(String path) {\n        System.out.println("📄 Чтение JSON: " + path);\n        return "[{\\"name\\":\\"Ivan\\"},{\\"name\\":\\"Maria\\"}]";\n    }\n\n    protected String[] parseData(String raw) {\n        System.out.println("🔍 JSON парсинг");\n        return new String[]{"Ivan", "Maria"};\n    }\n}\n\nclass DatabaseMiner extends DataMiner {\n    protected String extractData(String path) {\n        System.out.println("🗄️ SQL запрос: SELECT * FROM " + path);\n        return "row1|row2|row3";\n    }\n\n    protected String[] parseData(String raw) {\n        System.out.println("🔍 Парсинг результата запроса");\n        return raw.split("\\\\|");\n    }\n}\n\n// Использование\nnew CsvMiner().mine("users.csv");\nnew JsonMiner().mine("users.json");\nnew DatabaseMiner().mine("users");' },
        { type: 'tip', value: 'Шаблонный метод mine() объявлен как final — подклассы не могут изменить порядок шагов. Они переопределяют только конкретные шаги (extractData, parseData).' }
      ]
    },
    {
      id: 3,
      title: 'Template Method на TypeScript',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: 'abstract class TestFramework {\n    // Шаблонный метод\n    run(testName: string): void {\n        console.log(`\\n=== ${testName} ===`);\n        this.setUp();\n        try {\n            this.execute();\n            this.verify();\n            console.log("✅ PASSED");\n        } catch (e: any) {\n            console.log(`❌ FAILED: ${e.message}`);\n        } finally {\n            this.tearDown();\n        }\n    }\n\n    // Hooks — можно переопределить\n    protected setUp(): void {\n        console.log("  setUp: подготовка");\n    }\n\n    protected tearDown(): void {\n        console.log("  tearDown: очистка");\n    }\n\n    // Абстрактные шаги — обязательно переопределить\n    protected abstract execute(): void;\n    protected abstract verify(): void;\n}\n\nclass ApiTest extends TestFramework {\n    private response: any;\n\n    protected setUp(): void {\n        console.log("  setUp: запуск тест-сервера");\n    }\n\n    protected execute(): void {\n        console.log("  execute: GET /api/users");\n        this.response = { status: 200, data: [{ id: 1 }] };\n    }\n\n    protected verify(): void {\n        console.log("  verify: проверка статуса и данных");\n        if (this.response.status !== 200) throw new Error("Wrong status");\n    }\n\n    protected tearDown(): void {\n        console.log("  tearDown: остановка тест-сервера");\n    }\n}\n\nclass DatabaseTest extends TestFramework {\n    protected setUp(): void {\n        console.log("  setUp: создание тестовой БД");\n    }\n\n    protected execute(): void {\n        console.log("  execute: INSERT INTO users ...");\n    }\n\n    protected verify(): void {\n        console.log("  verify: SELECT COUNT(*) = 1");\n    }\n\n    protected tearDown(): void {\n        console.log("  tearDown: DROP тестовая БД");\n    }\n}\n\nnew ApiTest().run("API Test: получение пользователей");\nnew DatabaseTest().run("DB Test: вставка пользователя");' },
        { type: 'note', value: 'JUnit/Jest/Mocha работают по принципу Template Method: beforeEach → test → afterEach. Порядок фиксирован фреймворком, а вы заполняете шаги.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: генератор отчётов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Template Method для генерации отчётов в разных форматах.',
      requirements: [
        'Абстрактный класс ReportGenerator: шаблонный метод generate(data)',
        'Шаги: prepareHeader(), formatData(data), addFooter(), output()',
        'HtmlReportGenerator — генерирует HTML',
        'MarkdownReportGenerator — генерирует Markdown',
        'JsonReportGenerator — генерирует JSON'
      ],
      hint: 'generate() вызывает шаги в фиксированном порядке. Каждый подкласс форматирует данные в своём формате.',
      expectedOutput: '=== HTML ===\n<html><h1>Отчёт</h1><table>...</table><footer>2024</footer></html>\n=== Markdown ===\n# Отчёт\n| Имя | Возраст |\n---\n*2024*\n=== JSON ===\n{"title":"Отчёт","data":[...],"footer":"2024"}',
      solution: 'abstract class ReportGenerator {\n    generate(title: string, data: string[][]): string {\n        const parts: string[] = [];\n        parts.push(this.prepareHeader(title));\n        parts.push(this.formatData(data));\n        parts.push(this.addFooter());\n        const result = this.output(parts);\n        console.log(result);\n        return result;\n    }\n\n    protected abstract prepareHeader(title: string): string;\n    protected abstract formatData(data: string[][]): string;\n    protected abstract addFooter(): string;\n    protected abstract output(parts: string[]): string;\n}\n\nclass HtmlReport extends ReportGenerator {\n    protected prepareHeader(title: string) { return `<h1>${title}</h1>`; }\n    protected formatData(data: string[][]) {\n        const rows = data.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("");\n        return `<table>${rows}</table>`;\n    }\n    protected addFooter() { return "<footer>2024</footer>"; }\n    protected output(parts: string[]) { return `<html>${parts.join("")}</html>`; }\n}\n\nclass MarkdownReport extends ReportGenerator {\n    protected prepareHeader(title: string) { return `# ${title}`; }\n    protected formatData(data: string[][]) {\n        return data.map(r => `| ${r.join(" | ")} |`).join("\\n");\n    }\n    protected addFooter() { return "\\n*2024*"; }\n    protected output(parts: string[]) { return parts.join("\\n"); }\n}\n\nclass JsonReport extends ReportGenerator {\n    protected prepareHeader(title: string) { return title; }\n    protected formatData(data: string[][]) { return JSON.stringify(data); }\n    protected addFooter() { return "2024"; }\n    protected output(parts: string[]) {\n        return JSON.stringify({ title: parts[0], data: JSON.parse(parts[1]), footer: parts[2] });\n    }\n}\n\nconst data = [["Иван", "25"], ["Мария", "30"]];\n\nconsole.log("=== HTML ===");\nnew HtmlReport().generate("Отчёт", data);\nconsole.log("=== Markdown ===");\nnew MarkdownReport().generate("Отчёт", data);\nconsole.log("=== JSON ===");\nnew JsonReport().generate("Отчёт", data);',
      explanation: 'generate() — шаблонный метод, фиксирующий порядок: header → data → footer → output. Каждый подкласс определяет, КАК форматировать, но не КОГДА. Добавить новый формат (PDF) — один новый класс.'
    },
    {
      id: 5,
      title: 'Практика: ETL-процесс на Java',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте шаблон ETL (Extract-Transform-Load) с помощью Template Method.',
      requirements: [
        'Абстрактный класс ETLPipeline с методом run(): extract → transform → validate → load',
        'UserETL: извлекает пользователей из CSV, трансформирует, загружает в БД',
        'OrderETL: извлекает заказы из JSON, трансформирует, загружает в БД',
        'validate() — hook с реализацией по умолчанию (проверка не-null)',
        'Шаблонный метод run() должен быть final'
      ],
      hint: 'extract() возвращает List<Map>. transform() модифицирует данные. load() «сохраняет» в БД. validate() проверяет данные между transform и load.',
      expectedOutput: '=== User ETL ===\nExtract: 3 записи из users.csv\nTransform: нормализация имён\nValidate: 3 записей валидны\nLoad: 3 записей в таблицу users\n=== Order ETL ===\nExtract: 2 заказа из orders.json\nTransform: расчёт итогов\nValidate: 2 записей валидны\nLoad: 2 записей в таблицу orders',
      solution: 'import java.util.*;\n\nabstract class ETLPipeline {\n    public final void run() {\n        List<Map<String, Object>> data = extract();\n        data = transform(data);\n        if (validate(data)) {\n            load(data);\n        } else {\n            System.out.println("❌ Валидация не пройдена");\n        }\n    }\n\n    protected abstract List<Map<String, Object>> extract();\n    protected abstract List<Map<String, Object>> transform(List<Map<String, Object>> data);\n    protected abstract void load(List<Map<String, Object>> data);\n\n    // Hook с реализацией по умолчанию\n    protected boolean validate(List<Map<String, Object>> data) {\n        System.out.println("Validate: " + data.size() + " записей валидны");\n        return !data.isEmpty();\n    }\n}\n\nclass UserETL extends ETLPipeline {\n    protected List<Map<String, Object>> extract() {\n        var data = List.of(\n            Map.<String, Object>of("name", "ivan", "email", "ivan@mail.com"),\n            Map.<String, Object>of("name", "maria", "email", "maria@mail.com"),\n            Map.<String, Object>of("name", "alex", "email", "alex@mail.com")\n        );\n        System.out.println("Extract: " + data.size() + " записи из users.csv");\n        return new ArrayList<>(data);\n    }\n\n    protected List<Map<String, Object>> transform(List<Map<String, Object>> data) {\n        System.out.println("Transform: нормализация имён");\n        return data.stream().map(row -> {\n            var m = new HashMap<>(row);\n            String name = (String) m.get("name");\n            m.put("name", name.substring(0,1).toUpperCase() + name.substring(1));\n            return (Map<String, Object>) m;\n        }).toList();\n    }\n\n    protected void load(List<Map<String, Object>> data) {\n        System.out.println("Load: " + data.size() + " записей в таблицу users");\n    }\n}\n\nclass OrderETL extends ETLPipeline {\n    protected List<Map<String, Object>> extract() {\n        var data = List.of(\n            Map.<String, Object>of("id", 1, "amount", 5000),\n            Map.<String, Object>of("id", 2, "amount", 3000)\n        );\n        System.out.println("Extract: " + data.size() + " заказа из orders.json");\n        return new ArrayList<>(data);\n    }\n\n    protected List<Map<String, Object>> transform(List<Map<String, Object>> data) {\n        System.out.println("Transform: расчёт итогов");\n        return data;\n    }\n\n    protected void load(List<Map<String, Object>> data) {\n        System.out.println("Load: " + data.size() + " записей в таблицу orders");\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("=== User ETL ===");\n        new UserETL().run();\n        System.out.println("=== Order ETL ===");\n        new OrderETL().run();\n    }\n}',
      explanation: 'ETL-паттерн — классический случай для Template Method. Порядок Extract → Transform → Validate → Load фиксирован. Каждый конкретный ETL определяет свои источники, трансформации и целевые таблицы. validate() — hook с дефолтной реализацией.'
    },
    {
      id: 6,
      title: 'Практика: React-подобный компонент',
      type: 'practice',
      difficulty: 'hard',
      description: 'Смоделируйте жизненный цикл React-компонента через Template Method на TypeScript.',
      requirements: [
        'Абстрактный класс Component с lifecycle: constructor → mount → render → unmount',
        'Hooks: shouldUpdate(), componentDidMount(), componentWillUnmount()',
        'Метод update(newProps) проверяет shouldUpdate и перерисовывает',
        'Конкретные компоненты: UserCard и ProductList',
        'Демонстрация полного жизненного цикла'
      ],
      hint: 'mount() вызывает render() → componentDidMount(). update() вызывает shouldUpdate() → render(). unmount() вызывает componentWillUnmount().',
      expectedOutput: '[UserCard] mount → render → componentDidMount\n[UserCard] shouldUpdate? true → render\n[UserCard] componentWillUnmount → unmounted',
      solution: 'abstract class Component<P = any> {\n    protected props: P;\n\n    constructor(props: P) {\n        this.props = props;\n        console.log(`[${this.getName()}] constructor`);\n    }\n\n    // Шаблонный метод: mount\n    mount(): void {\n        console.log(`[${this.getName()}] mount`);\n        this.render();\n        this.componentDidMount();\n    }\n\n    // Шаблонный метод: update\n    update(newProps: P): void {\n        if (this.shouldUpdate(newProps)) {\n            console.log(`[${this.getName()}] shouldUpdate? true → render`);\n            this.props = newProps;\n            this.render();\n        } else {\n            console.log(`[${this.getName()}] shouldUpdate? false → skip`);\n        }\n    }\n\n    // Шаблонный метод: unmount\n    unmount(): void {\n        this.componentWillUnmount();\n        console.log(`[${this.getName()}] unmounted`);\n    }\n\n    // Абстрактные шаги\n    protected abstract render(): void;\n    protected abstract getName(): string;\n\n    // Hooks с дефолтной реализацией\n    protected componentDidMount(): void {\n        console.log(`[${this.getName()}] componentDidMount`);\n    }\n\n    protected componentWillUnmount(): void {\n        console.log(`[${this.getName()}] componentWillUnmount`);\n    }\n\n    protected shouldUpdate(newProps: P): boolean {\n        return JSON.stringify(this.props) !== JSON.stringify(newProps);\n    }\n}\n\nclass UserCard extends Component<{ name: string; role: string }> {\n    protected getName() { return "UserCard"; }\n\n    protected render(): void {\n        console.log(`[UserCard] render: ${this.props.name} (${this.props.role})`);\n    }\n\n    protected componentDidMount(): void {\n        console.log("[UserCard] componentDidMount: загрузка аватара");\n    }\n}\n\nconst card = new UserCard({ name: "Иван", role: "admin" });\ncard.mount();\ncard.update({ name: "Иван", role: "editor" });\ncard.update({ name: "Иван", role: "editor" }); // skip\ncard.unmount();',
      explanation: 'Template Method моделирует жизненный цикл React-компонента. Порядок mount/update/unmount фиксирован, подклассы переопределяют render() и hooks. shouldUpdate() оптимизирует — пропускает рендер при одинаковых props.'
    }
  ]
}
