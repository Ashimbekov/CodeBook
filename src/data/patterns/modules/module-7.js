export default {
  id: 7,
  title: 'Prototype',
  description: 'Паттерн Prototype: клонирование объектов, deep copy vs shallow copy, реестр прототипов',
  lessons: [
    {
      id: 1,
      title: 'Что такое Prototype?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Prototype (Прототип) — порождающий паттерн, который позволяет создавать новые объекты путём копирования (клонирования) существующих, без привязки к их конкретным классам.' },
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Создание объекта «с нуля» дорого (загрузка из БД, сложная инициализация)',
          'Нужно создать объект, не зная его точного типа (полиморфное клонирование)',
          'Нужно множество похожих объектов с небольшими различиями',
          'Хотите избежать иерархии фабрик для создания объектов'
        ]},
        { type: 'heading', value: 'Shallow Copy vs Deep Copy' },
        { type: 'code', language: 'java', value: '// Shallow Copy — копируются ссылки, а не объекты\nclass Document {\n    String title;\n    List<String> pages; // Ссылка на тот же список!\n}\n\nDocument original = new Document();\noriginal.pages = new ArrayList<>(List.of("Стр. 1", "Стр. 2"));\n\nDocument shallow = original; // Не клон — та же ссылка!\nshallow.pages.add("Стр. 3");\n// original.pages тоже содержит "Стр. 3"!\n\n// Deep Copy — создаются новые объекты\nDocument deep = new Document();\ndeep.title = original.title;\ndeep.pages = new ArrayList<>(original.pages); // Новый список!\ndeep.pages.add("Стр. 4");\n// original.pages НЕ содержит "Стр. 4"' },
        { type: 'warning', value: 'Shallow copy — частая причина коварных багов. Два объекта «думают», что у них свои данные, но на самом деле разделяют один и тот же вложенный объект.' }
      ]
    },
    {
      id: 2,
      title: 'Prototype в Java: Cloneable',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Java для клонирования есть встроенный интерфейс Cloneable и метод clone(). Однако у него есть недостатки — лучше реализовать собственный метод копирования.' },
        { type: 'heading', value: 'Через Cloneable (стандартный подход)' },
        { type: 'code', language: 'java', value: 'public class Shape implements Cloneable {\n    private String color;\n    private int x, y;\n\n    public Shape(String color, int x, int y) {\n        this.color = color;\n        this.x = x;\n        this.y = y;\n    }\n\n    @Override\n    public Shape clone() {\n        try {\n            return (Shape) super.clone(); // Shallow copy\n        } catch (CloneNotSupportedException e) {\n            throw new RuntimeException(e);\n        }\n    }\n\n    @Override\n    public String toString() {\n        return getClass().getSimpleName() + " [" + color + "] at (" + x + "," + y + ")";\n    }\n}\n\nclass Circle extends Shape {\n    private int radius;\n\n    public Circle(String color, int x, int y, int radius) {\n        super(color, x, y);\n        this.radius = radius;\n    }\n\n    @Override\n    public Circle clone() {\n        return (Circle) super.clone();\n    }\n}' },
        { type: 'heading', value: 'Через copy-конструктор (рекомендуемый подход)' },
        { type: 'code', language: 'java', value: 'public abstract class Shape {\n    protected String color;\n    protected int x, y;\n\n    public Shape(String color, int x, int y) {\n        this.color = color;\n        this.x = x;\n        this.y = y;\n    }\n\n    // Copy-конструктор\n    protected Shape(Shape source) {\n        this.color = source.color;\n        this.x = source.x;\n        this.y = source.y;\n    }\n\n    // Абстрактный метод клонирования\n    public abstract Shape copy();\n}\n\nclass Rectangle extends Shape {\n    private int width, height;\n\n    public Rectangle(String color, int x, int y, int width, int height) {\n        super(color, x, y);\n        this.width = width;\n        this.height = height;\n    }\n\n    private Rectangle(Rectangle source) {\n        super(source);\n        this.width = source.width;\n        this.height = source.height;\n    }\n\n    @Override\n    public Shape copy() {\n        return new Rectangle(this);\n    }\n}\n\n// Полиморфное клонирование\nShape original = new Rectangle("red", 10, 20, 100, 50);\nShape clone = original.copy(); // Не знаем конкретный тип!' },
        { type: 'tip', value: 'Copy-конструктор — более безопасный и контролируемый подход, чем Cloneable. Вы явно указываете, какие поля копировать и как.' }
      ]
    },
    {
      id: 3,
      title: 'Prototype в TypeScript',
      type: 'theory',
      content: [
        { type: 'text', value: 'В TypeScript нет встроенного Cloneable, но клонирование реализуется через spread-оператор, structuredClone или явные методы.' },
        { type: 'code', language: 'typescript', value: 'interface Prototype<T> {\n    clone(): T;\n}\n\nclass GameCharacter implements Prototype<GameCharacter> {\n    constructor(\n        public name: string,\n        public health: number,\n        public attack: number,\n        public skills: string[],\n        public inventory: Map<string, number>\n    ) {}\n\n    clone(): GameCharacter {\n        return new GameCharacter(\n            this.name,\n            this.health,\n            this.attack,\n            [...this.skills],                      // Deep copy массива\n            new Map(this.inventory)                 // Deep copy Map\n        );\n    }\n\n    toString(): string {\n        return `${this.name} (HP:${this.health}, ATK:${this.attack}, skills:${this.skills.join(",")})`;   \n    }\n}\n\n// Создаём шаблон воина\nconst warriorTemplate = new GameCharacter(\n    "Воин", 100, 25,\n    ["Удар мечом", "Блок щитом"],\n    new Map([[" зелье здоровья", 3], ["меч", 1]])\n);\n\n// Клонируем и кастомизируем\nconst warrior1 = warriorTemplate.clone();\nwarrior1.name = "Артур";\nwarrior1.skills.push("Вихрь");\n\nconst warrior2 = warriorTemplate.clone();\nwarrior2.name = "Ланселот";\nwarrior2.attack = 30;\n\nconsole.log(warriorTemplate.toString());\n// Воин (HP:100, ATK:25, skills:Удар мечом,Блок щитом)\nconsole.log(warrior1.toString());\n// Артур (HP:100, ATK:25, skills:Удар мечом,Блок щитом,Вихрь)\nconsole.log(warrior2.toString());\n// Ланселот (HP:100, ATK:30, skills:Удар мечом,Блок щитом)' },
        { type: 'heading', value: 'structuredClone (современный JS)' },
        { type: 'code', language: 'typescript', value: '// structuredClone — встроенная deep copy в современных браузерах и Node.js\nconst original = {\n    name: "Конфигурация",\n    settings: { theme: "dark", lang: "ru" },\n    plugins: ["auth", "cache"]\n};\n\nconst copy = structuredClone(original);\ncopy.settings.theme = "light";\ncopy.plugins.push("logging");\n\nconsole.log(original.settings.theme); // "dark" — не изменился!\nconsole.log(original.plugins);         // ["auth", "cache"] — не изменился!' },
        { type: 'note', value: 'structuredClone не клонирует функции, DOM-элементы и некоторые другие типы. Для сложных объектов с методами используйте явный метод clone().' }
      ]
    },
    {
      id: 4,
      title: 'Реестр прототипов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реестр прототипов (Prototype Registry) — хранилище заготовленных прототипов, которые можно клонировать по ключу. Часто используется в играх и редакторах.' },
        { type: 'code', language: 'java', value: 'public class ShapeRegistry {\n    private final Map<String, Shape> prototypes = new HashMap<>();\n\n    public void register(String key, Shape prototype) {\n        prototypes.put(key, prototype);\n    }\n\n    public Shape create(String key) {\n        Shape prototype = prototypes.get(key);\n        if (prototype == null) {\n            throw new IllegalArgumentException("Прототип не найден: " + key);\n        }\n        return prototype.copy();\n    }\n}\n\n// Предзаполняем реестр\nShapeRegistry registry = new ShapeRegistry();\nregistry.register("red-circle", new Circle("red", 0, 0, 50));\nregistry.register("blue-rect", new Rectangle("blue", 0, 0, 100, 50));\nregistry.register("green-circle", new Circle("green", 0, 0, 30));\n\n// Создаём объекты из прототипов\nShape s1 = registry.create("red-circle");   // Клон красного круга\nShape s2 = registry.create("red-circle");   // Ещё один клон\nShape s3 = registry.create("blue-rect");    // Клон синего прямоугольника' },
        { type: 'tip', value: 'Реестр прототипов отлично подходит для игровых объектов: враги, снаряды, бонусы. Вы создаёте «шаблоны» один раз, а потом клонируете их тысячами.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: система документов с клонированием',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему шаблонов документов с использованием Prototype.',
      requirements: [
        'Абстрактный класс Document с методом clone()',
        'Классы: Resume, Contract, Invoice — каждый с уникальными полями',
        'Реестр DocumentRegistry для хранения шаблонов',
        'Deep copy для вложенных объектов (список секций в резюме)',
        'Демонстрация клонирования и модификации без влияния на оригинал'
      ],
      hint: 'Каждый тип документа должен иметь copy-конструктор. Не забудьте создать новые экземпляры для вложенных коллекций.',
      expectedOutput: 'Шаблон: Резюме [Стандарт] — секции: Опыт, Образование\nКлон: Резюме [Алексей Иванов] — секции: Опыт, Образование, Навыки\nШаблон не изменился: Резюме [Стандарт] — секции: Опыт, Образование',
      solution: 'import java.util.*;\n\nabstract class Document {\n    protected String title;\n    protected String author;\n\n    public Document(String title, String author) {\n        this.title = title;\n        this.author = author;\n    }\n\n    protected Document(Document source) {\n        this.title = source.title;\n        this.author = source.author;\n    }\n\n    public abstract Document copy();\n    public void setTitle(String t) { this.title = t; }\n    public void setAuthor(String a) { this.author = a; }\n}\n\nclass Resume extends Document {\n    private List<String> sections;\n\n    public Resume(String title, String author, List<String> sections) {\n        super(title, author);\n        this.sections = new ArrayList<>(sections);\n    }\n\n    private Resume(Resume source) {\n        super(source);\n        this.sections = new ArrayList<>(source.sections); // Deep copy\n    }\n\n    public Document copy() { return new Resume(this); }\n    public void addSection(String s) { sections.add(s); }\n\n    public String toString() {\n        return "Резюме [" + title + "] — секции: " + String.join(", ", sections);\n    }\n}\n\nclass DocumentRegistry {\n    private Map<String, Document> templates = new HashMap<>();\n\n    public void register(String key, Document doc) { templates.put(key, doc); }\n\n    public Document create(String key) {\n        Document doc = templates.get(key);\n        if (doc == null) throw new IllegalArgumentException("Шаблон не найден: " + key);\n        return doc.copy();\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        DocumentRegistry registry = new DocumentRegistry();\n        Resume template = new Resume("Стандарт", "Система", List.of("Опыт", "Образование"));\n        registry.register("resume", template);\n\n        System.out.println("Шаблон: " + template);\n\n        Resume clone = (Resume) registry.create("resume");\n        clone.setTitle("Алексей Иванов");\n        clone.addSection("Навыки");\n        System.out.println("Клон: " + clone);\n        System.out.println("Шаблон не изменился: " + template);\n    }\n}',
      explanation: 'Copy-конструктор Resume создаёт новый ArrayList, обеспечивая deep copy. Изменение клона (добавление секции «Навыки») не затрагивает оригинальный шаблон. Реестр позволяет хранить шаблоны и создавать клоны по ключу.'
    },
    {
      id: 6,
      title: 'Практика: Prototype для игровых объектов на TypeScript',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте систему прототипов для игровых сущностей: Enemy, Weapon, Potion.',
      requirements: [
        'Интерфейс Cloneable<T> с методом clone(): T',
        'Класс Enemy с полями: name, hp, attack, abilities (string[])',
        'Класс Weapon с полями: name, damage, durability, enchantments (Map)',
        'Реестр прототипов PrototypeRegistry<T>',
        'Создайте шаблоны: Goblin, Dragon и клонируйте их с модификациями'
      ],
      hint: 'В clone() создавайте новые массивы через spread [...arr] и новые Map через new Map(original). Реестр — generic-класс с Map<string, T>.',
      expectedOutput: 'Goblin (HP:30, ATK:5, abilities: [Удар, Укус])\nGoblin Warrior (HP:50, ATK:10, abilities: [Удар, Укус, Блок])\nDragon (HP:500, ATK:80, abilities: [Огненное дыхание, Полёт, Хвостом])\nOriginal Goblin unchanged: (HP:30, ATK:5, abilities: [Удар, Укус])',
      solution: 'interface Cloneable<T> {\n    clone(): T;\n}\n\nclass Enemy implements Cloneable<Enemy> {\n    constructor(\n        public name: string,\n        public hp: number,\n        public attack: number,\n        public abilities: string[]\n    ) {}\n\n    clone(): Enemy {\n        return new Enemy(\n            this.name,\n            this.hp,\n            this.attack,\n            [...this.abilities]\n        );\n    }\n\n    toString(): string {\n        return `${this.name} (HP:${this.hp}, ATK:${this.attack}, abilities: [${this.abilities.join(", ")}])`;\n    }\n}\n\nclass PrototypeRegistry<T extends Cloneable<T>> {\n    private prototypes = new Map<string, T>();\n\n    register(key: string, prototype: T): void {\n        this.prototypes.set(key, prototype);\n    }\n\n    create(key: string): T {\n        const proto = this.prototypes.get(key);\n        if (!proto) throw new Error(`Прототип не найден: ${key}`);\n        return proto.clone();\n    }\n}\n\n// Создаём реестр\nconst enemies = new PrototypeRegistry<Enemy>();\nenemies.register("goblin", new Enemy("Goblin", 30, 5, ["Удар", "Укус"]));\nenemies.register("dragon", new Enemy("Dragon", 500, 80, ["Огненное дыхание", "Полёт", "Хвостом"]));\n\n// Клонируем и модифицируем\nconst goblin = enemies.create("goblin");\nconsole.log(goblin.toString());\n\nconst goblinWarrior = enemies.create("goblin");\ngoblinWarrior.name = "Goblin Warrior";\ngoblinWarrior.hp = 50;\ngoblinWarrior.attack = 10;\ngoblinWarrior.abilities.push("Блок");\nconsole.log(goblinWarrior.toString());\n\nconst dragon = enemies.create("dragon");\nconsole.log(dragon.toString());\n\n// Проверяем, что оригинал не изменился\nconst originalGoblin = enemies.create("goblin");\nconsole.log("Original Goblin unchanged: " + `(HP:${originalGoblin.hp}, ATK:${originalGoblin.attack}, abilities: [${originalGoblin.abilities.join(", ")}])`);',
      explanation: 'Generic PrototypeRegistry<T> хранит шаблоны и клонирует их по ключу. Deep copy через spread-оператор для массивов гарантирует, что изменение клона не повлияет на шаблон. Это идеальный подход для создания множества похожих игровых объектов.'
    }
  ]
}
