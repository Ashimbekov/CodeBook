export default {
  id: 16,
  title: 'Command',
  description: 'Паттерн Command: инкапсуляция запросов как объектов, undo/redo, очереди команд',
  lessons: [
    {
      id: 1,
      title: 'Что такое Command?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Command (Команда) — поведенческий паттерн, который превращает запрос в объект, позволяя параметризовать клиентов с различными запросами, ставить запросы в очередь, логировать их и поддерживать отмену операций.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Undo/Redo — отмена и повтор операций (текстовые редакторы, Photoshop)',
          'Очереди задач — отложенное выполнение команд',
          'Транзакции — группировка операций с возможностью отката',
          'Макросы — запись и воспроизведение последовательности действий',
          'Кнопки GUI — привязка действий к элементам интерфейса'
        ]},
        { type: 'code', language: 'text', value: '┌──────────┐     ┌──────────┐     ┌──────────┐\n│ Invoker  │────>│ Command  │────>│ Receiver │\n│ (кнопка) │     │ (объект) │     │ (логика) │\n└──────────┘     └──────────┘     └──────────┘\n\nInvoker вызывает execute() на Command.\nCommand делегирует работу Receiver.' },
        { type: 'note', value: 'Command отделяет объект, инициирующий операцию, от объекта, выполняющего её. Кнопка не знает, что произойдёт при нажатии — это знает Command.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java: текстовый редактор с Undo',
      type: 'theory',
      content: [
        { type: 'code', language: 'java', value: '// Команда\ninterface Command {\n    void execute();\n    void undo();\n}\n\n// Receiver — текстовый документ\nclass TextDocument {\n    private StringBuilder content = new StringBuilder();\n\n    void insert(int position, String text) {\n        content.insert(position, text);\n    }\n\n    void delete(int position, int length) {\n        content.delete(position, position + length);\n    }\n\n    String getContent() { return content.toString(); }\n}\n\n// Конкретные команды\nclass InsertCommand implements Command {\n    private TextDocument doc;\n    private int position;\n    private String text;\n\n    InsertCommand(TextDocument doc, int position, String text) {\n        this.doc = doc;\n        this.position = position;\n        this.text = text;\n    }\n\n    public void execute() { doc.insert(position, text); }\n    public void undo() { doc.delete(position, text.length()); }\n}\n\nclass DeleteCommand implements Command {\n    private TextDocument doc;\n    private int position;\n    private int length;\n    private String deletedText; // Сохраняем для undo\n\n    DeleteCommand(TextDocument doc, int position, int length) {\n        this.doc = doc;\n        this.position = position;\n        this.length = length;\n    }\n\n    public void execute() {\n        deletedText = doc.getContent().substring(position, position + length);\n        doc.delete(position, length);\n    }\n\n    public void undo() { doc.insert(position, deletedText); }\n}\n\n// Invoker — менеджер истории\nclass Editor {\n    private TextDocument doc = new TextDocument();\n    private Deque<Command> history = new ArrayDeque<>();\n    private Deque<Command> redoStack = new ArrayDeque<>();\n\n    void executeCommand(Command cmd) {\n        cmd.execute();\n        history.push(cmd);\n        redoStack.clear();\n    }\n\n    void undo() {\n        if (!history.isEmpty()) {\n            Command cmd = history.pop();\n            cmd.undo();\n            redoStack.push(cmd);\n        }\n    }\n\n    void redo() {\n        if (!redoStack.isEmpty()) {\n            Command cmd = redoStack.pop();\n            cmd.execute();\n            history.push(cmd);\n        }\n    }\n\n    void type(String text) {\n        int pos = doc.getContent().length();\n        executeCommand(new InsertCommand(doc, pos, text));\n    }\n\n    String getContent() { return doc.getContent(); }\n}\n\n// Использование\nEditor editor = new Editor();\neditor.type("Hello");\neditor.type(" World");\nSystem.out.println(editor.getContent()); // Hello World\n\neditor.undo();\nSystem.out.println(editor.getContent()); // Hello\n\neditor.redo();\nSystem.out.println(editor.getContent()); // Hello World' },
        { type: 'tip', value: 'Ключ к undo — каждая команда сохраняет достаточно информации для отмены. DeleteCommand запоминает удалённый текст, чтобы вставить его обратно.' }
      ]
    },
    {
      id: 3,
      title: 'Command на TypeScript: очередь задач',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: 'interface Command {\n    execute(): Promise<void>;\n    description: string;\n}\n\nclass SendEmailCommand implements Command {\n    description: string;\n    constructor(private to: string, private subject: string) {\n        this.description = `Email → ${to}: ${subject}`;\n    }\n    async execute(): Promise<void> {\n        console.log(`📧 Отправка: ${this.description}`);\n    }\n}\n\nclass GenerateReportCommand implements Command {\n    description: string;\n    constructor(private reportType: string) {\n        this.description = `Отчёт: ${reportType}`;\n    }\n    async execute(): Promise<void> {\n        console.log(`📊 Генерация: ${this.description}`);\n    }\n}\n\n// Очередь команд с приоритетами\nclass CommandQueue {\n    private queue: { command: Command; priority: number }[] = [];\n    private history: Command[] = [];\n\n    enqueue(command: Command, priority: number = 0): void {\n        this.queue.push({ command, priority });\n        this.queue.sort((a, b) => b.priority - a.priority);\n        console.log(`➕ В очереди: ${command.description} (приоритет: ${priority})`);\n    }\n\n    async processAll(): Promise<void> {\n        console.log(`\\n🚀 Обработка ${this.queue.length} команд...`);\n        while (this.queue.length > 0) {\n            const { command } = this.queue.shift()!;\n            await command.execute();\n            this.history.push(command);\n        }\n        console.log(`✅ Обработано: ${this.history.length} команд`);\n    }\n\n    getHistory(): string[] {\n        return this.history.map(c => c.description);\n    }\n}\n\nconst queue = new CommandQueue();\nqueue.enqueue(new SendEmailCommand("user@mail.com", "Добро пожаловать"), 1);\nqueue.enqueue(new GenerateReportCommand("Месячный отчёт"), 0);\nqueue.enqueue(new SendEmailCommand("admin@mail.com", "Алерт!"), 2);\nqueue.processAll();' },
        { type: 'note', value: 'Очередь команд — основа систем обработки задач (job queues): Celery, Bull, Sidekiq. Команды сериализуются, ставятся в очередь и выполняются воркерами.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: калькулятор с Undo/Redo',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте калькулятор с историей операций и поддержкой undo/redo.',
      requirements: [
        'Интерфейс Command с execute() и undo()',
        'Команды: AddCommand, SubtractCommand, MultiplyCommand, DivideCommand',
        'Класс Calculator с текущим значением и стеками history/redo',
        'Методы undo() и redo()',
        'Покажите цепочку: 0 → +10 → *3 → -5 → undo → undo → redo'
      ],
      hint: 'Каждая команда хранит предыдущее значение для undo. Calculator делегирует операции командам.',
      expectedOutput: '0 + 10 = 10\n10 * 3 = 30\n30 - 5 = 25\nUndo: 30\nUndo: 10\nRedo: 30',
      solution: 'interface Command {\n    execute(): number;\n    undo(): number;\n}\n\nclass Calculator {\n    private value = 0;\n    private history: Command[] = [];\n    private redoStack: Command[] = [];\n\n    getValue(): number { return this.value; }\n\n    execute(cmd: Command): number {\n        this.value = cmd.execute();\n        this.history.push(cmd);\n        this.redoStack = [];\n        return this.value;\n    }\n\n    undo(): number {\n        const cmd = this.history.pop();\n        if (cmd) {\n            this.value = cmd.undo();\n            this.redoStack.push(cmd);\n        }\n        return this.value;\n    }\n\n    redo(): number {\n        const cmd = this.redoStack.pop();\n        if (cmd) {\n            this.value = cmd.execute();\n            this.history.push(cmd);\n        }\n        return this.value;\n    }\n}\n\nclass AddCommand implements Command {\n    private prev: number;\n    constructor(private calc: { getValue(): number }, private amount: number) {\n        this.prev = calc.getValue();\n    }\n    execute(): number { this.prev = this.calc.getValue(); return this.prev + this.amount; }\n    undo(): number { return this.prev; }\n}\n\nclass MultiplyCommand implements Command {\n    private prev: number;\n    constructor(private calc: { getValue(): number }, private factor: number) {\n        this.prev = calc.getValue();\n    }\n    execute(): number { this.prev = this.calc.getValue(); return this.prev * this.factor; }\n    undo(): number { return this.prev; }\n}\n\nclass SubtractCommand implements Command {\n    private prev: number;\n    constructor(private calc: { getValue(): number }, private amount: number) {\n        this.prev = calc.getValue();\n    }\n    execute(): number { this.prev = this.calc.getValue(); return this.prev - this.amount; }\n    undo(): number { return this.prev; }\n}\n\nconst calc = new Calculator();\nconsole.log(`0 + 10 = ${calc.execute(new AddCommand(calc, 10))}`);\nconsole.log(`10 * 3 = ${calc.execute(new MultiplyCommand(calc, 3))}`);\nconsole.log(`30 - 5 = ${calc.execute(new SubtractCommand(calc, 5))}`);\nconsole.log(`Undo: ${calc.undo()}`);\nconsole.log(`Undo: ${calc.undo()}`);\nconsole.log(`Redo: ${calc.redo()}`);',
      explanation: 'Каждая команда запоминает предыдущее значение (prev) для undo. Calculator хранит стеки history и redo. Undo перемещает команду из history в redo и откатывает значение. Redo — обратный процесс.'
    },
    {
      id: 5,
      title: 'Практика: макро-команда',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему макросов — команду, содержащую список других команд.',
      requirements: [
        'Интерфейс Command с execute() и undo()',
        'MacroCommand — содержит список команд и выполняет их последовательно',
        'При undo() отменяет в обратном порядке',
        'Демонстрация: макрос «Создать проект» = mkdir + touch + git init + npm init',
        'MacroCommand сам является Command (Composite + Command)'
      ],
      hint: 'MacroCommand хранит List<Command>. execute() выполняет все по порядку. undo() отменяет в обратном порядке.',
      expectedOutput: '=== Выполнение макроса: Создать проект ===\n📁 mkdir my-app\n📄 touch my-app/index.ts\n🔧 git init my-app\n📦 npm init my-app\n=== Отмена макроса ===\n↩️ npm init отменена\n↩️ git init отменена\n↩️ touch отменена\n↩️ mkdir отменена',
      solution: 'interface Command {\n    execute(): void;\n    undo(): void;\n    getName(): string;\n}\n\nclass MkdirCommand implements Command {\n    constructor(private dir: string) {}\n    execute(): void { console.log(`📁 mkdir ${this.dir}`); }\n    undo(): void { console.log("↩️ mkdir отменена"); }\n    getName(): string { return `mkdir ${this.dir}`; }\n}\n\nclass TouchCommand implements Command {\n    constructor(private file: string) {}\n    execute(): void { console.log(`📄 touch ${this.file}`); }\n    undo(): void { console.log("↩️ touch отменена"); }\n    getName(): string { return `touch ${this.file}`; }\n}\n\nclass GitInitCommand implements Command {\n    constructor(private dir: string) {}\n    execute(): void { console.log(`🔧 git init ${this.dir}`); }\n    undo(): void { console.log("↩️ git init отменена"); }\n    getName(): string { return `git init ${this.dir}`; }\n}\n\nclass NpmInitCommand implements Command {\n    constructor(private dir: string) {}\n    execute(): void { console.log(`📦 npm init ${this.dir}`); }\n    undo(): void { console.log("↩️ npm init отменена"); }\n    getName(): string { return `npm init ${this.dir}`; }\n}\n\nclass MacroCommand implements Command {\n    private commands: Command[] = [];\n    constructor(private name: string) {}\n\n    add(cmd: Command): this {\n        this.commands.push(cmd);\n        return this;\n    }\n\n    execute(): void {\n        console.log(`=== Выполнение макроса: ${this.name} ===`);\n        for (const cmd of this.commands) {\n            cmd.execute();\n        }\n    }\n\n    undo(): void {\n        console.log("=== Отмена макроса ===");\n        for (let i = this.commands.length - 1; i >= 0; i--) {\n            this.commands[i].undo();\n        }\n    }\n\n    getName(): string { return this.name; }\n}\n\nconst macro = new MacroCommand("Создать проект")\n    .add(new MkdirCommand("my-app"))\n    .add(new TouchCommand("my-app/index.ts"))\n    .add(new GitInitCommand("my-app"))\n    .add(new NpmInitCommand("my-app"));\n\nmacro.execute();\nmacro.undo();',
      explanation: 'MacroCommand — это комбинация паттернов Command и Composite. Макрос содержит список команд и выполняет их все. При undo отменяет в обратном порядке, чтобы сохранить корректное состояние системы.'
    },
    {
      id: 6,
      title: 'Практика: транзакционные команды на Java',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте систему банковских транзакций с автоматическим откатом при ошибке.',
      requirements: [
        'Класс BankAccount с deposit(), withdraw(), getBalance()',
        'TransferCommand — перевод между счетами',
        'TransactionManager — выполняет список команд; при ошибке откатывает все',
        'При недостатке средств withdraw() бросает исключение',
        'Демонстрация: успешная транзакция и транзакция с откатом'
      ],
      hint: 'TransactionManager хранит executed-список. При ошибке вызывает undo() для каждой выполненной команды в обратном порядке.',
      expectedOutput: '=== Транзакция 1: Успешная ===\nПеревод 500 с Алиса на Борис ✅\nПеревод 200 с Борис на Вера ✅\nАлиса: 500, Борис: 300, Вера: 200\n=== Транзакция 2: Откат ===\nПеревод 100 с Алиса на Борис ✅\nПеревод 99999 с Борис на Вера ❌\n↩️ Откат: перевод 100 Борис → Алиса\nАлиса: 500, Борис: 300, Вера: 200',
      solution: 'class BankAccount {\n    private balance: number;\n    constructor(public name: string, balance: number) { this.balance = balance; }\n    getBalance(): number { return this.balance; }\n    deposit(amount: number): void { this.balance += amount; }\n    withdraw(amount: number): void {\n        if (amount > this.balance) throw new Error(`Недостаточно средств: ${this.name}`);\n        this.balance -= amount;\n    }\n}\n\ninterface Command {\n    execute(): void;\n    undo(): void;\n}\n\nclass TransferCommand implements Command {\n    constructor(private from: BankAccount, private to: BankAccount, private amount: number) {}\n\n    execute(): void {\n        this.from.withdraw(this.amount);\n        this.to.deposit(this.amount);\n        console.log(`Перевод ${this.amount} с ${this.from.name} на ${this.to.name} ✅`);\n    }\n\n    undo(): void {\n        this.to.withdraw(this.amount);\n        this.from.deposit(this.amount);\n        console.log(`↩️ Откат: перевод ${this.amount} ${this.to.name} → ${this.from.name}`);\n    }\n}\n\nclass TransactionManager {\n    executeTransaction(commands: Command[]): boolean {\n        const executed: Command[] = [];\n        try {\n            for (const cmd of commands) {\n                cmd.execute();\n                executed.push(cmd);\n            }\n            return true;\n        } catch (e: any) {\n            console.log(`❌ ${e.message}`);\n            for (let i = executed.length - 1; i >= 0; i--) {\n                executed[i].undo();\n            }\n            return false;\n        }\n    }\n}\n\nconst alice = new BankAccount("Алиса", 1000);\nconst boris = new BankAccount("Борис", 0);\nconst vera = new BankAccount("Вера", 0);\nconst tm = new TransactionManager();\n\nconsole.log("=== Транзакция 1: Успешная ===");\ntm.executeTransaction([\n    new TransferCommand(alice, boris, 500),\n    new TransferCommand(boris, vera, 200)\n]);\nconsole.log(`${alice.name}: ${alice.getBalance()}, ${boris.name}: ${boris.getBalance()}, ${vera.name}: ${vera.getBalance()}`);\n\nconsole.log("=== Транзакция 2: Откат ===");\ntm.executeTransaction([\n    new TransferCommand(alice, boris, 100),\n    new TransferCommand(boris, vera, 99999)\n]);\nconsole.log(`${alice.name}: ${alice.getBalance()}, ${boris.name}: ${boris.getBalance()}, ${vera.name}: ${vera.getBalance()}`);',
      explanation: 'TransactionManager обеспечивает атомарность: либо все команды выполняются, либо все откатываются. При ошибке на втором переводе первый автоматически отменяется. Это упрощённая модель транзакций базы данных.'
    }
  ]
}
