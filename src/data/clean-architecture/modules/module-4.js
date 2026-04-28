export default {
  id: 4,
  title: 'Onion Architecture',
  description: 'Onion Architecture Джеффри Палермо: слои, инверсия зависимостей, отличия от Hexagonal и Clean Architecture.',
  lessons: [
    {
      id: 1,
      title: 'Концепция Onion Architecture',
      type: 'theory',
      content: [
        { type: 'text', value: 'Onion Architecture (луковая архитектура) предложена Джеффри Палермо в 2008 году. Метафора луковицы: приложение состоит из концентрических слоёв, где каждый внешний слой зависит только от внутренних.' },
        { type: 'heading', value: 'Слои Onion Architecture (от центра к периферии)' },
        { type: 'list', value: [
          'Domain Model — сущности, value objects, доменные события (ядро)',
          'Domain Services — сервисы домена, работающие с несколькими сущностями',
          'Application Services — use cases, координация, транзакции',
          'Infrastructure — БД, файловая система, внешние API, UI'
        ]},
        { type: 'heading', value: 'Ключевой принцип' },
        { type: 'text', value: 'Инверсия зависимостей: интерфейсы определяются во внутренних слоях, реализации — во внешних. Внутренние слои не знают о существовании внешних. Infrastructure — это деталь, которую можно заменить.' },
        { type: 'tip', value: 'Onion Architecture очень похожа на Hexagonal и Clean Architecture. Различия в основном терминологические: "порты и адаптеры" vs "слои луковицы" vs "круги зависимостей". Принцип один: зависимости направлены внутрь.' }
      ]
    },
    {
      id: 2,
      title: 'Domain Model — ядро луковицы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Центральный слой содержит бизнес-объекты и правила, которые не зависят ни от какой технологии. Здесь нет ссылок на фреймворки, ORM, HTTP или файловую систему.' },
        { type: 'code', language: 'java', value: '// Domain Model — чистые бизнес-объекты\npublic class Employee {\n    private EmployeeId id;\n    private FullName name;\n    private Email email;\n    private Salary salary;\n    private Department department;\n    \n    // Бизнес-правило: повышение зарплаты\n    public void raiseSalary(Percentage percentage) {\n        if (percentage.value() > 50) {\n            throw new ExcessiveRaiseException(\n                "Повышение более 50% требует одобрения директора"\n            );\n        }\n        this.salary = this.salary.increase(percentage);\n    }\n    \n    // Бизнес-правило: перевод в другой отдел\n    public void transferTo(Department newDepartment) {\n        if (this.department.equals(newDepartment)) {\n            throw new SameDepartmentException();\n        }\n        this.department = newDepartment;\n    }\n}\n\n// Value Object: Salary\npublic record Salary(BigDecimal amount, Currency currency) {\n    public Salary {\n        if (amount.compareTo(BigDecimal.ZERO) < 0) {\n            throw new NegativeSalaryException();\n        }\n    }\n    \n    public Salary increase(Percentage percentage) {\n        BigDecimal increase = amount.multiply(percentage.asFraction());\n        return new Salary(amount.add(increase), currency);\n    }\n}' },
        { type: 'note', value: 'Domain Model не содержит аннотаций @Entity, @Column, @Autowired. Это POJO/POTS (Plain Old Java/TypeScript Objects) с бизнес-логикой внутри.' }
      ]
    },
    {
      id: 3,
      title: 'Domain Services и Application Services',
      type: 'theory',
      content: [
        { type: 'text', value: 'Два промежуточных слоя координируют работу доменных объектов, но на разных уровнях абстракции.' },
        { type: 'heading', value: 'Domain Services' },
        { type: 'text', value: 'Содержат бизнес-логику, которая не принадлежит одной сущности. Работают с несколькими доменными объектами.' },
        { type: 'code', language: 'java', value: '// Domain Service — работает с несколькими сущностями\npublic class TransferService {\n    // Бизнес-правило: перевод денег между счетами\n    public void transfer(BankAccount from, BankAccount to, Money amount) {\n        if (from.owner().equals(to.owner()) && amount.isGreaterThan(Money.of(1000000))) {\n            throw new SuspiciousTransferException("Подозрительный перевод самому себе");\n        }\n        from.withdraw(amount);\n        to.deposit(amount);\n    }\n}' },
        { type: 'heading', value: 'Application Services' },
        { type: 'text', value: 'Координируют выполнение use case. Управляют транзакциями, вызывают репозитории, отправляют события. Не содержат бизнес-логики!' },
        { type: 'code', language: 'java', value: '// Application Service — координация, без бизнес-логики\npublic class TransferMoneyUseCase {\n    private final AccountRepository accountRepo;\n    private final TransferService transferService; // доменный сервис\n    private final TransactionLogger transactionLogger;\n    \n    public TransferResult execute(TransferCommand command) {\n        // 1. Получить данные\n        BankAccount from = accountRepo.findById(command.fromAccountId());\n        BankAccount to = accountRepo.findById(command.toAccountId());\n        Money amount = Money.of(command.amount(), command.currency());\n        \n        // 2. Выполнить бизнес-операцию (логика в Domain Service)\n        transferService.transfer(from, to, amount);\n        \n        // 3. Сохранить результат\n        accountRepo.save(from);\n        accountRepo.save(to);\n        \n        // 4. Залогировать\n        transactionLogger.log(from.id(), to.id(), amount);\n        \n        return TransferResult.success();\n    }\n}' },
        { type: 'warning', value: 'Типичная ошибка: вся бизнес-логика в Application Service, а Domain Model — просто DTO с геттерами и сеттерами. Это Anemic Domain Model anti-pattern. Бизнес-правила должны быть в Entity и Domain Services.' }
      ]
    },
    {
      id: 4,
      title: 'Слой Infrastructure',
      type: 'theory',
      content: [
        { type: 'text', value: 'Самый внешний слой содержит все технические детали: БД, фреймворки, внешние сервисы, UI. Этот слой реализует интерфейсы, определённые во внутренних слоях.' },
        { type: 'code', language: 'typescript', value: '// Интерфейс определён в доменном слое\ninterface EmployeeRepository {\n  findById(id: EmployeeId): Promise<Employee | null>;\n  save(employee: Employee): Promise<void>;\n  findByDepartment(dept: Department): Promise<Employee[]>;\n}\n\n// Реализация в слое Infrastructure — TypeORM\nclass TypeOrmEmployeeRepository implements EmployeeRepository {\n  constructor(private dataSource: DataSource) {}\n\n  async findById(id: EmployeeId): Promise<Employee | null> {\n    const entity = await this.dataSource\n      .getRepository(EmployeeEntity)\n      .findOne({ where: { id: id.value } });\n    return entity ? this.toDomain(entity) : null;\n  }\n\n  async save(employee: Employee): Promise<void> {\n    const entity = this.toEntity(employee);\n    await this.dataSource.getRepository(EmployeeEntity).save(entity);\n  }\n\n  // Маппинг между доменной моделью и ORM-сущностью\n  private toDomain(entity: EmployeeEntity): Employee {\n    return Employee.reconstitute(\n      new EmployeeId(entity.id),\n      new FullName(entity.firstName, entity.lastName),\n      new Email(entity.email),\n      new Salary(entity.salaryAmount, entity.salaryCurrency),\n      new Department(entity.departmentId)\n    );\n  }\n\n  private toEntity(domain: Employee): EmployeeEntity {\n    const entity = new EmployeeEntity();\n    entity.id = domain.id.value;\n    entity.firstName = domain.name.firstName;\n    entity.lastName = domain.name.lastName;\n    entity.email = domain.email.value;\n    entity.salaryAmount = domain.salary.amount;\n    entity.salaryCurrency = domain.salary.currency;\n    entity.departmentId = domain.department.id;\n    return entity;\n  }\n}' },
        { type: 'heading', value: 'ORM Entity vs Domain Entity' },
        { type: 'text', value: 'В Onion Architecture это два разных объекта. ORM Entity (с аннотациями @Entity, @Column) — инфраструктурная деталь. Domain Entity — чистый бизнес-объект. Маппинг между ними — ответственность Infrastructure слоя.' },
        { type: 'note', value: 'Маппинг — это дополнительный код, но он даёт свободу: доменная модель не привязана к структуре БД. Таблицы могут меняться без изменения бизнес-логики.' }
      ]
    },
    {
      id: 5,
      title: 'Сравнение: Onion vs Hexagonal vs Clean',
      type: 'theory',
      content: [
        { type: 'text', value: 'Три архитектуры очень похожи. Все они инвертируют зависимости и ставят бизнес-логику в центр. Различия — в терминологии и акцентах.' },
        { type: 'heading', value: 'Hexagonal Architecture (Ports & Adapters)' },
        { type: 'list', value: [
          'Акцент на портах (интерфейсах) и адаптерах (реализациях)',
          'Два типа адаптеров: driving (входящие) и driven (исходящие)',
          'Визуальная метафора: гексагон с портами на гранях'
        ]},
        { type: 'heading', value: 'Onion Architecture' },
        { type: 'list', value: [
          'Акцент на слоях: Domain Model → Domain Services → Application Services → Infrastructure',
          'Чётко разделяет Domain Services и Application Services',
          'Визуальная метафора: концентрические круги (луковица)'
        ]},
        { type: 'heading', value: 'Clean Architecture' },
        { type: 'list', value: [
          'Акцент на правиле зависимостей (Dependency Rule)',
          'Чёткое разделение: Entities → Use Cases → Interface Adapters → Frameworks',
          'Визуальная метафора: концентрические круги со стрелками внутрь'
        ]},
        { type: 'heading', value: 'Что общего?' },
        { type: 'text', value: 'Все три архитектуры: (1) ставят бизнес-логику в центр, (2) инвертируют зависимости, (3) делают инфраструктуру заменяемой, (4) облегчают тестирование.' },
        { type: 'tip', value: 'На практике термины часто смешивают. Проект может называться "Clean Architecture", но использовать терминологию из Hexagonal. Это нормально — важны принципы, а не названия.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: рефакторинг в Onion Architecture',
      type: 'practice',
      difficulty: 'medium',
      description: 'Преобразуйте классическую трёхслойную архитектуру приложения сотрудников в Onion Architecture.',
      requirements: [
        'Выделить Domain Model: Employee с бизнес-правилами',
        'Создать Domain Service: SalaryCalculationService',
        'Создать Application Service: PromoteEmployeeUseCase',
        'Определить интерфейс EmployeeRepository в доменном слое',
        'Реализовать маппинг между Domain Entity и ORM Entity'
      ],
      hint: 'Начните с выделения бизнес-правил из сервисного слоя в Entity. Затем определите интерфейсы репозиториев во внутреннем слое. Реализации перенесите во внешний слой.',
      expectedOutput: 'Чёткое разделение на слои: Domain Model не зависит от Infrastructure, Application Service координирует без бизнес-логики, маппинг между ORM и Domain выполняется в Infrastructure.',
      solution: '// BEFORE: Классическая трёхзвенная архитектура\n// Service содержит всю логику, Entity — просто данные\n\n// AFTER: Onion Architecture\n\n// === Domain Model (ядро) ===\npublic class Employee {\n    private EmployeeId id;\n    private FullName name;\n    private Salary salary;\n    private Grade grade;\n    \n    public void promote() {\n        Grade newGrade = this.grade.next();\n        Percentage raise = newGrade.standardRaise();\n        this.grade = newGrade;\n        this.salary = this.salary.increase(raise);\n    }\n}\n\n// === Domain Service ===\npublic class SalaryCalculationService {\n    public Salary calculateBonus(Employee employee, KPI kpi) {\n        Percentage bonusRate = kpi.isExceeded() \n            ? Percentage.of(20) : Percentage.of(10);\n        return employee.salary().multiply(bonusRate);\n    }\n}\n\n// === Application Service ===\npublic class PromoteEmployeeUseCase {\n    private final EmployeeRepository repo;\n    \n    public void execute(EmployeeId id) {\n        Employee emp = repo.findById(id).orElseThrow();\n        emp.promote(); // бизнес-логика в Entity\n        repo.save(emp);\n    }\n}\n\n// === Interface (в Domain слое) ===\npublic interface EmployeeRepository {\n    Optional<Employee> findById(EmployeeId id);\n    void save(Employee employee);\n}\n\n// === Infrastructure (реализация) ===\npublic class JpaEmployeeRepository implements EmployeeRepository {\n    private final JpaEntityManager em;\n    \n    public Optional<Employee> findById(EmployeeId id) {\n        EmployeeJpaEntity entity = em.find(EmployeeJpaEntity.class, id.value());\n        return Optional.ofNullable(entity).map(this::toDomain);\n    }\n}',
      explanation: 'Рефакторинг перемещает бизнес-логику из сервисов в Entity (promote()). Application Service становится тонким координатором. Интерфейс репозитория определён в домене, реализация — в Infrastructure. Зависимости инвертированы: Infrastructure зависит от Domain, а не наоборот.'
    }
  ]
}
