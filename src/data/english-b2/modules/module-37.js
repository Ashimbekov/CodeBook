export default {
  id: 37,
  title: '3000 слов уровня B2',
  description: 'Ключевая лексика B2 для IT-специалистов: академическая, техническая, деловая',
  lessons: [
    {
      id: 1,
      title: 'Практика: Academic vocabulary in context',
      type: 'practice',
      difficulty: 'medium',
      description: 'Используйте академическую лексику B2 в технических предложениях.',
      requirements: ['Используйте слова в правильном контексте', 'Объясните нюансы значения', 'Отличайте схожие слова'],
      questions: [
        { text: 'Use each word correctly in an IT sentence:\n1. Nevertheless\n2. Consequently\n3. Albeit\n4. Prevalent\n5. Substantiate', answer: '1. Nevertheless: "The legacy codebase has significant technical debt; nevertheless, refactoring it completely is not feasible within the current quarter."\n2. Consequently: "The database was not indexed correctly; consequently, query performance degraded significantly under production load."\n3. Albeit: "The solution is effective, albeit more complex than the original approach."\n4. Prevalent: "Microservices architecture has become prevalent in modern enterprise systems, though it is not always the appropriate choice."\n5. Substantiate: "The team needs benchmark data to substantiate the claim that the new algorithm is 40% faster."', explanation: 'Connective words: nevertheless (contrast after concession), consequently (result/cause), albeit (concessive, formal), prevalent (widespread), substantiate (provide evidence for).' }
      ],
      hint: 'Nevertheless = однако/тем не менее; Consequently = следовательно; Albeit = хотя и; Prevalent = широко распространённый; Substantiate = подтверждать доказательствами.',
      solution: 'Правильные ответы:\n1. Nevertheless: contrast after concession (технический долг есть, тем не менее полный рефакторинг нецелесообразен).\n2. Consequently: result (неправильная индексация → ухудшение производительности).\n3. Albeit: formal concession (эффективно, хотя и сложнее).\n4. Prevalent: widespread adoption (микросервисы стали распространёнными).\n5. Substantiate: support with evidence (нужны данные для подтверждения утверждения).',
      explanation: 'Academic connective vocabulary makes technical writing precise and professional. These words signal logical relationships between ideas.'
    },
    {
      id: 2,
      title: 'Практика: Verbs of analysis and evaluation',
      type: 'practice',
      difficulty: 'medium',
      description: 'Глаголы анализа и оценки для технических текстов.',
      requirements: ['Замените простые глаголы более точными', 'Учитывайте уровень формальности', 'Используйте правильный регистр'],
      questions: [
        { text: 'Replace the underlined verbs with more precise B2-level verbs:\n1. We looked at three database options.\n2. The team found that Redis performs better under load.\n3. We will check the new algorithm against the existing one.\n4. The test results show the memory usage is higher than expected.', answer: '1. "We evaluated three database options." (evaluate = thoroughly assess pros/cons)\n2. "The team established that Redis performs better under load." (establish = confirm through evidence)\n3. "We will benchmark the new algorithm against the existing one." (benchmark = measure performance comparatively)\n4. "The test results indicate that memory usage is higher than expected." (indicate = suggest/point to, more cautious than "show")', explanation: 'Precise verbs convey the method of knowing: evaluate (deliberate comparison), establish (proven fact), benchmark (measured performance), indicate (suggested, not certain).' }
      ],
      hint: 'looked at → evaluated/examined/assessed; found → established/determined/revealed; check → benchmark/compare/validate; show → indicate/demonstrate/reveal.',
      solution: 'Правильные ответы:\n1. evaluated (deliberate, systematic assessment)\n2. established (confirmed through evidence)\n3. benchmark (performance comparison)\n4. indicate (cautious: suggest rather than prove)',
      explanation: 'Precise analytical verbs differentiate between degrees of certainty and rigor. "Indicate" is less certain than "demonstrate"; "establish" implies strong evidence.'
    },
    {
      id: 3,
      title: 'Практика: Business and professional vocabulary',
      type: 'practice',
      difficulty: 'medium',
      description: 'Деловая лексика B2 в IT-контексте.',
      requirements: ['Правильное использование в контексте', 'Формальный регистр', 'Различайте схожие термины'],
      questions: [
        { text: 'Fill in the blanks with the correct word (feasible, viable, scalable, sustainable, stakeholder, leverage, mitigate, align):\n\n1. "The proposed solution is technically ___, but the cost makes it economically ___."  (use the same word twice with different implications)\n2. "We need to ___ our existing infrastructure to support the new service."\n3. "The goal is to ___ risks by implementing a circuit breaker pattern."\n4. "The engineering roadmap must ___ with the company\'s strategic objectives."', answer: '1. "The proposed solution is technically feasible (possible to do), but the cost makes it economically unviable (not practical to pursue)." — feasible = technically possible; viable = practical and worthwhile\n2. "We need to leverage our existing infrastructure to support the new service." — leverage = use to maximum advantage\n3. "The goal is to mitigate risks by implementing a circuit breaker pattern." — mitigate = reduce severity\n4. "The engineering roadmap must align with the company\'s strategic objectives." — align = match/be consistent with', explanation: 'Feasible vs viable: feasible = can be done technically; viable = worth doing commercially. Leverage = use advantageously. Mitigate ≠ eliminate (reduce, not remove). Align = ensure consistency.' }
      ],
      hint: 'Feasible = можно сделать (технически); Viable = стоит делать (экономически); Leverage = использовать с выгодой; Mitigate = снижать (не устранять); Align = согласовывать.',
      solution: 'Правильные ответы:\n1. feasible (технически возможно) + unviable (экономически нецелесообразно)\n2. leverage (использовать имеющуюся инфраструктуру с выгодой)\n3. mitigate (снизить риски, не устранить)\n4. align (согласовать с целями компании)',
      explanation: 'Professional vocabulary makes communication precise. Feasible and viable are often confused but have different implications for decision-making.'
    },
    {
      id: 4,
      title: 'Практика: Formal vs informal equivalents',
      type: 'practice',
      difficulty: 'medium',
      description: 'Переключение между формальным и неформальным вариантами одних и тех же слов.',
      requirements: ['Определите правильный регистр', 'Замените informal на formal и наоборот', 'Объясните разницу в тоне'],
      questions: [
        { text: 'Convert each expression to the appropriate register:\n\n1. INFORMAL → FORMAL: "We need to figure out why the server keeps crashing."\n2. FORMAL → INFORMAL (Slack): "We wish to ascertain the root cause of the recurring service interruptions."\n3. INFORMAL → FORMAL: "The team messed up the deployment."\n4. FORMAL → INFORMAL: "It is imperative that all development team members adhere to the established coding standards."', answer: '1. FORMAL: "We need to identify/determine the root cause of the recurring server failures."\n2. INFORMAL: "We need to figure out why the service keeps going down."\n3. FORMAL (neutral/blameless): "The deployment encountered issues that resulted in a service disruption." (avoid blaming language in formal texts)\n4. INFORMAL: "Hey team, please stick to the coding standards we agreed on."', explanation: 'Register markers: "figure out" → "determine/identify/ascertain"; "messed up" → neutral passive construction; "imperative/adhere" → "please/stick to".' }
      ],
      hint: 'Formal signals: passives, Latinate words (ascertain/determine), full forms, complex sentences. Informal: phrasal verbs, contractions, direct address, short sentences.',
      solution: 'Правильные ответы:\n1. "We need to determine/identify the root cause of the recurring server failures."\n2. "We need to figure out why the service keeps going down."\n3. "The deployment encountered issues resulting in a service disruption."\n4. "Hey team, please stick to the coding standards we agreed on."',
      explanation: 'Register flexibility is a B2-level skill. The same information, different audiences, different vocabulary.'
    },
    {
      id: 5,
      title: 'Практика: Collocations in IT English',
      type: 'practice',
      difficulty: 'medium',
      description: 'Устойчивые словосочетания в IT-английском.',
      requirements: ['Выберите правильное слово-партнёр', 'Объясните почему другие варианты неверны', 'Используйте в предложении'],
      questions: [
        { text: 'Choose the correct collocation partner:\n\n1. ___ a deadline: meet / arrive / reach / achieve\n2. ___ a bug: detect / find / locate / identify (all are possible — which is most formal?)\n3. ___ technical debt: accumulate / grow / increase / build\n4. ___ a decision: make / do / take / perform\n5. ___ a pull request: submit / send / give / provide', answer: '1. MEET a deadline (meet is the standard collocation — "arrive/reach a deadline" are wrong; "achieve a deadline" is sometimes used but less standard)\n2. All are possible; IDENTIFY is most formal ("The team identified a critical vulnerability"); "find" is most informal\n3. ACCUMULATE technical debt (accumulate is standard: "Over two years, the codebase accumulated significant technical debt") — "build up" also correct\n4. MAKE a decision (standard); "take a decision" is also acceptable in British English\n5. SUBMIT a pull request (standard in git workflow: "I\'ve submitted PR #834 for review")', explanation: 'Collocations are fixed: you "meet" (not "reach") a deadline, "submit" (not "send") a PR. These are arbitrary but must be learned as units.' }
      ],
      hint: 'Common IT collocations: meet deadlines, submit/open/merge a PR, accumulate/address technical debt, identify/fix bugs, deploy/ship/release features.',
      solution: 'Правильные ответы:\n1. MEET a deadline\n2. IDENTIFY (most formal); find (most informal)\n3. ACCUMULATE technical debt\n4. MAKE a decision (British also: take)\n5. SUBMIT a pull request',
      explanation: 'Collocations — fixed word combinations — are one of the clearest markers of native-level fluency. They must be memorised as pairs, not constructed from logic.'
    },
    {
      id: 6,
      title: 'Практика: Discourse markers for technical writing',
      type: 'practice',
      difficulty: 'medium',
      description: 'Дискурсивные маркеры для связности технических текстов.',
      requirements: ['Добавьте подходящие маркеры', 'Улучшите логическую структуру', 'Не переиспользуйте одни и те же слова'],
      questions: [
        { text: 'Add appropriate discourse markers to improve this technical paragraph:\n\n"We considered three caching strategies. We chose write-through over cache-aside. Cache-aside requires explicit invalidation. Write-through keeps the cache consistent automatically. It adds latency to write operations. The write latency increase is acceptable given our read-heavy workload. Our reads outnumber writes 50:1."', answer: '"We considered three caching strategies. Ultimately, we chose write-through over cache-aside for the following reasons.\n\nFirst and foremost, cache-aside requires explicit invalidation logic, which introduces complexity and potential consistency bugs. Write-through, by contrast, keeps the cache consistent automatically with every write operation.\n\nAdmittedly, write-through adds latency to write operations. However, this trade-off is acceptable given our read-heavy workload — our reads outnumber writes by 50:1. Consequently, the performance benefit on reads significantly outweighs the cost on writes."', explanation: 'Discourse markers added: Ultimately (conclusion), for the following reasons (preview), First and foremost (priority), by contrast (opposition), Admittedly (concession), However (counter), Consequently (result).' }
      ],
      hint: 'Sequence: first/second/finally. Addition: furthermore/moreover. Contrast: however/by contrast/nevertheless. Concession: admittedly/granted. Result: consequently/therefore.',
      solution: 'Правильные ответы:\n1. Added: Ultimately (conclusion marker), for the following reasons (structure preview), First and foremost (priority), by contrast (opposition to cache-aside), Admittedly (honest concession), However (counter), Consequently (result of 50:1 ratio).',
      explanation: 'Discourse markers transform a list of facts into a coherent, persuasive argument showing the logical relationships between ideas.'
    },
    {
      id: 7,
      title: 'Практика: Noun phrases and nominalization',
      type: 'practice',
      difficulty: 'hard',
      description: 'Номинализация для академического и формального технического стиля.',
      requirements: ['Преобразуйте глагольные конструкции в номинальные', 'Используйте в формальном контексте', 'Сохраните точность смысла'],
      questions: [
        { text: 'Nominalise these informal sentences for a formal technical report:\n\n1. "We decided to use Redis because it performs better."\n2. "We found that the system fails when traffic spikes."\n3. "We tested three approaches and chose the fastest one."', answer: '1. NOMINALIZED: "The decision to use Redis was based on its superior performance characteristics."\n(decided → decision; performs better → superior performance)\n\n2. NOMINALIZED: "Investigation revealed a system failure pattern correlated with traffic spikes."\n(we found that → investigation revealed; the system fails → system failure pattern)\n\n3. NOMINALIZED: "Evaluation of three approaches resulted in the selection of the highest-performing solution."\n(we tested → evaluation of; we chose → resulted in the selection of)', explanation: 'Nominalisation: verb → noun (decide → decision, test → evaluation, perform → performance). Makes writing impersonal and formal. Common in academic and technical writing.' }
      ],
      hint: 'Nominalisation patterns: decide → decision, evaluate → evaluation, implement → implementation, perform → performance, select → selection, fail → failure.',
      solution: 'Правильные ответы:\n1. "The decision to use Redis was based on its superior performance characteristics."\n2. "Investigation revealed a system failure pattern correlated with traffic spikes."\n3. "Evaluation of three approaches resulted in the selection of the highest-performing solution."',
      explanation: 'Nominalisation is the dominant feature of academic and technical writing. It creates objectivity and concision by compressing actions into nouns.'
    },
    {
      id: 8,
      title: 'Практика: Vocabulary for uncertainty and hedging',
      type: 'practice',
      difficulty: 'medium',
      description: 'Лексика для выражения степени уверенности.',
      requirements: ['Выражайте точную степень уверенности', 'Используйте разные лексические средства', 'Различайте уровни уверенности'],
      questions: [
        { text: 'Rewrite each statement with the appropriate level of hedging:\n\n1. HIGH CERTAINTY (add hedge): "Caching caused the memory issue."\n2. LOW CERTAINTY (add hedge): "The performance degraded because of a memory leak."\n3. RECOMMENDATION (soften): "You must rewrite the authentication module."\n4. SPECULATION (add hedge): "The service will fail under the new load."', answer: '1. HIGH CERTAINTY: "Caching almost certainly caused the memory issue, based on the timeline of the OOM errors."\nOR: "The evidence strongly suggests that caching caused the memory issue."\n\n2. LOW CERTAINTY: "The performance degradation may potentially be attributable to a memory leak, though further investigation is required to confirm this hypothesis."\n\n3. SOFTENED RECOMMENDATION: "It would be strongly advisable to consider rewriting the authentication module." OR: "A refactoring of the authentication module is recommended."\n\n4. SPECULATION: "There is a possibility that the service may experience performance issues under the projected load." OR: "The service could potentially fail to handle the new load within acceptable latency thresholds."', explanation: 'Hedging scale: certainly/clearly (high) > likely/probably (medium) > possibly/may (low) > cannot be ruled out (very low).' }
      ],
      hint: 'Hedging scale: clearly/evidently (high certainty) > likely/probably (moderate) > may/possibly/potentially (low) > cannot be determined (very low).',
      solution: 'Правильные ответы:\n1. High certainty: "almost certainly caused / strongly suggests"\n2. Low certainty: "may potentially be attributable to / further investigation required"\n3. Softened recommendation: "would be advisable / is recommended"\n4. Speculation: "there is a possibility / could potentially"',
      explanation: 'Hedging vocabulary is essential in technical writing. Overstating certainty damages credibility; understating it makes writing vague. Match hedging to actual confidence level.'
    },
    {
      id: 9,
      title: 'Практика: Vocabulary for comparison and contrast',
      type: 'practice',
      difficulty: 'medium',
      description: 'Лексика для сравнения технических решений.',
      requirements: ['Используйте разнообразную vocabulary', 'Правильные структуры сравнения', 'Избегайте повторений'],
      questions: [
        { text: 'Write a comparison of REST vs GraphQL APIs using at least 8 different comparison words/phrases:\n(whereas, in contrast, on the other hand, similarly, both, unlike, superior to, inferior to, more X than, less X than, differ from, share...)', answer: 'REST and GraphQL both provide structured approaches to building APIs, but they differ fundamentally in how data is requested. REST uses fixed endpoints — each resource has a dedicated URL, whereas GraphQL provides a single endpoint through which clients can request exactly the data they need.\n\nIn terms of caching, REST has a distinct advantage: HTTP caching works out of the box with REST, since each endpoint maps to a specific response. GraphQL, on the other hand, requires application-level caching, which adds complexity.\n\nUnlike REST, where multiple requests may be needed to fetch related resources (the N+1 problem), GraphQL enables fetching all required data in a single query. In contrast, REST\'s predictability and simplicity make it superior to GraphQL for public APIs where discoverability matters.\n\nBoth approaches support authentication, error handling, and versioning, though they implement these differently. GraphQL is arguably more complex to set up, while REST is less flexible for mobile clients with varying data needs.', explanation: 'Comparison vocabulary: both (similarities), whereas/while (simultaneous contrast), in contrast/on the other hand (sequential contrast), unlike (highlight difference), superior/inferior to (relative judgment).' }
      ],
      hint: 'Comparison structures: X whereas Y (simultaneous), On the one hand... on the other hand... (sequential), Unlike X, Y... (highlight difference), Both X and Y... (similarity).',
      solution: 'Правильные ответы:\n1. Used: both (similarity), differ fundamentally (contrast), whereas (simultaneous contrast), in terms of (category marker), on the other hand (sequential contrast), unlike (highlight difference), in contrast (comparison), superior to (judgment), while (simultaneous), both (recurrence).',
      explanation: 'Comparison vocabulary variety is a marker of B2 fluency. Using the same word (like "but") repeatedly signals lower proficiency.'
    },
    {
      id: 10,
      title: 'Финальная практика: B2 vocabulary in context',
      type: 'practice',
      difficulty: 'hard',
      description: 'Комплексная проверка словарного запаса B2 в реалистичном тексте.',
      requirements: [
        'Напишите 200-250 слов технического текста',
        'Минимум 15 слов/конструкций уровня B2',
        'Формальный регистр',
        'Тема: обоснование перехода на GraphQL для мобильного API'
      ],
      hint: 'Use: evaluation, consequently, nevertheless, viable, leverage, align, prevalent, substantiate, feasible, mitigate, whilst, albeit, in contrast, moreover, ultimately.',
      solution: 'SAMPLE TEXT:\n\nThis report presents an evaluation of GraphQL as a replacement for the existing REST API serving our mobile client applications. The assessment was prompted by recurring performance issues that have been identified in the current architecture.\n\nThe primary constraint driving this proposal is the prevalence of over-fetching: mobile clients consistently receive substantially more data than required for a given screen. Consequently, this results in increased bandwidth consumption — a particularly critical concern for users on mobile networks with limited data plans.\n\nGraphQL addresses this limitation directly. By enabling clients to specify the exact fields required in each request, the proposed solution would mitigate over-fetching entirely. Moreover, it would eliminate the under-fetching problem — where multiple REST endpoints must be called to satisfy a single screen — through the consolidation of data requirements into a single query.\n\nThe transition is technically feasible within the current quarter, albeit it requires investment in schema design and developer tooling. Whilst the migration introduces additional backend complexity, this is outweighed by the performance gains for mobile users.\n\nThe approach leverages our existing authentication infrastructure, which remains unchanged. Ultimately, the evidence substantiates a clear case for adoption. Nevertheless, a phased rollout is recommended — beginning with internal clients — to validate the approach before committing fully.',
      explanation: 'B2 vocabulary in context: the words serve the meaning — they are not decorative. Each formal word could be replaced with a simpler one, but the formal register and precision are appropriate for a technical proposal.'
    }
  ]
}
