export default {
  id: 3,
  title: 'Инверсия и эмфаза',
  description: 'Инверсия для выразительности и формальности: "Not only did we deploy...", "Rarely does the server crash"',
  lessons: [
    {
      id: 1,
      title: 'Что такое инверсия и зачем она нужна',
      type: 'theory',
      content: [
        { type: 'text', value: 'Инверсия — это изменение обычного порядка слов (подлежащее + сказуемое) на обратный. В английском языке инверсия используется для создания эмфазы, формального тона и в определённых грамматических конструкциях.' },
        { type: 'heading', value: 'Зачем использовать инверсию?' },
        { type: 'list', items: [
          'Для эмоционального акцента на важной информации',
          'В формальных текстах и презентациях',
          'После отрицательных наречий для усиления',
          'В условных предложениях (формальный стиль)',
          'В tech talks и выступлениях для драматического эффекта'
        ]},
        { type: 'text', value: 'Сравните:\n"We had never seen such a catastrophic failure." (обычный порядок)\n"Never had we seen such a catastrophic failure." (инверсия — больший акцент)' },
        { type: 'tip', value: 'Инверсия часто встречается в технических презентациях, keynote-выступлениях и формальных отчётах. Зная её, вы поймёте, почему CTO говорит "Not only did we achieve our targets, but we exceeded them."' }
      ]
    },
    {
      id: 2,
      title: 'Инверсия после отрицательных наречий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Самый распространённый тип инверсии — после отрицательных или ограничивающих наречий в начале предложения.' },
        { type: 'heading', value: 'Never, Rarely, Seldom' },
        { type: 'text', value: '"Never have we encountered such a complex distributed systems problem."\n"Rarely does the production server experience downtime of this magnitude."\n"Seldom do we see such clean, well-documented code."' },
        { type: 'heading', value: 'Not only... but also' },
        { type: 'text', value: '"Not only did we deploy the feature on time, but we also improved performance by 40%."\n"Not only does this architecture violate SOLID principles, but it also makes testing impossible."' },
        { type: 'heading', value: 'Hardly/Scarcely... when/before' },
        { type: 'text', value: '"Hardly had we deployed the update when the first complaints started arriving."\n"Scarcely had the migration begun before we discovered the data inconsistencies."' },
        { type: 'heading', value: 'No sooner... than' },
        { type: 'text', value: '"No sooner had we fixed one bug than three more appeared."' },
        { type: 'warning', value: 'После этих наречий используется вспомогательный глагол (did, had, have, does, is) ПЕРЕД подлежащим. Это аналог вопросительного порядка слов.' }
      ]
    },
    {
      id: 3,
      title: 'Инверсия с Only и Little',
      type: 'theory',
      content: [
        { type: 'text', value: '"Only" с различными предлогами и наречиями также вызывает инверсию.' },
        { type: 'heading', value: 'Only after, Only when, Only then' },
        { type: 'text', value: '"Only after the full regression test suite passes can we deploy to production."\n"Only when all stakeholders approve the design should we begin implementation."\n"Only then did we understand the true complexity of the problem."' },
        { type: 'heading', value: 'Only by, Only with, Only if' },
        { type: 'text', value: '"Only by adopting a microservices architecture can we achieve the required scalability."\n"Only with proper monitoring in place can we ensure system reliability."\n"Only if we invest in proper tooling will the team\'s productivity improve."' },
        { type: 'heading', value: 'Little' },
        { type: 'text', value: '"Little did the developers know that this small optimization would cause a cascade failure."\n"Little do most engineers realize how much technical debt accumulates over time."' },
        { type: 'tip', value: 'В технических презентациях "Only by..." и "Only with..." очень убедительно звучат при аргументации технических решений. Например: "Only by embracing DevOps culture can we truly achieve continuous delivery."' }
      ]
    },
    {
      id: 4,
      title: 'Инверсия в условных предложениях',
      type: 'theory',
      content: [
        { type: 'text', value: 'В формальном стиле союз "if" в условных предложениях можно опустить, используя инверсию.' },
        { type: 'heading', value: 'Should (вместо if в First Conditional)' },
        { type: 'text', value: '"Should you encounter any issues, please contact the support team immediately."\n(= If you should encounter any issues...)\n\n"Should the deployment fail, the system will automatically roll back to the previous version."' },
        { type: 'heading', value: 'Were (вместо if в Second Conditional)' },
        { type: 'text', value: '"Were I the architect, I would redesign this from scratch."\n(= If I were the architect...)\n\n"Were the team to adopt agile practices, velocity would increase significantly."' },
        { type: 'heading', value: 'Had (вместо if в Third Conditional)' },
        { type: 'text', value: '"Had we identified the bottleneck earlier, we would have avoided the outage."\n(= If we had identified the bottleneck earlier...)\n\n"Had the code been properly reviewed, this vulnerability would not have made it to production."' },
        { type: 'note', value: 'Этот тип инверсии особенно часто встречается в RFC, официальных документах, юридических текстах и формальных технических отчётах.' }
      ]
    },
    {
      id: 5,
      title: 'So/Such... that и другие эмфатические конструкции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо инверсии, существуют другие способы создать эмфазу в предложении.' },
        { type: 'heading', value: 'So + adjective/adverb + that' },
        { type: 'text', value: '"The system was so overloaded that it stopped responding to health checks."\n"So significant were the performance improvements that the client extended the contract."' },
        { type: 'heading', value: 'Such + noun phrase + that' },
        { type: 'text', value: '"Such was the complexity of the migration that it required a dedicated team of 10 engineers."\n"Such was the quality of the code that it needed almost no modifications."' },
        { type: 'heading', value: 'Fronting — перемещение части предложения в начало' },
        { type: 'text', value: '"This approach we strongly recommend for high-traffic applications."\n"The documentation — that is what we need to focus on next."\n"Elegantly designed this API certainly is."' },
        { type: 'tip', value: 'Fronting и инверсия встречаются в TED-выступлениях и tech keynotes для создания ораторских эффектов. Умение их использовать делает презентации более запоминающимися.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: трансформация предложений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перепишите предложения, используя инверсию для создания эмфазы.',
      requirements: [
        'Начните предложение с указанного наречия или выражения',
        'Правильно используйте вспомогательный глагол',
        'Сохраните исходный смысл'
      ],
      questions: [
        { text: 'We had never seen such a severe security breach before.\n→ Never ___', answer: 'Never had we seen such a severe security breach before.', explanation: 'Never + had + subject + past participle' },
        { text: 'We fixed the critical bug and also improved performance.\n→ Not only ___', answer: 'Not only did we fix the critical bug, but we also improved performance.', explanation: 'Not only + did + subject + infinitive, but also + predicate' },
        { text: 'If the server should fail, the backup will take over automatically.\n→ Should ___', answer: 'Should the server fail, the backup will take over automatically.', explanation: 'Should + subject + infinitive (формальное условие)' }
      ],
      solution: 'Правильные ответы:\n1. Never had we seen such a severe security breach before.\n2. Not only did we fix the critical bug, but we also improved performance.\n3. Should the server fail, the backup will take over automatically.',
      hint: 'После отрицательного/ограничивающего наречия всегда идёт вспомогательный глагол (do/did/have/had/is/was) + подлежащее.',
      explanation: 'Инверсия — мощный риторический инструмент. В техническом общении она помогает подчеркнуть важные моменты и звучать профессионально в презентациях и документах.'
    }
  ]
}
