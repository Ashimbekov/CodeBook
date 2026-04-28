export default {
  id: 5,
  title: 'DDD: Основы',
  description: 'Domain-Driven Design: ubiquitous language, bounded contexts, стратегическое проектирование и связь с архитектурой.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Domain-Driven Design',
      type: 'theory',
      content: [
        { type: 'text', value: 'Domain-Driven Design (DDD) — подход к разработке ПО, предложенный Эриком Эвансом в 2003 году. Главная идея: структура кода должна отражать предметную область (домен) бизнеса, а не технические детали.' },
        { type: 'heading', value: 'Зачем DDD?' },
        { type: 'list', value: [
          'Код говорит на языке бизнеса — разработчик и бизнес-аналитик понимают друг друга',
          'Сложная бизнес-логика становится управляемой',
          'Границы модулей определяются бизнесом, а не технологиями',
          'Модель эволюционирует вместе с пониманием домена'
        ]},
        { type: 'heading', value: 'Когда применять DDD' },
        { type: 'text', value: 'DDD оправдан для сложных доменов с нетривиальной бизнес-логикой: финансы, логистика, медицина, e-commerce с комплексными правилами. Для CRUD-приложений DDD — это overkill.' },
        { type: 'heading', value: 'Два уровня DDD' },
        { type: 'list', value: [
          'Стратегический DDD — как разбить систему на bounded contexts, как они взаимодействуют',
          'Тактический DDD — как строить модель внутри контекста: Entity, Value Object, Aggregate'
        ]},
        { type: 'tip', value: 'DDD — это не архитектура, а подход к моделированию. Clean Architecture и Hexagonal — это про структуру кода. DDD — про содержание доменного слоя. Они отлично дополняют друг друга.' }
      ]
    },
    {
      id: 2,
      title: 'Ubiquitous Language',
      type: 'theory',
      content: [
        { type: 'text', value: 'Ubiquitous Language (единый язык) — общий словарь, используемый командой разработки и экспертами домена. Одни и те же термины используются в разговорах, документации и коде.' },
        { type: 'heading', value: 'Зачем единый язык?' },
        { type: 'text', value: 'Без единого языка возникают "переводы": бизнес говорит "клиент", разработчик пишет User; бизнес говорит "оформить заказ", разработчик называет метод processData(). Это приводит к ошибкам и недопониманию.' },
        { type: 'code', language: 'java', value: '// Плохо: код не отражает язык бизнеса\npublic class DataProcessor {\n    public void processData(Map<String, Object> data) {\n        int type = (int) data.get("type");\n        if (type == 1) {\n            // ...\n        }\n    }\n}\n\n// Хорошо: код говорит на языке домена\npublic class LoanApplication {\n    public ApprovalResult evaluate(Applicant applicant, LoanTerms terms) {\n        CreditScore score = applicant.creditScore();\n        if (score.isBelowMinimum()) {\n            return ApprovalResult.rejected("Кредитный рейтинг ниже минимального");\n        }\n        DebtToIncomeRatio ratio = applicant.debtToIncomeRatio();\n        if (ratio.exceedsThreshold(terms.maxDtiRatio())) {\n            return ApprovalResult.rejected("Превышен порог долговой нагрузки");\n        }\n        return ApprovalResult.approved(calculateRate(score, terms));\n    }\n}' },
        { type: 'heading', value: 'Как выработать Ubiquitous Language' },
        { type: 'list', value: [
          'Регулярные встречи разработчиков с экспертами домена',
          'Глоссарий терминов, доступный всей команде',
          'Код использует те же термины, что и бизнес',
          'Если эксперт домена не понимает название класса — переименуйте'
        ]},
        { type: 'warning', value: 'Ubiquitous Language уникален для каждого bounded context. Слово "Account" в банкинге означает банковский счёт, в системе аутентификации — учётную запись. Это нормально — разные контексты, разные значения.' }
      ]
    },
    {
      id: 3,
      title: 'Bounded Context',
      type: 'theory',
      content: [
        { type: 'text', value: 'Bounded Context (ограниченный контекст) — граница, внутри которой доменная модель имеет чёткое определение. Каждый контекст имеет свой Ubiquitous Language и свою модель.' },
        { type: 'heading', value: 'Зачем нужны границы?' },
        { type: 'text', value: 'В реальном бизнесе одно и то же понятие имеет разные значения в разных отделах. "Клиент" для отдела продаж — потенциальный покупатель, для бухгалтерии — плательщик, для поддержки — автор тикета. Одна модель не может описать все значения.' },
        { type: 'code', language: 'typescript', value: '// Bounded Context: Sales (Продажи)\nnamespace Sales {\n  class Customer {\n    id: CustomerId;\n    name: string;\n    segment: CustomerSegment; // VIP, Regular, New\n    purchaseHistory: Purchase[];\n    \n    calculateDiscount(): Percentage {\n      if (this.segment === CustomerSegment.VIP) return Percentage.of(15);\n      return Percentage.of(0);\n    }\n  }\n}\n\n// Bounded Context: Billing (Биллинг)\nnamespace Billing {\n  class Customer {\n    id: CustomerId;\n    billingAddress: Address;\n    paymentMethods: PaymentMethod[];\n    outstandingBalance: Money;\n    \n    charge(amount: Money): PaymentResult {\n      const method = this.preferredPaymentMethod();\n      return method.charge(amount);\n    }\n  }\n}\n\n// Bounded Context: Support (Поддержка)\nnamespace Support {\n  class Customer {\n    id: CustomerId;\n    contactInfo: ContactInfo;\n    tickets: Ticket[];\n    satisfactionScore: number;\n  }\n}' },
        { type: 'heading', value: 'Как определить границы контекстов' },
        { type: 'list', value: [
          'Разные отделы бизнеса часто = разные контексты',
          'Если одно слово имеет разные значения — нужна граница',
          'Если модель становится слишком большой — возможно, внутри несколько контекстов',
          'Команда, работающая автономно = хороший кандидат на отдельный контекст'
        ]},
        { type: 'note', value: 'Bounded Context — это логическая граница. Она может быть реализована как отдельный микросервис, модуль в монолите или даже пакет в одном приложении. Способ деплоя не определяет границы контекста.' }
      ]
    },
    {
      id: 4,
      title: 'Context Mapping',
      type: 'theory',
      content: [
        { type: 'text', value: 'Context Map — диаграмма, показывающая, как bounded contexts взаимодействуют. Существует несколько типичных паттернов взаимодействия.' },
        { type: 'heading', value: 'Паттерны взаимодействия' },
        { type: 'list', value: [
          'Shared Kernel — контексты разделяют общий код (опасно, создаёт coupling)',
          'Customer-Supplier — один контекст поставляет данные другому, они договариваются об API',
          'Conformist — один контекст принимает модель другого без изменений',
          'Anti-Corruption Layer (ACL) — адаптер, защищающий модель от влияния другого контекста',
          'Open Host Service — контекст предоставляет стандартизированный API для всех',
          'Published Language — общий формат обмена (JSON Schema, Protocol Buffers)'
        ]},
        { type: 'heading', value: 'Anti-Corruption Layer (ACL)' },
        { type: 'text', value: 'Самый важный паттерн. ACL — это адаптер между контекстами, который переводит модель одного контекста в модель другого.' },
        { type: 'code', language: 'java', value: '// ACL: адаптер между контекстами Billing и Sales\n// Billing-контекст не хочет зависеть от модели Sales\n\n// Порт в Billing-контексте\npublic interface CustomerInfoProvider {\n    BillingCustomer getCustomerForBilling(CustomerId id);\n}\n\n// ACL — адаптер, переводящий модель Sales в модель Billing\npublic class SalesCustomerAdapter implements CustomerInfoProvider {\n    private final SalesApiClient salesApi; // REST-клиент к Sales\n    \n    @Override\n    public BillingCustomer getCustomerForBilling(CustomerId id) {\n        // Получаем данные из Sales-контекста\n        SalesCustomerDto salesCustomer = salesApi.getCustomer(id.value());\n        \n        // Переводим в модель Billing-контекста\n        return new BillingCustomer(\n            new CustomerId(salesCustomer.getId()),\n            new Address(\n                salesCustomer.getStreet(),\n                salesCustomer.getCity(),\n                salesCustomer.getZip()\n            )\n        );\n    }\n}' },
        { type: 'tip', value: 'ACL защищает вашу доменную модель от изменений в чужом контексте. Если Sales переименует поле — сломается только ACL-адаптер, а не весь Billing-контекст.' }
      ]
    },
    {
      id: 5,
      title: 'Event Storming: открытие домена',
      type: 'theory',
      content: [
        { type: 'text', value: 'Event Storming — воркшоп-техника для исследования домена, предложенная Альберто Брандолини. За несколько часов команда (разработчики + эксперты) может обнаружить bounded contexts, ключевые бизнес-события и процессы.' },
        { type: 'heading', value: 'Как проводится Event Storming' },
        { type: 'list', value: [
          'Шаг 1: записать все доменные события на оранжевых стикерах ("Заказ создан", "Оплата получена")',
          'Шаг 2: расположить события на временной шкале',
          'Шаг 3: определить команды (синие стикеры) — действия, вызывающие события ("Создать заказ")',
          'Шаг 4: определить агрегаты (жёлтые стикеры) — объекты, принимающие команды',
          'Шаг 5: найти границы контекстов — где меняется язык и модель'
        ]},
        { type: 'heading', value: 'Пример: E-commerce' },
        { type: 'text', value: 'События: Товар добавлен в корзину → Заказ оформлен → Оплата инициирована → Оплата подтверждена → Заказ передан на сборку → Заказ отгружен → Доставка завершена.\n\nОбнаруженные контексты:\n- Catalog (управление товарами)\n- Ordering (оформление заказов)\n- Payment (обработка платежей)\n- Fulfillment (сборка и отгрузка)\n- Delivery (доставка)' },
        { type: 'note', value: 'Event Storming — одна из лучших техник для начала проекта с DDD. За 2-4 часа команда получает общее понимание домена, находит bounded contexts и определяет ubiquitous language.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: определение bounded contexts',
      type: 'practice',
      difficulty: 'medium',
      description: 'Определите bounded contexts для системы онлайн-образования (платформа курсов).',
      requirements: [
        'Определить минимум 4 bounded contexts',
        'Для каждого контекста определить ключевые сущности и ubiquitous language',
        'Нарисовать Context Map с типами отношений',
        'Определить, где нужен Anti-Corruption Layer',
        'Описать основные доменные события для каждого контекста'
      ],
      hint: 'Подумайте, какие отделы есть в онлайн-школе: создание контента, продажи, обучение, аналитика. У каждого отдела свой взгляд на "курс" и "студента".',
      expectedOutput: 'Определены bounded contexts (Catalog, Enrollment, Learning, Payment, Analytics), для каждого описан ubiquitous language и ключевые события, построена Context Map.',
      solution: '// Bounded Contexts для платформы онлайн-курсов\n\n// 1. CATALOG CONTEXT (Каталог)\n// Ubiquitous Language: Курс, Модуль, Урок, Автор, Категория\n// События: CourseCreated, CoursePublished, CoursePriceChanged\ninterface CatalogCourse {\n  id: CourseId;\n  title: string;\n  author: AuthorId;\n  modules: ModuleInfo[];\n  price: Money;\n  status: "draft" | "published";\n}\n\n// 2. ENROLLMENT CONTEXT (Запись на курсы)\n// Ubiquitous Language: Студент, Запись, Подписка, Промокод\n// События: StudentEnrolled, SubscriptionActivated, EnrollmentCancelled\ninterface Enrollment {\n  id: EnrollmentId;\n  studentId: StudentId;\n  courseId: CourseId;\n  enrolledAt: Date;\n  status: "active" | "completed" | "cancelled";\n}\n\n// 3. LEARNING CONTEXT (Обучение)\n// Ubiquitous Language: Прогресс, Задание, Оценка, Сертификат\n// События: LessonCompleted, AssignmentSubmitted, CertificateIssued\ninterface LearningProgress {\n  studentId: StudentId;\n  courseId: CourseId;\n  completedLessons: LessonId[];\n  currentModule: ModuleId;\n  score: number;\n}\n\n// 4. PAYMENT CONTEXT (Платежи)\n// Ubiquitous Language: Платёж, Возврат, Счёт, Подписка\n// События: PaymentProcessed, RefundIssued, InvoiceGenerated\ninterface Payment {\n  id: PaymentId;\n  customerId: CustomerId;\n  amount: Money;\n  status: "pending" | "completed" | "refunded";\n}\n\n// CONTEXT MAP:\n// Catalog ---[Open Host Service]---> Enrollment (Enrollment читает каталог)\n// Enrollment ---[Customer-Supplier]---> Learning (Learning знает о записях)\n// Enrollment ---[ACL]---> Payment (Enrollment защищён от деталей оплаты)\n// Learning ---[Published Language/Events]---> Analytics',
      explanation: 'Каждый контекст имеет свою модель "курса" и "студента". В Catalog курс — это контент с модулями. В Payment — товар с ценой. В Learning — набор уроков с прогрессом. Anti-Corruption Layer между Enrollment и Payment защищает бизнес-логику записи от деталей платёжной системы.'
    }
  ]
}
