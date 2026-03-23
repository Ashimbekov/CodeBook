export default {
  id: 21,
  title: 'Письмо: Architecture Decision Records',
  description: 'Как писать ADR — документы архитектурных решений на профессиональном английском',
  lessons: [
    {
      id: 1,
      title: 'Что такое ADR и зачем его писать',
      type: 'theory',
      content: [
        { type: 'text', value: 'ADR (Architecture Decision Record) — документ, фиксирующий важное архитектурное решение, его контекст и последствия. ADR отвечает на вопрос: "Почему мы сделали именно так?"' },
        { type: 'heading', value: 'Зачем нужны ADR' },
        { type: 'list', items: [
          'Новые члены команды понимают, почему система устроена именно так',
          'Предотвращение повторного обсуждения уже принятых решений',
          'Понимание контекста позволяет безопасно изменить решение',
          'Документирование альтернатив, которые были рассмотрены и отвергнуты',
          'Accountability — кто принял решение и почему'
        ]},
        { type: 'heading', value: 'Когда создавать ADR' },
        { type: 'text', value: '"Create an ADR for any architecturally significant decision."\n"Significant = hard to reverse, affects multiple teams, has long-term impact."\n"Examples: choice of database, message broker, authentication approach, API style (REST vs GraphQL)."' },
        { type: 'tip', value: 'Формат Michael Nygard — самый распространённый: Title, Status, Context, Decision, Consequences. Именно этот формат используется в большинстве open-source проектов.' }
      ]
    },
    {
      id: 2,
      title: 'Структура и разделы ADR',
      type: 'theory',
      content: [
        { type: 'text', value: 'Стандартный ADR состоит из нескольких ключевых разделов, каждый из которых выполняет определённую роль.' },
        { type: 'heading', value: 'Title' },
        { type: 'text', value: '"The title should clearly state the decision, not the problem."\n"Good: \'Use PostgreSQL as the primary database\'" \n"Bad: \'Database selection\'"\n"Format: ADR-001: [Decision stated as a fact or action]"' },
        { type: 'heading', value: 'Status' },
        { type: 'text', value: '"Proposed: decision is being considered"\n"Accepted: decision has been agreed upon"\n"Deprecated: superseded by a newer decision"\n"Superseded by ADR-007: link to the replacement"' },
        { type: 'heading', value: 'Context' },
        { type: 'text', value: '"What is the situation that prompted this decision?"\n"Include: technical constraints, business requirements, team skills, timeline."\n"Write in present tense: \'The application needs to handle...\'"\n"Be specific about the forces at play."' },
        { type: 'heading', value: 'Decision' },
        { type: 'text', value: '"State the decision clearly and unambiguously."\n"\'We will use...\' or \'We have decided to...\' or simply the solution."\n"Explain briefly why this option was chosen over alternatives."' },
        { type: 'heading', value: 'Consequences' },
        { type: 'text', value: '"What are the positive and negative outcomes of this decision?"\n"Include: technical implications, operational considerations, skills required."\n"Don\'t shy away from negative consequences — honest documentation is more valuable."' }
      ]
    },
    {
      id: 3,
      title: 'Язык для описания Context',
      type: 'theory',
      content: [
        { type: 'text', value: 'Секция Context объясняет, почему решение было принято — это самая важная часть.' },
        { type: 'heading', value: 'Описание технических требований' },
        { type: 'text', value: '"The system is required to handle up to 10,000 concurrent users."\n"The data model is highly relational, with complex join queries."\n"The team has significant prior experience with PostgreSQL."\n"The service must comply with GDPR, requiring data to reside within the EU."' },
        { type: 'heading', value: 'Описание ограничений' },
        { type: 'text', value: '"We are constrained by a tight timeline, limiting the time available for learning new technologies."\n"The existing infrastructure already includes managed PostgreSQL instances."\n"Budget constraints preclude the adoption of enterprise licensing."' },
        { type: 'heading', value: 'Описание рассмотренных вариантов' },
        { type: 'text', value: '"The following options were considered:\n1. PostgreSQL: mature, strong ACID guarantees, team familiarity.\n2. MongoDB: flexible schema, but eventual consistency is not acceptable for financial data.\n3. DynamoDB: excellent scalability, but limited query flexibility and vendor lock-in."' }
      ]
    },
    {
      id: 4,
      title: 'Язык для Decision и Consequences',
      type: 'theory',
      content: [
        { type: 'text', value: 'Секция Decision должна быть однозначной, а Consequences — честной.' },
        { type: 'heading', value: 'Decision — формулировки' },
        { type: 'text', value: '"We will adopt PostgreSQL as the primary relational database."\n"We have decided to implement a microservices architecture, starting with the authentication and notification services."\n"The team will migrate from REST to GraphQL for the client-facing API layer."' },
        { type: 'heading', value: 'Positive consequences' },
        { type: 'text', value: '"This decision aligns with the team\'s existing expertise, minimising the learning curve."\n"PostgreSQL\'s ACID compliance ensures data integrity for financial operations."\n"The approach provides a clear migration path with no downtime for existing clients."' },
        { type: 'heading', value: 'Negative consequences' },
        { type: 'text', value: '"This introduces operational complexity for teams unfamiliar with the new framework."\n"Horizontal scaling of PostgreSQL requires additional architectural work (e.g., read replicas, connection pooling)."\n"The migration will require approximately 6 engineer-weeks of effort."\n"Teams dependent on this service will need to update their integration tests."' }
      ]
    },
    {
      id: 5,
      title: 'Extended ADR formats: MADR и Y-Statements',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существуют расширенные форматы ADR для более детального документирования.' },
        { type: 'heading', value: 'MADR (Markdown Architectural Decision Records)' },
        { type: 'text', value: '"MADR extends the basic format with: Considered Options, Pros and Cons of each option."\n"Each option includes a brief analysis: Good, because... / Bad, because..."\n"The chosen option is explained: We chose X because it has the best balance of A, B, and C."' },
        { type: 'heading', value: 'Y-Statement format' },
        { type: 'text', value: '"In the context of [situation], facing [concern], we decided [option], to achieve [quality], accepting [downside]."\n\nExample: "In the context of high-throughput data ingestion, facing the need for exactly-once semantics and ordered processing, we decided to use Apache Kafka, to achieve reliable event streaming with replay capability, accepting the operational complexity of managing a Kafka cluster."' },
        { type: 'tip', value: 'Y-Statements отлично подходят для краткого документирования в PR-описаниях. Они заставляют явно указать downside — самую часто пропускаемую часть.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: написание ADR',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите полный ADR для описанного сценария.',
      requirements: [
        'Используйте формат: Title, Status, Context, Decision, Consequences',
        'Context: минимум 3 ограничения/требования',
        'Consequences: минимум 2 позитивных и 2 негативных'
      ],
      hint: 'Сценарий: ваша компания выбирает между REST и GraphQL для нового публичного API. Команда небольшая, клиенты — мобильные приложения с разными данными.',
      solution: '# ADR-012: Adopt GraphQL for the Public Client API\n\n## Status\nAccepted\n\n## Context\nThe engineering team is designing a new public API to serve our mobile and web clients. The following forces have shaped this decision:\n\n- Mobile clients require different data subsets than web clients, leading to over-fetching and under-fetching problems with traditional REST endpoints.\n- The product team plans to iterate rapidly on the data requirements, which with REST would necessitate frequent API versioning.\n- The backend team has prior experience with GraphQL from an internal project and possesses the necessary expertise.\n- Our clients are first-party (our own mobile apps and web frontend), reducing concerns about discoverability for third-party developers.\n\nThe following options were considered:\n1. REST: well-understood, excellent tooling, easier to cache, but requires multiple endpoints and leads to over/under-fetching.\n2. GraphQL: single endpoint, flexible queries, strong typing, but more complex caching and steeper learning curve for API consumers.\n\n## Decision\nWe will adopt GraphQL for the client-facing API layer. The schema-first approach will be used, with schema definitions acting as the contract between frontend and backend teams.\n\n## Consequences\n**Positive:**\n- Frontend teams can request exactly the data they need, eliminating over-fetching and reducing mobile data consumption.\n- A single versioned schema replaces the need for multiple versioned REST endpoints.\n- Strong typing catches integration errors at development time rather than at runtime.\n\n**Negative:**\n- HTTP caching is not straightforward with GraphQL; we will need to implement application-level caching.\n- The operational complexity of the GraphQL server layer is higher than a simple REST API.\n- Third-party API consumers (if required in the future) may find GraphQL less familiar than REST.\n- Requires additional training for backend engineers who will implement resolvers.',
      explanation: 'Хорошо написанный ADR — одна из самых ценных вещей, которую инженер может оставить команде. Он объясняет прошлые решения и позволяет будущим инженерам изменить их с пониманием контекста.'
    },
    {
      id: 7,
      title: 'Практика: Y-Statement и review ADR',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите Y-Statement и проведите review существующего ADR.',
      requirements: [
        'Напишите Y-Statement для сценария',
        'Найдите проблемы в предложенном ADR',
        'Предложите улучшения'
      ],
      questions: [
        { text: 'Write a Y-Statement for: Choosing Redis for session storage instead of storing sessions in the database.', answer: 'In the context of a high-traffic web application requiring fast session lookups, facing the performance bottleneck of database-backed sessions under concurrent load, we decided to use Redis as the session store, to achieve sub-millisecond session read/write latency and horizontal scalability, accepting the operational overhead of managing an additional infrastructure component and the risk of session data loss if Redis is not configured with persistence.', explanation: 'Y-Statement структура: In the context of [ситуация], facing [проблема], we decided [решение], to achieve [цель], accepting [компромис]. Ключевое — явное указание "accepting" — честное признание downside.' }
      ],
      solution: 'Правильные ответы:\n1. In the context of a high-traffic web application requiring fast session lookups, facing the performance bottleneck of database-backed sessions under concurrent load, we decided to use Redis as the session store, to achieve sub-millisecond session read/write latency and horizontal scalability, accept',
      hint: 'Y-Statement должен быть одним предложением с пятью частями. Каждая часть начинается с ключевых слов: "In the context of", "facing", "we decided", "to achieve", "accepting".',
      explanation: 'Y-Statements и ADR — дополняющие инструменты. Y-Statement для быстрого документирования в PR; полный ADR для важных решений, требующих детального обоснования.'
    }
  ]
}
