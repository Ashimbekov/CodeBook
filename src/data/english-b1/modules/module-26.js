export default {
  id: 26,
  title: 'Speaking: Explaining Technical Decisions',
  description: 'Как объяснять технические решения коллегам и руководству на английском. Фразы для обоснования выбора технологий и архитектуры.',
  lessons: [
    {
      id: 1,
      title: 'Why and how to explain technical decisions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Способность объяснять технические решения — один из ключевых навыков senior-разработчика. Это нужно для согласования с командой, объяснения менеджерам и документирования решений.' },
        { type: 'heading', value: 'Contexts where you explain decisions' },
        { type: 'list', items: [
          'Architecture review meetings — обсуждение архитектуры',
          'Pull request descriptions — описание в PR',
          'Technical docs (ADR — Architecture Decision Records)',
          'Standup / Sprint planning — ежедневные митинги',
          'Onboarding new developers — онбординг',
          'Stakeholder updates — обновления для менеджеров'
        ]},
        { type: 'heading', value: 'Structure of a good explanation' },
        { type: 'list', items: [
          '1. Context — что было задачей/проблемой',
          '2. Options considered — что рассматривалось',
          '3. Decision made — что выбрали',
          '4. Reasoning — почему именно это',
          '5. Trade-offs — что теряем',
          '6. Next steps — что дальше'
        ]},
        { type: 'tip', value: 'ADR (Architecture Decision Record) — формат документирования архитектурных решений. Попробуй писать ADR в своих проектах — это улучшает как английский, так и мышление об архитектуре.' }
      ]
    },
    {
      id: 2,
      title: 'Explaining technology choices: "I chose Redis because..."',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обоснование выбора технологии — частая задача. Научись формулировать это чётко и убедительно.' },
        { type: 'heading', value: 'Technology choice phrases' },
        { type: 'list', items: [
          '"I chose Redis because it provides sub-millisecond response times." — я выбрал Redis, потому что он обеспечивает...',
          '"We decided to use PostgreSQL since it supports ACID transactions." — мы решили использовать PostgreSQL, так как он поддерживает...',
          '"The reason I opted for GraphQL over REST is..." — причина выбора GraphQL вместо REST в том, что...',
          '"We went with Docker because it simplifies deployment consistency." — мы выбрали Docker, потому что...',
          '"I selected this library based on its active community and documentation." — я выбрал эту библиотеку исходя из...',
          '"The main factor in choosing Kubernetes was scalability requirements." — главным фактором в выборе Kubernetes были требования к масштабируемости'
        ]},
        { type: 'code', language: 'text', value: 'Example explanation:\n\n"I chose Redis as our caching layer for three reasons.\nFirst, it provides sub-millisecond response times which is critical\nfor our user-facing API. Second, it supports multiple data structures\n(hashes, sets, sorted sets) which gives us flexibility. Third, the team\nalready has expertise with Redis from our previous project, which\nreduces the learning curve."\n\n"The main trade-off is that Redis is an in-memory store, so we need\nto handle the case where the cache is cold after a restart."' },
        { type: 'note', value: 'Три причины — идеальное количество для объяснения. Одна кажется недостаточной, пять — слишком много. "I chose X for three reasons: First... Second... Third..."' }
      ]
    },
    {
      id: 3,
      title: 'Explaining architectural decisions: microservices, monolith',
      type: 'theory',
      content: [
        { type: 'text', value: 'Архитектурные решения требуют более глубокого объяснения, так как они влияют на всю команду.' },
        { type: 'heading', value: 'Architecture decision phrases' },
        { type: 'list', items: [
          '"We decided to use microservices since our teams are growing independently." — мы решили использовать микросервисы, так как...',
          '"We kept the monolith for now because our team is small and the overhead isn\'t justified." — оставили монолит, потому что...',
          '"The decision to separate the auth service was driven by security requirements." — решение выделить auth-сервис было обусловлено...',
          '"We\'re adopting the event-driven architecture to decouple services." — мы принимаем событийно-ориентированную архитектуру для...',
          '"Given our current scale of 10,000 users, a monolith is sufficient." — учитывая текущий масштаб...'
        ]},
        { type: 'heading', value: 'Explaining patterns and principles' },
        { type: 'list', items: [
          '"I applied the repository pattern here to abstract the database layer." — я применил паттерн репозитория для...',
          '"We\'re using CQRS to separate read and write operations for better performance." — мы используем CQRS для...',
          '"The circuit breaker pattern prevents cascade failures." — паттерн circuit breaker предотвращает каскадные сбои',
          '"We follow the 12-factor app methodology for deployment." — мы следуем методологии 12 факторов'
        ]},
        { type: 'tip', value: 'Когда объясняешь архитектурное решение, всегда упомяни требования, которые его обусловили: "Given [requirement], we decided [decision] because [reason]."' }
      ]
    },
    {
      id: 4,
      title: 'Explaining to non-technical stakeholders',
      type: 'theory',
      content: [
        { type: 'text', value: 'Часто нужно объяснять технические решения менеджерам или клиентам, которые не являются разработчиками. Это требует другого языка.' },
        { type: 'heading', value: 'Simplification techniques' },
        { type: 'list', items: [
          'Avoid jargon — избегай технического жаргона',
          'Use analogies — используй аналогии ("Redis is like a very fast sticky note on your desk")',
          'Focus on business impact — говори о бизнес-влиянии, не о технических деталях',
          'Use numbers — конкретные числа понятны всем ("3x faster", "50% less cost")',
          'Explain what changes for the user — объясни, что изменится для пользователя'
        ]},
        { type: 'heading', value: 'Phrases for non-technical audience' },
        { type: 'list', items: [
          '"In simple terms, what we\'re doing is..." — простыми словами, мы...',
          '"Think of it like..." — представьте это как...',
          '"The business benefit is..." — бизнес-выгода заключается в...',
          '"The reason this matters is that users will now be able to..." — это важно, потому что пользователи смогут...',
          '"This will reduce our operational costs by approximately..." — это снизит наши операционные затраты примерно на...',
          '"Without this change, we risk..." — без этого изменения мы рискуем...'
        ]},
        { type: 'note', value: 'Аналогии — мощный инструмент. "Caching is like keeping commonly used tools on your desk instead of going to the storeroom every time." — мгновенно понятно любому.' }
      ]
    },
    {
      id: 5,
      title: 'Defending and updating decisions',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда нужно защищать своё решение от критики или, наоборот, объявлять о его изменении.' },
        { type: 'heading', value: 'Defending a decision' },
        { type: 'list', items: [
          '"I understand your concern. However, at the time we made this decision, the constraints were..." — понимаю беспокойство, однако на тот момент ограничения были...',
          '"The data shows that this approach is working: [metrics]." — данные показывают, что подход работает',
          '"That\'s a valid point. Let me explain the trade-offs we considered." — верное замечание. Позвольте объяснить компромиссы...',
          '"We experimented with X and found that..." — мы экспериментировали с X и обнаружили...'
        ]},
        { type: 'heading', value: 'Announcing a change of decision' },
        { type: 'list', items: [
          '"We\'ve reconsidered our approach to X." — мы пересмотрели наш подход к X',
          '"Given the new requirements, we\'ve decided to change direction." — учитывая новые требования, мы решили изменить курс',
          '"We were wrong about X. The better approach is..." — мы ошибались насчёт X. Лучший подход...',
          '"Based on the performance data, we\'re migrating from X to Y." — на основе данных о производительности мы мигрируем с X на Y'
        ]},
        { type: 'tip', value: 'Не бойся признавать ошибки в технических решениях. "We were wrong about X and here\'s what we learned" показывает зрелость и честность, а не слабость.' }
      ]
    },
    {
      id: 6,
      title: 'Practice: Explain your decisions',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши или произнеси объяснение для следующих сценариев.',
      solution: 'Структура хорошего объяснения решения:\n1. Назови выбор прямо.\n2. Объясни причину (статическая типизация, безопасность транзакций и т.д.).\n3. Укажи trade-off (что теряем/усложняем).\n4. Объясни почему выгода перевешивает недостатки.\n\nДля TypeScript: типизация → меньше runtime-ошибок → лучший IntelliSense → trade-off: медленнее вначале.\nДля PostgreSQL (нетехнически): надёжность транзакций → как банковский счёт → важнее гибкости.',
      tasks: [
        {
          scenario: 'Ты выбрал TypeScript вместо JavaScript для нового проекта. Объясни это команде.',
          keyPoints: ['Статическая типизация', 'Лучший IntelliSense', 'Ранее выявление ошибок', 'Trade-off: более медленная первоначальная разработка'],
          sampleAnswer: 'I chose TypeScript over JavaScript for this project for several reasons.\n\nFirst, static typing helps us catch errors at compile time rather than runtime. In our last project, we spent significant time debugging type-related issues that TypeScript would have prevented.\n\nSecond, the better IDE support — IntelliSense, autocompletion, and refactoring tools — will improve developer productivity, especially for new team members.\n\nThe main trade-off is the initial learning curve and slightly slower development speed at the start. However, I believe this will pay off in reduced bugs and better maintainability long-term.'
        },
        {
          scenario: 'Твоя команда выбрала PostgreSQL вместо MongoDB. Объясни это менеджеру (нетехническому).',
          keyPoints: ['ACID транзакции', 'Структурированные данные', 'Надёжность в финансовых операциях'],
          sampleAnswer: 'In simple terms, we\'re using PostgreSQL because our application handles financial transactions, and we need to guarantee that all operations are reliable and consistent.\n\nThink of it like a bank ledger: every debit must match a credit, and we can never lose a record. PostgreSQL is designed for exactly this kind of reliability.\n\nThe alternative we considered was more flexible but less strict about data consistency. For a social media app that would be fine, but for financial data, reliability matters more than flexibility.\n\nThis decision gives us the confidence that when a payment is processed, it\'s guaranteed to be recorded correctly.'
        }
      ]
    },
    {
      id: 7,
      title: 'Practice: Justify technology choices',
      type: 'practice',
      difficulty: 'medium',
      description: 'Для каждого технологического выбора составь 2-3 предложения обоснования.',
      solution: 'Примеры правильных обоснований:\n1. React vs Vue.js: "We chose React because our team has strong React expertise, reducing the learning curve. React\'s larger ecosystem means more third-party libraries and easier hiring. The trade-off is more boilerplate, but we mitigate this with our component library."\n2. Kubernetes: "We chose Kubernetes to scale individual services independently based on load. It handles automatic restarts of failed containers, improving reliability. The trade-off is operational complexity, but we\'re investing in DevOps training."',
      tasks: [
        {
          choice: 'React over Vue.js',
          hints: 'Экосистема, размер сообщества, опыт команды, рынок труда',
          sampleAnswer: 'We chose React over Vue.js primarily because our team already has strong React expertise, reducing the learning curve. Additionally, React\'s larger ecosystem and community means more third-party libraries and easier hiring. The trade-off is that React has more boilerplate, but we mitigate this with our existing component library.'
        },
        {
          choice: 'Kubernetes for container orchestration',
          hints: 'Масштабируемость, автовосстановление, стандарт индустрии',
          sampleAnswer: 'We decided to use Kubernetes since we need to scale individual services independently based on load. It also handles automatic restarts of failed containers, improving our system reliability. The trade-off is significant operational complexity, but we\'re investing in DevOps training to manage this.'
        }
      ]
    }
  ]
}
