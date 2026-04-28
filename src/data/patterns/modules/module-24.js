export default {
  id: 24,
  title: 'Visitor',
  description: 'Паттерн Visitor: добавление операций без изменения классов, double dispatch',
  lessons: [
    {
      id: 1,
      title: 'Что такое Visitor?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Visitor (Посетитель) — поведенческий паттерн, который позволяет добавлять новые операции к существующим классам, не изменяя их. Visitor отделяет алгоритм от структуры объектов.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Нужно выполнять различные операции над объектами сложной структуры (дерево)',
          'Добавлять новые операции часто, а новые типы элементов — редко',
          'Компиляторы (AST traversal), файловые системы, отчёты по разным структурам',
          'Нужен double dispatch — выбор метода зависит и от типа посетителя, и от типа элемента'
        ]},
        { type: 'heading', value: 'Double Dispatch' },
        { type: 'text', value: 'Обычный полиморфизм (single dispatch) выбирает метод по типу объекта. Visitor реализует double dispatch — метод выбирается по типу И элемента, И посетителя.' },
        { type: 'warning', value: 'Visitor сложно применять, если иерархия элементов часто меняется (добавляются новые типы). Каждый новый тип требует обновления ВСЕХ посетителей.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java',
      type: 'theory',
      content: [
        { type: 'code', language: 'java', value: '// Элементы\ninterface Shape {\n    void accept(ShapeVisitor visitor);\n}\n\nclass Circle implements Shape {\n    double radius;\n    Circle(double radius) { this.radius = radius; }\n    public void accept(ShapeVisitor v) { v.visitCircle(this); }\n}\n\nclass Rectangle implements Shape {\n    double width, height;\n    Rectangle(double w, double h) { this.width = w; this.height = h; }\n    public void accept(ShapeVisitor v) { v.visitRectangle(this); }\n}\n\nclass Triangle implements Shape {\n    double a, b, c;\n    Triangle(double a, double b, double c) { this.a = a; this.b = b; this.c = c; }\n    public void accept(ShapeVisitor v) { v.visitTriangle(this); }\n}\n\n// Посетитель\ninterface ShapeVisitor {\n    void visitCircle(Circle c);\n    void visitRectangle(Rectangle r);\n    void visitTriangle(Triangle t);\n}\n\n// Конкретный посетитель: расчёт площади\nclass AreaCalculator implements ShapeVisitor {\n    double totalArea = 0;\n\n    public void visitCircle(Circle c) {\n        double area = Math.PI * c.radius * c.radius;\n        totalArea += area;\n        System.out.printf("Круг (r=%.1f): площадь = %.2f%n", c.radius, area);\n    }\n\n    public void visitRectangle(Rectangle r) {\n        double area = r.width * r.height;\n        totalArea += area;\n        System.out.printf("Прямоугольник (%.1fx%.1f): площадь = %.2f%n", r.width, r.height, area);\n    }\n\n    public void visitTriangle(Triangle t) {\n        double s = (t.a + t.b + t.c) / 2;\n        double area = Math.sqrt(s * (s - t.a) * (s - t.b) * (s - t.c));\n        totalArea += area;\n        System.out.printf("Треугольник: площадь = %.2f%n", area);\n    }\n}\n\n// Конкретный посетитель: экспорт в SVG\nclass SvgExporter implements ShapeVisitor {\n    StringBuilder svg = new StringBuilder();\n\n    public void visitCircle(Circle c) {\n        svg.append(String.format("<circle r=\\"%.1f\\" />\\n", c.radius));\n    }\n    public void visitRectangle(Rectangle r) {\n        svg.append(String.format("<rect width=\\"%.1f\\" height=\\"%.1f\\" />\\n", r.width, r.height));\n    }\n    public void visitTriangle(Triangle t) {\n        svg.append("<polygon points=\\"...\\" />\\n");\n    }\n}\n\nList<Shape> shapes = List.of(\n    new Circle(5), new Rectangle(3, 4), new Triangle(3, 4, 5)\n);\n\nAreaCalculator calc = new AreaCalculator();\nfor (Shape s : shapes) s.accept(calc);\nSystem.out.printf("Общая площадь: %.2f%n", calc.totalArea);\n\nSvgExporter exporter = new SvgExporter();\nfor (Shape s : shapes) s.accept(exporter);\nSystem.out.println(exporter.svg);' },
        { type: 'tip', value: 'accept(visitor) — ключевой метод. Элемент «знакомится» с посетителем и вызывает на нём правильный метод. Это и есть double dispatch: сначала dispatch по типу элемента (accept), потом по типу посетителя (visitXxx).' }
      ]
    },
    {
      id: 3,
      title: 'Visitor на TypeScript',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// AST (Abstract Syntax Tree) — классическое применение Visitor\ninterface ASTNode {\n    accept<R>(visitor: ASTVisitor<R>): R;\n}\n\nclass NumberNode implements ASTNode {\n    constructor(public value: number) {}\n    accept<R>(v: ASTVisitor<R>): R { return v.visitNumber(this); }\n}\n\nclass BinaryNode implements ASTNode {\n    constructor(public left: ASTNode, public op: string, public right: ASTNode) {}\n    accept<R>(v: ASTVisitor<R>): R { return v.visitBinary(this); }\n}\n\nclass UnaryNode implements ASTNode {\n    constructor(public op: string, public operand: ASTNode) {}\n    accept<R>(v: ASTVisitor<R>): R { return v.visitUnary(this); }\n}\n\ninterface ASTVisitor<R> {\n    visitNumber(node: NumberNode): R;\n    visitBinary(node: BinaryNode): R;\n    visitUnary(node: UnaryNode): R;\n}\n\n// Visitor: вычисление\nclass Evaluator implements ASTVisitor<number> {\n    visitNumber(n: NumberNode): number { return n.value; }\n    visitBinary(n: BinaryNode): number {\n        const l = n.left.accept(this);\n        const r = n.right.accept(this);\n        switch (n.op) {\n            case "+": return l + r;\n            case "-": return l - r;\n            case "*": return l * r;\n            case "/": return l / r;\n            default: throw new Error("Unknown op: " + n.op);\n        }\n    }\n    visitUnary(n: UnaryNode): number {\n        const val = n.operand.accept(this);\n        return n.op === "-" ? -val : val;\n    }\n}\n\n// Visitor: pretty print\nclass Printer implements ASTVisitor<string> {\n    visitNumber(n: NumberNode): string { return String(n.value); }\n    visitBinary(n: BinaryNode): string {\n        return `(${n.left.accept(this)} ${n.op} ${n.right.accept(this)})`;\n    }\n    visitUnary(n: UnaryNode): string {\n        return `${n.op}${n.operand.accept(this)}`;\n    }\n}\n\n// AST для: -(3 + 5) * 2\nconst ast = new BinaryNode(\n    new UnaryNode("-", new BinaryNode(new NumberNode(3), "+", new NumberNode(5))),\n    "*",\n    new NumberNode(2)\n);\n\nconsole.log(ast.accept(new Printer()));    // (-(3 + 5) * 2)\nconsole.log(ast.accept(new Evaluator()));  // -16' },
        { type: 'note', value: 'TypeScript Compiler API и Babel используют Visitor для обхода AST. Visitor позволяет добавлять новые трансформации (минификация, транспиляция) без изменения узлов дерева.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: файловая система с Visitor',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Visitor для анализа файловой системы.',
      requirements: [
        'Элементы: FileNode и DirectoryNode с accept(visitor)',
        'SizeCalculator — подсчёт общего размера',
        'FileCounter — подсчёт файлов по расширениям',
        'SearchVisitor — поиск файлов по имени',
        'Демонстрация: обход дерева каталогов разными посетителями'
      ],
      hint: 'DirectoryNode.accept() вызывает visitor.visitDirectory(this) и рекурсивно accept() для всех дочерних элементов.',
      expectedOutput: 'Размер: 185 KB\nФайлы: {java: 3, xml: 1, md: 1}\nПоиск "Test": [MainTest.java, UtilsTest.java]',
      solution: 'interface FSVisitor {\n    visitFile(file: FileNode): void;\n    visitDirectory(dir: DirectoryNode): void;\n}\n\ninterface FSNode {\n    accept(visitor: FSVisitor): void;\n    getName(): string;\n}\n\nclass FileNode implements FSNode {\n    constructor(public name: string, public size: number) {}\n    accept(v: FSVisitor) { v.visitFile(this); }\n    getName() { return this.name; }\n}\n\nclass DirectoryNode implements FSNode {\n    children: FSNode[] = [];\n    constructor(public name: string) {}\n    add(node: FSNode): this { this.children.push(node); return this; }\n    accept(v: FSVisitor) {\n        v.visitDirectory(this);\n        this.children.forEach(c => c.accept(v));\n    }\n    getName() { return this.name; }\n}\n\nclass SizeCalculator implements FSVisitor {\n    total = 0;\n    visitFile(f: FileNode) { this.total += f.size; }\n    visitDirectory(d: DirectoryNode) {}\n}\n\nclass FileCounter implements FSVisitor {\n    counts = new Map<string, number>();\n    visitFile(f: FileNode) {\n        const ext = f.name.split(".").pop() || "unknown";\n        this.counts.set(ext, (this.counts.get(ext) || 0) + 1);\n    }\n    visitDirectory() {}\n}\n\nclass SearchVisitor implements FSVisitor {\n    results: string[] = [];\n    constructor(private query: string) {}\n    visitFile(f: FileNode) {\n        if (f.name.includes(this.query)) this.results.push(f.name);\n    }\n    visitDirectory() {}\n}\n\nconst root = new DirectoryNode("project")\n    .add(new DirectoryNode("src")\n        .add(new FileNode("Main.java", 50))\n        .add(new FileNode("Utils.java", 30)))\n    .add(new DirectoryNode("test")\n        .add(new FileNode("MainTest.java", 40))\n        .add(new FileNode("UtilsTest.java", 35)))\n    .add(new FileNode("pom.xml", 20))\n    .add(new FileNode("README.md", 10));\n\nconst sizeCalc = new SizeCalculator();\nroot.accept(sizeCalc);\nconsole.log(`Размер: ${sizeCalc.total} KB`);\n\nconst counter = new FileCounter();\nroot.accept(counter);\nconsole.log("Файлы:", Object.fromEntries(counter.counts));\n\nconst search = new SearchVisitor("Test");\nroot.accept(search);\nconsole.log(`Поиск "Test": [${search.results.join(", ")}]`);',
      explanation: 'Три разных Visitor-а обходят одно и то же дерево, извлекая разную информацию. Для добавления новой операции (например, удаление пустых папок) нужен только новый Visitor — дерево не меняется.'
    },
    {
      id: 5,
      title: 'Практика: Visitor для HTML-документа на Java',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Visitor для обработки HTML-дерева: рендеринг, статистика, поиск.',
      requirements: [
        'Элементы: TextNode, ElementNode (tag, attributes, children)',
        'HtmlRenderer — генерирует HTML-строку',
        'StatisticsVisitor — считает теги, текст, глубину',
        'QueryVisitor — находит элементы по тегу или атрибуту',
        'Демонстрация: обход <div><h1>Title</h1><p>Text</p></div>'
      ],
      hint: 'ElementNode.accept() вызывает visitElement(this), затем рекурсивно accept() для children. TextNode.accept() вызывает visitText(this).',
      expectedOutput: 'HTML: <div class="main"><h1>Заголовок</h1><p>Текст</p></div>\nСтатистика: теги=3, текст=2, глубина=2\nПоиск <p>: ["Текст"]',
      solution: 'import java.util.*;\n\ninterface HtmlVisitor {\n    void visitText(TextNode node);\n    void visitElement(ElementNode node);\n}\n\ninterface HtmlNode {\n    void accept(HtmlVisitor visitor);\n}\n\nclass TextNode implements HtmlNode {\n    String text;\n    TextNode(String text) { this.text = text; }\n    public void accept(HtmlVisitor v) { v.visitText(this); }\n}\n\nclass ElementNode implements HtmlNode {\n    String tag;\n    Map<String, String> attrs;\n    List<HtmlNode> children = new ArrayList<>();\n\n    ElementNode(String tag, Map<String, String> attrs, HtmlNode... kids) {\n        this.tag = tag;\n        this.attrs = attrs;\n        children.addAll(List.of(kids));\n    }\n\n    public void accept(HtmlVisitor v) {\n        v.visitElement(this);\n        for (HtmlNode child : children) child.accept(v);\n    }\n}\n\nclass HtmlRenderer implements HtmlVisitor {\n    StringBuilder html = new StringBuilder();\n    public void visitText(TextNode n) { html.append(n.text); }\n    public void visitElement(ElementNode n) {\n        html.append("<").append(n.tag);\n        n.attrs.forEach((k, v) -> html.append(" ").append(k).append("=\\"").append(v).append("\\""));\n        html.append(">");\n        for (HtmlNode c : n.children) c.accept(this);\n        html.append("</").append(n.tag).append(">");\n    }\n}\n\nclass StatsVisitor implements HtmlVisitor {\n    int tags = 0, texts = 0, depth = 0, maxDepth = 0;\n    public void visitText(TextNode n) { texts++; }\n    public void visitElement(ElementNode n) {\n        tags++;\n        depth++;\n        maxDepth = Math.max(maxDepth, depth);\n        for (HtmlNode c : n.children) c.accept(this);\n        depth--;\n    }\n}\n\nclass QueryVisitor implements HtmlVisitor {\n    String targetTag;\n    List<String> results = new ArrayList<>();\n    QueryVisitor(String tag) { this.targetTag = tag; }\n    public void visitText(TextNode n) {}\n    public void visitElement(ElementNode n) {\n        if (n.tag.equals(targetTag)) {\n            StringBuilder text = new StringBuilder();\n            for (HtmlNode c : n.children) {\n                if (c instanceof TextNode t) text.append(t.text);\n            }\n            results.add(text.toString());\n        }\n        for (HtmlNode c : n.children) c.accept(this);\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        ElementNode dom = new ElementNode("div", Map.of("class", "main"),\n            new ElementNode("h1", Map.of(), new TextNode("Заголовок")),\n            new ElementNode("p", Map.of(), new TextNode("Текст")));\n\n        HtmlRenderer renderer = new HtmlRenderer();\n        dom.accept(renderer);\n        System.out.println("HTML: " + renderer.html);\n\n        StatsVisitor stats = new StatsVisitor();\n        dom.accept(stats);\n        System.out.printf("Статистика: теги=%d, текст=%d, глубина=%d%n", stats.tags, stats.texts, stats.maxDepth);\n\n        QueryVisitor query = new QueryVisitor("p");\n        dom.accept(query);\n        System.out.println("Поиск <p>: " + query.results);\n    }\n}',
      explanation: 'Три Visitor-а работают с одним HTML-деревом: Renderer строит HTML-строку, Stats собирает статистику, Query ищет элементы. Это модель работы DOM API — querySelectorAll, textContent, innerHTML реализуются через обход дерева.'
    },
    {
      id: 6,
      title: 'Практика: Visitor для бухгалтерии на TypeScript',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Visitor для обработки финансовых операций.',
      requirements: [
        'Элементы: Income, Expense, Investment с accept(visitor)',
        'TaxCalculator — рассчитывает налоги по разным правилам для каждого типа',
        'ReportGenerator — формирует текстовый отчёт',
        'Демонстрация: обработка списка операций двумя посетителями'
      ],
      hint: 'Каждый тип операции имеет свою ставку налога. TaxCalculator суммирует налоги. ReportGenerator форматирует каждую операцию.',
      expectedOutput: 'Налоги:\n  Зарплата: 200000 × 20% = 40000\n  Аренда офиса: -50000 (вычет)\n  Акции: 30000 × 15% = 4500\nИтого налог: 44500\n---\nОтчёт: Доход: 200000, Расход: 50000, Инвестиции: 30000',
      solution: 'interface FinanceVisitor {\n    visitIncome(op: Income): void;\n    visitExpense(op: Expense): void;\n    visitInvestment(op: Investment): void;\n}\n\ninterface FinanceOperation {\n    accept(v: FinanceVisitor): void;\n}\n\nclass Income implements FinanceOperation {\n    constructor(public source: string, public amount: number) {}\n    accept(v: FinanceVisitor) { v.visitIncome(this); }\n}\n\nclass Expense implements FinanceOperation {\n    constructor(public description: string, public amount: number) {}\n    accept(v: FinanceVisitor) { v.visitExpense(this); }\n}\n\nclass Investment implements FinanceOperation {\n    constructor(public asset: string, public profit: number) {}\n    accept(v: FinanceVisitor) { v.visitInvestment(this); }\n}\n\nclass TaxCalculator implements FinanceVisitor {\n    totalTax = 0;\n    visitIncome(op: Income) {\n        const tax = op.amount * 0.2;\n        this.totalTax += tax;\n        console.log(`  ${op.source}: ${op.amount} × 20% = ${tax}`);\n    }\n    visitExpense(op: Expense) {\n        console.log(`  ${op.description}: -${op.amount} (вычет)`);\n    }\n    visitInvestment(op: Investment) {\n        const tax = op.profit * 0.15;\n        this.totalTax += tax;\n        console.log(`  ${op.asset}: ${op.profit} × 15% = ${tax}`);\n    }\n}\n\nclass ReportGenerator implements FinanceVisitor {\n    income = 0; expenses = 0; investments = 0;\n    visitIncome(op: Income) { this.income += op.amount; }\n    visitExpense(op: Expense) { this.expenses += op.amount; }\n    visitInvestment(op: Investment) { this.investments += op.profit; }\n}\n\nconst operations: FinanceOperation[] = [\n    new Income("Зарплата", 200000),\n    new Expense("Аренда офиса", 50000),\n    new Investment("Акции", 30000)\n];\n\nconsole.log("Налоги:");\nconst tax = new TaxCalculator();\noperations.forEach(op => op.accept(tax));\nconsole.log(`Итого налог: ${tax.totalTax}`);\n\nconsole.log("---");\nconst report = new ReportGenerator();\noperations.forEach(op => op.accept(report));\nconsole.log(`Отчёт: Доход: ${report.income}, Расход: ${report.expenses}, Инвестиции: ${report.investments}`);',
      explanation: 'TaxCalculator применяет разные ставки налога в зависимости от типа операции: 20% на доход, вычет на расход, 15% на инвестиционную прибыль. ReportGenerator суммирует суммы. Два разных анализа одних данных без изменения классов операций.'
    }
  ]
}
