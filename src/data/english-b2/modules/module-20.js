export default {
  id: 20,
  title: 'Чтение: научные статьи (papers)',
  description: 'Как читать и понимать технические research papers и whitepaper-документы',
  lessons: [
    {
      id: 1,
      title: 'Структура research paper',
      type: 'theory',
      content: [
        { type: 'text', value: 'Умение читать research papers открывает доступ к передовым знаниям в области IT. Многие фундаментальные технологии (MapReduce, Dynamo, Kafka, Raft) описаны именно в papers.' },
        { type: 'heading', value: 'Стандартная структура' },
        { type: 'list', items: [
          'Abstract: что исследовалось, метод, ключевые результаты (150-300 слов)',
          'Introduction: контекст, проблема, вклад статьи',
          'Related Work / Background: предыдущие исследования',
          'Design / Architecture / Approach: предлагаемое решение',
          'Implementation: как реализовано',
          'Evaluation: эксперименты и результаты',
          'Discussion: интерпретация, ограничения',
          'Conclusion: резюме и будущая работа',
          'References: литература'
        ]},
        { type: 'tip', value: 'Стратегия чтения paper: 1) Abstract — понять суть. 2) Introduction + Conclusion — понять вклад. 3) Figures and tables — ключевые результаты. 4) Полное чтение только если нужна глубина.' }
      ]
    },
    {
      id: 2,
      title: 'Лексика academic papers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Academic papers используют специфическую лексику, которую нужно распознавать автоматически.' },
        { type: 'heading', value: 'Описание вклада' },
        { type: 'text', value: '"We present X, a novel approach to..."\n"This paper proposes/describes/introduces/presents..."\n"We demonstrate that X outperforms existing solutions by..."\n"To the best of our knowledge, this is the first system to..."' },
        { type: 'heading', value: 'Описание экспериментов' },
        { type: 'text', value: '"We evaluated X on a dataset of / benchmark of / workload consisting of..."\n"Our evaluation demonstrates / shows / indicates..."\n"The results are compared against the baseline of..."\n"We conducted experiments on a cluster of N machines."' },
        { type: 'heading', value: 'Описание ограничений' },
        { type: 'text', value: '"This work does not address / is out of scope for..."\n"A limitation of our approach is..."\n"Future work will explore..."\n"While our system performs well under X conditions, Y scenarios remain challenging."' },
        { type: 'note', value: '"Seminal paper": основополагающая статья в области. "Follow-up work": последующие исследования. "Orthogonal to": не противоречащий, работающий независимо. "Strawman": нарочно упрощённый вариант для сравнения.' }
      ]
    },
    {
      id: 3,
      title: 'Чтение знаковых IT papers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Разберём фрагменты из реальных важных статей, ставших основой для современных технологий.' },
        { type: 'heading', value: 'Google MapReduce (2004)' },
        { type: 'text', value: 'From the abstract: "MapReduce is a programming model and an associated implementation for processing and generating large data sets. Users specify a map function that processes a key/value pair to generate a set of intermediate key/value pairs, and a reduce function that merges all intermediate values associated with the same intermediate key."\n\nКлючевые слова: programming model, implementation, map/reduce functions, intermediate key/value pairs.' },
        { type: 'heading', value: 'Amazon Dynamo (2007)' },
        { type: 'text', value: 'From the abstract: "Dynamo is a highly available key-value storage system that some of Amazon\'s core services use to provide an always-on experience... to achieve this level of availability, Dynamo sacrifices consistency under certain failure scenarios."\n\nЗдесь явно описан CAP trade-off: availability vs consistency.' },
        { type: 'tip', value: 'Must-read papers для senior engineers: MapReduce (Google), Dynamo (Amazon), Bigtable (Google), Raft (Ongaro & Ousterhout), Spanner (Google), Kafka (LinkedIn). Они описывают системы, которые вы используете каждый день.' }
      ]
    },
    {
      id: 4,
      title: 'Критическое чтение: оценка papers',
      type: 'theory',
      content: [
        { type: 'text', value: 'Критическое чтение — умение не просто понять, но и оценить качество и применимость исследования.' },
        { type: 'heading', value: 'Вопросы для критической оценки' },
        { type: 'list', items: [
          'What problem are the authors solving? Is it a real problem?',
          'What assumptions do they make? Are they valid?',
          'How does the evaluation compare to real-world conditions?',
          'What are the limitations and failure modes not discussed?',
          'Has this been validated beyond the authors\' own evaluation?',
          'What is the complexity/cost of implementation?'
        ]},
        { type: 'heading', value: 'Оценка экспериментов' },
        { type: 'text', value: '"Microbenchmark vs. end-to-end benchmark: microbenchmarks can be misleading."\n"Is the baseline fair? Were alternatives configured optimally?"\n"Is the workload synthetic or real? Synthetic workloads may not reflect production."\n"What hardware was used? Results may not generalise."' }
      ]
    },
    {
      id: 5,
      title: 'Белые книги (whitepapers) и технические блоги',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кроме academic papers, важно уметь читать whitepapers и engineering blogs крупных компаний.' },
        { type: 'heading', value: 'Whitepaper' },
        { type: 'text', value: '"A whitepaper is an authoritative report on a specific topic, often presenting a solution to a problem."\n"AWS whitepapers cover topics like security, high availability, and cost optimisation."\n"Whitepapers are less rigorous than academic papers but more practical."\n"They often contain architecture diagrams and implementation guidance."' },
        { type: 'heading', value: 'Engineering blogs' },
        { type: 'text', value: '"Netflix Tech Blog, Uber Engineering, Airbnb Engineering: real-world system design at scale."\n"These posts describe actual production systems, not theoretical research."\n"Key pattern: Problem description → Solution considered → Trade-offs → Implementation details → Results."' },
        { type: 'heading', value: 'Лексика engineering blogs' },
        { type: 'text', value: '"We ran into an issue where..."\n"After investigating, we found that..."\n"We tried X, but it didn\'t work because..."\n"The solution was to..."\n"This allowed us to / This resulted in..."\n"Lessons learned: ..."' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Summary и critique',
      type: 'practice',
      difficulty: 'hard',
      description: 'Прочитайте abstract и напишите summary + критический анализ.',
      requirements: [
        'Summary: 3-4 предложения, своими словами',
        'Critique: минимум 2 вопроса к авторам',
        'Определите: проблема, метод, результат, ограничения'
      ],
      questions: [
        { text: 'Abstract from a hypothetical paper:\n"We present CacheAware, a distributed caching system designed to minimise cache misses in geographically distributed deployments. Traditional consistent hashing approaches result in cache invalidation storms when nodes join or leave the cluster. CacheAware introduces a novel virtual node algorithm that reduces cache miss rate by up to 78% during topology changes. We evaluated CacheAware on a 100-node cluster under synthetic workloads designed to simulate e-commerce traffic patterns. Results show a 78% reduction in cache misses and a 45% reduction in origin server load."\n\nWrite: 1) Summary, 2) Critical questions', answer: 'SUMMARY: The paper presents CacheAware, a distributed caching system that addresses the problem of cache invalidation storms during cluster topology changes. Using a novel virtual node algorithm, the system reduces cache miss rates by up to 78% compared to traditional consistent hashing, with evaluation on a 100-node cluster.\n\nCRITICAL QUESTIONS:\n1. Experimental validity: The evaluation used "synthetic workloads designed to simulate e-commerce traffic patterns." How accurately do these workloads represent real production traffic? Have the authors validated their system against actual production systems? Real traffic often has bursty, long-tail distributions that synthetic workloads may not capture.\n2. Comparison baseline: Against which consistent hashing implementation was CacheAware compared? Was the baseline configured optimally? A 78% improvement sounds impressive, but depends heavily on what the baseline is.\n3. Missing information: What is the overhead of the virtual node algorithm in terms of memory and CPU? What happens to write latency during topology changes?', explanation: 'Критический анализ papers — ключевой навык для senior-инженеров. Способность задавать правильные вопросы к исследованию позволяет принимать обоснованные решения о применимости технологии.' }
      ],
      solution: 'Правильные ответы:\n1. SUMMARY: The paper presents CacheAware, a distributed caching system that addresses the problem of cache invalidation storms during cluster topology changes. Using a novel virtual node algorithm, the system reduces cache miss rates by up to 78% compared to traditional consistent hashing, with evalua',
      hint: 'Summary: что (проблема), как (метод), что получилось (результаты). Critique: фокус на методологии (как они это измеряли), baseline (с чем сравнивали), экстраполируемости результатов.',
      explanation: 'Умение критически читать papers отличает инженера, который применяет технологии осознанно, от того, кто следует хайпу. Каждое исследование имеет ограничения — нужно их видеть.'
    },
    {
      id: 7,
      title: 'Практика: чтение Raft paper фрагмент',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проанализируйте фрагмент реального paper и объясните концепцию своими словами.',
      requirements: [
        'Объясните концепцию из текста простым языком',
        'Выделите ключевые термины',
        'Свяжите с практическим применением'
      ],
      questions: [
        { text: 'From "In Search of an Understandable Consensus Algorithm" (Raft paper):\n"Raft begins with a leader election phase. A server starts as a follower. Followers are passive: they issue no requests on their own but simply respond to requests from leaders and candidates. If a follower receives no communication, it assumes there is no viable leader and begins an election. To begin an election, a follower increments its current term and transitions to candidate state."\n\nExplain: What happens when a follower detects a leader failure?', answer: 'When a follower stops receiving communication from the leader (within a timeout period), it concludes that the current leader is unavailable — either crashed or partitioned from the network. The follower then takes the following steps: First, it increments its "term number" — a logical clock that tracks election generations. This ensures that responses from an old leader (if it was just delayed, not failed) will be rejected. Second, it transitions its own state from "follower" to "candidate". Third, it begins a new leader election by requesting votes from other nodes in the cluster.\n\nThis mechanism is fundamental to Raft\'s fault tolerance: the cluster can continue operating as long as a majority of nodes remain reachable. The term increment prevents a recovered stale leader from causing split-brain issues.', explanation: 'Объяснение сложных distributed systems концепций простым языком — навык, критически важный для tech talks, документации и обучения junior-инженеров.' }
      ],
      solution: 'Правильные ответы:\n1. When a follower stops receiving communication from the leader (within a timeout period), it concludes that the current leader is unavailable — either crashed or partitioned from the network. The follower then takes the following steps: First, it increments its "term number" — a logical clock that tr',
      hint: 'Читайте медленно, разбирая каждое предложение. Переведите технические термины: "term" = номер избирательного тура; "candidate state" = состояние кандидата на лидерство.',
      explanation: 'Читать research papers — это навык, который развивается с практикой. Начните с понимания структуры, затем работайте с vocabulary, и постепенно переходите к критическому анализу.'
    }
  ]
}
