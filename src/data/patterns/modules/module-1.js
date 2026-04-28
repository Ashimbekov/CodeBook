export default {
  id: 1,
  title: 'Введение в паттерны проектирования',
  description: 'Зачем нужны паттерны, история GoF, основы UML и классификация паттернов',
  lessons: [
    {
      id: 1,
      title: 'Что такое паттерны проектирования?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Паттерны проектирования (Design Patterns) — это проверенные временем решения типичных проблем, возникающих при проектировании программного обеспечения. Они не являются готовым кодом — это шаблоны, которые описывают подход к решению задачи.' },
        { type: 'heading', value: 'Зачем нужны паттерны?' },
        { type: 'list', items: [
          'Избежание «изобретения велосипеда» — не нужно заново придумывать решения типовых задач',
          'Общий язык — разработчики во всём мире понимают, что значит «используй Singleton» или «примени Observer»',
          'Гибкость кода — паттерны делают код расширяемым и устойчивым к изменениям',
          'Снижение связанности — модули системы становятся более независимыми друг от друга'
        ]},
        { type: 'tip', value: 'Представьте, что паттерны — это как рецепты в кулинарии. Повар не изобретает борщ каждый раз заново, а использует проверенный рецепт, адаптируя его под ситуацию.' },
        { type: 'heading', value: 'История: «Банда четырёх» (GoF)' },
        { type: 'text', value: 'В 1994 году четыре автора — Эрих Гамма, Ричард Хелм, Ральф Джонсон и Джон Влиссидес — опубликовали книгу «Design Patterns: Elements of Reusable Object-Oriented Software». Их прозвали Gang of Four (GoF). Книга описывает 23 классических паттерна, которые до сих пор являются основой проектирования ПО.' },
        { type: 'note', value: 'Паттерны GoF — это не единственные существующие паттерны. Есть архитектурные паттерны (MVC, MVVM), паттерны параллелизма, паттерны интеграции и многие другие. Но GoF-паттерны — это фундамент, с которого стоит начинать.' }
      ]
    },
    {
      id: 2,
      title: 'Классификация паттернов GoF',
      type: 'theory',
      content: [
        { type: 'text', value: 'Все 23 паттерна GoF делятся на три группы в зависимости от их назначения.' },
        { type: 'heading', value: 'Порождающие паттерны (Creational)' },
        { type: 'text', value: 'Отвечают за создание объектов. Они абстрагируют процесс инстанцирования и делают систему независимой от способа создания объектов.' },
        { type: 'list', items: [
          'Singleton — гарантирует единственный экземпляр класса',
          'Factory Method — определяет интерфейс для создания объектов, позволяя подклассам выбирать класс',
          'Abstract Factory — создаёт семейства связанных объектов',
          'Builder — конструирует сложные объекты пошагово',
          'Prototype — создаёт объекты путём клонирования существующих'
        ]},
        { type: 'heading', value: 'Структурные паттерны (Structural)' },
        { type: 'text', value: 'Описывают способы композиции классов и объектов для формирования более крупных структур.' },
        { type: 'list', items: [
          'Adapter — преобразует интерфейс класса к другому интерфейсу',
          'Bridge — разделяет абстракцию и реализацию',
          'Composite — компонует объекты в древовидные структуры',
          'Decorator — динамически добавляет новую функциональность',
          'Facade — предоставляет упрощённый интерфейс к подсистеме',
          'Flyweight — экономит память за счёт разделения общего состояния',
          'Proxy — предоставляет суррогат для контроля доступа к объекту'
        ]},
        { type: 'heading', value: 'Поведенческие паттерны (Behavioral)' },
        { type: 'text', value: 'Описывают алгоритмы и распределение обязанностей между объектами.' },
        { type: 'list', items: [
          'Chain of Responsibility — передаёт запрос по цепочке обработчиков',
          'Command — инкапсулирует запрос как объект',
          'Iterator — последовательный доступ к элементам коллекции',
          'Mediator — уменьшает связанность между компонентами',
          'Memento — сохраняет и восстанавливает состояние объекта',
          'Observer — определяет зависимость «один ко многим»',
          'State — меняет поведение объекта в зависимости от состояния',
          'Strategy — определяет семейство взаимозаменяемых алгоритмов',
          'Template Method — определяет скелет алгоритма',
          'Visitor — добавляет операции без изменения классов',
          'Interpreter — определяет грамматику и интерпретатор для языка'
        ]},
        { type: 'tip', value: 'Не пытайтесь запомнить все 23 паттерна сразу. Начните с самых популярных: Singleton, Factory Method, Observer, Strategy, Decorator. Остальные изучите по мере необходимости.' }
      ]
    },
    {
      id: 3,
      title: 'Основы UML для паттернов',
      type: 'theory',
      content: [
        { type: 'text', value: 'UML (Unified Modeling Language) — это стандартный язык моделирования для визуализации архитектуры программного обеспечения. Для понимания паттернов достаточно знать диаграмму классов.' },
        { type: 'heading', value: 'Диаграмма классов UML' },
        { type: 'text', value: 'Класс в UML изображается прямоугольником, разделённым на три секции: имя класса, атрибуты (поля), методы.' },
        { type: 'code', language: 'text', value: '┌──────────────────────┐\n│       Animal         │  ← Имя класса\n├──────────────────────┤\n│ - name: String       │  ← Атрибуты (поля)\n│ - age: int           │\n├──────────────────────┤\n│ + getName(): String  │  ← Методы\n│ + makeSound(): void  │\n└──────────────────────┘\n\nМодификаторы доступа:\n  + public\n  - private\n  # protected\n  ~ package-private' },
        { type: 'heading', value: 'Типы связей' },
        { type: 'list', items: [
          'Наследование (──▷) — класс расширяет другой класс. Сплошная линия с пустым треугольником',
          'Реализация (--▷) — класс реализует интерфейс. Пунктирная линия с пустым треугольником',
          'Ассоциация (──>) — один класс использует другой. Сплошная линия со стрелкой',
          'Агрегация (◇──>) — «часть-целое», части могут существовать без целого. Пустой ромб',
          'Композиция (◆──>) — «часть-целое», части не существуют без целого. Заполненный ромб',
          'Зависимость (-->) — один класс временно использует другой. Пунктирная линия'
        ]},
        { type: 'code', language: 'java', value: '// Наследование\nclass Dog extends Animal {\n    @Override\n    public void makeSound() {\n        System.out.println("Гав!");\n    }\n}\n\n// Реализация интерфейса\ninterface Flyable {\n    void fly();\n}\n\nclass Bird extends Animal implements Flyable {\n    @Override\n    public void fly() {\n        System.out.println("Лечу!");\n    }\n}\n\n// Композиция\nclass Car {\n    private Engine engine; // Двигатель не существует без машины\n    \n    Car() {\n        this.engine = new Engine();\n    }\n}' },
        { type: 'note', value: 'В каждом паттерне мы будем рисовать схему отношений классов. Знание UML поможет вам быстро понимать структуру паттерна, читая документацию или книги.' }
      ]
    },
    {
      id: 4,
      title: 'Когда применять паттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Паттерны — мощный инструмент, но применять их нужно с умом. Неправильное или чрезмерное использование паттернов может усложнить код вместо того, чтобы упростить его.' },
        { type: 'heading', value: 'Признаки необходимости паттерна' },
        { type: 'list', items: [
          'Код дублируется в нескольких местах — возможно, нужен Template Method или Strategy',
          'Класс стал слишком большим — возможно, нужно разделить ответственности (Facade, Mediator)',
          'Изменение в одном месте ломает другие части системы — высокая связанность (Observer, Mediator)',
          'Сложно добавлять новый функционал — нарушены принципы SOLID (Factory Method, Decorator)',
          'Много условных конструкций (if/else, switch) — возможно, нужен State или Strategy'
        ]},
        { type: 'heading', value: 'Антипаттерн: чрезмерное проектирование (Over-engineering)' },
        { type: 'text', value: 'Одна из самых частых ошибок — применение паттерна «на всякий случай», без реальной необходимости. Это приводит к избыточной сложности кода.' },
        { type: 'code', language: 'java', value: '// ❌ Over-engineering: фабрика для одного класса\ninterface GreeterFactory {\n    Greeter createGreeter();\n}\n\nclass SimpleGreeterFactory implements GreeterFactory {\n    public Greeter createGreeter() {\n        return new SimpleGreeter();\n    }\n}\n\n// ✅ Просто создайте объект напрямую\nGreeter greeter = new SimpleGreeter();' },
        { type: 'warning', value: 'Золотое правило: «Не используй паттерн, пока не столкнулся с проблемой, которую он решает». Паттерн — это решение конкретной проблемы, а не цель сама по себе.' },
        { type: 'heading', value: 'Правило трёх' },
        { type: 'text', value: 'Хорошая эвристика: если вы столкнулись с одной и той же проблемой трижды — самое время применить паттерн. В первый раз решите задачу напрямую, во второй — обратите внимание на дублирование, в третий — рефакторьте с применением паттерна.' },
        { type: 'tip', value: 'Рефакторинг к паттернам (Refactoring to Patterns) — это подход, при котором вы сначала пишете простой код, а затем, когда появляется необходимость, преобразуете его к паттерну. Это намного безопаснее, чем проектирование «наперёд».' }
      ]
    },
    {
      id: 5,
      title: 'Практика: определение паттернов',
      type: 'practice',
      difficulty: 'easy',
      description: 'Определите, к какой категории относится описанная проблема и какой паттерн мог бы её решить.',
      requirements: [
        'Создайте перечисление PatternCategory с тремя значениями: CREATIONAL, STRUCTURAL, BEHAVIORAL',
        'Создайте метод classifyPattern(String patternName), возвращающий категорию паттерна',
        'Метод должен корректно классифицировать: Singleton, Adapter, Observer, Builder, Decorator, Strategy',
        'Для неизвестного паттерна выбросьте IllegalArgumentException'
      ],
      hint: 'Используйте switch или Map для маппинга имён паттернов на категории.',
      expectedOutput: 'Singleton -> CREATIONAL\nAdapter -> STRUCTURAL\nObserver -> BEHAVIORAL\nBuilder -> CREATIONAL\nDecorator -> STRUCTURAL\nStrategy -> BEHAVIORAL',
      solution: 'import java.util.Map;\nimport java.util.HashMap;\n\npublic class PatternClassifier {\n\n    enum PatternCategory {\n        CREATIONAL, STRUCTURAL, BEHAVIORAL\n    }\n\n    private static final Map<String, PatternCategory> PATTERNS = new HashMap<>();\n\n    static {\n        // Порождающие\n        PATTERNS.put("Singleton", PatternCategory.CREATIONAL);\n        PATTERNS.put("Factory Method", PatternCategory.CREATIONAL);\n        PATTERNS.put("Abstract Factory", PatternCategory.CREATIONAL);\n        PATTERNS.put("Builder", PatternCategory.CREATIONAL);\n        PATTERNS.put("Prototype", PatternCategory.CREATIONAL);\n        // Структурные\n        PATTERNS.put("Adapter", PatternCategory.STRUCTURAL);\n        PATTERNS.put("Bridge", PatternCategory.STRUCTURAL);\n        PATTERNS.put("Composite", PatternCategory.STRUCTURAL);\n        PATTERNS.put("Decorator", PatternCategory.STRUCTURAL);\n        PATTERNS.put("Facade", PatternCategory.STRUCTURAL);\n        PATTERNS.put("Flyweight", PatternCategory.STRUCTURAL);\n        PATTERNS.put("Proxy", PatternCategory.STRUCTURAL);\n        // Поведенческие\n        PATTERNS.put("Chain of Responsibility", PatternCategory.BEHAVIORAL);\n        PATTERNS.put("Command", PatternCategory.BEHAVIORAL);\n        PATTERNS.put("Iterator", PatternCategory.BEHAVIORAL);\n        PATTERNS.put("Mediator", PatternCategory.BEHAVIORAL);\n        PATTERNS.put("Memento", PatternCategory.BEHAVIORAL);\n        PATTERNS.put("Observer", PatternCategory.BEHAVIORAL);\n        PATTERNS.put("State", PatternCategory.BEHAVIORAL);\n        PATTERNS.put("Strategy", PatternCategory.BEHAVIORAL);\n        PATTERNS.put("Template Method", PatternCategory.BEHAVIORAL);\n        PATTERNS.put("Visitor", PatternCategory.BEHAVIORAL);\n    }\n\n    public static PatternCategory classifyPattern(String patternName) {\n        PatternCategory category = PATTERNS.get(patternName);\n        if (category == null) {\n            throw new IllegalArgumentException("Неизвестный паттерн: " + patternName);\n        }\n        return category;\n    }\n\n    public static void main(String[] args) {\n        String[] patterns = {"Singleton", "Adapter", "Observer", "Builder", "Decorator", "Strategy"};\n        for (String p : patterns) {\n            System.out.println(p + " -> " + classifyPattern(p));\n        }\n    }\n}',
      explanation: 'Мы использовали Map для хранения соответствия между именами паттернов и их категориями. Это позволяет избежать длинных цепочек if/else и легко расширять список паттернов.'
    },
    {
      id: 6,
      title: 'Практика: анализ кода',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проанализируйте данный код и определите, какие проблемы проектирования в нём есть и какие паттерны могли бы помочь.',
      requirements: [
        'Изучите класс NotificationService, который отправляет уведомления по email, SMS и push',
        'Определите нарушенные принципы SOLID',
        'Предложите рефакторинг с использованием паттерна Strategy',
        'Реализуйте интерфейс NotificationStrategy и три конкретные стратегии'
      ],
      hint: 'Обратите внимание на switch/case в методе send(). Каждый раз при добавлении нового типа уведомления нужно менять этот класс — это нарушает принцип открытости/закрытости (OCP).',
      expectedOutput: 'Email: Отправлено на user@example.com\nSMS: Отправлено на +7-777-123-45-67\nPush: Отправлено уведомление через Firebase',
      solution: '// Интерфейс стратегии\ninterface NotificationStrategy {\n    void send(String recipient, String message);\n}\n\n// Конкретные стратегии\nclass EmailStrategy implements NotificationStrategy {\n    public void send(String recipient, String message) {\n        System.out.println("Email: Отправлено на " + recipient);\n    }\n}\n\nclass SmsStrategy implements NotificationStrategy {\n    public void send(String recipient, String message) {\n        System.out.println("SMS: Отправлено на " + recipient);\n    }\n}\n\nclass PushStrategy implements NotificationStrategy {\n    public void send(String recipient, String message) {\n        System.out.println("Push: Отправлено уведомление через Firebase");\n    }\n}\n\n// Контекст\nclass NotificationService {\n    private NotificationStrategy strategy;\n\n    public NotificationService(NotificationStrategy strategy) {\n        this.strategy = strategy;\n    }\n\n    public void setStrategy(NotificationStrategy strategy) {\n        this.strategy = strategy;\n    }\n\n    public void notify(String recipient, String message) {\n        strategy.send(recipient, message);\n    }\n}\n\n// Использование\npublic class Main {\n    public static void main(String[] args) {\n        NotificationService service = new NotificationService(new EmailStrategy());\n        service.notify("user@example.com", "Привет!");\n\n        service.setStrategy(new SmsStrategy());\n        service.notify("+7-777-123-45-67", "Привет!");\n\n        service.setStrategy(new PushStrategy());\n        service.notify("device-token", "Привет!");\n    }\n}',
      explanation: 'Мы применили паттерн Strategy, чтобы устранить switch/case и нарушение OCP. Теперь для добавления нового типа уведомлений достаточно создать новый класс, реализующий NotificationStrategy, без изменения существующего кода.'
    }
  ]
}
