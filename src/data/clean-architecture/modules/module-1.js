export default {
  id: 1,
  title: 'Введение в архитектуру ПО',
  description: 'Зачем нужна архитектура, coupling и cohesion, архитектурные trade-offs и как принимать решения при проектировании систем.',
  lessons: [
    {
      id: 1,
      title: 'Что такое архитектура программного обеспечения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Архитектура программного обеспечения — это набор высокоуровневых решений о структуре системы: как разделить код на компоненты, как они взаимодействуют друг с другом, и какие принципы определяют эволюцию системы.' },
        { type: 'heading', value: 'Зачем нужна архитектура?' },
        { type: 'text', value: 'Без продуманной архитектуры любой проект с ростом превращается в неуправляемый хаос. Код становится трудно менять, тестировать и масштабировать. Архитектура — это инвестиция в будущее проекта.' },
        { type: 'list', value: [
          'Управляемость — код легко понимать и модифицировать',
          'Тестируемость — компоненты можно тестировать изолированно',
          'Масштабируемость — систему можно расширять без переписывания',
          'Командная работа — разные команды могут работать параллельно',
          'Снижение стоимости изменений — изменения не ломают всю систему'
        ]},
        { type: 'heading', value: 'Архитектура vs Дизайн' },
        { type: 'text', value: 'Архитектура — это стратегические решения (какие слои, как общаются модули, какие протоколы). Дизайн — тактические решения (какие паттерны использовать в конкретном классе, как назвать метод). На практике граница размыта, но архитектурные решения дороже менять.' },
        { type: 'tip', value: 'Роберт Мартин говорит: "Цель архитектуры — минимизировать человеческие ресурсы, необходимые для создания и поддержки системы". Хорошая архитектура делает разработку дешевле со временем, а не дороже.' }
      ]
    },
    {
      id: 2,
      title: 'Coupling и Cohesion',
      type: 'theory',
      content: [
        { type: 'text', value: 'Coupling (связанность) и Cohesion (связность) — два фундаментальных метрических понятия, определяющих качество архитектуры. Хорошая архитектура стремится к низкой связанности и высокой связности.' },
        { type: 'heading', value: 'Coupling (Связанность)' },
        { type: 'text', value: 'Степень зависимости одного модуля от другого. Высокий coupling означает, что изменение в одном модуле вынуждает менять другие модули.' },
        { type: 'code', language: 'java', value: '// Высокий coupling — OrderService напрямую зависит от конкретной БД\npublic class OrderService {\n    private MySQLConnection db = new MySQLConnection("localhost:3306");\n    \n    public void createOrder(Order order) {\n        db.execute("INSERT INTO orders ...");\n        // Если захотим сменить БД — придётся переписывать этот класс\n    }\n}\n\n// Низкий coupling — зависимость через абстракцию\npublic class OrderService {\n    private final OrderRepository repository;\n    \n    public OrderService(OrderRepository repository) {\n        this.repository = repository;\n    }\n    \n    public void createOrder(Order order) {\n        repository.save(order);\n        // Можем подменить реализацию без изменения этого класса\n    }\n}' },
        { type: 'heading', value: 'Cohesion (Связность)' },
        { type: 'text', value: 'Степень, в которой элементы внутри модуля принадлежат друг другу. Высокая связность означает, что все методы класса работают с одними и теми же данными и решают одну задачу.' },
        { type: 'code', language: 'java', value: '// Низкая cohesion — класс делает слишком много разных вещей\npublic class UserManager {\n    public void createUser(User user) { ... }\n    public void sendEmail(String to, String body) { ... }\n    public void generateReport(List<User> users) { ... }\n    public void backupDatabase() { ... }\n}\n\n// Высокая cohesion — каждый класс отвечает за свою область\npublic class UserService {\n    public void createUser(User user) { ... }\n    public User findById(Long id) { ... }\n}\n\npublic class EmailService {\n    public void sendEmail(String to, String body) { ... }\n}' },
        { type: 'note', value: 'Запомните формулу: Low Coupling + High Cohesion = Good Architecture. Это основной принцип, к которому стремятся все архитектурные стили.' }
      ]
    },
    {
      id: 3,
      title: 'Архитектурные trade-offs',
      type: 'theory',
      content: [
        { type: 'text', value: 'В архитектуре не существует идеальных решений. Каждое решение — это компромисс (trade-off). Задача архитектора — выбрать компромисс, наиболее подходящий для конкретного проекта.' },
        { type: 'heading', value: 'Типичные trade-offs' },
        { type: 'list', value: [
          'Простота vs Гибкость — простой код легче понять, но сложнее расширить',
          'Производительность vs Читаемость — оптимизированный код часто менее понятен',
          'Консистентность vs Доступность — CAP-теорема в распределённых системах',
          'DRY vs Decoupling — общий код создаёт зависимости между модулями',
          'Монолит vs Микросервисы — простота деплоя vs независимость компонентов'
        ]},
        { type: 'heading', value: 'Как принимать архитектурные решения' },
        { type: 'text', value: 'Хороший архитектор не выбирает технологию или подход "потому что модно". Он анализирует контекст: требования бизнеса, размер команды, опыт разработчиков, бюджет и сроки.' },
        { type: 'code', language: 'typescript', value: '// Пример trade-off: прямой вызов vs событие\n\n// Вариант 1: Прямой вызов — просто, но высокий coupling\nclass OrderService {\n  constructor(private emailService: EmailService) {}\n  \n  createOrder(order: Order): void {\n    this.saveOrder(order);\n    this.emailService.sendConfirmation(order); // прямая зависимость\n  }\n}\n\n// Вариант 2: Событие — сложнее, но низкий coupling\nclass OrderService {\n  constructor(private eventBus: EventBus) {}\n  \n  createOrder(order: Order): void {\n    this.saveOrder(order);\n    this.eventBus.publish(new OrderCreatedEvent(order)); // никакой зависимости от email\n  }\n}' },
        { type: 'warning', value: 'Не усложняйте архитектуру "на будущее". YAGNI (You Aren\'t Gonna Need It) — мощный принцип. Добавляйте абстракции, когда в них есть реальная потребность, а не "на всякий случай".' }
      ]
    },
    {
      id: 4,
      title: 'Обзор архитектурных стилей',
      type: 'theory',
      content: [
        { type: 'text', value: 'За десятилетия развития индустрии сформировалось несколько основных архитектурных стилей. Каждый стиль определяет способ организации кода и взаимодействия компонентов.' },
        { type: 'heading', value: 'Layered Architecture (Слоистая)' },
        { type: 'text', value: 'Самый распространённый стиль. Код разделяется на горизонтальные слои: Presentation → Business Logic → Data Access. Каждый слой обращается только к слою ниже.' },
        { type: 'heading', value: 'Hexagonal Architecture (Гексагональная)' },
        { type: 'text', value: 'Предложена Алистером Кокберном. Ядро — бизнес-логика, окружённая портами (интерфейсами) и адаптерами (реализациями). Внешний мир подключается через адаптеры.' },
        { type: 'heading', value: 'Clean Architecture (Чистая)' },
        { type: 'text', value: 'Предложена Робертом Мартином. Развитие идей гексагональной архитектуры с чётким правилом зависимостей: зависимости направлены только внутрь, к ядру.' },
        { type: 'heading', value: 'Event-Driven Architecture' },
        { type: 'text', value: 'Компоненты общаются через события. Слабая связанность, высокая масштабируемость, но сложность отладки и гарантий доставки.' },
        { type: 'heading', value: 'Microservices' },
        { type: 'text', value: 'Система разбивается на независимые сервисы, каждый со своей БД и деплоем. Максимальная независимость, но высокая операционная сложность.' },
        { type: 'tip', value: 'В этом курсе мы сфокусируемся на Clean Architecture, Hexagonal Architecture и DDD — подходах, которые определяют внутреннюю структуру приложения, а не его развёртывание.' }
      ]
    },
    {
      id: 5,
      title: 'Метрики качества архитектуры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Как понять, хорошая ли у вас архитектура? Существуют конкретные метрики и индикаторы, которые можно измерить.' },
        { type: 'heading', value: 'Количественные метрики' },
        { type: 'list', value: [
          'Afferent Coupling (Ca) — сколько модулей зависят от данного модуля',
          'Efferent Coupling (Ce) — от скольких модулей зависит данный модуль',
          'Instability = Ce / (Ca + Ce) — нестабильность модуля (0 = стабильный, 1 = нестабильный)',
          'Abstractness = абстрактные классы / все классы — степень абстрактности',
          'Cyclomatic Complexity — количество независимых путей через код'
        ]},
        { type: 'heading', value: 'Качественные индикаторы' },
        { type: 'list', value: [
          'Время на добавление новой фичи растёт? Архитектура деградирует',
          'Изменение в одном модуле ломает другие? Высокий coupling',
          'Новый разработчик долго разбирается? Плохая читаемость',
          'Тесты хрупкие и часто ломаются? Плохое разделение ответственности'
        ]},
        { type: 'code', language: 'typescript', value: '// Пример: расчёт метрики нестабильности\ninterface ModuleMetrics {\n  name: string;\n  afferentCoupling: number;  // Ca: кто зависит от нас\n  efferentCoupling: number;  // Ce: от кого зависим мы\n}\n\nfunction calculateInstability(metrics: ModuleMetrics): number {\n  const total = metrics.afferentCoupling + metrics.efferentCoupling;\n  if (total === 0) return 0;\n  return metrics.efferentCoupling / total;\n}\n\n// Domain-слой должен быть стабильным (Instability ≈ 0)\n// Infrastructure-слой может быть нестабильным (Instability ≈ 1)\nconsole.log(calculateInstability({ name: "domain", afferentCoupling: 10, efferentCoupling: 0 })); // 0\nconsole.log(calculateInstability({ name: "infrastructure", afferentCoupling: 0, efferentCoupling: 8 })); // 1' },
        { type: 'note', value: 'Правило стабильных зависимостей (Stable Dependencies Principle): модуль должен зависеть только от модулей, которые стабильнее его. Domain-слой самый стабильный — от него зависят все, но он не зависит ни от кого.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: анализ архитектуры проекта',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проанализируйте структуру проекта, определите coupling/cohesion и предложите улучшения архитектуры.',
      requirements: [
        'Определить архитектурный стиль проекта',
        'Вычислить coupling между модулями',
        'Оценить cohesion каждого модуля',
        'Найти нарушения принципов (циклические зависимости, высокий coupling)',
        'Предложить конкретные улучшения'
      ],
      hint: 'Начните с рисования диаграммы зависимостей между модулями. Стрелка от A к B означает, что A зависит от B. Циклы в графе — первый сигнал проблемы.',
      expectedOutput: 'Диаграмма зависимостей построена, метрики coupling/cohesion вычислены, проблемные места выявлены, предложены конкретные шаги по улучшению.',
      solution: '// Анализ архитектуры проекта\n\n// Шаг 1: Определяем модули и зависимости\nconst modules = [\n  { name: "UserController", dependsOn: ["UserService", "HttpRequest", "HttpResponse"] },\n  { name: "UserService", dependsOn: ["UserRepository", "EmailService", "Logger"] },\n  { name: "UserRepository", dependsOn: ["Database", "UserMapper"] },\n  { name: "EmailService", dependsOn: ["SmtpClient", "TemplateEngine"] },\n];\n\n// Шаг 2: Вычисляем coupling\n// UserService: Ce = 3 (зависит от 3 модулей), Ca = 1 (1 модуль зависит от него)\n// Instability = 3 / (1 + 3) = 0.75 — высокая нестабильность\n\n// Шаг 3: Проблемы\n// - UserService зависит от конкретного EmailService (высокий coupling)\n// - Нет интерфейсов между слоями\n\n// Шаг 4: Улучшения\n// - Ввести интерфейс EmailSender вместо конкретного EmailService\n// - Внедрять зависимости через конструктор (DI)\n// - Разделить UserService на UserCommandService и UserQueryService',
      explanation: 'Анализ архитектуры начинается с визуализации зависимостей. Высокий coupling между конкретными классами затрудняет тестирование и изменение. Решение — инверсия зависимостей через интерфейсы и внедрение зависимостей через конструктор.'
    }
  ]
}
