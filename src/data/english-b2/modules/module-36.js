export default {
  id: 36,
  title: 'Практикум: Реальные ситуации',
  description: 'Практика реальных рабочих ситуаций: инциденты, переговоры, митинги, code review',
  lessons: [
    {
      id: 1,
      title: 'Практика: Incident response communication',
      type: 'practice',
      difficulty: 'hard',
      description: 'Коммуникация во время реального инцидента.',
      requirements: ['Быстро и ясно', 'Правильный регистр для каждой аудитории', 'Структурированные обновления'],
      questions: [
        { text: 'Production incident: payment service down for 15 minutes, affecting 2% of users.\nWrite: 1) Slack update for engineering team (now), 2) Status page update (public-facing)', answer: '1. SLACK (engineering team):\n"@oncall @payments-team P1 in progress — payment service returning 503s since 14:23 UTC. ~2% of users affected (checkout flow only). I\'m looking at the logs now — looks like the DB connection pool is exhausted. Rolling back v2.4.1 now as mitigation. ETA on recovery: 15 min. AFAICT no data loss. Will update in 10."\n\n2. STATUS PAGE (public):\n"Investigating — Payment Processing\nWe are currently investigating reports of payment failures affecting a small number of users. Our engineering team is actively working to resolve the issue. We will provide an update within 15 minutes.\nUpdated: 14:35 UTC"', explanation: 'Internal: fast, jargon-heavy, technical detail, action-oriented. Public: calm, no technical detail, clear ETA, reassuring.' }
      ],
      hint: 'Internal Slack: who, what, impact, action, ETA. Status page: no jargon, no blame, clear ETA, we\'re on it.',
      solution: 'Правильные ответы:\n1. Internal Slack: technical details (503s, DB connection pool, rollback), personal ownership ("I\'m looking"), ETA, brief ("no data loss").\nStatus page: plain language, no technical details, ETA commitment, timestamp.',
      explanation: 'Incident communication is a critical skill. The right message to the right audience at the right time reduces confusion and maintains trust.'
    },
    {
      id: 2,
      title: 'Практика: Salary negotiation',
      type: 'practice',
      difficulty: 'hard',
      description: 'Переговоры о зарплате на английском.',
      requirements: ['Уверенно, но не агрессивно', 'Обосновывайте запрос', 'Знайте свои bottom line'],
      questions: [
        { text: 'The recruiter offers $140,000. Your target is $160,000. How do you respond?', answer: '"Thank you for the offer — I\'m genuinely excited about this opportunity and the team.\n\nAfter reviewing the details, the base salary is below what I\'m targeting. Based on my experience with distributed systems at scale, the impact I\'ve had on system reliability at my current role (reduced P99 latency by 60%, zero major incidents in 18 months), and the current market rate for senior engineers in this area, I\'m targeting $160,000 base.\n\nIs there flexibility to move in that direction? I\'m happy to discuss the full compensation package — equity, bonus, or other components — if that\'s more workable."', explanation: 'Negotiation structure: express genuine interest, state your number confidently, justify with specific evidence, ask a question rather than issuing an ultimatum.' }
      ],
      hint: 'Negotiation formula: 1) Positive framing ("excited"). 2) State what you\'re targeting, not what they offered. 3) Justify with evidence. 4) Ask a question, not ultimatum.',
      solution: 'Правильные ответы:\n1. Structure: genuine interest → state target ($160K) → justify with evidence (specific accomplishments) → ask about flexibility → open to package discussion.',
      explanation: 'Salary negotiation in English follows predictable patterns. Prepare your justification in advance: specific achievements, market data, your value proposition.'
    },
    {
      id: 3,
      title: 'Практика: Sprint planning discussion',
      type: 'practice',
      difficulty: 'medium',
      description: 'Участие в sprint planning на английском.',
      requirements: ['Оцените story points обоснованно', 'Спросите уточняющие вопросы', 'Выразите опасения конструктивно'],
      questions: [
        { text: 'Your PM says: "This feature should be 3 story points — just add a new field to the database and show it in the UI."\n\nYou believe it\'s actually 8 points. How do you respond?', answer: '"I want to make sure we\'re aligned on the scope before we commit to 3 points.\n\nOn the surface, yes — a field and a UI element sounds simple. But there are a few things that I think make this more complex:\n\nFirst, the field needs to be backfilled for the 2 million existing records — that\'s a migration that needs to run without downtime, which adds complexity.\n\nSecond, this field will need to be indexed for the search functionality you mentioned last week.\n\nThird, the UI change touches the shared form component, which means we need regression testing across three other features that use it.\n\nWith those in mind, I\'d estimate this at 8 points, not 3. Want me to break it down into smaller tickets so we can see if any parts can be de-scoped?"', explanation: 'Sprint planning pushback: acknowledge their perspective, list specific technical reasons with concrete details, offer a constructive path forward (decompose).' }
      ],
      hint: 'When pushing back on estimates: 1) Acknowledge the surface simplicity. 2) List specific hidden complexity with details. 3) Offer a constructive alternative (decompose, descope).',
      solution: 'Правильные ответы:\n1. Structure: align on scope first → list specific hidden complexity (migration 2M records, index needed, shared component regression) → give revised estimate (8 pts) → offer to decompose.',
      explanation: 'Estimate pushback requires evidence, not just "I think it\'s more complex." Specific technical reasons build credibility and lead to better planning.'
    },
    {
      id: 4,
      title: 'Практика: Code review conversation',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите и ответьте на code review комментарии профессионально.',
      requirements: ['Конструктивный тон', 'Техническое обоснование', 'Разные уровни критики'],
      questions: [
        { text: 'Write code review comments for this Python function:\n\ndef get_user(user_id):\n    user = db.query("SELECT * FROM users WHERE id = " + user_id)\n    if user:\n        return user\n    return None', answer: 'BLOCKING — Security:\n"This is vulnerable to SQL injection — user_id is concatenated directly into the query string. An attacker could pass something like \'1 OR 1=1\' to access all records. Use parameterised queries:\n`db.query("SELECT * FROM users WHERE id = %s", (user_id,))`"\n\nRECOMMENDATION — SELECT * :\n"Consider selecting only the fields you need instead of SELECT *. This reduces data transfer, avoids accidentally exposing sensitive fields (e.g., password_hash), and makes the code\'s intent clearer."\n\nSUGGESTION — Return type:\n"The function returns either a user object or None, which is fine, but consider raising a UserNotFoundError instead of returning None for the not-found case. This makes error handling explicit for callers rather than requiring them to check for None."\n\nNIT:\n"nit: The `if user: return user` check could be simplified to just `return user` — if user is None, that\'s returned anyway."', explanation: 'Code review levels: blocking (security), recommendation (best practice), suggestion (design choice), nit (style). Each justified with explanation.' }
      ],
      hint: 'Code review levels: BLOCKING (must fix), RECOMMENDATION (should fix), SUGGESTION (could improve), NIT (minor style). Each with a specific reason and often a concrete fix.',
      solution: 'Правильные ответы:\n1. BLOCKING: SQL injection vulnerability → parameterised queries.\nRECOMMENDATION: SELECT * → select specific fields.\nSUGGESTION: None return → raise UserNotFoundError.\nNIT: simplify if/return.',
      explanation: 'Differentiated code review comments help authors prioritise: what must be fixed vs. what could be improved. This makes reviews faster and more effective.'
    },
    {
      id: 5,
      title: 'Практика: 1:1 meeting',
      type: 'practice',
      difficulty: 'medium',
      description: 'Ведите продуктивный 1:1 разговор с менеджером на английском.',
      requirements: ['Структурированные обновления', 'Честное обсуждение blockers', 'Разговор о карьере'],
      questions: [
        { text: 'Your manager asks: "How are things going? Anything on your mind?"\n\nYou\'ve been doing great on deliverables but feel under-challenged technically. Write a natural, productive response.', answer: '"Things are going well on the delivery side — I\'m on track with the API project and confident we\'ll hit the sprint goals.\n\nThere is something I\'ve been thinking about that I wanted to bring up. I\'ve been feeling a bit under-challenged technically lately. The work I\'ve been doing is important, but it\'s been mostly execution of well-defined tasks. I\'d like to take on something that stretches me more — maybe leading the design of the new search infrastructure, or contributing to the observability project.\n\nI know there might not be an immediate opening, but I wanted to flag it early rather than wait. Is there anything on the horizon where you think I could contribute at a higher level?"', explanation: 'Productive 1:1: start with positive updates, introduce the concern honestly (not as a complaint but as a goal), propose specific opportunities, ask an open question.' }
      ],
      hint: '1:1 structure: brief status update → honest concern (framed as aspiration, not complaint) → specific ask or question → invite dialogue.',
      solution: 'Правильные ответы:\n1. Structure: positive delivery update → honest career concern (under-challenged technically) → specific suggestions (search infra, observability project) → open question to manager.',
      explanation: '1:1s are the most important conversations in your career. Being honest about your growth needs (with a proposed solution) is how you develop your career intentionally.'
    },
    {
      id: 6,
      title: 'Практика: Technical onboarding explanation',
      type: 'practice',
      difficulty: 'medium',
      description: 'Объясните систему новому коллеге эффективно.',
      requirements: ['Начните с big picture', 'Не перегружайте деталями', 'Давайте контекст для решений'],
      questions: [
        { text: 'Walk a new engineer through the architecture of a microservices-based e-commerce platform on their first week.\nCover: overview, key services, why the main decisions were made.', answer: '"Welcome! Let me give you the 30,000-foot view first.\n\nWe\'re a microservices architecture — five main services: User Service, Product Catalogue, Order Service, Payment Service, and Notification Service. They communicate asynchronously through Kafka for most events, and synchronously via HTTP only when we need an immediate response.\n\nWhy did we go microservices? Primarily because the payment and catalogue teams need to deploy independently — they have different release cycles and different scaling requirements. The catalogue needs to handle seasonal traffic spikes; payment needs rock-solid reliability without interference from other teams.\n\nFor you to understand the codebase, the most important thing is the event schema — all services communicate through well-defined events in Avro format, documented in the schema registry. Start there.\n\nThis week, I\'d focus on the Order Service — that\'s where most of the business logic lives and it touches most other services. The README has a local setup guide. Ask me anything."', explanation: 'Onboarding explanation: big picture first (not components), explain WHY decisions were made, direct them where to start, leave an open door for questions.' }
      ],
      hint: 'Onboarding order: 1) Why the architecture exists. 2) What the main components are. 3) How they connect. 4) Where to start. Avoid over-detailing on day one.',
      solution: 'Правильные ответы:\n1. Structure: high-level overview (5 services, Kafka) → why microservices (independent deployment, different scaling) → where to start (event schema → Order Service) → open door for questions.',
      explanation: 'Good technical onboarding accelerates time-to-contribution and reduces cognitive overload. Context (why) matters as much as information (what).'
    },
    {
      id: 7,
      title: 'Практика: Standup with blockers',
      type: 'practice',
      difficulty: 'easy',
      description: 'Effective standup update, особенно с блокерами.',
      requirements: ['Yesterday / Today / Blockers структура', 'Конкретные, краткие', 'Блокеры с предлагаемым решением'],
      questions: [
        { text: 'Write a standup update. Context:\n- Yesterday: finished implementing rate limiting, wrote tests, PR open\n- Today: starting the analytics dashboard feature\n- Blocker: waiting for design mockups from design team (3 days delayed)', answer: 'YESTERDAY: Finished implementing rate limiting on the auth endpoints — wrote unit and integration tests, PR #934 is open and ready for review. Would appreciate a look from whoever has bandwidth.\n\nTODAY: Starting on the analytics dashboard. I\'ll begin with the data model while I wait for the design mockups.\n\nBLOCKER: I\'m still waiting on design mockups from the design team — they were expected Monday and I haven\'t received them yet. I\'ve pinged Sarah twice. Could someone help escalate this? I can continue with the backend work in the meantime but can\'t finalise the frontend without the designs.', explanation: 'Standup: specific (PR number), actionable (ready for review), shows initiative on blocker (pinged twice, workaround), asks for specific help (escalate).' }
      ],
      hint: 'Good standup: specific enough to be useful (PR numbers, names), shows initiative on blockers, offers a workaround if available.',
      solution: 'Правильные ответы:\n1. Yesterday: rate limiting implemented, tests written, PR #934 ready for review.\nToday: analytics dashboard, starting data model while waiting for designs.\nBlocker: design mockups 3 days late, pinged Sarah twice, need escalation, workaround in progress (backend work).',
      explanation: 'Daily standups should take 15 minutes for a whole team. Keep updates concise but specific. Blockers need a proposed action, not just a complaint.'
    },
    {
      id: 8,
      title: 'Практика: Giving feedback',
      type: 'practice',
      difficulty: 'hard',
      description: 'Дайте конструктивную обратную связь коллеге.',
      requirements: ['Конкретные примеры', 'Actionable suggestions', 'Сохраните позитивные отношения'],
      questions: [
        { text: 'A junior engineer on your team consistently submits PRs without tests. Write a constructive feedback conversation (not just a code review comment).', answer: '"Hey, do you have 10 minutes? I wanted to chat about something I\'ve noticed in your recent PRs.\n\nYour implementation quality has been really strong — the rate limiting feature you shipped last week was clean, well-structured code. I wanted to give you some feedback on the test coverage though.\n\nOver the last few PRs, I\'ve noticed there haven\'t been unit tests included. I want to share why that matters from my experience: we have two services that went to production without good test coverage, and both have become very difficult to refactor. Any change feels risky because we can\'t tell quickly if we\'ve broken something.\n\nFor your upcoming work, I\'d suggest writing tests alongside the implementation — not after. It actually makes the implementation faster because you catch issues earlier.\n\nI can pair with you on the next feature to show the workflow I use — would that help? I\'m not trying to criticise the code quality, which is genuinely good. I just want to set you up for the senior role you\'re clearly aiming for."', explanation: 'Feedback structure: positive recognition → specific observation → concrete impact → actionable suggestion → offer to help → close positively.' }
      ],
      hint: 'Feedback formula: 1) Positive recognition (specific). 2) Observation (behaviour, not person). 3) Impact (why it matters). 4) Suggestion. 5) Offer support. 6) Close positively.',
      solution: 'Правильные ответы:\n1. Structure: genuine positive (specific implementation quality) → observation (PRs without tests) → concrete impact (services hard to refactor without tests) → suggestion (test alongside, not after) → offer to pair program → positive close (set you up for senior role).',
      explanation: 'Constructive feedback builds careers and improves teams. The goal is to change the behaviour, not judge the person. Always end with a forward-looking positive.'
    },
    {
      id: 9,
      title: 'Практика: Remote meeting facilitation',
      type: 'practice',
      difficulty: 'medium',
      description: 'Ведите продуктивный remote митинг на английском.',
      requirements: ['Эффективный старт', 'Управление тайм-боксом', 'Завершение с action items'],
      questions: [
        { text: 'Facilitate a 30-minute remote architecture review meeting. Write the key phrases for:\n1. Opening and agenda setting\n2. Keeping the discussion on track\n3. Closing with action items', answer: '1. OPENING: "Thanks everyone for joining. We have 30 minutes, so let\'s stay focused. Today\'s goal is to decide on the caching strategy for the new API — I want us to leave with a clear decision and owners.\n\nAgenda: 10 minutes to review the two options, 15 minutes of discussion, 5 minutes to decide and assign action items. I\'ll be time-keeping. Alex, can you share your screen and walk us through the options?"\n\n2. ON-TRACK PHRASES:\n"That\'s a great point — let\'s table that for the second half so we stay on the current topic."\n"We\'re at the 10-minute mark, so I\'d like to move into the discussion phase."\n"I\'m going to summarise what I\'ve heard to make sure we\'re aligned before deciding."\n\n3. CLOSING:\n"We\'re at 28 minutes, so let me capture the actions before we close: Alex — compare Redis vs Memcached performance benchmarks by Thursday. Maya — draft the implementation proposal based on our decision. Next meeting: Friday 10 AM to finalise. Does anyone have blockers or questions before we close?"', explanation: 'Meeting facilitation: clear agenda upfront, explicit timekeeping, summarise before deciding, close with named action items and due dates.' }
      ],
      hint: 'Facilitation essentials: state the goal and agenda, timekeeper, redirect tangents, summarise decisions, close with named action items.',
      solution: 'Правильные ответы:\n1. Opening: goal + agenda + timekeeper + first presenter.\n2. On-track: table tangents, announce time checks, summarise to align.\n3. Closing: capture action items (who + what + when), check for blockers, confirm next step.',
      explanation: 'Good meeting facilitation respects everyone\'s time and produces clear outcomes. The facilitator\'s job is to serve the meeting\'s goal, not to talk the most.'
    },
    {
      id: 10,
      title: 'Финальная практика: Полный рабочий день на английском',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите коммуникацию для полного рабочего дня.',
      requirements: [
        'Standup update (50 words)',
        'Slack message о техническом решении (100 words)',
        'Code review комментарий (100 words)',
        'EOD summary email (150 words)'
      ],
      hint: 'A full day of English communication shows register flexibility. Each format has its own conventions.',
      solution: 'STANDUP:\nYesterday: Completed the Redis integration for session caching — PR #1043 open, tests pass, coverage at 94%. Today: Starting the API rate limiting feature. Blocker: Need clarification from product on the rate limit values per tier — will ping Alex after standup.\n\nSLACK MESSAGE:\n"Hey team, quick update on the session caching approach.\n\nI ended up going with a write-through strategy rather than cache-aside. Here\'s the trade-off: write-through adds ~2ms to write operations but eliminates the complexity of cache invalidation logic. Given we read sessions 50x more than we write them, I think it\'s the right call. Happy to pair with anyone who wants to understand the implementation — it\'s a pattern we\'ll likely reuse elsewhere. PR #1043 for context."\n\nCODE REVIEW:\n"This is a solid implementation overall. One concern I want to flag: the error handling on line 47 catches all exceptions with a bare `except Exception`. This is too broad — it will silently swallow unexpected errors that we\'d want to know about. I\'d recommend catching only the specific exceptions you expect (e.g., RedisConnectionError, TimeoutError) and letting others propagate. This makes debugging much easier when something unexpected happens."\n\nEOD EMAIL:\nSubject: EOD Summary — Session Caching + Rate Limiting Start\n\nHi team,\n\nQuick end-of-day summary:\n\nCompleted today:\n- Redis session caching implementation is ready for review (PR #1043). Architecture decision documented in ADR-031. Coverage at 94%.\n- Initial design for API rate limiting complete. Using token bucket algorithm with Redis as the backing store. Detailed in the Confluence page I created this afternoon.\n\nPending:\n- Still need product confirmation on rate limit values per tier (following up with Alex)\n- PR #1043 would benefit from one more review before merge\n\nTomorrow: Implementing rate limiting based on the approved design.\n\nLet me know if anything needs urgent attention.\n\nBest,\nNurdaulet',
      explanation: 'A full working day in English requires shifting registers fluidly: casual Slack, professional email, technical code review. Each serves a different purpose and audience.'
    }
  ]
}
