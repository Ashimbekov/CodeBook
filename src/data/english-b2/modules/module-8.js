export default {
  id: 8,
  title: 'Subjunctive Mood',
  description: 'Сослагательное наклонение: формальные требования, желания, рекомендации',
  lessons: [
    {
      id: 1,
      title: 'Что такое субъюнктив и где он встречается',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сослагательное наклонение (subjunctive) — это особая форма глагола, выражающая желания, требования, рекомендации и гипотетические ситуации. В современном английском оно встречается реже, чем в прошлом, но в формальных текстах используется активно.' },
        { type: 'heading', value: 'Два типа субъюнктива' },
        { type: 'list', items: [
          'Present subjunctive: базовая форма глагола (без -s, без изменений)',
          'Past subjunctive: форма Past Simple (особенно "were" вместо "was")'
        ]},
        { type: 'heading', value: 'Present subjunctive' },
        { type: 'text', value: 'Используется после глаголов требования, рекомендации, предложения:\n"We recommend that every developer USE a linter." (не "uses"!)\n"The team requires that all PRs BE reviewed before merging."\n"It is essential that the service RESPOND within 200ms."' },
        { type: 'tip', value: 'В американском английском subjunctive используется чаще, чем в британском. В документах крупных американских IT-компаний (Google, Microsoft, AWS) вы часто встретите: "It is recommended that all endpoints BE secured with HTTPS."' }
      ]
    },
    {
      id: 2,
      title: 'Present Subjunctive: глаголы требования и рекомендации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Present subjunctive используется в that-придаточных после определённых глаголов.' },
        { type: 'heading', value: 'Глаголы, вызывающие present subjunctive' },
        { type: 'list', items: [
          'Demand, require, insist: "Management demands that the feature BE delivered by Friday."',
          'Recommend, suggest, propose: "I suggest that we ADOPT a CI/CD approach."',
          'Request, ask, urge: "The client requests that all data BE encrypted."',
          'Order, command, decree: "The policy orders that access logs BE retained for 90 days."',
          'Advise, stipulate: "The contract stipulates that the SLA BE maintained at 99.9%."'
        ]},
        { type: 'heading', value: 'Прилагательные, вызывающие present subjunctive' },
        { type: 'text', value: 'После "it is + adjective + that":\n"It is essential that every microservice HAVE its own database."\n"It is vital that the backup COMPLETE before the maintenance window."\n"It is important that the API BE backward compatible."\n"It is necessary that all team members ATTEND the architecture review."' },
        { type: 'warning', value: 'Помните: в present subjunctive НЕТ -s для третьего лица единственного числа!\nНЕПРАВИЛЬНО: "It is essential that the service responds within 200ms."\nПРАВИЛЬНО: "It is essential that the service respond within 200ms."' }
      ]
    },
    {
      id: 3,
      title: 'Past Subjunctive: were вместо was',
      type: 'theory',
      content: [
        { type: 'text', value: 'Past subjunctive используется в условных предложениях и выражениях желания. Ключевая форма — "were" для всех лиц.' },
        { type: 'heading', value: '"Were" в условных предложениях' },
        { type: 'text', value: '"If I were the lead architect, I would design this differently."\n(Не "was" — это субъюнктив!)\n\n"If the system were stateless, horizontal scaling would be trivial."\n"Were this a monolith, we could not scale individual components."' },
        { type: 'heading', value: '"Were to" — формальные условия' },
        { type: 'text', value: '"If the primary database were to fail, the system would automatically failover to the replica."\n"Were the team to adopt TDD, code quality would improve significantly."\n"Were this vulnerability to be exploited, the impact would be catastrophic."' },
        { type: 'heading', value: '"As if" / "As though" + past subjunctive' },
        { type: 'text', value: '"The legacy code is written as if performance were irrelevant."\n"He talks about distributed systems as if they were trivial to implement."\n"The system behaves as though the database connections were unlimited."' },
        { type: 'tip', value: 'В американском разговорном английском "was" в условных предложениях теперь широко принимается, но "were" остаётся стандартом формального письма и публичных выступлений.' }
      ]
    },
    {
      id: 4,
      title: 'Wish, If only, Would rather — выражение желаний',
      type: 'theory',
      content: [
        { type: 'text', value: 'Эти конструкции используют субъюнктив для выражения желаний, сожалений и предпочтений.' },
        { type: 'heading', value: 'Wish + past subjunctive — желание о настоящем' },
        { type: 'text', value: '"I wish the codebase were better documented." (сейчас плохо задокументирован)\n"I wish we had more time for refactoring." (сейчас нет времени)\n"The team wishes the deployment process were automated."' },
        { type: 'heading', value: 'Wish + past perfect — сожаление о прошлом' },
        { type: 'text', value: '"I wish we had chosen a different database from the start." (в прошлом выбрали не то)\n"The architect wishes he had documented the decisions made three years ago."\n"I wish I had learned Kubernetes earlier."' },
        { type: 'heading', value: 'Would rather + subject + past subjunctive' },
        { type: 'text', value: '"I would rather we used PostgreSQL instead of MongoDB for this use case."\n"I\'d rather the team addressed technical debt before adding new features."\n"The CTO would rather we deployed incrementally than all at once."' },
        { type: 'heading', value: 'If only — сильное сожаление' },
        { type: 'text', value: '"If only we had invested in proper observability tooling earlier!"\n"If only the documentation were up to date, onboarding would be so much easier."' }
      ]
    },
    {
      id: 5,
      title: 'Субъюнктив в формальных документах и стандартах',
      type: 'theory',
      content: [
        { type: 'text', value: 'В технических стандартах, юридических и корпоративных документах субъюнктив встречается очень часто.' },
        { type: 'heading', value: 'В технических требованиях (requirements)' },
        { type: 'text', value: '"The specification requires that all passwords BE hashed using bcrypt."\n"The SLA stipulates that uptime BE maintained at 99.95%."\n"Company policy demands that all external dependencies BE approved by the security team."' },
        { type: 'heading', value: 'В RFC и стандартах' },
        { type: 'text', value: '"It is recommended that implementations SUPPORT both IPv4 and IPv6."\n"The working group proposes that this mechanism BE deprecated in the next version."\n"It is required that the server INCLUDE the Content-Type header in all responses."' },
        { type: 'heading', value: 'В корпоративной коммуникации' },
        { type: 'text', value: '"Management insists that the project MEET the originally agreed deadline."\n"HR requires that all contractors COMPLETE the security training within 30 days."\n"The board suggests that the engineering team PRESENT a quarterly roadmap."' },
        { type: 'note', value: 'В RFC 2119 модальные глаголы (MUST, SHOULD, MAY) используются вместо субъюнктива. Но в более свободных технических текстах и ADR-документах субъюнктив регулярно встречается.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: формальные требования',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перефразируйте требования, используя правильный субъюнктив.',
      requirements: [
        'Используйте present subjunctive после глаголов требования',
        'Используйте "were" в условных предложениях',
        'Сохраните формальный тон'
      ],
      questions: [
        { text: 'The spec says: "All API responses must include a timestamp."\n→ The specification requires that ___', answer: 'The specification requires that all API responses include a timestamp.', explanation: 'Present subjunctive после "requires that": no -s, base form' },
        { text: 'I want us to use GraphQL instead of REST.\n→ I would rather ___', answer: 'I would rather we used GraphQL instead of REST.', explanation: 'Would rather + subject + past subjunctive (used, not use)' },
        { text: 'It is a pity that the system is not horizontally scalable.\n→ I wish ___', answer: 'I wish the system were horizontally scalable.', explanation: 'Wish + past subjunctive для настоящего; "were" не "was"' }
      ],
      solution: 'Правильные ответы:\n1. The specification requires that all API responses include a timestamp.\n2. I would rather we used GraphQL instead of REST.\n3. I wish the system were horizontally scalable.',
      hint: 'Present subjunctive: нет -s в третьем лице, нет вспомогательных глаголов. Past subjunctive: "were" для всех лиц, Past Simple для остальных глаголов.',
      explanation: 'Субъюнктив в формальных требованиях придаёт тексту официальность и точность. В технических стандартах его правильное использование — признак профессионального владения языком.'
    }
  ]
}
