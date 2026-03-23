export default {
  id: 33,
  title: 'Практикум: Tech Interview',
  description: 'Интенсивная практика для технических собеседований: system design, behavioural, coding discussion',
  lessons: [
    {
      id: 1,
      title: 'Практика: Clarifying requirements',
      type: 'practice',
      difficulty: 'medium',
      description: 'Отработайте вопросы для прояснения требований на system design интервью.',
      requirements: ['Задайте минимум 5 уточняющих вопросов', 'Охватите: scale, features, constraints, SLA', 'Не начинайте дизайн без ответов'],
      questions: [
        { text: 'Interviewer: "Design a URL shortener like bit.ly."\n\nWhat clarifying questions do you ask before starting?', answer: 'Before I start: 1) What is the scale — URLs shortened per day, redirects per second? 2) Do we need analytics (click tracking, geo data)? 3) How long should URLs remain active — any expiry? 4) Do we need custom aliases? 5) What are the latency requirements for redirects? 6) Single region or global availability?', explanation: 'Good clarifying questions cover: scale, features, data retention, latency SLAs, geographic requirements.' }
      ],
      hint: 'Cover four areas: Scale (how big?), Features (what exactly?), Constraints (latency, availability?), Non-functional requirements (security, compliance?).',
      solution: 'Правильные ответы:\n1. Five key questions: scale (URLs/day, redirects/sec), analytics needed?, URL expiry?, custom aliases?, latency SLA for redirects?, regional vs global?',
      explanation: 'Clarifying requirements before diving into design is one of the strongest signals of engineering maturity. Interviewers specifically watch for this.'
    },
    {
      id: 2,
      title: 'Практика: Capacity estimation',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведите расчёт нагрузки для системы.',
      requirements: ['Используйте правильные единицы', 'Показывайте расчёты пошагово', 'Делайте допущения явными'],
      questions: [
        { text: 'System: Social media platform — 50 million DAU, each user views 20 posts/day.\nCalculate average RPS and peak RPS.', answer: 'Total requests/day: 50,000,000 × 20 = 1,000,000,000 (1 billion)\nAverage RPS: 1,000,000,000 / 86,400 ≈ 11,574 ≈ ~12,000 RPS\nPeak RPS (3x factor): 12,000 × 3 = ~36,000 RPS', explanation: '1 day ≈ 86,400 seconds. Round to nice numbers. State assumptions explicitly. Peak factor is typically 2-5x average.' }
      ],
      hint: 'Steps: 1) Daily total = DAU × actions/user. 2) Average RPS = daily / 86,400. 3) Peak = average × peak multiplier (2-5x).',
      solution: 'Правильные ответы:\n1. Daily total: 50M × 20 = 1B requests/day.\nAverage RPS: 1B / 86,400 ≈ 12,000 RPS.\nPeak RPS: 12,000 × 3 = ~36,000 RPS.',
      explanation: 'Capacity estimation shows you can reason quantitatively about systems. Always show your math and state assumptions — the process matters more than the exact number.'
    },
    {
      id: 3,
      title: 'Практика: High-level architecture explanation',
      type: 'practice',
      difficulty: 'hard',
      description: 'Опишите высокоуровневую архитектуру системы чётко и структурированно.',
      requirements: ['Назовите все ключевые компоненты', 'Объясните поток данных', 'Упомяните масштабирование'],
      questions: [
        { text: 'Describe the high-level architecture for a notification service (push, email, in-app) for 10 million users.', answer: 'Four main components:\n1. Notification API: accepts requests, validates, publishes to Kafka.\n2. Kafka: separate topics per channel (push, email, in-app) for independent scaling.\n3. Channel Workers: push worker → FCM/APNs, email worker → SendGrid, in-app worker → database.\n4. Storage: Redis for recent delivery status (fast lookups), PostgreSQL for full notification history.\nScaling: Kafka consumers scale horizontally; API layer is stateless behind a load balancer.', explanation: 'Structure: API layer → queue → workers → storage. Explain each component\'s role and connections.' }
      ],
      hint: 'Use the pattern: ingestion → queue → processing → storage. Walk through from the perspective of one notification request.',
      solution: 'Правильные ответы:\n1. Components: Notification API → Kafka (per-channel topics) → Channel Workers (push/email/in-app) → Storage (Redis + PostgreSQL).\nScaling: Kafka consumer horizontal scaling, stateless API behind load balancer.',
      explanation: 'Clear component-by-component explanation with data flow is the expected output of the high-level design phase.'
    },
    {
      id: 4,
      title: 'Практика: Trade-off discussion',
      type: 'practice',
      difficulty: 'hard',
      description: 'Аргументируйте архитектурное решение с обсуждением компромиссов.',
      requirements: ['Назовите минимум 2 альтернативы', 'Объясните выбор через trade-offs', 'Признайте недостатки выбранного решения'],
      questions: [
        { text: 'Compare PostgreSQL vs MongoDB for a financial transactions system. Which do you choose and why?', answer: 'Choose PostgreSQL for financial transactions.\nReasons: ACID compliance (atomicity essential for payments), strong consistency (no stale reads), complex queries/joins for reporting.\nMongoDB trade-offs that make it unsuitable: eventual consistency risks double-spending; flexible schema provides no benefit for well-defined financial data.\nPostgreSQL downside: horizontal scaling is harder — requires read replicas and connection pooling. This trade-off is worth it for correctness.', explanation: 'Strong trade-off discussion: names both options, explains fit to use case, honestly acknowledges the downside of the chosen option.' }
      ],
      hint: 'Structure: Option A pros/cons for THIS use case → Option B pros/cons → why A wins → what you sacrifice by choosing A.',
      solution: 'Правильные ответы:\n1. PostgreSQL for financial systems: ACID compliance, strong consistency, complex queries.\nMongoDB unsuitable: eventual consistency risks, no schema benefit.\nAccepted trade-off: PostgreSQL horizontal scaling harder, but correctness outweighs scalability for financial data.',
      explanation: 'Decision-making with explicit trade-offs is what distinguishes senior engineers in interviews. Always explain what you\'re giving up.'
    },
    {
      id: 5,
      title: 'Практика: STAR method — behavioural interview',
      type: 'practice',
      difficulty: 'medium',
      description: 'Структурированный ответ на поведенческие вопросы.',
      requirements: ['Используйте структуру: Situation → Task → Action → Result', 'Конкретные числа в Result', 'Личное действие, а не "мы"'],
      questions: [
        { text: 'Tell me about a time you had to deal with a technical disagreement within the team.', answer: 'SITUATION: Our team debated session storage: database-backed (current) vs Redis. I believed Redis was correct; senior engineer preferred PostgreSQL to avoid infrastructure complexity.\nTASK: Decide within one sprint — performance issues from database sessions were affecting users.\nACTION: Instead of debating opinions, I proposed a benchmark. I set up a test environment, simulated 5,000 concurrent users, measured P99 latency for both approaches, documented operational overhead, presented results.\nRESULT: Redis was 12x faster (0.3ms vs 3.8ms P99). Team agreed to migrate. Production P99 session latency dropped from 120ms to 18ms. The engineer who disagreed became Redis\'s strongest advocate.', explanation: 'STAR answers are concrete, show initiative, and quantify outcomes. Avoid vague "we improved performance" — say by how much.' }
      ],
      hint: 'S: context (1-2 sentences). T: your specific role. A: what YOU did (not "we"). R: measurable outcome + lesson learned.',
      solution: 'Правильные ответы:\n1. STAR structure with: specific context (5,000 concurrent users), personal initiative (proposed benchmark), quantified result (12x faster, P99 120ms → 18ms), positive team outcome.',
      explanation: 'STAR format is expected at most tech companies. Practice it until natural — it shows you can communicate clearly under pressure.'
    },
    {
      id: 6,
      title: 'Практика: Database schema design',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спроектируйте схему базы данных для системы.',
      requirements: ['Назовите основные таблицы и ключевые поля', 'Обоснуйте выбор PK', 'Укажите индексы и их назначение'],
      questions: [
        { text: 'Design the core database schema for a ride-sharing service. Name the main tables, key fields, and important indexes.', answer: 'Core tables:\nUSERS: user_id (UUID PK), email (UNIQUE), name, phone_number, created_at\nDRIVERS: driver_id (UUID PK), user_id (FK), status (ENUM: available/on_trip/offline), rating (DECIMAL 3,2), current_lat, current_lng\nTRIPS: trip_id (UUID PK), rider_id (FK→users), driver_id (FK→drivers), status (ENUM: requested/accepted/in_progress/completed/cancelled), pickup_lat/lng, dropoff_lat/lng, fare_amount, requested_at, completed_at\n\nKey indexes:\n- drivers(status) — find available drivers\n- drivers(current_lat, current_lng) — geospatial index for proximity\n- trips(rider_id, requested_at) — user\'s trip history\n- trips(driver_id, status) — driver\'s active trips\n\nUUID PKs chosen for global uniqueness in distributed system.', explanation: 'Database design: identify entities, FK relationships, then ask: what queries run? Design indexes for those queries.' }
      ],
      hint: 'Identify entities first (nouns: user, driver, trip). Then relationships (FK). Then: what queries will run most? Design indexes for those.',
      solution: 'Правильные ответы:\n1. Tables: USERS, DRIVERS (with location + status), TRIPS (with FK to both).\nIndexes: drivers(status) for availability, geospatial on driver location, trips(rider_id) for history.\nDesign justification: UUID PKs, ENUM for status, separate lat/lng columns with geospatial index.',
      explanation: 'Database schema shows breadth: entity modelling, key choices, index design, and awareness of query patterns.'
    },
    {
      id: 7,
      title: 'Практика: Algorithm explanation',
      type: 'practice',
      difficulty: 'hard',
      description: 'Объясните алгоритмическое решение на английском с указанием complexity.',
      requirements: ['Опишите подход словами', 'Назовите time и space complexity', 'Обсудите edge cases и альтернативы'],
      questions: [
        { text: 'Explain your approach to finding two numbers in an array that sum to a target. Discuss complexity and edge cases.', answer: 'Approach: Hash set solution for O(n) time.\nFor each element, calculate complement = target - current. Check if complement exists in hash set. If yes → found pair. If no → add current to set, continue.\nTime: O(n) — single pass, O(1) lookups.\nSpace: O(n) — hash set stores up to n elements.\nEdge cases: empty array (return null), no solution exists (return null), duplicate elements (handled by set), target = 2×same element (check complement != current index).\nAlternative: sort + two pointers = O(n log n) time, O(1) space — better if memory constrained.', explanation: 'Algorithmic explanation: name approach, describe step by step, state Big O with justification, list edge cases, mention alternatives with trade-offs.' }
      ],
      hint: 'Structure: 1) Name the approach. 2) Describe step by step. 3) State Big O. 4) List edge cases. 5) Mention alternatives.',
      solution: 'Правильные ответы:\n1. Hash set: for each element, check if complement (target - element) in set. O(n) time, O(n) space.\nEdge cases: empty array, no solution, duplicates, target = 2× same element.\nAlternative: sort + two pointers O(n log n) time, O(1) space.',
      explanation: 'Explaining thinking out loud in English is as important as the solution. Interviewers evaluate communication skills alongside algorithmic thinking.'
    },
    {
      id: 8,
      title: 'Практика: Questions for the interviewer',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите умные вопросы для интервьюера в конце собеседования.',
      requirements: ['Минимум 5 вопросов', 'Покажите технический интерес и интерес к культуре', 'Избегайте вопросов о зарплате и льготах'],
      questions: [
        { text: 'You are at the end of a system design interview at a company building a large-scale data platform. What 5 questions do you ask?', answer: '1. "What is the biggest technical challenge the data platform team is currently facing — scale, latency, or data correctness?"\n2. "How does the team approach architectural decisions — formal RFC/ADR process, or more informal?"\n3. "What does the on-call rotation look like, and what is a typical incident response like?"\n4. "How does the team balance shipping new features with addressing technical debt?"\n5. "What does success look like for this role in the first six months — what would I need to achieve to make a clear positive impact?"', explanation: 'Good questions signal genuine interest, show you think about culture, and help you evaluate whether the role is right for you.' }
      ],
      hint: 'Question categories: technical challenges, team processes, culture, growth, success metrics. Avoid: salary, vacation, perks.',
      solution: 'Правильные ответы:\n1. Five questions covering: biggest technical challenge, decision-making process, on-call/incidents, tech debt balance, definition of success in the role.',
      explanation: 'The questions you ask reveal what you value. Technical, thoughtful questions show you\'re evaluating the role as much as they\'re evaluating you.'
    },
    {
      id: 9,
      title: 'Практика: Thinking out loud — Fermi estimation',
      type: 'practice',
      difficulty: 'medium',
      description: 'Практикуйте озвучивание мыслей при неизвестности.',
      requirements: ['Разбейте проблему на оцениваемые части', 'Делайте допущения явными', 'Давайте диапазон, не точное число'],
      questions: [
        { text: 'Fermi question: "How many piano tuners are there in New York City?" Think out loud.', answer: '"Let me reason through this.\nNYC has ~8 million people, ~3.2 million households. Assume 1 piano per 100 households = 32,000 pianos.\nPianos tuned 1.5x per year = 48,000 tuning jobs/year.\nTuning takes ~2 hours including travel. Tuner works 1,000 tuning jobs/year.\n48,000 / 1,000 = 48 piano tuners.\nEstimate: ~50 piano tuners. Could be 2-5x off in either direction, but the order of magnitude should be right."', explanation: 'Fermi estimation tests structured thinking. Interviewer wants to see how you decompose the problem, make reasonable assumptions, and work through uncertainty.' }
      ],
      hint: 'Break the problem into estimable sub-problems. State each assumption. Show your math. Give a range, not a precise number.',
      solution: 'Правильные ответы:\n1. Decompose: population → pianos per household → total pianos → tunings/year → time per tuning → tuner capacity → number of tuners.\nAnswer: ~50 piano tuners. Acceptable range: 20-200. What matters is structured reasoning.',
      explanation: 'Fermi questions assess how you handle uncertainty. Structured reasoning from first principles is the skill being evaluated, not the exact answer.'
    },
    {
      id: 10,
      title: 'Mock interview: Design URL Shortener',
      type: 'practice',
      difficulty: 'hard',
      description: 'Полное mock-интервью: design a URL shortener system.',
      requirements: [
        'Структура: clarify → estimate → design → deep dive → trade-offs',
        'Включите key design decisions, database choice, scaling',
        'Длина: 300-400 слов'
      ],
      hint: 'Focus areas: key generation (base-62 vs hash), redirect type (301 vs 302), storage (SQL for analytics vs KV for redirects), caching strategy.',
      solution: 'MOCK INTERVIEW — URL Shortener:\n\nClarify: "Scale (URLs/day, redirects/sec)? Analytics needed? URL expiry? Custom aliases? Latency SLA?"\n\nAssuming: 100M new URLs/day, 10B redirects/day, 5-year retention.\n\nCapacity: 10B redirects/day ÷ 86,400 = ~115,000 RPS average, ~350,000 peak.\n\nHigh-level design:\n1. Shortening Service → generates base-62 key → writes to PostgreSQL\n2. Redirect Service (stateless, read-heavy) → reads from Redis cache → falls back to PostgreSQL\n3. Redis: maps short code → long URL with TTL\n4. PostgreSQL: full record (short_url, long_url, user_id, created_at, expires_at, click_count)\n\nKey generation: base-62 counter encoding (0-9, a-z, A-Z). 6 chars = 56B unique keys.\n\nRedirect type: 301 (permanent, browser caches) for performance; 302 (temporary) if analytics required.\n\nTrade-off: 301 faster (no server roundtrip after first visit) but loses click analytics. Choose based on requirements.',
      explanation: 'A complete system design answer covers all phases. Structured thinking — not memorised answers — is what gets you the offer.'
    }
  ]
}
