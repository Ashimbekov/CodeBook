export default {
  id: 34,
  title: 'Практикум: Презентации',
  description: 'Практика технических презентаций: структура, delivery, Q&A, данные и метрики',
  lessons: [
    {
      id: 1,
      title: 'Практика: Opening a tech talk',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите сильное вступление для технической презентации.',
      requirements: ['Hook в первых 30 секундах', 'Краткое представление спикера', 'Анонс структуры'],
      questions: [
        { text: 'Write the opening 2 minutes for a talk: "Why We Migrated from MongoDB to PostgreSQL".\nInclude: hook, speaker intro, agenda, target audience.', answer: 'HOOK: "Two years ago, our engineering team made a decision that felt like a step backwards. We migrated 50 terabytes of production data from MongoDB to PostgreSQL. Our colleagues thought we were crazy. MongoDB was working. Users weren\'t complaining."\n\nINTRO: "My name is Nurdaulet, principal engineer at [Company]. Eight years building data-intensive systems. This migration was the most complex project of my career."\n\nAGENDA: "Today: 1) The technical problems that drove the decision. 2) The migration strategy we chose and alternatives we rejected. 3) Three lessons I wish someone had told us beforehand."\n\nAUDIENCE: "This talk is for senior engineers and tech leads considering a similar migration or wanting to understand SQL vs NoSQL trade-offs from a production perspective."', explanation: 'Strong opening: counterintuitive hook creates curiosity, brief credible speaker intro, clear agenda, defined audience.' }
      ],
      hint: 'Opening structure: hook (story/statistic/question creating tension) → speaker intro (brief) → what they\'ll learn → agenda → target audience.',
      solution: 'Правильные ответы:\n1. Hook: counterintuitive decision ("step backwards"). Speaker intro: brief credentials (principal engineer, 8 years). Agenda: 3 numbered points. Audience: senior engineers/tech leads.',
      explanation: 'The opening 60-90 seconds determine whether your audience stays engaged. Practice it until natural — it\'s the only part worth memorising.'
    },
    {
      id: 2,
      title: 'Практика: Explaining complex concepts',
      type: 'practice',
      difficulty: 'medium',
      description: 'Объясните сложную концепцию для смешанной аудитории.',
      requirements: ['Начните с аналогии', 'Затем техническое объяснение', 'Завершите практическим примером'],
      questions: [
        { text: 'Explain "eventual consistency" to an audience of both engineers and product managers.', answer: 'ANALOGY: "Imagine collaborating on a Google Doc with a colleague in another city. You both type simultaneously. For a second, you see different versions. Then Google reconciles and you both see the same document. That delay — that window where you might see different data — is eventual consistency."\n\nTECHNICAL: "In distributed databases, updating all servers simultaneously is expensive. So we write to one server and let the change propagate over milliseconds. A read on server B right after a write to server A might return stale data."\n\nPM IMPLICATION: "This is why you might create a social media post and not see it immediately on refresh. The system is eventually consistent — your post will appear, just not instantaneously everywhere."\n\nWHEN ACCEPTABLE: "Social media feeds, product catalogues: yes. Financial transactions, inventory counts: no — those require strong consistency."', explanation: 'Layered explanation: analogy for everyone → technical detail → product implications → guidance on when to use.' }
      ],
      hint: 'Structure: Analogy (everyone understands) → Technical depth (engineers) → Product implication (PMs) → When it matters. Ground abstract concepts in a concrete example.',
      solution: 'Правильные ответы:\n1. Analogy: Google Doc collaborative editing delay.\nTechnical: write propagation delay across distributed servers.\nPM implication: social media post not appearing immediately.\nGuidance: acceptable for feeds/catalogues, not for financial/inventory.',
      explanation: 'Explaining technical concepts at multiple levels simultaneously is essential for cross-functional communication. It\'s a hallmark of senior engineers.'
    },
    {
      id: 3,
      title: 'Практика: Presenting metrics',
      type: 'practice',
      difficulty: 'medium',
      description: 'Опишите данные и метрики убедительно.',
      requirements: ['Контекст (почему важно)', 'До/после с абсолютными и относительными числами', 'Явный вывод'],
      questions: [
        { text: 'Present these performance metrics:\n- API P50 latency: 180ms → 22ms\n- API P99 latency: 2400ms → 180ms\n- Error rate: 0.8% → 0.05%\n- Infrastructure cost: $12,000/mo → $9,500/mo', answer: 'RESPONSE TIME: "The median user experience improved from 180ms to 22ms — 88% improvement. But more important: P99 dropped from 2.4 seconds to 180ms — 92% reduction. Previously, 1 in 100 users waited nearly 3 seconds. Now they wait under 200ms. That\'s the difference between frustration and delight."\n\nERROR RATE: "Down from 0.8% to 0.05%. At 10 million requests/day, that\'s 80,000 errors/day reduced to 5,000. 75,000 fewer failures per day."\n\nCOST: "Infrastructure cost dropped 21% — from $12,000 to $9,500/month. Better performance AND lower cost — that doesn\'t always happen."\n\nKEY TAKEAWAY: "Optimise for P99, not just median. That\'s where users feel the system is unreliable."', explanation: 'Data presentation: name the metric + why it matters, give absolute + relative change, real-world translation, explicit conclusion.' }
      ],
      hint: 'When presenting metrics: 1) Name metric (why it matters). 2) Before/after (absolute + %). 3) Real-world translation. 4) Key conclusion.',
      solution: 'Правильные ответы:\n1. P50: 180→22ms (88%), P99: 2400→180ms (92%).\nError rate: 0.8%→0.05% = 80,000→5,000 errors/day.\nCost: $12,000→$9,500/mo (21% reduction).\nKey takeaway: optimise for P99, not just median.',
      explanation: 'Raw numbers are not insights. Your job as a presenter is to translate data into meaning for users, the business, and the team.'
    },
    {
      id: 4,
      title: 'Практика: Handling Q&A',
      type: 'practice',
      difficulty: 'hard',
      description: 'Ответьте на сложный вопрос из зала профессионально.',
      requirements: ['Признайте валидность вопроса', 'Ответьте конкретно', 'Если не знаете — скажите и предложите follow-up'],
      questions: [
        { text: 'After your microservices migration talk, audience asks:\n"This sounds great for a 200-person team. But doesn\'t this make zero sense for a 10-person startup?"\n\nRespond diplomatically and completely.', answer: '"That\'s one of the most important questions of the evening — thank you for raising it.\n\nYou\'re right, and I should have been clearer about context. Everything I described assumes three preconditions: a team large enough that service ownership is a bottleneck, a proven business model, and operational maturity to manage distributed systems.\n\nFor a 10-person startup: start with a monolith. A well-structured monolith with clear module boundaries. You\'ll deploy faster, debug faster, and not need distributed systems experience on every hire.\n\nMigrate to microservices when coordination overhead is genuinely slowing down a team that needs to work independently — typically well past 50 engineers with proven product-market fit.\n\nTake the principles from today\'s talk, not the architecture. Thank you for the pushback — it\'s a fair point."', explanation: 'Great Q&A: acknowledge the valid challenge, concede your omission, give concrete alternative for their context, close positively.' }
      ],
      hint: 'Q&A framework: 1) Acknowledge (don\'t dismiss). 2) Concede if valid. 3) Answer specifically with context. 4) If you don\'t know, say so and offer to follow up.',
      solution: 'Правильные ответы:\n1. Acknowledge validity, correct own omission (didn\'t state preconditions), give specific guidance (monolith for small teams, migrate at 50+ engineers with PMF), close positively.',
      explanation: 'How you handle challenging questions often defines the audience\'s lasting impression. Confidence + intellectual honesty is the winning combination.'
    },
    {
      id: 5,
      title: 'Практика: Talk structure outline',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте детальный outline для 30-минутного tech talk.',
      requirements: ['Структура с таймингом', 'Ключевой message для каждой части', 'Transitions'],
      questions: [
        { text: 'Create a detailed 30-minute talk outline for:\n"Zero-Downtime Deployments: How We Deploy 50 Times Per Day"', answer: '0:00-2:00 — OPENING (2 min): Hook: "18 months ago every deploy was a crisis. Today: 50 deploys/day, zero downtime." Agenda: problem → solution → techniques → results.\n\n2:00-7:00 — THE PROBLEM (5 min): Cost of downtime. Our starting point: weekly deploys, 30-min downtime windows.\n\n7:00-15:00 — TECHNIQUES (8 min): Blue-green (3 min), rolling deployments (2 min), feature flags (3 min).\n\n15:00-22:00 — DEMO (7 min): Blue-green in action, traffic shifting 10%→50%→100%, automatic rollback.\n\n22:00-27:00 — RESULTS + LESSONS (5 min): Current state, 3 things we got wrong, what we\'d do differently.\n\n27:00-30:00 — CLOSE + Q&A (3 min): 3 key takeaways, single call to action, open for questions.', explanation: 'Timed outline ensures coverage without running over. Know what to cut if running late.' }
      ],
      hint: 'Rule of thirds: 1/3 problem (why this matters), 1/3 solution (what to do), 1/3 demo+results (proof it works). End with one call to action.',
      solution: 'Правильные ответы:\n1. 30-min structure: Opening (2) → Problem (5) → Techniques (8) → Demo (7) → Results/Lessons (5) → Close/Q&A (3).\nEach section: timing + key message + what audience learns.',
      explanation: 'Detailed talk outlines save you in practice runs. When you know each section\'s purpose, cutting or expanding is easy.'
    },
    {
      id: 6,
      title: 'Практика: Transitions и signposting',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите переходные фразы между секциями презентации.',
      requirements: ['Summarise текущую секцию', 'Bridge к следующей', 'Поддерживайте narrative momentum'],
      questions: [
        { text: 'Write transitions between these three sections of a microservices migration talk:\n1. "The problems with our monolith"\n2. "Our migration strategy"\n3. "What we would do differently"', answer: 'TRANSITION 1→2: "So we\'ve established the problem: a monolith slowing down the team, making independent deployments impossible, a single point of failure. The question was: what do we do about it? I want to walk you through the strategy we chose — and more importantly, the two alternatives we considered and rejected."\n\nTRANSITION 2→3: "That\'s the strategy we executed. It worked — 6 independent services by year end. But I\'d be doing you a disservice if I only told you what went well. Let me spend the last few minutes being honest about three decisions that, in hindsight, we would have made differently."', explanation: 'Good transitions: summarise (1 sentence), create tension/question the next section answers, signal what\'s coming.' }
      ],
      hint: 'Transition formula: "So [summary]. The question now is [next problem]. In [next section], I\'ll show you [what\'s coming]."',
      solution: 'Правильные ответы:\n1. Transition 1→2: summarise problem → bridge question ("what do we do?") → signal (strategy + rejected alternatives).\nTransition 2→3: acknowledge success briefly → honest pivot → signal (3 things done differently).',
      explanation: 'Transitions are the glue of a presentation. Without them, a talk feels like disconnected sections. Good transitions maintain the narrative thread.'
    },
    {
      id: 7,
      title: 'Практика: Handling the unexpected',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите фразы для непредвиденных ситуаций во время презентации.',
      requirements: ['Технический сбой', 'Сложный вопрос который не знаешь', 'Потеря места в презентации'],
      questions: [
        { text: 'Write natural English phrases for these three scenarios:\n1. Your demo crashes mid-presentation\n2. Someone asks a detailed question you cannot answer\n3. You lose your train of thought mid-sentence', answer: '1. DEMO CRASH: "It looks like the demo environment isn\'t cooperating — which, honestly, just proves that distributed systems are hard. [light laughter] Let me switch to the screenshot version I prepared — I always have a backup. [opens backup] Here\'s what the successful run looked like..."\n\n2. UNKNOWN ANSWER: "That\'s a great question, and I want to be honest: I don\'t have a confident answer off the top of my head. My intuition is [brief reasoning], but I\'d rather give you a reliable answer than a confident wrong one. Can I take your contact and follow up after I\'ve had a chance to look into it properly?"\n\n3. LOST TRAIN OF THOUGHT: "Let me take a breath... [pause] The key point I was making is [restate the main idea]. Let me come back to the specific detail from a different angle."', explanation: 'Recovery phrases show confidence and experience. The audience forgives almost everything if the speaker remains calm and professional.' }
      ],
      hint: 'For all unexpected situations: stay calm (pause if needed), acknowledge the situation briefly (don\'t ignore it), recover gracefully, continue.',
      solution: 'Правильные ответы:\n1. Demo crash: acknowledge lightly with humour, show backup screenshots, continue.\n2. Unknown question: be honest, give brief intuition, offer to follow up.\n3. Lost thought: pause, restate the key point, approach differently.',
      explanation: 'How you handle the unexpected is often more memorable than the prepared content. Calm recovery demonstrates expertise and confidence.'
    },
    {
      id: 8,
      title: 'Практика: Call to action and closing',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напишите сильное завершение и call to action для tech talk.',
      requirements: ['Summarise ключевые takeaways (максимум 3)', 'Конкретный, actionable call to action', 'Memorable closing line'],
      questions: [
        { text: 'Write the closing 2 minutes for a talk on "Observability: Moving from Logging to Distributed Tracing".\nInclude: 3 takeaways, call to action, closing line.', answer: 'THREE TAKEAWAYS: "Before I close, three things I want you to remember from today:\n\nFirst: logs tell you what happened, but not why. Distributed tracing gives you the full story across service boundaries.\n\nSecond: you don\'t need to instrument everything at once. Start with your critical path — the 20% of services that handle 80% of user-facing requests.\n\nThird: observability is not a tool you buy. It\'s a culture of asking \'how will I know when this breaks?\' before you ship."\n\nCALL TO ACTION: "Here\'s what I\'d ask you to do this week: pick one service in your stack and add distributed tracing to it. Just one. Use the OpenTelemetry SDK — it takes less than an hour. See what you learn. I guarantee you\'ll find something surprising."\n\nCLOSING: "You cannot improve what you cannot see. Thank you."', explanation: 'Strong close: 3 memorable takeaways, specific actionable CTA with timeline and tool, short punchy closing line.' }
      ],
      hint: 'Takeaways: 3 max, each one sentence. CTA: specific enough to act on tomorrow. Closing: one powerful, memorable sentence.',
      solution: 'Правильные ответы:\n1. Takeaways: logs vs tracing (what vs why), start with critical path (20%→80%), observability is culture not tool.\nCTA: instrument one service with OpenTelemetry this week.\nClosing line: "You cannot improve what you cannot see."',
      explanation: 'The closing is the last thing your audience remembers. Make it count: consolidate, motivate, and leave them with something memorable.'
    },
    {
      id: 9,
      title: 'Практика: Remote presentation adaptation',
      type: 'practice',
      difficulty: 'easy',
      description: 'Адаптируйте ключевые аспекты презентации для удалённого формата.',
      requirements: ['5 ключевых отличий от in-person', 'Практические техники для каждого', 'Реалистичные решения'],
      questions: [
        { text: 'What are the 5 most important differences between in-person and remote tech talk delivery? Give a practical technique for each.', answer: '1. NO VISUAL FEEDBACK: Build explicit interaction every 5-7 min. "Type in chat: how many of you have hit this problem?" Use polls for key decision points.\n\n2. ENERGY LOSS THROUGH SCREEN: Speak 20% slower, 30% more energetically. Stand up — it changes your vocal energy.\n\n3. SHORTER ATTENTION SPAN: Make agenda visible throughout. "We\'re on point 2 of 4." Sections max 5-7 minutes.\n\n4. TECHNICAL ISSUES: Test everything 30 min before. Have slide URL ready to send in chat. Practice first 60 seconds without slides.\n\n5. EYE CONTACT: Position notes near camera at top of screen. Look into the camera lens during key points, not at audience tiles.', explanation: 'Remote presentation requires more active engagement design. The lack of visual feedback means you must create it explicitly.' }
      ],
      hint: 'Remote challenges: no energy feedback, easy attention loss, technical issues. Solutions: explicit interaction, more vocal energy, shorter segments, redundant tech, camera positioning.',
      solution: 'Правильные ответы:\n1. No visual feedback → explicit chat interaction every 5-7 min.\n2. Energy loss → 30% more energetic, stand up.\n3. Short attention → visible agenda, max 5-7 min sections.\n4. Tech issues → test 30 min early, have backup URL.\n5. Eye contact → notes near camera, look into lens for key points.',
      explanation: 'Remote presentation is a different skill. Companies increasingly expect engineers to present effectively in both formats.'
    },
    {
      id: 10,
      title: 'Финальная практика: Lightning talk script',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите полный сценарий для 10-минутного lightning talk.',
      requirements: [
        'Hook → problem → solution → takeaways → call to action',
        'Transitions между секциями',
        'Длина: 600-700 слов',
        'Тема: "Why Every Engineer Should Write Technical Blog Posts"'
      ],
      hint: 'Structure: hook (1 min) → problem/why they don\'t write (2 min) → evidence it works (4 min) → how to start (2 min) → call to action (1 min).',
      solution: 'LIGHTNING TALK SCRIPT:\n\n[HOOK - 1 min]\n"Three years ago I spent four hours debugging an authentication issue. The fix was three lines of code. That weekend I wrote a blog post about it. Today that post has 80,000 reads. I got emails from engineers in 14 countries saying it solved their exact problem. My current job came because the hiring manager found that post before my CV.\n\nI want to make the case today that technical blogging is one of the highest-leverage things you can do for your career — and for the engineers who come after you.\n\n[THE BARRIER - 2 min]\nMost engineers never write publicly. The most common reason: \'I have nothing original to say.\'\n\nI want to challenge that. That post wasn\'t original research. It was a frustrated engineer explaining the exact error, the exact cause, the exact fix. In plain English. The person who benefits most from your writing is not someone smarter than you. It\'s the version of you from six months ago. There are thousands of engineers at that level, facing that problem, right now.\n\n[EVIDENCE - 4 min]\nTwo data points.\n\nDistribution: A blog post in English has potential reach across every engineering community on the planet — Hacker News, dev.to, Reddit, company Slacks. A conference talk reaches 300 people once. A blog post reaches the right person at the right moment, forever.\n\nCareer compounding: A colleague wrote one post per month for two years. Each got a few hundred to a few thousand reads. Nothing viral. At his next interview, the engineering manager said: \'I\'ve been reading your blog for a year. I already know how you think.\' He got an offer 30% above his ask.\n\n[HOW TO START - 2 min]\nOne system only: the next time you spend more than two hours solving a problem, spend 30 minutes writing it up. What was the problem. Why it was confusing. What you tried. What finally worked.\n\nPublish on dev.to — free, already has an audience. Do that four times. You have a body of work.\n\n[CLOSE - 1 min]\nEvery senior engineer I know wishes they had started writing earlier. Not for the career benefits — though those are real. But for the habit of thinking clearly that writing forces.\n\nThe post you write today will help an engineer you will never meet.\n\nYou cannot level up others if you keep everything in your head. Thank you."',
      explanation: 'A complete lightning talk has a clear narrative arc: problem → evidence → action → call to action. Every minute serves a purpose. This format works at any length from 5 to 60 minutes.'
    }
  ]
}
