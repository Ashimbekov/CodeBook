export default {
  id: 5,
  title: 'Abstract Factory',
  description: 'Паттерн Abstract Factory: создание семейств связанных объектов без привязки к конкретным классам',
  lessons: [
    {
      id: 1,
      title: 'Что такое Abstract Factory?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Abstract Factory (Абстрактная фабрика) — порождающий паттерн, который предоставляет интерфейс для создания семейств связанных или зависимых объектов без указания их конкретных классов.' },
        { type: 'heading', value: 'Отличие от Factory Method' },
        { type: 'text', value: 'Factory Method создаёт один объект. Abstract Factory создаёт целое семейство связанных объектов. Например, если вы разрабатываете кроссплатформенный UI, вам нужны кнопки, чекбоксы и текстовые поля, и все они должны быть в одном стиле (Windows или macOS).' },
        { type: 'code', language: 'text', value: '┌─────────────────────┐\n│   GUIFactory        │ ← Абстрактная фабрика\n│ (interface)         │\n├─────────────────────┤\n│ + createButton()    │\n│ + createCheckbox()  │\n│ + createInput()     │\n└──────────┬──────────┘\n      ┌────┴─────┐\n┌─────┴─────┐ ┌──┴──────────┐\n│ Windows   │ │ MacOS       │\n│ Factory   │ │ Factory     │\n├───────────┤ ├─────────────┤\n│ WinButton │ │ MacButton   │\n│ WinCheck  │ │ MacCheck    │\n│ WinInput  │ │ MacInput    │\n└───────────┘ └─────────────┘' },
        { type: 'tip', value: 'Abstract Factory гарантирует совместимость создаваемых объектов. Если вы используете WindowsFactory, все элементы UI будут в стиле Windows — невозможно случайно создать macOS-кнопку с Windows-чекбоксом.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Система должна быть независима от способа создания объектов',
          'Нужно создавать семейства связанных объектов (UI-элементы, документы, подключения к БД)',
          'Нужно гарантировать совместимость объектов из одного семейства',
          'Нужно поддерживать несколько «тем» или «платформ»'
        ]}
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java: кроссплатформенный UI',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реализуем абстрактную фабрику для создания кроссплатформенных UI-элементов.' },
        { type: 'heading', value: 'Интерфейсы продуктов' },
        { type: 'code', language: 'java', value: 'interface Button {\n    void render();\n    void onClick(Runnable handler);\n}\n\ninterface Checkbox {\n    void render();\n    boolean isChecked();\n    void toggle();\n}\n\ninterface TextField {\n    void render();\n    String getValue();\n    void setValue(String text);\n}' },
        { type: 'heading', value: 'Семейство Windows' },
        { type: 'code', language: 'java', value: 'class WindowsButton implements Button {\n    public void render() { System.out.println("[Windows Button]"); }\n    public void onClick(Runnable handler) {\n        System.out.println("Windows click event");\n        handler.run();\n    }\n}\n\nclass WindowsCheckbox implements Checkbox {\n    private boolean checked = false;\n    public void render() { System.out.println("[Windows Checkbox] " + (checked ? "☑" : "☐")); }\n    public boolean isChecked() { return checked; }\n    public void toggle() { checked = !checked; }\n}\n\nclass WindowsTextField implements TextField {\n    private String value = "";\n    public void render() { System.out.println("[Windows TextField: " + value + "]"); }\n    public String getValue() { return value; }\n    public void setValue(String text) { value = text; }\n}' },
        { type: 'heading', value: 'Семейство macOS' },
        { type: 'code', language: 'java', value: 'class MacButton implements Button {\n    public void render() { System.out.println("(macOS Button)"); }\n    public void onClick(Runnable handler) {\n        System.out.println("macOS click event");\n        handler.run();\n    }\n}\n\nclass MacCheckbox implements Checkbox {\n    private boolean checked = false;\n    public void render() { System.out.println("(macOS Checkbox) " + (checked ? "✓" : "○")); }\n    public boolean isChecked() { return checked; }\n    public void toggle() { checked = !checked; }\n}\n\nclass MacTextField implements TextField {\n    private String value = "";\n    public void render() { System.out.println("(macOS TextField: " + value + ")"); }\n    public String getValue() { return value; }\n    public void setValue(String text) { value = text; }\n}' },
        { type: 'heading', value: 'Абстрактная фабрика и конкретные фабрики' },
        { type: 'code', language: 'java', value: 'interface GUIFactory {\n    Button createButton();\n    Checkbox createCheckbox();\n    TextField createTextField();\n}\n\nclass WindowsFactory implements GUIFactory {\n    public Button createButton() { return new WindowsButton(); }\n    public Checkbox createCheckbox() { return new WindowsCheckbox(); }\n    public TextField createTextField() { return new WindowsTextField(); }\n}\n\nclass MacFactory implements GUIFactory {\n    public Button createButton() { return new MacButton(); }\n    public Checkbox createCheckbox() { return new MacCheckbox(); }\n    public TextField createTextField() { return new MacTextField(); }\n}\n\n// Клиентский код\nclass Application {\n    private final Button button;\n    private final Checkbox checkbox;\n    private final TextField textField;\n\n    Application(GUIFactory factory) {\n        button = factory.createButton();\n        checkbox = factory.createCheckbox();\n        textField = factory.createTextField();\n    }\n\n    void renderUI() {\n        button.render();\n        checkbox.render();\n        textField.render();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        String os = System.getProperty("os.name").toLowerCase();\n        GUIFactory factory = os.contains("win")\n            ? new WindowsFactory()\n            : new MacFactory();\n\n        Application app = new Application(factory);\n        app.renderUI();\n    }\n}' },
        { type: 'tip', value: 'Клиентский код Application работает только через интерфейсы (GUIFactory, Button, Checkbox, TextField). Он не знает и не должен знать, какие конкретные классы используются.' }
      ]
    },
    {
      id: 3,
      title: 'Реализация на TypeScript: темы оформления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим Abstract Factory на примере системы тем оформления: светлая и тёмная темы.' },
        { type: 'code', language: 'typescript', value: '// Интерфейсы продуктов\ninterface ThemeColors {\n    background: string;\n    text: string;\n    primary: string;\n}\n\ninterface ThemeButton {\n    render(): string;\n}\n\ninterface ThemeCard {\n    render(title: string, content: string): string;\n}\n\n// Абстрактная фабрика\ninterface ThemeFactory {\n    createColors(): ThemeColors;\n    createButton(label: string): ThemeButton;\n    createCard(): ThemeCard;\n}\n\n// Светлая тема\nclass LightColors implements ThemeColors {\n    background = "#FFFFFF";\n    text = "#333333";\n    primary = "#2196F3";\n}\n\nclass LightButton implements ThemeButton {\n    constructor(private label: string) {}\n    render(): string {\n        return `<button style="bg:#2196F3;color:white">${this.label}</button>`;\n    }\n}\n\nclass LightCard implements ThemeCard {\n    render(title: string, content: string): string {\n        return `<div style="bg:white;border:1px solid #ddd"><h2>${title}</h2><p>${content}</p></div>`;\n    }\n}\n\nclass LightThemeFactory implements ThemeFactory {\n    createColors(): ThemeColors { return new LightColors(); }\n    createButton(label: string): ThemeButton { return new LightButton(label); }\n    createCard(): ThemeCard { return new LightCard(); }\n}\n\n// Тёмная тема\nclass DarkColors implements ThemeColors {\n    background = "#1E1E1E";\n    text = "#E0E0E0";\n    primary = "#BB86FC";\n}\n\nclass DarkButton implements ThemeButton {\n    constructor(private label: string) {}\n    render(): string {\n        return `<button style="bg:#BB86FC;color:black">${this.label}</button>`;\n    }\n}\n\nclass DarkCard implements ThemeCard {\n    render(title: string, content: string): string {\n        return `<div style="bg:#2D2D2D;border:1px solid #444"><h2>${title}</h2><p>${content}</p></div>`;\n    }\n}\n\nclass DarkThemeFactory implements ThemeFactory {\n    createColors(): ThemeColors { return new DarkColors(); }\n    createButton(label: string): ThemeButton { return new DarkButton(label); }\n    createCard(): ThemeCard { return new DarkCard(); }\n}\n\n// Клиентский код\nfunction renderPage(factory: ThemeFactory): void {\n    const colors = factory.createColors();\n    const button = factory.createButton("Нажми меня");\n    const card = factory.createCard();\n\n    console.log("Фон: " + colors.background);\n    console.log("Кнопка: " + button.render());\n    console.log("Карточка: " + card.render("Заголовок", "Контент"));\n}\n\n// Выбираем тему\nconst isDark = true;\nconst factory: ThemeFactory = isDark\n    ? new DarkThemeFactory()\n    : new LightThemeFactory();\n\nrenderPage(factory);' },
        { type: 'note', value: 'Abstract Factory часто используется в связке с конфигурацией или переменными окружения. Выбор конкретной фабрики происходит один раз при старте приложения, а дальше весь код работает через абстракции.' }
      ]
    },
    {
      id: 4,
      title: 'Реальные примеры Abstract Factory',
      type: 'theory',
      content: [
        { type: 'text', value: 'Abstract Factory широко используется в реальных проектах и фреймворках.' },
        { type: 'heading', value: 'JDBC в Java' },
        { type: 'code', language: 'java', value: '// java.sql.Connection — это абстрактная фабрика!\n// Каждый драйвер (MySQL, PostgreSQL, Oracle) реализует свои конкретные классы\n\nConnection conn = DriverManager.getConnection(url);\n\n// conn.createStatement() — фабричный метод\nStatement stmt = conn.createStatement();  // MySQL → MySQLStatement\n\n// conn.prepareStatement() — ещё один фабричный метод\nPreparedStatement ps = conn.prepareStatement(sql); // MySQL → MySQLPreparedStatement' },
        { type: 'heading', value: 'Подключение к разным базам данных' },
        { type: 'code', language: 'java', value: '// Пример: фабрика для работы с разными БД\ninterface DatabaseFactory {\n    Connection createConnection();\n    QueryBuilder createQueryBuilder();\n    MigrationRunner createMigrationRunner();\n}\n\nclass PostgresFactory implements DatabaseFactory {\n    public Connection createConnection() {\n        return new PostgresConnection("jdbc:postgresql://localhost:5432/mydb");\n    }\n    public QueryBuilder createQueryBuilder() {\n        return new PostgresQueryBuilder(); // Поддерживает RETURNING\n    }\n    public MigrationRunner createMigrationRunner() {\n        return new PostgresMigrationRunner();\n    }\n}\n\nclass MySQLFactory implements DatabaseFactory {\n    public Connection createConnection() {\n        return new MySQLConnection("jdbc:mysql://localhost:3306/mydb");\n    }\n    public QueryBuilder createQueryBuilder() {\n        return new MySQLQueryBuilder(); // Свой синтаксис\n    }\n    public MigrationRunner createMigrationRunner() {\n        return new MySQLMigrationRunner();\n    }\n}' },
        { type: 'heading', value: 'Angular Material Theming' },
        { type: 'code', language: 'typescript', value: '// Концепция Angular Material — фабрика тем\ninterface MatTheme {\n    createPalette(): MatPalette;\n    createTypography(): MatTypography;\n    createShadows(): MatShadows;\n}\n\n// В Angular это делается через токены DI и провайдеры,\n// но концептуально это Abstract Factory' },
        { type: 'tip', value: 'Если вы используете Spring Boot, Abstract Factory встроена в концепцию профилей (profiles). Разные профили (dev, staging, prod) могут подключать разные реализации сервисов.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: фабрика мебели',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте Abstract Factory для мебельного магазина с разными стилями: Modern и Victorian.',
      requirements: [
        'Интерфейсы Chair, Table, Sofa с методом describe()',
        'Семейство Modern: ModernChair, ModernTable, ModernSofa',
        'Семейство Victorian: VictorianChair, VictorianTable, VictorianSofa',
        'Интерфейс FurnitureFactory с методами createChair(), createTable(), createSofa()',
        'Конкретные фабрики ModernFurnitureFactory и VictorianFurnitureFactory'
      ],
      hint: 'Создайте клиентский код, который получает FurnitureFactory и создаёт всю мебель через фабрику, не зная конкретных классов.',
      expectedOutput: 'Стиль: Modern\n  Стул: минималистичный стул из хрома и пластика\n  Стол: стеклянный стол на металлических ножках\n  Диван: модульный диван из экокожи\n---\nСтиль: Victorian\n  Стул: резной дубовый стул с бархатной обивкой\n  Стол: массивный стол из красного дерева\n  Диван: диван честерфилд с каретной стяжкой',
      solution: 'interface Chair {\n    String describe();\n}\n\ninterface Table {\n    String describe();\n}\n\ninterface Sofa {\n    String describe();\n}\n\n// Modern\nclass ModernChair implements Chair {\n    public String describe() { return "минималистичный стул из хрома и пластика"; }\n}\nclass ModernTable implements Table {\n    public String describe() { return "стеклянный стол на металлических ножках"; }\n}\nclass ModernSofa implements Sofa {\n    public String describe() { return "модульный диван из экокожи"; }\n}\n\n// Victorian\nclass VictorianChair implements Chair {\n    public String describe() { return "резной дубовый стул с бархатной обивкой"; }\n}\nclass VictorianTable implements Table {\n    public String describe() { return "массивный стол из красного дерева"; }\n}\nclass VictorianSofa implements Sofa {\n    public String describe() { return "диван честерфилд с каретной стяжкой"; }\n}\n\ninterface FurnitureFactory {\n    Chair createChair();\n    Table createTable();\n    Sofa createSofa();\n}\n\nclass ModernFurnitureFactory implements FurnitureFactory {\n    public Chair createChair() { return new ModernChair(); }\n    public Table createTable() { return new ModernTable(); }\n    public Sofa createSofa() { return new ModernSofa(); }\n}\n\nclass VictorianFurnitureFactory implements FurnitureFactory {\n    public Chair createChair() { return new VictorianChair(); }\n    public Table createTable() { return new VictorianTable(); }\n    public Sofa createSofa() { return new VictorianSofa(); }\n}\n\npublic class Main {\n    static void furnishRoom(String style, FurnitureFactory factory) {\n        System.out.println("Стиль: " + style);\n        System.out.println("  Стул: " + factory.createChair().describe());\n        System.out.println("  Стол: " + factory.createTable().describe());\n        System.out.println("  Диван: " + factory.createSofa().describe());\n    }\n\n    public static void main(String[] args) {\n        furnishRoom("Modern", new ModernFurnitureFactory());\n        System.out.println("---");\n        furnishRoom("Victorian", new VictorianFurnitureFactory());\n    }\n}',
      explanation: 'Abstract Factory гарантирует, что вся мебель в одном стиле. Невозможно случайно создать Modern стул с Victorian столом. Для добавления нового стиля (Art Deco) нужно создать новые классы мебели и фабрику, не меняя клиентский код.'
    },
    {
      id: 6,
      title: 'Практика: фабрика компонентов на TypeScript',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте Abstract Factory для генерации HTML-компонентов в двух вариантах: Bootstrap и Material Design.',
      requirements: [
        'Интерфейсы UIButton, UIInput, UIAlert с методом toHTML(): string',
        'Bootstrap-компоненты с классами btn btn-primary, form-control, alert alert-info',
        'Material-компоненты с классами mdc-button, mdc-text-field, mdc-snackbar',
        'Интерфейс UIComponentFactory',
        'Функция renderForm(factory: UIComponentFactory) генерирующая форму'
      ],
      hint: 'Каждый компонент возвращает HTML-строку с CSS-классами своего фреймворка. renderForm() создаёт input, button и alert через фабрику.',
      expectedOutput: 'Bootstrap Form:\n<input class="form-control" placeholder="Email">\n<button class="btn btn-primary">Отправить</button>\n<div class="alert alert-info">Форма создана!</div>\n---\nMaterial Form:\n<input class="mdc-text-field" placeholder="Email">\n<button class="mdc-button">Отправить</button>\n<div class="mdc-snackbar">Форма создана!</div>',
      solution: 'interface UIButton {\n    toHTML(): string;\n}\n\ninterface UIInput {\n    toHTML(): string;\n}\n\ninterface UIAlert {\n    toHTML(): string;\n}\n\ninterface UIComponentFactory {\n    createButton(label: string): UIButton;\n    createInput(placeholder: string): UIInput;\n    createAlert(message: string): UIAlert;\n}\n\n// Bootstrap\nclass BootstrapButton implements UIButton {\n    constructor(private label: string) {}\n    toHTML(): string {\n        return `<button class="btn btn-primary">${this.label}</button>`;\n    }\n}\n\nclass BootstrapInput implements UIInput {\n    constructor(private placeholder: string) {}\n    toHTML(): string {\n        return `<input class="form-control" placeholder="${this.placeholder}">`;\n    }\n}\n\nclass BootstrapAlert implements UIAlert {\n    constructor(private message: string) {}\n    toHTML(): string {\n        return `<div class="alert alert-info">${this.message}</div>`;\n    }\n}\n\nclass BootstrapFactory implements UIComponentFactory {\n    createButton(label: string): UIButton { return new BootstrapButton(label); }\n    createInput(placeholder: string): UIInput { return new BootstrapInput(placeholder); }\n    createAlert(message: string): UIAlert { return new BootstrapAlert(message); }\n}\n\n// Material\nclass MaterialButton implements UIButton {\n    constructor(private label: string) {}\n    toHTML(): string {\n        return `<button class="mdc-button">${this.label}</button>`;\n    }\n}\n\nclass MaterialInput implements UIInput {\n    constructor(private placeholder: string) {}\n    toHTML(): string {\n        return `<input class="mdc-text-field" placeholder="${this.placeholder}">`;\n    }\n}\n\nclass MaterialAlert implements UIAlert {\n    constructor(private message: string) {}\n    toHTML(): string {\n        return `<div class="mdc-snackbar">${this.message}</div>`;\n    }\n}\n\nclass MaterialFactory implements UIComponentFactory {\n    createButton(label: string): UIButton { return new MaterialButton(label); }\n    createInput(placeholder: string): UIInput { return new MaterialInput(placeholder); }\n    createAlert(message: string): UIAlert { return new MaterialAlert(message); }\n}\n\n// Клиентский код\nfunction renderForm(name: string, factory: UIComponentFactory): void {\n    console.log(name + " Form:");\n    console.log(factory.createInput("Email").toHTML());\n    console.log(factory.createButton("Отправить").toHTML());\n    console.log(factory.createAlert("Форма создана!").toHTML());\n}\n\nrenderForm("Bootstrap", new BootstrapFactory());\nconsole.log("---");\nrenderForm("Material", new MaterialFactory());',
      explanation: 'Abstract Factory гарантирует консистентность UI-компонентов. Все элементы формы используют CSS-классы одного фреймворка. Для добавления Tailwind UI достаточно создать новое семейство классов и фабрику.'
    }
  ]
}
