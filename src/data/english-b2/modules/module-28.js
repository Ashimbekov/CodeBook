export default {
  id: 28,
  title: 'Дебаты: аргументация технических решений',
  description: 'Как убедительно аргументировать технические решения и вести конструктивные дебаты',
  lessons: [
    {
      id: 1,
      title: 'Структура технического аргумента',
      type: 'theory',
      content: [
        { type: 'text', value: 'Умение убедительно аргументировать технические решения — один из ключевых навыков для senior-инженеров и tech leads. Это не про то, чтобы "выиграть" спор — это про то, чтобы прийти к лучшему решению.' },
        { type: 'heading', value: 'Структура PEEL' },
        { type: 'text', value: '"Point: Чётко сформулируйте свою позицию."\n"Evidence: Обоснуйте данными, примерами или логикой."\n"Explanation: Объясните, как доказательства поддерживают позицию."\n"Link: Свяжите с основным вопросом или следующим аргументом."' },
        { type: 'heading', value: 'Пример PEEL в IT-дискуссии' },
        { type: 'text', value: '"Point: We should adopt event-driven architecture for this use case.\nEvidence: Our current synchronous approach causes cascading failures — when the email service is slow, it blocks the checkout flow, as evidenced by last month\'s incident where a 3-second email delay caused a 30% cart abandonment spike.\nExplanation: Event-driven architecture would decouple these services, so email delays would not affect checkout performance.\nLink: This directly addresses the reliability requirement we discussed earlier."' }
      ]
    },
    {
      id: 2,
      title: 'Фразы для представления позиции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Как заявить свою позицию чётко, но не агрессивно.' },
        { type: 'heading', value: 'Представление своей позиции' },
        { type: 'text', value: '"I\'d like to make the case for [approach X]."\n"My position is that we should [action]. Let me explain my reasoning."\n"I strongly believe that [X] is the right approach, and here\'s why."\n"I\'d like to challenge the current assumption that [Y]. I think [Z] is actually more appropriate."' },
        { type: 'heading', value: 'Представление доказательств' },
        { type: 'text', value: '"The data supports this: [specific numbers]."\n"Looking at the industry precedent, companies like [X] have found that..."\n"Our own production metrics show that..."\n"According to the benchmark we ran last week..."' },
        { type: 'heading', value: 'Уступки и нюансы' },
        { type: 'text', value: '"I acknowledge that this approach has a downside: [X]. However, I believe the benefit of [Y] outweighs this."\n"This isn\'t perfect, but it\'s the best option given [constraints]."\n"Fair point — but even accounting for that, I think [X] still holds."' }
      ]
    },
    {
      id: 3,
      title: 'Контраргументы: как оспаривать позиции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Эффективный контраргумент сначала признаёт сильные стороны оппонента, затем предлагает альтернативную точку зрения.' },
        { type: 'heading', value: 'Структура стального аргумента (steelmanning)' },
        { type: 'text', value: '"Steelmanning: сначала представьте наилучшую версию чужого аргумента, потом опровергните."\n"The strongest case for [X] is [Y]. However, what this argument doesn\'t account for is [Z]."' },
        { type: 'heading', value: 'Фразы для контраргументов' },
        { type: 'text', value: '"I see your point, but I think we\'re missing [key factor]."\n"That\'s true under normal circumstances, but consider the edge case where..."\n"I\'d push back on that slightly. The data shows [contrary evidence]."\n"That\'s a valid concern, but it\'s based on the assumption that [X], which may not hold for our use case."\n"Have we considered the second-order effects of [proposed solution]?"' },
        { type: 'heading', value: 'Признание поражения в дебатах' },
        { type: 'text', value: '"You\'ve convinced me — I was wrong about [X]."\n"That\'s a strong point I hadn\'t fully considered. Let me revise my position."\n"Given that evidence, I\'m willing to change my recommendation to [Y]."' }
      ]
    },
    {
      id: 4,
      title: 'Достижение консенсуса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Цель технических дебатов — не победить, а прийти к лучшему решению. Умение находить консенсус — ключевой навык.' },
        { type: 'heading', value: 'Disagree and commit' },
        { type: 'text', value: '"\'Disagree and commit\' — принцип Amazon: можно не соглашаться, но после принятия решения — полностью поддерживать его реализацию."\n"I have reservations about this approach, but I understand the reasoning. I\'ll commit to making it work."\n"I\'m not convinced, but I respect the decision. What can I do to support the implementation?"' },
        { type: 'heading', value: 'Поиск компромисса' },
        { type: 'text', value: '"Can we find a middle ground? What if we [hybrid approach]?"\n"Both options have merit. What would it take to get the benefits of both?"\n"Could we start with [simpler option] and revisit [more complex option] once we have more data?"\n"What are the criteria by which we\'re making this decision? Can we agree on those first?"' },
        { type: 'heading', value: 'Фреймворки принятия решений' },
        { type: 'text', value: '"Let\'s use a decision matrix to compare our options against agreed criteria."\n"I propose we set a reversibility threshold: if this decision is easily reversible, we can decide quickly. If it\'s not, we should invest more time."\n"Can we agree on an experiment to test the hypothesis before fully committing?"' }
      ]
    },
    {
      id: 5,
      title: 'Архитектурные обсуждения: типичные паттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Архитектурные дебаты имеют свои типичные паттерны и ловушки.' },
        { type: 'heading', value: 'REST vs GraphQL' },
        { type: 'text', value: '"For a public API with external consumers who have diverse needs, REST\'s discoverability and simplicity are hard to beat."\n"For a first-party API where we control all clients, GraphQL\'s flexibility eliminates over-fetching, which is particularly valuable for mobile clients on limited bandwidth."' },
        { type: 'heading', value: 'SQL vs NoSQL' },
        { type: 'text', value: '"If your data is highly relational and you need ACID guarantees — financial data, orders — SQL is the right choice."\n"If you\'re storing large volumes of denormalised, high-velocity data where schema flexibility matters, NoSQL offers real advantages."\n"The choice should be driven by your access patterns, not by what\'s trendy."' },
        { type: 'heading', value: 'Microservices vs Monolith' },
        { type: 'text', value: '"The microservices architectural premium makes sense when the organisational complexity it enables outweighs the operational overhead it introduces."\n"For a team of fewer than 10 engineers working on a single domain, a well-structured monolith will almost always outperform microservices."' }
      ]
    },
    {
      id: 6,
      title: 'Практика: архитектурный дебат',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проведите структурированный дебат по архитектурному вопросу.',
      requirements: [
        'Представьте позицию с использованием PEEL структуры',
        'Предвосхитите и ответьте на контраргументы',
        'Предложите компромисс или путь к консенсусу'
      ],
      hint: 'Тема: "We should migrate from a monolith to microservices." Представьте и аргументы ЗА, и ПРОТИВ, и предложите решение.',
      solution: 'POSITION: We should NOT migrate to microservices at this stage.\n\nPOINT: Our current team of 8 engineers working on a single product domain does not meet the preconditions for microservices to deliver value.\n\nEVIDENCE: According to Sam Newman\'s research on microservices adoption, the primary benefit of microservices is enabling independent team scaling. At our current team size, the operational overhead (3 additional services to maintain, separate deployment pipelines, distributed tracing setup, service mesh configuration) would consume approximately 40% of engineering capacity, as measured by teams at similar stage.\n\nEXPLANATION: This overhead directly contradicts our current priority of shipping faster. Our monolith can be well-structured using bounded contexts, which gives us the code modularity benefits without the operational complexity.\n\nCOUNTERARGUMENT ANTICIPATION: The strongest argument for microservices is that our checkout and recommendation engines have very different scaling requirements. That\'s valid. However, this can be addressed by extracting just those two services — not by a full microservices migration.\n\nCOMPROMISE: I propose we adopt a \'strangler fig\' pattern: extract the high-scaling-demand components (checkout, recommendation engine) as separate services while keeping the rest as a modular monolith. This delivers the scalability benefits where needed without the full operational cost.',
      explanation: 'Лучшие архитектурные дебаты ведут к лучшим решениям. Ключ: обоснование должно быть data-driven, а не opinion-driven. "The data shows..." намного убедительнее, чем "I think..."'
    },
    {
      id: 7,
      title: 'Практика: дипломатичное несогласие',
      type: 'practice',
      difficulty: 'medium',
      description: 'Выразите несогласие с техническим решением дипломатично и конструктивно.',
      requirements: [
        'Признайте позицию оппонента',
        'Выразите несогласие без агрессии',
        'Предложите альтернативу или следующий шаг'
      ],
      questions: [
        { text: 'Your tech lead says: "I\'ve decided we\'re going to use blockchain to store user session data. It will be more secure."\n\nYou disagree strongly. How do you respond diplomatically?', answer: '"I appreciate you thinking creatively about security — it\'s clearly a priority for all of us. I\'d like to understand the decision better before we commit to it. My concern is that blockchain\'s properties (immutability, consensus mechanisms, distributed storage) are optimised for a different set of problems than session management, which requires fast read/write operations and easy invalidation.\n\nSpecifically, I\'m worried about latency: most blockchain operations take seconds, while session validation needs to happen in milliseconds. And session data needs to be invalidated on logout, which is inherently difficult with an immutable ledger.\n\nWould you be open to us putting together a quick comparison of blockchain against alternatives like Redis with proper encryption? I\'d love to make sure we\'re making this decision with a full picture of the trade-offs. I might be missing something about your vision for this."', explanation: 'Дипломатичное несогласие: 1) Признайте позитивное намерение; 2) Задайте уточняющий вопрос вместо прямого "вы неправы"; 3) Выразите конкретные технические опасения; 4) Предложите процесс для принятия решения; 5) Оставьте возможность для себя ошибиться.' }
      ],
      solution: 'Правильные ответы:\n1. "I appreciate you thinking creatively about security — it\\\'s clearly a priority for all of us. I\\\'d like to understand the decision better before we commit to it. My concern is that blockchain\\\'s propert...',
      hint: 'Начните с признания позитивного намерения, затем задайте вопрос (не утверждение!), затем выразите конкретное техническое опасение, затем предложите следующий шаг.',
      explanation: 'Умение дипломатично не соглашаться — один из наиболее ценных soft skills для senior-инженеров. Плохо сформулированное несогласие разрушает отношения; хорошо сформулированное ведёт к лучшим решениям.'
    }
  ]
}
