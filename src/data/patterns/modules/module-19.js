export default {
  id: 19,
  title: 'Memento',
  description: 'Паттерн Memento: сохранение и восстановление состояния объекта без нарушения инкапсуляции',
  lessons: [
    {
      id: 1,
      title: 'Что такое Memento?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Memento (Снимок) — поведенческий паттерн, который позволяет сохранять и восстанавливать предыдущее состояние объекта, не раскрывая деталей его реализации.' },
        { type: 'heading', value: 'Три участника' },
        { type: 'list', items: [
          'Originator — объект, состояние которого нужно сохранять',
          'Memento — снимок состояния (immutable)',
          'Caretaker — хранитель, управляющий историей снимков'
        ]},
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Undo/Redo в редакторах, играх, формах',
          'Сохранение состояния игры (save/load)',
          'Транзакции: откат при ошибке',
          'Контрольные точки в длительных вычислениях'
        ]},
        { type: 'note', value: 'Memento vs Command: Command хранит действие (что сделать и как отменить). Memento хранит полное состояние объекта. Command экономичнее по памяти, Memento проще в реализации.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java',
      type: 'theory',
      content: [
        { type: 'code', language: 'java', value: '// Memento — снимок состояния\nclass EditorMemento {\n    private final String content;\n    private final int cursorPosition;\n    private final String timestamp;\n\n    EditorMemento(String content, int cursorPosition) {\n        this.content = content;\n        this.cursorPosition = cursorPosition;\n        this.timestamp = java.time.LocalDateTime.now().toString();\n    }\n\n    String getContent() { return content; }\n    int getCursorPosition() { return cursorPosition; }\n    String getTimestamp() { return timestamp; }\n}\n\n// Originator — текстовый редактор\nclass TextEditor {\n    private StringBuilder content = new StringBuilder();\n    private int cursorPosition = 0;\n\n    void type(String text) {\n        content.insert(cursorPosition, text);\n        cursorPosition += text.length();\n    }\n\n    void moveCursor(int position) {\n        cursorPosition = Math.max(0, Math.min(position, content.length()));\n    }\n\n    EditorMemento save() {\n        return new EditorMemento(content.toString(), cursorPosition);\n    }\n\n    void restore(EditorMemento memento) {\n        content = new StringBuilder(memento.getContent());\n        cursorPosition = memento.getCursorPosition();\n    }\n\n    String getContent() { return content.toString(); }\n}\n\n// Caretaker — хранитель истории\nclass History {\n    private final Deque<EditorMemento> snapshots = new ArrayDeque<>();\n\n    void push(EditorMemento memento) { snapshots.push(memento); }\n\n    EditorMemento pop() {\n        return snapshots.isEmpty() ? null : snapshots.pop();\n    }\n\n    int size() { return snapshots.size(); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        TextEditor editor = new TextEditor();\n        History history = new History();\n\n        history.push(editor.save());\n        editor.type("Привет");\n        System.out.println("1: " + editor.getContent());\n\n        history.push(editor.save());\n        editor.type(", мир!");\n        System.out.println("2: " + editor.getContent());\n\n        // Undo\n        editor.restore(history.pop());\n        System.out.println("Undo: " + editor.getContent());\n\n        editor.restore(history.pop());\n        System.out.println("Undo: " + editor.getContent());\n    }\n}' },
        { type: 'tip', value: 'Memento должен быть immutable — после создания его состояние не меняется. Это гарантирует, что сохранённый снимок всегда валиден.' }
      ]
    },
    {
      id: 3,
      title: 'Memento на TypeScript',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// Memento для настроек приложения\nclass SettingsMemento {\n    constructor(\n        public readonly theme: string,\n        public readonly fontSize: number,\n        public readonly language: string,\n        public readonly timestamp: Date = new Date()\n    ) {}\n}\n\nclass AppSettings {\n    private theme = "light";\n    private fontSize = 14;\n    private language = "ru";\n\n    setTheme(t: string) { this.theme = t; }\n    setFontSize(s: number) { this.fontSize = s; }\n    setLanguage(l: string) { this.language = l; }\n\n    save(): SettingsMemento {\n        return new SettingsMemento(this.theme, this.fontSize, this.language);\n    }\n\n    restore(m: SettingsMemento): void {\n        this.theme = m.theme;\n        this.fontSize = m.fontSize;\n        this.language = m.language;\n    }\n\n    toString(): string {\n        return `Тема: ${this.theme}, Шрифт: ${this.fontSize}, Язык: ${this.language}`;\n    }\n}\n\nclass SettingsHistory {\n    private stack: SettingsMemento[] = [];\n\n    save(m: SettingsMemento): void { this.stack.push(m); }\n    undo(): SettingsMemento | undefined { return this.stack.pop(); }\n    canUndo(): boolean { return this.stack.length > 0; }\n}\n\nconst settings = new AppSettings();\nconst history = new SettingsHistory();\n\nhistory.save(settings.save());\nsettings.setTheme("dark");\nsettings.setFontSize(18);\nconsole.log("После изменений: " + settings.toString());\n\nhistory.save(settings.save());\nsettings.setLanguage("en");\nconsole.log("Ещё изменения: " + settings.toString());\n\nif (history.canUndo()) {\n    settings.restore(history.undo()!);\n    console.log("Undo: " + settings.toString());\n}' },
        { type: 'note', value: 'localStorage.setItem / sessionStorage — это по сути Memento для веб-приложений. React useReducer + dispatch тоже построен на идее снимков состояния.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: save/load для игры',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему сохранения/загрузки игры с помощью Memento.',
      requirements: [
        'Класс GameState (Originator): level, health, score, position, inventory',
        'Класс GameSave (Memento): immutable снимок состояния с датой',
        'Класс SaveManager (Caretaker): хранит до 5 последних сохранений',
        'Методы quickSave(), quickLoad(), listSaves()',
        'При 6-м сохранении самое старое удаляется'
      ],
      hint: 'SaveManager хранит List<GameSave> с ограничением maxSaves. При сохранении — если full, удалить первый.',
      expectedOutput: 'Игра: уровень 1, HP 100, очки 0\n💾 Сохранение #1\nИгра: уровень 3, HP 75, очки 1500\n💾 Сохранение #2\nИгра: уровень 5, HP 30, очки 3200\n📂 Загрузка сохранения #2\nИгра: уровень 3, HP 75, очки 1500',
      solution: 'class GameSave {\n    constructor(\n        public readonly level: number,\n        public readonly health: number,\n        public readonly score: number,\n        public readonly position: { x: number; y: number },\n        public readonly inventory: string[],\n        public readonly savedAt: Date = new Date()\n    ) {}\n}\n\nclass GameState {\n    level = 1;\n    health = 100;\n    score = 0;\n    position = { x: 0, y: 0 };\n    inventory: string[] = [];\n\n    save(): GameSave {\n        return new GameSave(\n            this.level, this.health, this.score,\n            { ...this.position }, [...this.inventory]\n        );\n    }\n\n    restore(save: GameSave): void {\n        this.level = save.level;\n        this.health = save.health;\n        this.score = save.score;\n        this.position = { ...save.position };\n        this.inventory = [...save.inventory];\n    }\n\n    toString(): string {\n        return `Игра: уровень ${this.level}, HP ${this.health}, очки ${this.score}`;\n    }\n}\n\nclass SaveManager {\n    private saves: GameSave[] = [];\n    private maxSaves: number;\n\n    constructor(maxSaves = 5) { this.maxSaves = maxSaves; }\n\n    quickSave(state: GameState): void {\n        if (this.saves.length >= this.maxSaves) this.saves.shift();\n        this.saves.push(state.save());\n        console.log(`💾 Сохранение #${this.saves.length}`);\n    }\n\n    quickLoad(state: GameState, index?: number): void {\n        const idx = index ?? this.saves.length - 1;\n        if (idx >= 0 && idx < this.saves.length) {\n            state.restore(this.saves[idx]);\n            console.log(`📂 Загрузка сохранения #${idx + 1}`);\n        }\n    }\n\n    listSaves(): string[] {\n        return this.saves.map((s, i) => `#${i + 1}: Уровень ${s.level}, HP ${s.health}`);\n    }\n}\n\nconst game = new GameState();\nconst saves = new SaveManager(5);\n\nconsole.log(game.toString());\nsaves.quickSave(game);\n\ngame.level = 3; game.health = 75; game.score = 1500;\nconsole.log(game.toString());\nsaves.quickSave(game);\n\ngame.level = 5; game.health = 30; game.score = 3200;\nconsole.log(game.toString());\n\nsaves.quickLoad(game, 1);\nconsole.log(game.toString());',
      explanation: 'GameState (Originator) создаёт снимки через save() и восстанавливает через restore(). Deep copy (spread) гарантирует, что снимок не привязан к текущему состоянию. SaveManager ограничивает количество сохранений, удаляя старые.'
    },
    {
      id: 5,
      title: 'Практика: версионирование документа на Java',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему версионирования документа с возможностью отката к любой версии.',
      requirements: [
        'Класс Document с title, content, author, tags',
        'Класс DocumentVersion (Memento) с номером версии и комментарием',
        'Класс VersionControl: commit(doc, comment), checkout(version), log()',
        'checkout(n) восстанавливает состояние до версии n',
        'log() показывает историю всех версий'
      ],
      hint: 'VersionControl хранит List<DocumentVersion>. Каждый commit() создаёт новую версию. checkout() восстанавливает из списка по индексу.',
      expectedOutput: 'v1: Первая версия — Начало документа\nv2: Добавлен контент — Расширена основная часть\nv3: Финальная правка — Исправлены ошибки\nОткат к v1:\nДокумент: Первая версия (автор: Иван)',
      solution: 'import java.util.*;\n\nclass DocumentVersion {\n    final int version;\n    final String title;\n    final String content;\n    final String author;\n    final List<String> tags;\n    final String comment;\n\n    DocumentVersion(int v, String title, String content, String author, List<String> tags, String comment) {\n        this.version = v; this.title = title; this.content = content;\n        this.author = author; this.tags = List.copyOf(tags); this.comment = comment;\n    }\n}\n\nclass Document {\n    String title, content, author;\n    List<String> tags = new ArrayList<>();\n\n    Document(String title, String content, String author) {\n        this.title = title; this.content = content; this.author = author;\n    }\n\n    DocumentVersion snapshot(int version, String comment) {\n        return new DocumentVersion(version, title, content, author, tags, comment);\n    }\n\n    void restore(DocumentVersion v) {\n        this.title = v.title; this.content = v.content;\n        this.author = v.author; this.tags = new ArrayList<>(v.tags);\n    }\n\n    public String toString() { return "Документ: " + title + " (автор: " + author + ")"; }\n}\n\nclass VersionControl {\n    private List<DocumentVersion> versions = new ArrayList<>();\n\n    void commit(Document doc, String comment) {\n        int v = versions.size() + 1;\n        versions.add(doc.snapshot(v, comment));\n    }\n\n    void checkout(Document doc, int version) {\n        if (version >= 1 && version <= versions.size()) {\n            doc.restore(versions.get(version - 1));\n            System.out.println("Откат к v" + version + ":");\n        }\n    }\n\n    void log() {\n        for (DocumentVersion v : versions) {\n            System.out.println("v" + v.version + ": " + v.title + " — " + v.comment);\n        }\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Document doc = new Document("Первая версия", "Начало", "Иван");\n        VersionControl vc = new VersionControl();\n\n        vc.commit(doc, "Начало документа");\n        doc.title = "Добавлен контент"; doc.content = "Расширенный";\n        vc.commit(doc, "Расширена основная часть");\n        doc.title = "Финальная правка"; doc.content = "Готово";\n        vc.commit(doc, "Исправлены ошибки");\n\n        vc.log();\n        vc.checkout(doc, 1);\n        System.out.println(doc);\n    }\n}',
      explanation: 'VersionControl хранит список снимков (DocumentVersion). Каждый commit() создаёт immutable снимок. checkout() восстанавливает документ из конкретной версии. Это упрощённая модель Git для одного файла.'
    },
    {
      id: 6,
      title: 'Практика: Memento с сериализацией',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте Memento с сохранением в JSON для персистентного хранения на TypeScript.',
      requirements: [
        'Класс FormState с полями: name, email, address, phone',
        'Memento сериализуется в JSON-строку',
        'FormHistory может экспортировать всю историю в JSON и импортировать обратно',
        'Поддержка undo(n) — откат на n шагов',
        'Демонстрация: заполнение формы, сохранение, восстановление'
      ],
      hint: 'JSON.stringify для сериализации, JSON.parse для десериализации. Храните историю как массив JSON-строк.',
      expectedOutput: 'Заполнение формы...\nСостояние: {name:"Иван",email:"ivan@mail.com"}\n💾 Сохранено\nИзменение: {name:"Иван",email:"new@mail.com"}\nUndo: {name:"Иван",email:"ivan@mail.com"}\nЭкспорт: [{"name":"","email":""},{"name":"Иван","email":"ivan@mail.com"}]',
      solution: 'class FormState {\n    name = "";\n    email = "";\n    address = "";\n    phone = "";\n\n    save(): string {\n        return JSON.stringify({ name: this.name, email: this.email, address: this.address, phone: this.phone });\n    }\n\n    restore(memento: string): void {\n        const data = JSON.parse(memento);\n        this.name = data.name;\n        this.email = data.email;\n        this.address = data.address;\n        this.phone = data.phone;\n    }\n\n    toString(): string {\n        return `{name:"${this.name}",email:"${this.email}"}`;\n    }\n}\n\nclass FormHistory {\n    private snapshots: string[] = [];\n\n    push(memento: string): void {\n        this.snapshots.push(memento);\n        console.log("💾 Сохранено");\n    }\n\n    undo(steps: number = 1): string | undefined {\n        for (let i = 0; i < steps && this.snapshots.length > 1; i++) {\n            this.snapshots.pop();\n        }\n        return this.snapshots[this.snapshots.length - 1];\n    }\n\n    exportHistory(): string {\n        return JSON.stringify(this.snapshots.map(s => JSON.parse(s)));\n    }\n\n    importHistory(json: string): void {\n        const data = JSON.parse(json) as any[];\n        this.snapshots = data.map(d => JSON.stringify(d));\n    }\n}\n\nconst form = new FormState();\nconst history = new FormHistory();\n\nconsole.log("Заполнение формы...");\nhistory.push(form.save());\n\nform.name = "Иван";\nform.email = "ivan@mail.com";\nconsole.log("Состояние: " + form.toString());\nhistory.push(form.save());\n\nform.email = "new@mail.com";\nconsole.log("Изменение: " + form.toString());\nhistory.push(form.save());\n\nconst prev = history.undo();\nif (prev) form.restore(prev);\nconsole.log("Undo: " + form.toString());\n\nconsole.log("Экспорт: " + history.exportHistory());',
      explanation: 'Memento сериализуется в JSON-строку, что позволяет сохранять историю в localStorage, IndexedDB или отправлять на сервер. exportHistory/importHistory обеспечивают персистентность между сессиями.'
    }
  ]
}
