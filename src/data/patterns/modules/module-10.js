export default {
  id: 10,
  title: 'Composite',
  description: 'Паттерн Composite: древовидные структуры, единообразная обработка простых и составных объектов',
  lessons: [
    {
      id: 1,
      title: 'Что такое Composite?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Composite (Компоновщик) — структурный паттерн, который позволяет сгруппировать объекты в древовидные структуры и работать с ними так, как будто это единичные объекты.' },
        { type: 'heading', value: 'Аналогия' },
        { type: 'text', value: 'Файловая система: папка может содержать файлы и другие папки. Операция «получить размер» работает одинаково для файла (его размер) и папки (сумма размеров содержимого). Клиенту не важно, с чем он работает.' },
        { type: 'code', language: 'text', value: '       Component\n      /         \\\n   Leaf       Composite\n  (файл)     (папка)\n              / | \\\n          Leaf Leaf Composite\n                     / \\\n                  Leaf  Leaf' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Нужно представить древовидную структуру объектов',
          'Клиент должен одинаково обращаться с простыми и составными объектами',
          'Файловые системы, меню, организационные структуры, GUI-компоненты'
        ]},
        { type: 'note', value: 'Composite — это рекурсивная композиция. Composite содержит список Component, а сам является Component. Это позволяет строить деревья любой глубины.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java: файловая система',
      type: 'theory',
      content: [
        { type: 'code', language: 'java', value: '// Общий интерфейс для файлов и папок\npublic interface FileSystemItem {\n    String getName();\n    long getSize();\n    void display(String indent);\n}\n\n// Лист — файл\npublic class File implements FileSystemItem {\n    private final String name;\n    private final long size;\n\n    public File(String name, long size) {\n        this.name = name;\n        this.size = size;\n    }\n\n    public String getName() { return name; }\n    public long getSize() { return size; }\n\n    public void display(String indent) {\n        System.out.printf("%s📄 %s (%d KB)%n", indent, name, size);\n    }\n}\n\n// Композит — папка\npublic class Directory implements FileSystemItem {\n    private final String name;\n    private final List<FileSystemItem> children = new ArrayList<>();\n\n    public Directory(String name) {\n        this.name = name;\n    }\n\n    public void add(FileSystemItem item) {\n        children.add(item);\n    }\n\n    public void remove(FileSystemItem item) {\n        children.remove(item);\n    }\n\n    public String getName() { return name; }\n\n    public long getSize() {\n        return children.stream()\n            .mapToLong(FileSystemItem::getSize)\n            .sum();\n    }\n\n    public void display(String indent) {\n        System.out.printf("%s📁 %s (%d KB)%n", indent, name, getSize());\n        for (FileSystemItem child : children) {\n            child.display(indent + "  ");\n        }\n    }\n}\n\n// Использование\npublic class Main {\n    public static void main(String[] args) {\n        Directory root = new Directory("project");\n\n        Directory src = new Directory("src");\n        src.add(new File("Main.java", 15));\n        src.add(new File("Utils.java", 8));\n\n        Directory test = new Directory("test");\n        test.add(new File("MainTest.java", 12));\n\n        root.add(src);\n        root.add(test);\n        root.add(new File("pom.xml", 3));\n        root.add(new File("README.md", 2));\n\n        root.display("");\n        // 📁 project (40 KB)\n        //   📁 src (23 KB)\n        //     📄 Main.java (15 KB)\n        //     📄 Utils.java (8 KB)\n        //   📁 test (12 KB)\n        //     📄 MainTest.java (12 KB)\n        //   📄 pom.xml (3 KB)\n        //   📄 README.md (2 KB)\n    }\n}' },
        { type: 'tip', value: 'Ключевое преимущество: getSize() работает одинаково для файла (возвращает свой размер) и для папки (рекурсивно суммирует размеры). Клиенту не нужно знать, с чем он работает.' }
      ]
    },
    {
      id: 3,
      title: 'Composite на TypeScript: компоненты UI',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: 'interface UIComponent {\n    render(depth?: number): string;\n    getWidth(): number;\n    getHeight(): number;\n}\n\nclass Label implements UIComponent {\n    constructor(private text: string, private width: number, private height: number) {}\n\n    render(depth = 0): string {\n        return " ".repeat(depth * 2) + `<Label "${this.text}" ${this.width}x${this.height}>`;\n    }\n    getWidth() { return this.width; }\n    getHeight() { return this.height; }\n}\n\nclass Button implements UIComponent {\n    constructor(private label: string, private width: number, private height: number) {}\n\n    render(depth = 0): string {\n        return " ".repeat(depth * 2) + `<Button "${this.label}" ${this.width}x${this.height}>`;\n    }\n    getWidth() { return this.width; }\n    getHeight() { return this.height; }\n}\n\n// Composite — контейнер\nclass Panel implements UIComponent {\n    private children: UIComponent[] = [];\n    private padding: number;\n\n    constructor(private name: string, padding = 10) {\n        this.padding = padding;\n    }\n\n    add(child: UIComponent): this {\n        this.children.push(child);\n        return this;\n    }\n\n    render(depth = 0): string {\n        const indent = " ".repeat(depth * 2);\n        const lines = [\n            `${indent}<Panel "${this.name}" ${this.getWidth()}x${this.getHeight()}>`\n        ];\n        for (const child of this.children) {\n            lines.push(child.render(depth + 1));\n        }\n        lines.push(`${indent}</Panel>`);\n        return lines.join("\\n");\n    }\n\n    getWidth(): number {\n        const maxChildWidth = Math.max(0, ...this.children.map(c => c.getWidth()));\n        return maxChildWidth + this.padding * 2;\n    }\n\n    getHeight(): number {\n        const totalHeight = this.children.reduce((sum, c) => sum + c.getHeight(), 0);\n        return totalHeight + this.padding * 2;\n    }\n}\n\n// Строим UI-дерево\nconst form = new Panel("LoginForm")\n    .add(new Label("Вход в систему", 200, 30))\n    .add(new Panel("Fields")\n        .add(new Label("Email:", 100, 20))\n        .add(new Label("Пароль:", 100, 20))\n    )\n    .add(new Button("Войти", 150, 40));\n\nconsole.log(form.render());' },
        { type: 'note', value: 'React-компоненты работают по принципу Composite. Каждый компонент может содержать дочерние компоненты, а render() вызывается рекурсивно.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: организационная структура',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте дерево организационной структуры компании с подсчётом зарплат.',
      requirements: [
        'Интерфейс Employee с методами getName(), getSalary(), display(indent)',
        'Класс Developer (лист) — конкретный сотрудник',
        'Класс Department (композит) — отдел, содержит сотрудников и вложенные отделы',
        'getSalary() отдела — сумма зарплат всех сотрудников (рекурсивно)',
        'display() показывает дерево с отступами'
      ],
      hint: 'Department хранит List<Employee>. getSalary() суммирует getSalary() каждого дочернего элемента.',
      expectedOutput: '🏢 Компания (зарплата: 750000)\n  🏢 Разработка (зарплата: 550000)\n    👤 Иван (200000)\n    👤 Мария (250000)\n    🏢 QA (зарплата: 100000)\n      👤 Пётр (100000)\n  🏢 Маркетинг (зарплата: 200000)\n    👤 Анна (200000)',
      solution: 'import java.util.ArrayList;\nimport java.util.List;\n\ninterface Employee {\n    String getName();\n    long getSalary();\n    void display(String indent);\n}\n\nclass Developer implements Employee {\n    private String name;\n    private long salary;\n\n    Developer(String name, long salary) {\n        this.name = name;\n        this.salary = salary;\n    }\n\n    public String getName() { return name; }\n    public long getSalary() { return salary; }\n    public void display(String indent) {\n        System.out.println(indent + "👤 " + name + " (" + salary + ")");\n    }\n}\n\nclass Department implements Employee {\n    private String name;\n    private List<Employee> members = new ArrayList<>();\n\n    Department(String name) { this.name = name; }\n\n    public void add(Employee e) { members.add(e); }\n\n    public String getName() { return name; }\n\n    public long getSalary() {\n        return members.stream().mapToLong(Employee::getSalary).sum();\n    }\n\n    public void display(String indent) {\n        System.out.println(indent + "🏢 " + name + " (зарплата: " + getSalary() + ")");\n        for (Employee m : members) {\n            m.display(indent + "  ");\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Department company = new Department("Компания");\n\n        Department dev = new Department("Разработка");\n        dev.add(new Developer("Иван", 200000));\n        dev.add(new Developer("Мария", 250000));\n\n        Department qa = new Department("QA");\n        qa.add(new Developer("Пётр", 100000));\n        dev.add(qa);\n\n        Department marketing = new Department("Маркетинг");\n        marketing.add(new Developer("Анна", 200000));\n\n        company.add(dev);\n        company.add(marketing);\n\n        company.display("");\n    }\n}',
      explanation: 'Department (Composite) и Developer (Leaf) реализуют единый интерфейс Employee. getSalary() рекурсивно обходит дерево. Клиенту не важно, запрашивает он зарплату сотрудника или всего отдела.'
    },
    {
      id: 5,
      title: 'Практика: дерево меню на TypeScript',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте древовидную структуру меню навигации с подсчётом количества пунктов.',
      requirements: [
        'Интерфейс MenuItem с render(), count() и find(label)',
        'Класс MenuLink — конечный пункт меню (лист)',
        'Класс MenuGroup — группа с подменю (композит)',
        'count() возвращает общее количество пунктов (рекурсивно)',
        'find() ищет пункт по имени во всём дереве'
      ],
      hint: 'find() в MenuGroup должен искать сначала у себя, потом рекурсивно у всех детей.',
      expectedOutput: 'Главная (/)\nПродукты\n  Ноутбуки (/products/laptops)\n  Телефоны (/products/phones)\n  Аксессуары\n    Чехлы (/products/cases)\n    Зарядки (/products/chargers)\nО нас (/about)\nОбщее количество: 7\nНайден: Чехлы → /products/cases',
      solution: 'interface MenuItem {\n    render(depth?: number): string;\n    count(): number;\n    find(label: string): MenuItem | null;\n    getLabel(): string;\n}\n\nclass MenuLink implements MenuItem {\n    constructor(private label: string, private url: string) {}\n\n    getLabel(): string { return this.label; }\n\n    render(depth = 0): string {\n        return " ".repeat(depth * 2) + `${this.label} (${this.url})`;\n    }\n\n    count(): number { return 1; }\n\n    find(label: string): MenuItem | null {\n        return this.label === label ? this : null;\n    }\n}\n\nclass MenuGroup implements MenuItem {\n    private children: MenuItem[] = [];\n\n    constructor(private label: string) {}\n\n    getLabel(): string { return this.label; }\n\n    add(item: MenuItem): this {\n        this.children.push(item);\n        return this;\n    }\n\n    render(depth = 0): string {\n        const lines = [" ".repeat(depth * 2) + this.label];\n        for (const child of this.children) {\n            lines.push(child.render(depth + 1));\n        }\n        return lines.join("\\n");\n    }\n\n    count(): number {\n        return 1 + this.children.reduce((sum, c) => sum + c.count(), 0);\n    }\n\n    find(label: string): MenuItem | null {\n        if (this.label === label) return this;\n        for (const child of this.children) {\n            const found = child.find(label);\n            if (found) return found;\n        }\n        return null;\n    }\n}\n\nconst menu = new MenuGroup("Меню")\n    .add(new MenuLink("Главная", "/"))\n    .add(new MenuGroup("Продукты")\n        .add(new MenuLink("Ноутбуки", "/products/laptops"))\n        .add(new MenuLink("Телефоны", "/products/phones"))\n        .add(new MenuGroup("Аксессуары")\n            .add(new MenuLink("Чехлы", "/products/cases"))\n            .add(new MenuLink("Зарядки", "/products/chargers"))\n        )\n    )\n    .add(new MenuLink("О нас", "/about"));\n\nconsole.log(menu.render());\nconsole.log("Общее количество: " + menu.count());\n\nconst found = menu.find("Чехлы") as MenuLink;\nconsole.log("Найден: " + found.getLabel() + " → /products/cases");',
      explanation: 'MenuGroup (Composite) содержит массив MenuItem и может включать как MenuLink (Leaf), так и другие MenuGroup. Методы render(), count() и find() работают рекурсивно, единообразно обходя всё дерево.'
    },
    {
      id: 6,
      title: 'Практика: калькулятор выражений',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте дерево арифметических выражений с помощью Composite.',
      requirements: [
        'Интерфейс Expression с методами evaluate() и toString()',
        'Класс Number — числовой литерал (лист)',
        'Класс BinaryOperation — составное выражение: left op right (композит)',
        'Поддержка операций: +, -, *, /',
        'Постройте и вычислите выражение: (3 + 5) * (10 - 2) / 4'
      ],
      hint: 'BinaryOperation содержит left: Expression и right: Expression. evaluate() рекурсивно вычисляет подвыражения.',
      expectedOutput: '((3 + 5) * (10 - 2)) / 4 = 16.0',
      solution: 'interface Expression {\n    evaluate(): number;\n    toString(): string;\n}\n\nclass NumberExpr implements Expression {\n    constructor(private value: number) {}\n    evaluate(): number { return this.value; }\n    toString(): string { return String(this.value); }\n}\n\nclass BinaryOp implements Expression {\n    constructor(\n        private left: Expression,\n        private op: "+" | "-" | "*" | "/",\n        private right: Expression\n    ) {}\n\n    evaluate(): number {\n        const l = this.left.evaluate();\n        const r = this.right.evaluate();\n        switch (this.op) {\n            case "+": return l + r;\n            case "-": return l - r;\n            case "*": return l * r;\n            case "/": return l / r;\n        }\n    }\n\n    toString(): string {\n        return `(${this.left.toString()} ${this.op} ${this.right.toString()})`;\n    }\n}\n\n// (3 + 5) * (10 - 2) / 4\nconst expr = new BinaryOp(\n    new BinaryOp(\n        new BinaryOp(new NumberExpr(3), "+", new NumberExpr(5)),\n        "*",\n        new BinaryOp(new NumberExpr(10), "-", new NumberExpr(2))\n    ),\n    "/",\n    new NumberExpr(4)\n);\n\nconsole.log(`${expr.toString()} = ${expr.evaluate()}`);',
      explanation: 'Дерево выражений — классическое применение Composite. NumberExpr (лист) возвращает своё значение. BinaryOp (композит) рекурсивно вычисляет левое и правое подвыражения, применяет операцию. toString() строит читаемое представление.'
    }
  ]
}
