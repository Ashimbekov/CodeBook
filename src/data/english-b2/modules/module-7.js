export default {
  id: 7,
  title: 'Cleft Sentences',
  description: 'Расщеплённые предложения для акцента: "It was X that...", "What we need is..."',
  lessons: [
    {
      id: 1,
      title: 'It-cleft: It was... that/who',
      type: 'theory',
      content: [
        { type: 'text', value: 'Расщеплённые предложения (cleft sentences) — это способ выделить определённый элемент предложения, перенеся акцент на него.' },
        { type: 'heading', value: 'Структура It-cleft' },
        { type: 'text', value: 'It + be + ВЫДЕЛЯЕМЫЙ ЭЛЕМЕНТ + that/who + остаток предложения' },
        { type: 'heading', value: 'Примеры с выделением разных элементов' },
        { type: 'text', value: 'Обычное предложение: "John introduced the microservices architecture last year."\n\nВыделяем КОГО: "It was John who introduced the microservices architecture."\nВыделяем ЧТО: "It was the microservices architecture that John introduced."\nВыделяем КОГДА: "It was last year that John introduced the microservices architecture."' },
        { type: 'heading', value: 'IT-примеры' },
        { type: 'text', value: '"It was the unclosed database connection that caused the memory leak."\n"It was the lack of proper logging that made debugging so difficult."\n"It is the distributed nature of the system that makes consistency challenging."' },
        { type: 'tip', value: 'It-cleft особенно полезны при объяснении root cause в постмортемах: вы точно указываете, ЧТО именно стало причиной проблемы.' }
      ]
    },
    {
      id: 2,
      title: 'Wh-cleft: What... is/was',
      type: 'theory',
      content: [
        { type: 'text', value: 'Wh-cleft (или pseudo-cleft) начинается с вопросительного слова (What, Where, When, Why, How) и используется для выделения предиката.' },
        { type: 'heading', value: 'What-cleft — самый распространённый тип' },
        { type: 'text', value: '"What we need is a proper monitoring solution." (Что нам нужно — это...)\n"What caused the outage was a misconfigured firewall rule."\n"What makes this algorithm efficient is its use of memoisation."\n"What I find most impressive is the fault tolerance built into the system."' },
        { type: 'heading', value: 'What-cleft для акцента на действии' },
        { type: 'text', value: '"What we did was refactor the entire authentication module."\n"What the system does is cache the results for 5 minutes."\n"What the team needs to do is address the technical debt."' },
        { type: 'heading', value: 'All-cleft — ограничение и акцент' },
        { type: 'text', value: '"All that is required is a valid API key."\n"All we need to do is update the configuration file."\n"All the tests need to pass before deployment."' },
        { type: 'tip', value: '"What we need is..." — одна из самых полезных конструкций для технических презентаций. Она чётко формулирует требования или решения.' }
      ]
    },
    {
      id: 3,
      title: 'Reversed wh-cleft и другие варианты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Обратное псевдо-расщепление ставит выделяемый элемент в начало.' },
        { type: 'heading', value: 'Reversed pseudo-cleft' },
        { type: 'text', value: '"The main bottleneck is what we need to address first."\n(Вместо: "What we need to address first is the main bottleneck.")\n\n"Better test coverage is what the codebase urgently needs."\n"Horizontal scaling is what will solve our capacity issues."' },
        { type: 'heading', value: 'Why-cleft и How-cleft' },
        { type: 'text', value: '"Why the service is failing is that it cannot connect to the database."\n"How we handle this is by implementing a circuit breaker pattern."\n"The reason why we chose PostgreSQL is its support for JSONB."' },
        { type: 'heading', value: 'Cleft с it + adjective' },
        { type: 'text', value: '"It is because of poor database indexing that queries are slow."\n"It is only through proper load testing that we can guarantee performance."\n"It is thanks to the caching layer that we achieve sub-millisecond response times."' }
      ]
    },
    {
      id: 4,
      title: 'Cleft sentences в IT-презентациях',
      type: 'theory',
      content: [
        { type: 'text', value: 'В технических презентациях cleft sentences используются для убеждения аудитории и выделения ключевых аргументов.' },
        { type: 'heading', value: 'Представление проблемы' },
        { type: 'text', value: '"What we are facing is a classic scalability problem."\n"It is the growing user base that is putting pressure on our current infrastructure."\n"What is slowing us down is not the algorithm, but the I/O operations."' },
        { type: 'heading', value: 'Представление решения' },
        { type: 'text', value: '"What I propose is a three-phase migration to microservices."\n"It is by adopting event-driven architecture that we can decouple these services."\n"What this approach gives us is both scalability and maintainability."' },
        { type: 'heading', value: 'Выделение преимуществ' },
        { type: 'text', value: '"What sets this solution apart is its zero-downtime deployment capability."\n"It is the simplicity of this design that makes it so maintainable."\n"What we gain from this refactoring is a 40% reduction in code complexity."' },
        { type: 'tip', value: 'Используйте cleft sentences в ключевые моменты презентации — для введения проблемы, предложения решения и подведения итогов. Они создают паузу и привлекают внимание.' }
      ]
    },
    {
      id: 5,
      title: 'Cleft sentences в технической документации',
      type: 'theory',
      content: [
        { type: 'text', value: 'В документации cleft sentences помогают структурировать объяснения и избегать неоднозначности.' },
        { type: 'heading', value: 'ADR (Architecture Decision Records)' },
        { type: 'text', value: '"What drove this decision was the need for strong consistency guarantees."\n"It is the eventual consistency model of NoSQL databases that makes them unsuitable for this use case."\n"What we considered but rejected was a synchronous messaging approach due to its latency implications."' },
        { type: 'heading', value: 'Troubleshooting guides' },
        { type: 'text', value: '"What typically causes this error is an expired authentication token."\n"It is the combination of these two factors that leads to the deadlock."\n"What you need to check first is the application logs at the time of the incident."' },
        { type: 'heading', value: 'README и How-to документы' },
        { type: 'text', value: '"What this library does is abstract away the complexity of HTTP connection pooling."\n"It is this configuration that controls the retry behaviour of the client."\n"What makes this approach different from alternatives is the automatic failover mechanism."' }
      ]
    },
    {
      id: 6,
      title: 'Практика: cleft sentences для акцента',
      type: 'practice',
      difficulty: 'medium',
      description: 'Перефразируйте предложения с использованием cleft sentences.',
      requirements: [
        'Используйте указанный тип cleft',
        'Выделите указанный элемент',
        'Предложение должно оставаться естественным'
      ],
      questions: [
        { text: 'Poor database indexing causes most query slowdowns.\n→ It-cleft, выделите причину:', answer: 'It is poor database indexing that causes most query slowdowns.', explanation: 'It-cleft: It is + выделяемый элемент + that + остаток' },
        { text: 'We need to improve our CI/CD pipeline.\n→ What-cleft:', answer: 'What we need to improve is our CI/CD pipeline.', explanation: 'What + subject + verb + is + highlighted element' },
        { text: 'The lack of proper documentation slows down onboarding.\n→ What-cleft с другим порядком:', answer: 'What slows down onboarding is the lack of proper documentation.', explanation: 'What + predicate + is + subject (reversed order для акцента на проблеме)' }
      ],
      solution: 'Правильные ответы:\n1. It is poor database indexing that causes most query slowdowns.\n2. What we need to improve is our CI/CD pipeline.\n3. What slows down onboarding is the lack of proper documentation.',
      hint: 'Решите, какой элемент вы хотите выделить, затем выберите подходящий тип: It-cleft для выделения подлежащего/обстоятельства, What-cleft для выделения действия или объекта.',
      explanation: 'Cleft sentences — мощный инструмент для точного указания на причинно-следственные связи в техническом анализе. Освоив их, вы сможете делать технические объяснения значительно чётче и убедительнее.'
    }
  ]
}
