export default {
  id: 29,
  title: 'Практикум: Продвинутая грамматика',
  description: 'Практика всех тем продвинутой грамматики: условные, инверсия, клефты, пассив, модальные',
  lessons: [
    {
      id: 1,
      title: 'Тест: Mixed Conditionals',
      type: 'practice',
      difficulty: 'hard',
      description: 'Комплексные упражнения на смешанные условные предложения.',
      requirements: ['Заполните пропуски', 'Трансформируйте предложения', 'Напишите мини-эссе с условными'],
      questions: [
        { text: 'If the team ___ (follow) SOLID principles from the start, we ___ (not deal) with this spaghetti code now.', answer: 'had followed / would not be dealing', explanation: 'Mixed conditional Type 1: past condition (had followed) → present consequence (would not be dealing)' },
        { text: 'If I ___ (be) a better communicator, I ___ (get) promoted to tech lead last year.', answer: 'were / would have got', explanation: 'Mixed conditional Type 2: present state (were = not a good communicator) → past consequence (would have got)' },
        { text: 'Rewrite using a mixed conditional:\n"We did not invest in tests. Now we have a fragile codebase."', answer: 'If we had invested in tests, we would not have such a fragile codebase now.', explanation: 'Past condition → present consequence = Mixed Type 1' }
      ],
      solution: 'Правильные ответы:\n1. had followed / would not be dealing\n2. were / would have got\n3. If we had invested in tests, we would not have such a fragile codebase now.',
      hint: 'Identify: is the condition in the past or present? Is the consequence in the past or present? This determines the type.',
      explanation: 'Mixed conditionals describe situations where cause and effect span different time periods. They are especially common in technical analysis and postmortems.'
    },
    {
      id: 2,
      title: 'Тест: Инверсия',
      type: 'practice',
      difficulty: 'hard',
      description: 'Трансформация предложений с использованием инверсии.',
      requirements: ['Начните каждое предложение с указанного наречия', 'Используйте правильный вспомогательный глагол'],
      questions: [
        { text: 'We have never seen such a critical vulnerability in production.\n→ Never ___', answer: 'Never have we seen such a critical vulnerability in production.', explanation: 'Never + have/has + subject + past participle' },
        { text: 'We not only fixed the bug but also improved performance by 50%.\n→ Not only ___', answer: 'Not only did we fix the bug, but we also improved performance by 50%.', explanation: 'Not only + did + subject + base verb (past simple context)' },
        { text: 'If the primary server should fail, the backup will activate automatically.\n→ Should ___', answer: 'Should the primary server fail, the backup will activate automatically.', explanation: 'Should (formal conditional inversion) + subject + bare infinitive' }
      ],
      solution: 'Правильные ответы:\n1. Never have we seen such a critical vulnerability in production.\n2. Not only did we fix the bug, but we also improved performance by 50%.\n3. Should the primary server fail, the backup will activate automatically.',
      hint: 'После отрицательного/ограничивающего наречия: вспомогательный глагол + подлежащее (как в вопросе).',
      explanation: 'Inversion is a key feature of formal and emphatic English, widely used in technical presentations and documentation.'
    },
    {
      id: 3,
      title: 'Тест: Cleft Sentences',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перефразирование с использованием расщеплённых предложений.',
      requirements: ['Используйте указанный тип клефта', 'Выделите указанный элемент'],
      questions: [
        { text: 'Poor documentation caused the onboarding delay.\n→ It-cleft (emphasise cause):', answer: 'It was poor documentation that caused the onboarding delay.', explanation: 'It + was + highlighted element + that + rest of sentence' },
        { text: 'We need better observability tooling.\n→ What-cleft:', answer: 'What we need is better observability tooling.', explanation: 'What + subject + verb + is/was + complement' },
        { text: 'The refactoring improved code maintainability above all.\n→ What-cleft emphasising result:', answer: 'What the refactoring improved most was code maintainability.', explanation: 'What + subject + verb + adverb + was + object' }
      ],
      solution: 'Правильные ответы:\n1. It was poor documentation that caused the onboarding delay.\n2. What we need is better observability tooling.\n3. What the refactoring improved most was code maintainability.',
      hint: 'Choose cleft type based on what you want to emphasise: It-cleft for identifying who/what, What-cleft for actions and qualities.',
      explanation: 'Cleft sentences allow you to pinpoint exact causes, solutions, and requirements — invaluable in technical documentation and presentations.'
    },
    {
      id: 4,
      title: 'Тест: Advanced Passives',
      type: 'practice',
      difficulty: 'hard',
      description: 'Комплексные упражнения на пассивный залог.',
      requirements: ['Трансформируйте в пассив', 'Добавьте модальный глагол', 'Используйте причастные обороты'],
      questions: [
        { text: 'Someone must have introduced the memory leak during the last refactoring.\n→ The memory leak ___', answer: 'The memory leak must have been introduced during the last refactoring.', explanation: 'Modal + have been + past participle (past modal passive)' },
        { text: 'The team wrote this library in Kotlin for performance reasons.\n→ This library ___ (written in Kotlin, used as a participle clause)', answer: 'Written in Kotlin for performance reasons, this library offers significant advantages.', explanation: 'Past participle at the start: passive participial clause replacing "Because it was written in..."' },
        { text: 'We recommend that all secrets be rotated every 90 days.\n→ It ___ (formal passive)', answer: 'It is recommended that all secrets be rotated every 90 days.', explanation: 'It is + past participle + that + subjunctive clause' }
      ],
      solution: 'Правильные ответы:\n1. The memory leak must have been introduced during the last refactoring.\n2. Written in Kotlin for performance reasons, this library offers significant advantages.\n3. It is recommended that all secrets be rotated every 90 days.',
      hint: 'Passive + modal: modal + be/have been + past participle. Participle clause: V3 at start of sentence. Formal recommendation: It is recommended that + base form.',
      explanation: 'Complex passives are the foundation of professional technical writing in documentation, RFCs, and incident reports.'
    },
    {
      id: 5,
      title: 'Тест: Modal verbs в IT-анализе',
      type: 'practice',
      difficulty: 'hard',
      description: 'Использование модальных глаголов для анализа и выводов.',
      requirements: ['Выберите правильный модальный глагол', 'Объясните уровень уверенности'],
      questions: [
        { text: 'The database shows 10,000 failed login attempts from a single IP. What ___ (logical deduction - almost certain) this mean?', answer: 'This must indicate a brute-force attack in progress.', explanation: 'Must = near-certain logical deduction based on evidence' },
        { text: 'We did not write integration tests. As a result, the bug reached production. Express regret:', answer: 'We should have written integration tests before deploying.', explanation: 'Should have + past participle = regret about past omission' },
        { text: 'Express a past possibility: "There is a chance the configuration was incorrectly set."', answer: 'The configuration may/might have been incorrectly set.', explanation: 'May/might have been + past participle = past possibility' }
      ],
      solution: 'Правильные ответы:\n1. This must indicate a brute-force attack in progress.\n2. We should have written integration tests before deploying.\n3. The configuration may/might have been incorrectly set.',
      hint: 'Certainty scale: must have (90%+) > should have been (expectation) > could have been (possibility) > might/may have been (lower probability)',
      explanation: 'Precise modal usage distinguishes professional engineers from junior developers. It allows nuanced communication about causes, possibilities, and recommendations.'
    },
    {
      id: 6,
      title: 'Тест: Participle Clauses',
      type: 'practice',
      difficulty: 'medium',
      description: 'Трансформация предложений в причастные обороты.',
      requirements: ['Сократите придаточные до причастных оборотов', 'Выберите правильный тип причастия'],
      questions: [
        { text: 'Because it was designed for high availability, the service continues to operate during partial failures.\n→ (Participle clause):', answer: 'Designed for high availability, the service continues to operate during partial failures.', explanation: 'Past participle (passive meaning) replaces "Because it was designed"' },
        { text: 'After the team had reviewed all requirements, they began the implementation.\n→ (Having + past participle):', answer: 'Having reviewed all requirements, the team began the implementation.', explanation: 'Having + past participle for action completed before the main clause' },
        { text: 'The algorithm iterates through the list and computes the running average.\n→ (-ing clause):', answer: 'Iterating through the list, the algorithm computes the running average.', explanation: '-ing clause for simultaneous or sequential action by the same subject' }
      ],
      solution: 'Правильные ответы:\n1. Designed for high availability, the service continues to operate during partial failures.\n2. Having reviewed all requirements, the team began the implementation.\n3. Iterating through the list, the algorithm computes the running average.',
      hint: 'Past participle (V3) = passive or completed before main action. Having + V3 = completed before. -ing = simultaneous or sequential (same subject).',
      explanation: 'Participle clauses make technical writing more concise and elegant. They are a hallmark of professional engineering communication.'
    },
    {
      id: 7,
      title: 'Тест: Субъюнктив',
      type: 'practice',
      difficulty: 'medium',
      description: 'Использование сослагательного наклонения в формальных требованиях.',
      requirements: ['Используйте present subjunctive после глаголов требования', 'Используйте were в условных предложениях'],
      questions: [
        { text: 'The specification requires: all passwords must use bcrypt.\n→ The specification requires that ___', answer: 'The specification requires that all passwords be hashed using bcrypt.', explanation: 'Present subjunctive after "requires that": base form (be), no -s for third person' },
        { text: 'I am not a distributed systems expert. If I were, I would design this differently.\n→ As a wish:', answer: 'I wish I were a distributed systems expert.', explanation: 'Wish + past subjunctive (were for all persons)' }
      ],
      solution: 'Правильные ответы:\n1. The specification requires that all passwords be hashed using bcrypt.\n2. I wish I were a distributed systems expert.',
      hint: 'Present subjunctive: base form only (no -s, no -ing, no auxiliaries). Past subjunctive: were (for "be" in all persons).',
      explanation: 'The subjunctive mood appears frequently in technical requirements and standards. Recognising it is important for reading RFCs; using it marks professional writing.'
    },
    {
      id: 8,
      title: 'Тест: Discourse Markers',
      type: 'practice',
      difficulty: 'medium',
      description: 'Структурирование технических текстов с помощью дискурсивных маркеров.',
      requirements: ['Добавьте подходящие дискурсивные маркеры', 'Улучшите связность текста'],
      questions: [
        { text: 'Improve the cohesion of this technical paragraph by adding discourse markers:\n\n"We evaluated three options. We chose PostgreSQL. It has ACID compliance. It supports complex queries. It has a large community. NoSQL solutions are not suitable. They lack transactional support."', answer: 'We evaluated three options. Ultimately, we chose PostgreSQL for the following reasons. First and foremost, it provides full ACID compliance, which is essential for our financial data. Furthermore, it supports complex queries with excellent performance. In addition, it benefits from a large and active community. In contrast, NoSQL solutions were not suitable for our use case, primarily because they lack transactional support.', explanation: 'Added: Ultimately (conclusion marker), First and foremost (priority), Furthermore (addition), In addition (addition), In contrast (opposition), primarily because (reason)' }
      ],
      solution: 'Правильные ответы:\n1. We evaluated three options. Ultimately, we chose PostgreSQL for the following reasons. First and foremost, it provides full ACID compliance, which is essential for our financial data. Furthermore, it supports complex queries with excellent performance. In addition, it benefits from a large and activ',
      hint: 'Sequence: first/second/finally. Addition: furthermore/moreover/in addition. Contrast: however/in contrast/nevertheless. Reason: because/due to/as a result of.',
      explanation: 'Discourse markers transform a list of facts into a coherent, persuasive argument. They show the logical relationships between ideas.'
    },
    {
      id: 9,
      title: 'Тест: Formal vs Informal Register',
      type: 'practice',
      difficulty: 'medium',
      description: 'Переключение между формальным и неформальным регистром.',
      requirements: ['Адаптируйте текст к указанной аудитории', 'Сохраните содержание, измените стиль'],
      questions: [
        { text: 'Convert to formal (for a client report):\n"Hey, so basically our servers got hammered during the sale and went down for like 2 hours. We fixed it pretty quickly though. Won\'t happen again — we\'re getting more servers."', answer: 'During the promotional event, our infrastructure experienced an unexpected surge in traffic that exceeded current capacity, resulting in a service interruption of approximately two hours. Our engineering team promptly resolved the issue by restoring service from backup systems. To prevent recurrence, we are in the process of procuring additional capacity and implementing auto-scaling policies that will respond automatically to future traffic surges.', explanation: 'Formal transformations: "got hammered" → "experienced a surge exceeding capacity"; "went down for like 2 hours" → "service interruption of approximately two hours"; "fixed it pretty quickly" → "promptly resolved the issue"' }
      ],
      solution: 'Правильные ответы:\n1. During the promotional event, our infrastructure experienced an unexpected surge in traffic that exceeded current capacity, resulting in a service interruption of approximately two hours. Our engineering team promptly resolved the issue by restoring service from backup systems. To prevent recurrence',
      hint: 'Formal: no contractions, no slang, passive voice, abstract nouns, longer sentences, specific rather than vague.',
      explanation: 'Register flexibility is one of the clearest signals of English language proficiency. The ability to shift register appropriately is a professional skill as much as a language skill.'
    },
    {
      id: 10,
      title: 'Комплексный тест: написание технического документа',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напишите короткий технический документ, используя все продвинутые грамматические конструкции.',
      requirements: [
        'Минимум: 1 cleft sentence, 1 inversion, 1 mixed conditional, 1 complex passive, 1 participle clause',
        'Используйте дискурсивные маркеры для связности',
        'Формальный академический тон',
        'Длина: 150-200 слов',
        'Тема: обоснование перехода на event-driven architecture'
      ],
      hint: 'Начните с cleft sentence для выделения проблемы, используйте инверсию для эмфазы, смешанное условное для анализа прошлого, пассив для описания архитектуры.',
      solution: 'It is the tightly coupled architecture of our current system that has been identified as the primary bottleneck to scaling. Not only does the existing synchronous communication pattern introduce cascading failures, but it also severely limits our ability to evolve individual services independently.\n\nHad we adopted event-driven architecture from the outset, we would not be facing the performance constraints that are currently limiting our growth. Analysis conducted over the preceding quarter has demonstrated that the synchronous checkout flow, dependent on three downstream services, is responsible for 78% of our P99 latency.\n\nDesigned around asynchronous event streams, the proposed architecture would decouple these services entirely. Having reviewed the available options — including Apache Kafka, AWS EventBridge, and RabbitMQ — the engineering team recommends Kafka, given its support for high-throughput, replayable event streams.\n\nIn conclusion, it is recommended that the migration be phased over two quarters, beginning with the most critical service boundary. Only by taking a structured, incremental approach can we ensure a smooth transition with minimal disruption to existing operations.',
      explanation: 'This example demonstrates how advanced grammar features work together in professional technical writing. Each structure serves a communicative purpose: cleft for emphasis, inversion for formality, mixed conditional for analysis, passive for objectivity.'
    }
  ]
}
