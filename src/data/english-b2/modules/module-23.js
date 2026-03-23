export default {
  id: 23,
  title: 'Разговорные: Tech Interview (System Design)',
  description: 'Как проходить system design интервью на английском: структура, фразы, типичные вопросы',
  lessons: [
    {
      id: 1,
      title: 'Структура system design интервью',
      type: 'theory',
      content: [
        { type: 'text', value: 'System design интервью — один из самых сложных этапов для senior-инженеров. Знание языковых паттернов так же важно, как и технические знания.' },
        { type: 'heading', value: 'Типичная структура (45-60 минут)' },
        { type: 'list', items: [
          '0-5 мин: прояснить требования (clarify requirements)',
          '5-10 мин: оценка масштаба (capacity estimation)',
          '10-15 мин: high-level design',
          '15-35 мин: deep dive в конкретные компоненты',
          '35-45 мин: обсуждение trade-offs и улучшений',
          '45-60 мин: вопросы интервьюеру'
        ]},
        { type: 'heading', value: 'Что оценивает интервьюер' },
        { type: 'text', value: '"Can the candidate lead a technical discussion?"\n"Do they ask clarifying questions before jumping to solutions?"\n"Can they reason about trade-offs rather than giving definitive \'best\' answers?"\n"Do they drive the conversation, or do they need to be led?"' },
        { type: 'tip', value: 'Золотое правило: не молчите. Думайте вслух. Даже если вы не знаете ответа, покажите свой мыслительный процесс: "I\'m not sure about the exact number, but let me reason through this..."' }
      ]
    },
    {
      id: 2,
      title: 'Фазы 1-2: Clarifying Requirements и Capacity Estimation',
      type: 'theory',
      content: [
        { type: 'text', value: 'Никогда не начинайте дизайн без прояснения требований. Это демонстрирует зрелость инженера.' },
        { type: 'heading', value: 'Фразы для прояснения требований' },
        { type: 'text', value: '"Before I dive into the design, I\'d like to clarify a few things."\n"What is the expected scale? How many users / requests per second are we targeting?"\n"Are we designing for global availability or a single region?"\n"What are the most critical features for the first version?"\n"Are there any latency requirements? What is acceptable response time?"\n"Do we have any constraints on the technology stack?"' },
        { type: 'heading', value: 'Capacity Estimation phrases' },
        { type: 'text', value: '"Let me do a rough capacity estimate."\n"Assuming 10 million daily active users, and each user makes about 10 requests per day, that\'s roughly 100 million requests per day."\n"Dividing by 86,400 seconds, we get approximately 1,200 requests per second on average."\n"Assuming a 10x peak factor, we should plan for around 12,000 requests per second at peak."' },
        { type: 'tip', value: 'Стандартные числа для оценки: 1 day = 86,400 seconds; 1 month ≈ 2.5 million seconds; 1 year ≈ 30 million seconds. Запомните их — они часто нужны в capacity estimation.' }
      ]
    },
    {
      id: 3,
      title: 'Фаза 3-4: High-level Design и Deep Dive',
      type: 'theory',
      content: [
        { type: 'text', value: 'High-level design — это набросок архитектуры. Deep dive — углубление в ключевые компоненты.' },
        { type: 'heading', value: 'High-level design phrases' },
        { type: 'text', value: '"Let me start with a high-level overview and then we can deep dive into specific components."\n"At a high level, the system consists of three main components: [list them]."\n"The client sends requests to the API gateway, which routes them to the appropriate microservice."\n"Let me draw this out..."' },
        { type: 'heading', value: 'Deep dive transitions' },
        { type: 'text', value: '"Would you like me to go deeper on any particular component?"\n"The most interesting engineering challenge here is the database layer. Let me elaborate."\n"I\'d like to spend some time on the data model — I think this is where the complexity lies."\n"Let\'s discuss how we would handle failures in this component."' },
        { type: 'heading', value: 'Описание компонентов' },
        { type: 'text', value: '"The service is stateless, so it can be horizontally scaled behind a load balancer."\n"We\'ll use a read-through cache to reduce database load for frequently accessed data."\n"The queue decouples the producer from the consumer, allowing asynchronous processing."' }
      ]
    },
    {
      id: 4,
      title: 'Trade-offs: как обсуждать компромиссы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Умение обсуждать trade-offs — один из главных сигналов для интервьюера, что кандидат — senior.' },
        { type: 'heading', value: 'Фразы для trade-offs' },
        { type: 'text', value: '"This is a classic trade-off between consistency and availability."\n"Option A gives us better performance, but at the cost of increased complexity."\n"I chose this approach because [benefit], accepting [downside]."\n"There are two main approaches here, each with different trade-offs."\n"This works well for our read-heavy workload, but if writes dominated, I would choose differently."' },
        { type: 'heading', value: 'Признание неуверенности' },
        { type: 'text', value: '"I\'m not 100% sure on the exact numbers, but the order of magnitude should be correct."\n"I haven\'t worked with this technology specifically, but based on first principles..."\n"This is an area where I\'d want to validate with benchmarks before committing."\n"Good question — I\'m thinking through the implications."' },
        { type: 'tip', value: 'Признание неуверенности — признак зрелости, не слабости. Интервьюеры предпочитают кандидата, который говорит "I\'m not sure, but let me reason through it", а не уверенно даёт неверный ответ.' }
      ]
    },
    {
      id: 5,
      title: 'Типичные system design вопросы и шаблоны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Большинство system design вопросов следуют предсказуемым паттернам.' },
        { type: 'heading', value: 'URL Shortener (TinyURL)' },
        { type: 'text', value: '"Key design decisions: hash generation (base-62 encoding vs MD5), storage (SQL vs NoSQL), redirection (301 vs 302), analytics."\n"Useful phrase: \'The core challenge is generating short, unique, collision-free keys at scale.\'"' },
        { type: 'heading', value: 'News Feed (Twitter/Facebook)' },
        { type: 'text', value: '"Key decisions: fanout on write vs fanout on read, caching strategy, ranking algorithm."\n"Useful phrase: \'For celebrities with millions of followers, fanout on write would be prohibitively expensive. We\'d use a hybrid approach.\'"' },
        { type: 'heading', value: 'Rate Limiter' },
        { type: 'text', value: '"Key decisions: algorithm (token bucket, leaky bucket, sliding window), storage (in-memory vs distributed)."\n"Useful phrase: \'Distributed rate limiting requires atomic operations across multiple servers — Redis with Lua scripts is a common solution.\'"' },
        { type: 'heading', value: 'Distributed Cache' },
        { type: 'text', value: '"Key decisions: eviction policy (LRU, LFU), consistent hashing for distribution, write strategy (write-through vs write-behind)."\n"Useful phrase: \'Cache invalidation is one of the two hard problems in computer science — let me walk through how we\'d handle it.\'"' }
      ]
    },
    {
      id: 6,
      title: 'Вопросы интервьюеру и завершение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Конец интервью — не менее важен, чем начало. Грамотные вопросы показывают вашу серьёзность и интерес.' },
        { type: 'heading', value: 'Технические вопросы' },
        { type: 'text', value: '"What is the biggest technical challenge the team is facing right now?"\n"How does the team approach architectural decisions — is there a formal review process?"\n"What does the on-call rotation look like for this team?"\n"How is technical debt managed in the current codebase?"' },
        { type: 'heading', value: 'Вопросы о культуре и процессах' },
        { type: 'text', value: '"How does the team balance shipping new features with maintaining code quality?"\n"What does the engineering onboarding process look like?"\n"How autonomous are engineers in making technical decisions?"\n"What does success look like for this role in the first 6 months?"' }
      ]
    },
    {
      id: 7,
      title: 'Практика: mock system design interview',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проведите полное mock system design интервью.',
      requirements: [
        'Соблюдайте структуру: clarify → estimate → design → deep dive → trade-offs',
        'Используйте фразы из урока',
        'Покажите умение обсуждать trade-offs',
        'Вопрос: "Design a ride-sharing service like Uber"'
      ],
      hint: 'Начните с вопросов: сколько пользователей, какие функции (только matching? или история поездок, платежи?), география.',
      solution: 'MOCK INTERVIEW RESPONSE:\n\n"Before I dive in, let me clarify a few requirements. Are we designing the full platform including payments and driver management, or just the core matching system? And what\'s our target scale — primarily one city or global?\n\nOk, let me do a rough estimate. Assuming 5 million daily active users in one city, and an average of 2 rides per day, that\'s 10 million ride requests per day, or about 115 per second on average. With a 5x peak factor, we should design for around 600 requests per second.\n\nAt a high level, the system needs three core capabilities: location tracking, matching, and trip management. I\'ll start with the high-level architecture and then we can deep dive.\n\nFor location tracking, drivers stream their GPS coordinates every 5 seconds. We need a geospatial store — I\'d use Redis with the GEO module for efficient proximity queries. The challenge is write throughput: 100,000 active drivers sending updates every 5 seconds is 20,000 writes per second — Redis handles this comfortably.\n\nFor matching, when a rider requests a ride, we query Redis for the nearest available drivers within a configurable radius. The matching service considers: distance, driver rating, and ETA. This is a trade-off: simple nearest-first matching is fast but may overlook driver who could arrive at the same time with a higher rating.\n\nThe main trade-off in this design is consistency vs. availability. Multiple riders might be matched to the same driver simultaneously. I\'d handle this with optimistic locking on the driver\'s status in Redis — first match wins.\n\nWhat would you like to deep dive into — the geospatial queries, the matching algorithm, or the trip management?"',
      explanation: 'Хороший system design ответ показывает structured thinking, не идеальное знание. Clarify first, estimate, design top-down, discuss trade-offs, invite follow-up questions.'
    },
    {
      id: 8,
      title: 'Практика: формулировки для сложных ситуаций',
      type: 'practice',
      difficulty: 'medium',
      description: 'Как отвечать, когда не знаешь ответа на интервью.',
      requirements: [
        'Ответьте на каждый вопрос, используя техники обработки неопределённости',
        'Не молчите — думайте вслух',
        'Покажите процесс рассуждения'
      ],
      questions: [
        { text: 'Interviewer: "What\'s the maximum throughput of a single Kafka partition?"\nYou don\'t remember the exact number. How do you respond?', answer: '"That\'s a good question. I don\'t have the exact figure off the top of my head, but let me reason through it. A Kafka partition is fundamentally limited by the underlying storage throughput and network bandwidth. Sequential disk writes — which Kafka uses — can achieve around 500MB/s on modern NVMe drives. With typical messages in the range of 1-10KB, that would suggest somewhere in the range of 50,000 to 500,000 messages per second per partition. I believe Kafka\'s documented throughput is in the hundreds of MB/s range per partition. I\'d want to verify the exact number before committing to it in a production design — I would run a benchmark for our specific hardware and message sizes."', explanation: 'Техники обработки незнания: 1) Признать, что не помнишь точно; 2) Рассуждать от первых принципов; 3) Дать оценочный диапазон; 4) Сказать, как бы проверил. Это намного лучше, чем молчать или угадывать.' }
      ],
      solution: 'Правильные ответы:\n1. "That\\\'s a good question. I don\\\'t have the exact figure off the top of my head, but let me reason through it. A Kafka partition is fundamentally limited by the underlying storage throughput and network...',
      hint: '"I don\'t know" alone is a bad answer. "I don\'t know exactly, but let me think through it..." показывает мышление. Reasoning ability is what matters, not memorized facts.',
      explanation: 'System design интервью — это не викторина на знание фактов. Это оценка мышления. Кандидат, который говорит "I don\'t know but here\'s how I\'d reason about it", часто лучше кандидата, который угадывает уверенно.'
    }
  ]
}
