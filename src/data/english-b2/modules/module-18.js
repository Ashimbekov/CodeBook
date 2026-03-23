export default {
  id: 18,
  title: 'Академический и формальный стиль',
  description: 'Академическое письмо для технических статей, RFC и whitepaper-документов',
  lessons: [
    {
      id: 1,
      title: 'Академический стиль: основные принципы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Академический и формальный стиль используется в research papers, RFC, whitepaper-документах, технических отчётах и официальной корреспонденции.' },
        { type: 'heading', value: 'Ключевые характеристики' },
        { type: 'list', items: [
          'Объективность: избегание личных местоимений и эмоций',
          'Точность: конкретные данные и ссылки вместо общих утверждений',
          'Формальная лексика: латинские заимствования, абстрактные существительные',
          'Сложный синтаксис: номинализация, пассив, придаточные предложения',
          'Hedging: выражение степени уверенности через модальные глаголы и наречия'
        ]},
        { type: 'heading', value: 'Номинализация — ключевой инструмент' },
        { type: 'text', value: 'Замена глаголов существительными — признак академического стиля:\n"We analysed the results" → "An analysis of the results was conducted"\n"We improved performance" → "Performance improvements were achieved"\n"We decided to adopt microservices" → "The decision to adopt a microservices architecture was made"' },
        { type: 'tip', value: 'Академический стиль — не о длине слов, а о точности. "The system failed" слишком расплывчато. "The service experienced an unplanned interruption due to resource exhaustion" — точно и академично.' }
      ]
    },
    {
      id: 2,
      title: 'Hedging: выражение степени уверенности',
      type: 'theory',
      content: [
        { type: 'text', value: 'Hedging — использование языковых средств для выражения осторожности и неопределённости. В академических текстах это обязательно — избегайте абсолютных утверждений без доказательств.' },
        { type: 'heading', value: 'Модальные глаголы для hedging' },
        { type: 'text', value: '"This approach may improve performance significantly."\n"The proposed algorithm could reduce latency by up to 40%."\n"Further investigation might reveal additional factors."\n"These results should be interpreted with caution."' },
        { type: 'heading', value: 'Адвербиальные hedges' },
        { type: 'text', value: '"This approach appears to be more efficient in most cases."\n"The results suggest that caching could provide substantial benefits."\n"It seems reasonable to conclude that..."\n"There is evidence to indicate that..."' },
        { type: 'heading', value: 'Reporting verbs' },
        { type: 'text', value: '"Previous studies have shown that..."\n"The authors claim that this algorithm is optimal."\n"The results indicate a correlation between..."\n"The data suggests that the hypothesis is partially supported."' },
        { type: 'warning', value: 'Разница между academic hedging и деловой уверенностью: в research papers hedging обязателен. В business presentations наоборот — нужна уверенность: "This solution will improve performance" звучит убедительнее, чем "might improve".' }
      ]
    },
    {
      id: 3,
      title: 'Структура академической технической статьи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Знание стандартной структуры помогает и писать, и читать технические статьи.' },
        { type: 'heading', value: 'IMRAD структура' },
        { type: 'text', value: '"Introduction: Why this research was conducted and what the paper contributes."\n"Methods: How the research was conducted (reproducible)."\n"Results: What was observed (data only, no interpretation)."\n"And Discussion: What the results mean and their implications."' },
        { type: 'heading', value: 'Abstract — краткое резюме статьи' },
        { type: 'text', value: '"The abstract summarises the paper in 150-300 words."\n"It typically includes: motivation, method, key results, and conclusion."\n"Do not cite other works or use unexplained abbreviations in the abstract."\n"The abstract is often read in isolation — it must stand alone."' },
        { type: 'heading', value: 'Типичные фразы для разделов' },
        { type: 'text', value: 'Introduction: "This paper presents...", "The remainder of this paper is organised as follows..."\nRelated work: "Prior work by X et al. demonstrated...", "In contrast to previous approaches..."\nMethods: "We evaluated X using...", "The experimental setup consisted of..."\nResults: "Table 1 shows...", "As evidenced by Figure 3..."\nConclusion: "In this paper, we have demonstrated...", "Future work will explore..."' }
      ]
    },
    {
      id: 4,
      title: 'RFC-стиль: технические стандарты',
      type: 'theory',
      content: [
        { type: 'text', value: 'RFC (Request for Comments) — стандарт написания технических интернет-стандартов. Знание этого стиля важно для участия в стандартизации и написания ADR.' },
        { type: 'heading', value: 'RFC 2119 ключевые слова' },
        { type: 'text', value: '"MUST / REQUIRED / SHALL: the definition is an absolute requirement."\n"MUST NOT / SHALL NOT: the definition is an absolute prohibition."\n"SHOULD / RECOMMENDED: there may be valid reasons to not follow this, but understand implications first."\n"SHOULD NOT / NOT RECOMMENDED: there may be valid reasons, but understand the implications."\n"MAY / OPTIONAL: the item is truly optional."' },
        { type: 'heading', value: 'RFC language patterns' },
        { type: 'text', value: '"Implementations MUST support TLS 1.3."\n"The server SHOULD include a retry-after header when returning 429."\n"Clients MAY cache responses for up to 24 hours."\n"Implementations MUST NOT use MD5 for any security-sensitive operations."' },
        { type: 'tip', value: 'Когда пишете ADR или внутренний RFC, используйте эти ключевые слова в верхнем регистре. Это сразу даёт понять, что является обязательным, а что рекомендуемым.' }
      ]
    },
    {
      id: 5,
      title: 'Ссылки, цитирование и evidence-based writing',
      type: 'theory',
      content: [
        { type: 'text', value: 'Академическое письмо требует поддержки утверждений доказательствами и ссылками.' },
        { type: 'heading', value: 'Интеграция источников' },
        { type: 'text', value: '"According to Dean et al. (2004), MapReduce provides significant advantages for large-scale data processing."\n"As demonstrated by Lamport (1978) in his seminal work on distributed systems..."\n"Recent benchmarks (Smith, 2024) suggest that the performance gap has narrowed considerably."' },
        { type: 'heading', value: 'Критическое использование источников' },
        { type: 'text', value: '"While X et al. (2020) advocate for approach A, this analysis is limited to..."\n"These results contrast with those reported by Y (2022), potentially due to..."\n"The methodology employed by Z has been questioned on the grounds that..."' },
        { type: 'heading', value: 'Фразы для доказательного письма' },
        { type: 'text', value: '"The data conclusively demonstrate that..."\n"Evidence suggests a positive correlation between..."\n"This is supported by the experimental results presented in Section 4."\n"The findings are consistent with the hypothesis that..."' }
      ]
    },
    {
      id: 6,
      title: 'Практика: написание абстракта',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите академический абстракт для технической статьи о вашей системе.',
      requirements: [
        'Длина: 150-200 слов',
        'Структура: проблема → метод → результаты → вывод',
        'Используйте академический стиль: hedging, номинализация, пассив',
        'Тема: оптимизация производительности распределённой базы данных'
      ],
      hint: 'Начните с одного предложения о проблеме, затем метод, потом результаты с конкретными числами, затем вывод и значимость работы.',
      solution: 'Abstract:\n\nDistributed database systems frequently encounter performance degradation under high-concurrency workloads, resulting in increased query latency and reduced throughput. This paper presents an investigation into the application of adaptive indexing strategies to mitigate these challenges in multi-tenant environments.\n\nA series of controlled experiments was conducted across three distributed database configurations, each subjected to synthetic workloads simulating real-world e-commerce transaction patterns. The proposed approach dynamically adjusts index structures based on observed query patterns, thereby reducing the need for manual tuning.\n\nExperimental results indicate a median query latency reduction of 42% under peak load conditions, alongside a throughput improvement of approximately 35%. These gains were achieved without significant increases in storage overhead.\n\nThe findings suggest that adaptive indexing represents a viable approach for improving distributed database performance at scale. It is anticipated that the methodology described herein may be generalised to a broader range of distributed data systems. Future work will explore the application of machine learning techniques to further refine the adaptation mechanisms.',
      explanation: 'Академический абстракт — сжатое, структурированное представление исследования. Навык его написания востребован при подготовке whitepaper-документов, conference proposals и внутренних технических отчётов.'
    },
    {
      id: 7,
      title: 'Практика: конвертация неформального в академический стиль',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перепишите неформальный технический текст в академическом стиле.',
      requirements: [
        'Используйте номинализацию',
        'Добавьте hedging где уместно',
        'Замените фразовые глаголы и разговорную лексику формальными эквивалентами',
        'Используйте пассивный залог где уместно'
      ],
      questions: [
        { text: 'INFORMAL: "We found out that caching really speeds things up. We tried it and it worked great — response times went way down. We think more teams should do this."\n→ ACADEMIC/FORMAL:', answer: 'It was established through experimental evaluation that the implementation of a caching layer results in substantial performance improvements. The findings demonstrate a statistically significant reduction in response latency. Based on the evidence presented, it is recommended that this approach be considered for adoption across comparable system architectures.', explanation: 'Трансформации: "found out" → "established"; "really speeds things up" → "substantial performance improvements"; "went way down" → "statistically significant reduction"; "We think more teams should do this" → "it is recommended that this approach be considered"' }
      ],
      solution: 'Правильные ответы:\n1. It was established through experimental evaluation that the implementation of a caching layer results in substantial performance improvements. The findings demonstrate a statistically significant reduction in response latency. Based on the evidence presented, it is recommended that this approach be ',
      hint: 'Шаги: 1) Заменить "we/I" безличными конструкциями; 2) Заменить разговорные слова формальными; 3) Добавить hedge-слова (may, suggest, appear); 4) Номинализировать глаголы.',
      explanation: 'Конвертация между стилями — важный навык. В работе часто нужно писать одно и то же в разных стилях: slack-сообщение команде, email клиенту, раздел в whitepaper. Знание различий между стилями позволяет это делать эффективно.'
    }
  ]
}
