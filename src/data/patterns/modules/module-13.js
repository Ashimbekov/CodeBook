export default {
  id: 13,
  title: 'Flyweight',
  description: 'Паттерн Flyweight: экономия памяти через разделение общего состояния, кэширование объектов',
  lessons: [
    {
      id: 1,
      title: 'Что такое Flyweight?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Flyweight (Легковес) — структурный паттерн, экономящий память за счёт разделения общего состояния между множеством объектов. Вместо хранения полных данных в каждом объекте, общие данные выносятся в разделяемые объекты.' },
        { type: 'heading', value: 'Внутреннее vs Внешнее состояние' },
        { type: 'list', items: [
          'Внутреннее (intrinsic) — неизменяемые данные, общие для многих объектов. Хранятся в Flyweight. Пример: шрифт, текстура, спрайт',
          'Внешнее (extrinsic) — уникальные данные, специфичные для каждого контекста. Передаются извне. Пример: координаты, размер, состояние'
        ]},
        { type: 'heading', value: 'Когда использовать?' },
        { type: 'list', items: [
          'Программа создаёт огромное количество похожих объектов',
          'Объекты съедают всю доступную память',
          'Большая часть состояния объектов может быть вынесена',
          'Игры (частицы, деревья, пули), текстовые редакторы (символы)'
        ]},
        { type: 'note', value: 'Flyweight жертвует процессорным временем (пересчёт/передача внешнего состояния) ради экономии памяти. Используйте, когда память — реальный bottleneck.' }
      ]
    },
    {
      id: 2,
      title: 'Реализация на Java: игровой лес',
      type: 'theory',
      content: [
        { type: 'code', language: 'java', value: '// Flyweight — разделяемые данные дерева (текстура, цвет)\nclass TreeType {\n    private final String name;\n    private final String color;\n    private final String texture; // Большой объект!\n\n    TreeType(String name, String color, String texture) {\n        this.name = name;\n        this.color = color;\n        this.texture = texture;\n    }\n\n    void draw(int x, int y) {\n        System.out.printf("Рисую %s (%s) в [%d, %d]%n", name, color, x, y);\n    }\n}\n\n// Фабрика Flyweight — кэширует и переиспользует\nclass TreeFactory {\n    private static final Map<String, TreeType> cache = new HashMap<>();\n\n    static TreeType getTreeType(String name, String color, String texture) {\n        String key = name + "_" + color;\n        return cache.computeIfAbsent(key, k -> {\n            System.out.println("🌱 Создан новый тип: " + name + " " + color);\n            return new TreeType(name, color, texture);\n        });\n    }\n\n    static int getCacheSize() { return cache.size(); }\n}\n\n// Контекст — уникальные данные (координаты)\nclass Tree {\n    private final int x, y;\n    private final TreeType type; // Ссылка на разделяемый Flyweight\n\n    Tree(int x, int y, TreeType type) {\n        this.x = x;\n        this.y = y;\n        this.type = type;\n    }\n\n    void draw() { type.draw(x, y); }\n}\n\n// Лес — содержит тысячи деревьев\nclass Forest {\n    private final List<Tree> trees = new ArrayList<>();\n\n    void plantTree(int x, int y, String name, String color, String texture) {\n        TreeType type = TreeFactory.getTreeType(name, color, texture);\n        trees.add(new Tree(x, y, type));\n    }\n\n    void draw() {\n        trees.forEach(Tree::draw);\n    }\n\n    int getTreeCount() { return trees.size(); }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        Forest forest = new Forest();\n        Random rand = new Random();\n\n        // Сажаем 1000 деревьев только 3 типов!\n        String[][] types = {\n            {"Дуб", "зелёный", "oak.png"},\n            {"Берёза", "белый", "birch.png"},\n            {"Ель", "тёмно-зелёный", "spruce.png"}\n        };\n\n        for (int i = 0; i < 1000; i++) {\n            String[] t = types[rand.nextInt(3)];\n            forest.plantTree(rand.nextInt(1000), rand.nextInt(1000), t[0], t[1], t[2]);\n        }\n\n        System.out.println("Деревьев: " + forest.getTreeCount());\n        System.out.println("Типов (Flyweight): " + TreeFactory.getCacheSize());\n        // 1000 деревьев, но только 3 объекта TreeType в памяти!\n    }\n}' },
        { type: 'tip', value: '1000 деревьев с текстурами по 1 МБ каждая = 1 ГБ памяти. С Flyweight — всего 3 МБ (3 типа). Экономия: 99.7%!' }
      ]
    },
    {
      id: 3,
      title: 'Flyweight на TypeScript',
      type: 'theory',
      content: [
        { type: 'code', language: 'typescript', value: '// Flyweight для текстового редактора\nclass CharacterStyle {\n    constructor(\n        public readonly font: string,\n        public readonly size: number,\n        public readonly bold: boolean,\n        public readonly italic: boolean,\n        public readonly color: string\n    ) {}\n\n    getKey(): string {\n        return `${this.font}_${this.size}_${this.bold}_${this.italic}_${this.color}`;\n    }\n}\n\nclass StyleFactory {\n    private static cache = new Map<string, CharacterStyle>();\n\n    static getStyle(font: string, size: number, bold: boolean,\n                    italic: boolean, color: string): CharacterStyle {\n        const key = `${font}_${size}_${bold}_${italic}_${color}`;\n        if (!StyleFactory.cache.has(key)) {\n            StyleFactory.cache.set(key, new CharacterStyle(font, size, bold, italic, color));\n        }\n        return StyleFactory.cache.get(key)!;\n    }\n\n    static getCacheSize(): number { return StyleFactory.cache.size; }\n}\n\nclass Character {\n    constructor(\n        public readonly char: string,        // Уникальное\n        public readonly position: number,     // Уникальное\n        public readonly style: CharacterStyle // Разделяемое (Flyweight)\n    ) {}\n\n    render(): string {\n        return `[${this.char}] pos:${this.position} font:${this.style.font} size:${this.style.size}`;\n    }\n}\n\n// Использование\nconst doc: Character[] = [];\nconst normalStyle = StyleFactory.getStyle("Arial", 12, false, false, "#000");\nconst boldStyle = StyleFactory.getStyle("Arial", 12, true, false, "#000");\nconst headingStyle = StyleFactory.getStyle("Arial", 24, true, false, "#333");\n\nconst text = "Привет, мир!";\nfor (let i = 0; i < text.length; i++) {\n    doc.push(new Character(text[i], i, i < 7 ? normalStyle : boldStyle));\n}\n\nconsole.log(`Символов: ${doc.length}`);\nconsole.log(`Стилей в кэше: ${StyleFactory.getCacheSize()}`);\nconsole.log(doc.map(c => c.render()).join("\\n"));' },
        { type: 'note', value: 'В реальном текстовом редакторе миллионы символов, но типов форматирования — десятки. Flyweight позволяет хранить стиль один раз, а каждый символ хранит только ссылку.' }
      ]
    },
    {
      id: 4,
      title: 'Практика: кэш спрайтов для игры',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему кэширования спрайтов для 2D-игры с помощью Flyweight.',
      requirements: [
        'Класс Sprite (Flyweight) — изображение, ширина, высота',
        'Класс SpriteFactory — кэширует спрайты по имени',
        'Класс GameObject — позиция (x, y), спрайт (ссылка на Flyweight), скорость',
        'Создайте 100 врагов трёх типов и 50 снарядов одного типа',
        'Покажите экономию памяти: сколько объектов vs сколько спрайтов'
      ],
      hint: 'SpriteFactory использует Map для кэширования. Все враги одного типа разделяют один Sprite.',
      expectedOutput: 'Создано объектов: 150\nСпрайтов в кэше: 4\nБез Flyweight: 150 спрайтов в памяти\nС Flyweight: 4 спрайта в памяти',
      solution: 'class Sprite {\n    constructor(\n        public readonly name: string,\n        public readonly width: number,\n        public readonly height: number,\n        public readonly imageData: string\n    ) {\n        console.log(`🎨 Загружен спрайт: ${name} (${width}x${height})`);\n    }\n}\n\nclass SpriteFactory {\n    private static cache = new Map<string, Sprite>();\n\n    static getSprite(name: string, w: number, h: number): Sprite {\n        if (!SpriteFactory.cache.has(name)) {\n            SpriteFactory.cache.set(name, new Sprite(name, w, h, `data_${name}`));\n        }\n        return SpriteFactory.cache.get(name)!;\n    }\n\n    static getCacheSize(): number { return SpriteFactory.cache.size; }\n}\n\nclass GameObject {\n    constructor(\n        public x: number,\n        public y: number,\n        public sprite: Sprite,\n        public speedX: number = 0,\n        public speedY: number = 0\n    ) {}\n\n    render(): void {\n        // Использует разделяемый спрайт\n    }\n}\n\nconst objects: GameObject[] = [];\n\n// 100 врагов трёх типов\nfor (let i = 0; i < 40; i++) {\n    objects.push(new GameObject(Math.random() * 800, Math.random() * 600,\n        SpriteFactory.getSprite("goblin", 32, 32)));\n}\nfor (let i = 0; i < 35; i++) {\n    objects.push(new GameObject(Math.random() * 800, Math.random() * 600,\n        SpriteFactory.getSprite("skeleton", 32, 48)));\n}\nfor (let i = 0; i < 25; i++) {\n    objects.push(new GameObject(Math.random() * 800, Math.random() * 600,\n        SpriteFactory.getSprite("dragon", 64, 64)));\n}\n\n// 50 снарядов\nfor (let i = 0; i < 50; i++) {\n    objects.push(new GameObject(Math.random() * 800, Math.random() * 600,\n        SpriteFactory.getSprite("fireball", 16, 16), 5, 0));\n}\n\nconsole.log(`\\nСоздано объектов: ${objects.length}`);\nconsole.log(`Спрайтов в кэше: ${SpriteFactory.getCacheSize()}`);\nconsole.log(`Без Flyweight: ${objects.length} спрайтов в памяти`);\nconsole.log(`С Flyweight: ${SpriteFactory.getCacheSize()} спрайта в памяти`);',
      explanation: '150 игровых объектов разделяют всего 4 спрайта. Если каждый спрайт весит 1 МБ, экономия: 150 МБ → 4 МБ. Flyweight — must-have для игровых движков и систем с большим количеством однотипных объектов.'
    },
    {
      id: 5,
      title: 'Практика: Flyweight для карты на Java',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте систему отображения карты с тайлами (плитками) через Flyweight.',
      requirements: [
        'Класс Tile (Flyweight) — тип тайла (трава, вода, камень, песок), текстура',
        'Класс TileFactory — кэш тайлов',
        'Класс MapCell — позиция (row, col) + ссылка на Tile',
        'Класс GameMap — двумерный массив MapCell',
        'Создайте карту 100x100 и покажите статистику использования памяти'
      ],
      hint: 'Карта 100x100 = 10000 ячеек, но типов тайлов всего 4. Каждый тайл хранит текстуру один раз.',
      expectedOutput: 'Карта создана: 100x100 = 10000 ячеек\nТипов тайлов: 4\nТрава: 5023, Вода: 2511, Камень: 1245, Песок: 1221\nЭкономия памяти: ~99.96%',
      solution: 'import java.util.*;\n\nclass Tile {\n    private final String type;\n    private final String texture;\n    private final boolean walkable;\n\n    Tile(String type, String texture, boolean walkable) {\n        this.type = type;\n        this.texture = texture;\n        this.walkable = walkable;\n    }\n\n    String getType() { return type; }\n    void render(int row, int col) { /* использует texture */ }\n}\n\nclass TileFactory {\n    private static final Map<String, Tile> tiles = new HashMap<>();\n\n    static Tile getTile(String type) {\n        return tiles.computeIfAbsent(type, t -> {\n            switch (t) {\n                case "grass": return new Tile("Трава", "grass.png", true);\n                case "water": return new Tile("Вода", "water.png", false);\n                case "stone": return new Tile("Камень", "stone.png", true);\n                case "sand": return new Tile("Песок", "sand.png", true);\n                default: return new Tile(t, "default.png", true);\n            }\n        });\n    }\n\n    static int cacheSize() { return tiles.size(); }\n}\n\nclass MapCell {\n    int row, col;\n    Tile tile;\n    MapCell(int row, int col, Tile tile) {\n        this.row = row; this.col = col; this.tile = tile;\n    }\n}\n\nclass GameMap {\n    MapCell[][] cells;\n\n    GameMap(int rows, int cols) {\n        cells = new MapCell[rows][cols];\n        Random rand = new Random();\n        String[] types = {"grass", "water", "stone", "sand"};\n        double[] weights = {0.5, 0.25, 0.125, 0.125};\n\n        for (int r = 0; r < rows; r++) {\n            for (int c = 0; c < cols; c++) {\n                double val = rand.nextDouble();\n                String type = val < 0.5 ? "grass" : val < 0.75 ? "water" : val < 0.875 ? "stone" : "sand";\n                cells[r][c] = new MapCell(r, c, TileFactory.getTile(type));\n            }\n        }\n    }\n\n    void printStats() {\n        Map<String, Integer> counts = new HashMap<>();\n        for (MapCell[] row : cells)\n            for (MapCell cell : row)\n                counts.merge(cell.tile.getType(), 1, Integer::sum);\n\n        int total = cells.length * cells[0].length;\n        System.out.println("Карта создана: " + cells.length + "x" + cells[0].length + " = " + total + " ячеек");\n        System.out.println("Типов тайлов: " + TileFactory.cacheSize());\n        counts.forEach((type, count) -> System.out.println(type + ": " + count));\n    }\n}\n\npublic class Main {\n    public static void main(String[] args) {\n        GameMap map = new GameMap(100, 100);\n        map.printStats();\n    }\n}',
      explanation: '10000 ячеек карты разделяют всего 4 объекта Tile. Текстуры загружаются один раз. Без Flyweight каждая ячейка хранила бы свою копию текстуры. Экономия особенно заметна для больших карт.'
    },
    {
      id: 6,
      title: 'Практика: String Pool как Flyweight',
      type: 'practice',
      difficulty: 'easy',
      description: 'Реализуйте собственный StringPool — классический пример Flyweight.',
      requirements: [
        'Класс StringPool с методом intern(value: string): string',
        'intern() возвращает закэшированную строку, если она уже есть',
        'Метод stats() показывает количество уникальных строк и общее число обращений',
        'Обработайте массив из 10000 строк с ограниченным набором уникальных значений',
        'Покажите разницу в количестве объектов'
      ],
      hint: 'Map<string, string> для кэша. intern() проверяет наличие строки и возвращает из кэша или добавляет новую.',
      expectedOutput: 'Обработано строк: 10000\nУникальных в пуле: 5\nБез пула: 10000 объектов\nС пулом: 5 объектов',
      solution: 'class StringPool {\n    private pool = new Map<string, string>();\n    private totalRequests = 0;\n\n    intern(value: string): string {\n        this.totalRequests++;\n        if (!this.pool.has(value)) {\n            this.pool.set(value, value);\n        }\n        return this.pool.get(value)!;\n    }\n\n    stats(): { unique: number; total: number } {\n        return { unique: this.pool.size, total: this.totalRequests };\n    }\n}\n\nconst pool = new StringPool();\nconst statuses = ["ACTIVE", "INACTIVE", "PENDING", "BLOCKED", "DELETED"];\n\nfor (let i = 0; i < 10000; i++) {\n    const status = statuses[Math.floor(Math.random() * statuses.length)];\n    pool.intern(status);\n}\n\nconst { unique, total } = pool.stats();\nconsole.log(`Обработано строк: ${total}`);\nconsole.log(`Уникальных в пуле: ${unique}`);\nconsole.log(`Без пула: ${total} объектов`);\nconsole.log(`С пулом: ${unique} объектов`);',
      explanation: 'Java String.intern() работает именно так — хранит пул уникальных строк. 10000 обращений, но в памяти всего 5 строк. Это базовая идея Flyweight: разделение общего неизменяемого состояния.'
    }
  ]
}
