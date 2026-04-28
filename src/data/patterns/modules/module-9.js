export default {
  id: 9,
  title: 'Bridge',
  description: 'Паттерн Bridge: разделение абстракции и реализации, многомерные иерархии',
  lessons: [
    {
      id: 1,
      title: 'Что такое Bridge?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bridge (Мост) — структурный паттерн, который разделяет большой класс или набор связанных классов на две отдельные иерархии — абстракцию и реализацию, позволяя изменять их независимо друг от друга.' },
        { type: 'heading', value: 'Проблема: комбинаторный взрыв классов' },
        { type: 'text', value: 'Представьте иерархию фигур с цветами. Без Bridge для каждой комбинации (RedCircle, BlueCircle, GreenCircle, RedSquare, BlueSquare...) нужен отдельный класс. При N фигурах и M цветах — N*M классов!' },
        { type: 'code', language: 'text', value: 'БЕЗ Bridge:          С Bridge:\nShape                 Shape ──────> Color\n├── RedCircle         ├── Circle    ├── Red\n├── BlueCircle        └── Square    ├── Blue\n├── GreenCircle                     └── Green\n├── RedSquare\n├── BlueSquare        3 + 3 = 6     вместо  3 × 3 = 9\n├── GreenSquare\n└── ... 9 классов!' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Нужно избежать постоянного наследования при добавлении вариаций',
          'Абстракция и реализация должны изменяться независимо',
          'Нужно переключать реализацию во время выполнения',
          'Хотите разделить монолитный класс на несколько измерений'
        ]},
        { type: 'note', value: 'Bridge — один из самых недооценённых паттернов. Он решает фундаментальную проблему — экспоненциальный рост числа классов при множественных вариациях.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим Bridge на примере системы уведомлений с разными каналами доставки и уровнями срочности.' },
        { type: 'code', language: 'java', value: '// Реализация (Implementation) — КАК доставлять\ninterface MessageSender {\n    void send(String title, String body);\n}\n\nclass EmailSender implements MessageSender {\n    public void send(String title, String body) {\n        System.out.println("📧 Email: [" + title + "] " + body);\n    }\n}\n\nclass SmsSender implements MessageSender {\n    public void send(String title, String body) {\n        System.out.println("📱 SMS: " + title + " - " + body);\n    }\n}\n\nclass SlackSender implements MessageSender {\n    public void send(String title, String body) {\n        System.out.println("💬 Slack: *" + title + "* " + body);\n    }\n}\n\n// Абстракция — ЧТО отправлять\nabstract class Notification {\n    protected MessageSender sender; // Мост к реализации\n\n    Notification(MessageSender sender) {\n        this.sender = sender;\n    }\n\n    abstract void notify(String message);\n}\n\n// Расширения абстракции\nclass InfoNotification extends Notification {\n    InfoNotification(MessageSender sender) { super(sender); }\n\n    void notify(String message) {\n        sender.send("ℹ️ Информация", message);\n    }\n}\n\nclass UrgentNotification extends Notification {\n    UrgentNotification(MessageSender sender) { super(sender); }\n\n    void notify(String message) {\n        sender.send("🚨 СРОЧНО!", message.toUpperCase());\n        sender.send("🚨 Повтор", "Пожалуйста, проверьте: " + message);\n    }\n}\n\nclass ErrorNotification extends Notification {\n    ErrorNotification(MessageSender sender) { super(sender); }\n\n    void notify(String message) {\n        sender.send("❌ Ошибка", "Произошла ошибка: " + message);\n    }\n}\n\n// Использование: любая комбинация абстракции и реализации\npublic class App {\n    public static void main(String[] args) {\n        Notification n1 = new UrgentNotification(new EmailSender());\n        n1.notify("Сервер недоступен");\n\n        Notification n2 = new InfoNotification(new SlackSender());\n        n2.notify("Деплой завершён");\n\n        Notification n3 = new ErrorNotification(new SmsSender());\n        n3.notify("Ошибка базы данных");\n    }\n}' },
        { type: 'tip', value: '3 типа уведомлений × 3 канала = 9 комбинаций, но всего 6 классов. При добавлении нового канала (Telegram) нужен только 1 класс, а не 3.' }
      ]
    },
    {
      id: 3,
      title: 'Bridge на TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реализуем Bridge для системы рендеринга UI-компонентов на разных платформах.' },
        { type: 'code', language: 'typescript', value: '// Реализация: как рендерить\ninterface Renderer {\n    renderText(text: string): string;\n    renderButton(label: string): string;\n    renderImage(src: string): string;\n}\n\nclass HtmlRenderer implements Renderer {\n    renderText(text: string): string {\n        return `<p>${text}</p>`;\n    }\n    renderButton(label: string): string {\n        return `<button>${label}</button>`;\n    }\n    renderImage(src: string): string {\n        return `<img src="${src}" />`;\n    }\n}\n\nclass MarkdownRenderer implements Renderer {\n    renderText(text: string): string {\n        return text;\n    }\n    renderButton(label: string): string {\n        return `[${label}](#)`;\n    }\n    renderImage(src: string): string {\n        return `![image](${src})`;\n    }\n}\n\nclass JsonRenderer implements Renderer {\n    renderText(text: string): string {\n        return JSON.stringify({ type: "text", value: text });\n    }\n    renderButton(label: string): string {\n        return JSON.stringify({ type: "button", label });\n    }\n    renderImage(src: string): string {\n        return JSON.stringify({ type: "image", src });\n    }\n}\n\n// Абстракция: что рендерить\nabstract class Page {\n    constructor(protected renderer: Renderer) {}\n    abstract render(): string;\n}\n\nclass ArticlePage extends Page {\n    constructor(\n        renderer: Renderer,\n        private title: string,\n        private content: string,\n        private imageUrl: string\n    ) {\n        super(renderer);\n    }\n\n    render(): string {\n        return [\n            this.renderer.renderText(this.title),\n            this.renderer.renderImage(this.imageUrl),\n            this.renderer.renderText(this.content),\n            this.renderer.renderButton("Читать далее")\n        ].join("\\n");\n    }\n}\n\nclass ProfilePage extends Page {\n    constructor(\n        renderer: Renderer,\n        private name: string,\n        private avatar: string\n    ) {\n        super(renderer);\n    }\n\n    render(): string {\n        return [\n            this.renderer.renderImage(this.avatar),\n            this.renderer.renderText(this.name),\n            this.renderer.renderButton("Подписаться")\n        ].join("\\n");\n    }\n}\n\n// Использование\nconst htmlArticle = new ArticlePage(\n    new HtmlRenderer(), "Заголовок", "Контент статьи", "img.jpg"\n);\nconsole.log("=== HTML ===");\nconsole.log(htmlArticle.render());\n\nconst mdArticle = new ArticlePage(\n    new MarkdownRenderer(), "Заголовок", "Контент статьи", "img.jpg"\n);\nconsole.log("\\n=== Markdown ===");\nconsole.log(mdArticle.render());' },
        { type: 'note', value: 'Bridge позволяет менять рендерер во время выполнения. Например, пользователь может переключиться между HTML и Markdown режимом редактора.' }
      ]
    },
    {
      id: 4,
      title: 'Bridge vs Adapter vs Strategy',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bridge часто путают с Adapter и Strategy. Разберём ключевые различия.' },
        { type: 'heading', value: 'Bridge vs Adapter' },
        { type: 'list', items: [
          'Adapter — применяется после проектирования, когда нужно соединить несовместимые интерфейсы',
          'Bridge — применяется до реализации, когда вы заранее разделяете абстракцию и реализацию',
          'Adapter — адаптирует существующий код, Bridge — проектирует новый код гибко'
        ]},
        { type: 'heading', value: 'Bridge vs Strategy' },
        { type: 'list', items: [
          'Strategy — один алгоритм из семейства подставляется в контекст (одно измерение)',
          'Bridge — две иерархии (абстракция + реализация) развиваются независимо (два измерения)',
          'Strategy фокусируется на поведении, Bridge — на структуре'
        ]},
        { type: 'code', language: 'java', value: '// Strategy: одно измерение — алгоритм сортировки\nclass Sorter {\n    private SortStrategy strategy;\n    void sort(int[] arr) { strategy.sort(arr); }\n}\n\n// Bridge: два измерения — форма + цвет\nclass Shape {\n    private Color color;  // Мост к другому измерению\n    void draw() { /* использует color */ }\n}' },
        { type: 'tip', value: 'Простой тест: если у вас два независимых аспекта, которые можно комбинировать — это Bridge. Если один аспект, который можно заменять — это Strategy.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Bridge для графического редактора',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему фигур с разными способами отрисовки через Bridge.',
      requirements: [
        'Интерфейс DrawingAPI с методами drawCircle(x, y, radius) и drawRectangle(x, y, w, h)',
        'Реализации: SVGDrawingAPI и CanvasDrawingAPI',
        'Абстрактный класс Shape с полем DrawingAPI',
        'Конкретные фигуры: Circle и Rectangle',
        'Каждая фигура может отрисовываться любым API'
      ],
      hint: 'Shape принимает DrawingAPI в конструкторе (мост). Метод draw() делегирует отрисовку API.',
      expectedOutput: 'SVG: <circle cx="10" cy="20" r="30" />\nCanvas: ctx.arc(10, 20, 30, 0, 2*PI)\nSVG: <rect x="5" y="5" width="100" height="50" />\nCanvas: ctx.fillRect(5, 5, 100, 50)',
      solution: 'interface DrawingAPI {\n    void drawCircle(int x, int y, int radius);\n    void drawRectangle(int x, int y, int width, int height);\n}\n\nclass SVGDrawingAPI implements DrawingAPI {\n    public void drawCircle(int x, int y, int r) {\n        System.out.printf("SVG: <circle cx=\\"%d\\" cy=\\"%d\\" r=\\"%d\\" />%n", x, y, r);\n    }\n    public void drawRectangle(int x, int y, int w, int h) {\n        System.out.printf("SVG: <rect x=\\"%d\\" y=\\"%d\\" width=\\"%d\\" height=\\"%d\\" />%n", x, y, w, h);\n    }\n}\n\nclass CanvasDrawingAPI implements DrawingAPI {\n    public void drawCircle(int x, int y, int r) {\n        System.out.printf("Canvas: ctx.arc(%d, %d, %d, 0, 2*PI)%n", x, y, r);\n    }\n    public void drawRectangle(int x, int y, int w, int h) {\n        System.out.printf("Canvas: ctx.fillRect(%d, %d, %d, %d)%n", x, y, w, h);\n    }\n}\n\nabstract class Shape {\n    protected DrawingAPI api;\n    Shape(DrawingAPI api) { this.api = api; }\n    abstract void draw();\n}\n\nclass Circle extends Shape {\n    private int x, y, radius;\n    Circle(int x, int y, int radius, DrawingAPI api) {\n        super(api);\n        this.x = x; this.y = y; this.radius = radius;\n    }\n    void draw() { api.drawCircle(x, y, radius); }\n}\n\nclass Rectangle extends Shape {\n    private int x, y, width, height;\n    Rectangle(int x, int y, int w, int h, DrawingAPI api) {\n        super(api);\n        this.x = x; this.y = y; this.width = w; this.height = h;\n    }\n    void draw() { api.drawRectangle(x, y, width, height); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        DrawingAPI svg = new SVGDrawingAPI();\n        DrawingAPI canvas = new CanvasDrawingAPI();\n\n        new Circle(10, 20, 30, svg).draw();\n        new Circle(10, 20, 30, canvas).draw();\n        new Rectangle(5, 5, 100, 50, svg).draw();\n        new Rectangle(5, 5, 100, 50, canvas).draw();\n    }\n}',
      explanation: 'Bridge разделяет ЧТО рисовать (Circle, Rectangle) и КАК рисовать (SVG, Canvas). Добавление новой фигуры или нового API требует только одного нового класса, а не N*M классов.'
    },
    {
      id: 6,
      title: 'Практика: Bridge для системы отчётов на TypeScript',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте систему отчётов с разными форматами вывода и типами данных.',
      requirements: [
        'Интерфейс ReportFormatter с методами formatHeader, formatRow, formatFooter',
        'Реализации: CsvFormatter, HtmlTableFormatter, JsonFormatter',
        'Абстрактный класс Report с полем formatter',
        'Конкретные: SalesReport и EmployeeReport',
        'Каждый отчёт может быть выгружен в любом формате'
      ],
      hint: 'Report.generate() вызывает formatter.formatHeader(), затем formatRow() для каждой строки, затем formatFooter(). Каждый formatter генерирует вывод в своём формате.',
      expectedOutput: 'CSV:\nПродукт,Количество,Сумма\nЛаптоп,10,500000\nТелефон,50,250000\nИтого: 3 записи\n---\nJSON:\n{"headers":["Имя","Должность"],"rows":[{"Имя":"Иван","Должность":"Разработчик"}],"total":1}',
      solution: 'interface ReportFormatter {\n    formatHeader(columns: string[]): string;\n    formatRow(values: string[]): string;\n    formatFooter(totalRows: number): string;\n}\n\nclass CsvFormatter implements ReportFormatter {\n    formatHeader(columns: string[]): string {\n        return columns.join(",");\n    }\n    formatRow(values: string[]): string {\n        return values.join(",");\n    }\n    formatFooter(totalRows: number): string {\n        return `Итого: ${totalRows} записи`;\n    }\n}\n\nclass JsonFormatter implements ReportFormatter {\n    private headers: string[] = [];\n    private rows: Record<string, string>[] = [];\n\n    formatHeader(columns: string[]): string {\n        this.headers = columns;\n        this.rows = [];\n        return "";\n    }\n    formatRow(values: string[]): string {\n        const row: Record<string, string> = {};\n        this.headers.forEach((h, i) => row[h] = values[i]);\n        this.rows.push(row);\n        return "";\n    }\n    formatFooter(totalRows: number): string {\n        return JSON.stringify({ headers: this.headers, rows: this.rows, total: totalRows });\n    }\n}\n\nabstract class Report {\n    constructor(protected formatter: ReportFormatter) {}\n    abstract generate(): string;\n}\n\nclass SalesReport extends Report {\n    private data = [\n        ["Лаптоп", "10", "500000"],\n        ["Телефон", "50", "250000"]\n    ];\n\n    generate(): string {\n        const lines: string[] = [];\n        lines.push(this.formatter.formatHeader(["Продукт", "Количество", "Сумма"]));\n        this.data.forEach(row => lines.push(this.formatter.formatRow(row)));\n        lines.push(this.formatter.formatFooter(this.data.length));\n        return lines.filter(l => l).join("\\n");\n    }\n}\n\nclass EmployeeReport extends Report {\n    private data = [[" Иван", "Разработчик"]];\n\n    generate(): string {\n        const lines: string[] = [];\n        lines.push(this.formatter.formatHeader(["Имя", "Должность"]));\n        this.data.forEach(row => lines.push(this.formatter.formatRow(row)));\n        lines.push(this.formatter.formatFooter(this.data.length));\n        return lines.filter(l => l).join("\\n");\n    }\n}\n\nconsole.log("CSV:");\nconsole.log(new SalesReport(new CsvFormatter()).generate());\nconsole.log("---");\nconsole.log("JSON:");\nconsole.log(new EmployeeReport(new JsonFormatter()).generate());',
      explanation: 'Bridge разделяет тип отчёта (Sales, Employee) и формат вывода (CSV, JSON, HTML). Два измерения развиваются независимо. Для поддержки нового формата (Excel) достаточно одного нового класса.'
    }
  ]
}
