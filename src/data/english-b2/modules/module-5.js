export default {
  id: 5,
  title: 'Participle Clauses',
  description: 'Причастные обороты для сжатия информации и профессионального стиля',
  lessons: [
    {
      id: 1,
      title: 'Present Participle Clause (-ing)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Причастные обороты позволяют объединять несколько мыслей в одно предложение, делая текст более плавным и профессиональным.' },
        { type: 'heading', value: 'Одновременные действия' },
        { type: 'text', value: 'Когда два действия происходят одновременно:\n"Using the event-driven architecture, the system processes requests asynchronously."\n(= While it uses the event-driven architecture...)\n\n"Running in a Docker container, the application is isolated from the host environment."\n(= Because it runs in a Docker container...)' },
        { type: 'heading', value: 'Последовательные действия' },
        { type: 'text', value: 'Когда одно действие следует за другим:\n"Receiving the request, the load balancer forwards it to an available instance."\n(= After receiving the request...)\n\n"Identifying the bottleneck, the team quickly implemented a caching solution."' },
        { type: 'heading', value: 'Причина или условие' },
        { type: 'text', value: '"Knowing the API is rate-limited, we implemented exponential backoff."\n(= Because we know the API is rate-limited...)\n\n"Not having the necessary permissions, the process terminated with an error."' },
        { type: 'warning', value: 'Важно: подразумеваемое подлежащее причастного оборота должно совпадать с подлежащим главного предложения.\nНЕПРАВИЛЬНО: "Running low on memory, the logs were deleted." (кто удалял — не логи!)\nПРАВИЛЬНО: "Running low on memory, the system deleted old logs."' }
      ]
    },
    {
      id: 2,
      title: 'Past Participle Clause (V3)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Прошедшее причастие используется для пассивного смысла — когда подлежащее является получателем действия.' },
        { type: 'heading', value: 'Пассивный смысл' },
        { type: 'text', value: '"Built with scalability in mind, the architecture supports millions of concurrent users."\n(= Because it was built with scalability in mind...)\n\n"Optimised for low latency, the database queries return results in under 5ms."\n\n"Written in TypeScript, the codebase benefits from static type checking."' },
        { type: 'heading', value: 'Reduced relative clauses' },
        { type: 'text', value: '"The service deployed last night is experiencing issues." (= that was deployed)\n"All data stored in the cloud is encrypted at rest." (= that is stored)\n"The PR submitted this morning needs urgent review." (= that was submitted)' },
        { type: 'tip', value: 'Past Participle в начале предложения — признак зрелого технического письма. Такой стиль часто встречается в Google и AWS технических блогах.' }
      ]
    },
    {
      id: 3,
      title: 'Having + Past Participle — предшествующее действие',
      type: 'theory',
      content: [
        { type: 'text', value: '"Having + Past Participle" используется для действий, которые произошли ДО действия в главном предложении.' },
        { type: 'heading', value: 'Примеры' },
        { type: 'text', value: '"Having reviewed the code, the senior engineer approved the merge request."\n(= After she had reviewed the code, she approved...)\n\n"Having identified the root cause, the team implemented a permanent fix."\n\n"Having worked with this codebase for three years, I can say the technical debt is significant."' },
        { type: 'heading', value: 'Having been + Past Participle (пассив)' },
        { type: 'text', value: '"Having been deployed to production, the new version immediately showed performance improvements."\n(= After it had been deployed...)\n\n"Having been thoroughly tested in staging, the feature was approved for release."' },
        { type: 'tip', value: '"Having completed the analysis, we can conclude that..." — типичное начало технических заключений и секций в whitepaper-документах.' }
      ]
    },
    {
      id: 4,
      title: 'Независимые причастные обороты (Absolute Participle Clauses)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Независимые причастные обороты имеют своё собственное подлежащее, которое отличается от подлежащего главного предложения.' },
        { type: 'heading', value: 'Структура: существительное/местоимение + причастие' },
        { type: 'text', value: '"All tests having passed, the team proceeded with the deployment."\n(= When all tests had passed, the team proceeded...)\n\n"The migration being complete, we decommissioned the old servers."\n\n"Weather permitting, the server room maintenance will be scheduled for this weekend."' },
        { type: 'heading', value: 'With + существительное + причастие' },
        { type: 'text', value: '"With the refactoring done, the codebase is now much more maintainable."\n"With monitoring properly configured, detecting anomalies became much easier."\n"With traffic increasing, we had to scale up the infrastructure."' },
        { type: 'note', value: 'Независимые причастные обороты часто встречаются в формальных технических отчётах и статьях. Они позволяют элегантно добавлять контекст к основной мысли.' }
      ]
    },
    {
      id: 5,
      title: 'Причастные обороты в IT-текстах: типичные паттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'В IT-документации и технических статьях есть устойчивые паттерны использования причастных оборотов.' },
        { type: 'heading', value: 'Описание архитектуры' },
        { type: 'text', value: '"Leveraging a microservices architecture, the system achieves both scalability and fault isolation."\n"Implementing the CQRS pattern, we separated read and write operations for better performance."\n"Adopting a hexagonal architecture, the team decoupled the business logic from infrastructure concerns."' },
        { type: 'heading', value: 'Описание алгоритмов и процессов' },
        { type: 'text', value: '"Iterating through the collection, the algorithm computes the running average."\n"Using binary search, the lookup complexity is reduced from O(n) to O(log n)."\n"Applying the observer pattern, we notified all subscribers of state changes."' },
        { type: 'heading', value: 'Технические ограничения и условия' },
        { type: 'text', value: '"Requiring O(n) space, this approach may not be suitable for memory-constrained environments."\n"Not supporting horizontal scaling, the legacy monolith became a bottleneck."\n"Given the constraints, the team opted for a simpler solution."' },
        { type: 'tip', value: '"Given that...", "Considering that...", "Assuming that..." — эти причастные обороты часто используются в архитектурных обсуждениях и ADR-документах для формулировки допущений.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: трансформация предложений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Сократите предложения, используя причастные обороты.',
      requirements: [
        'Замените придаточные предложения причастными оборотами',
        'Сохраните исходный смысл',
        'Выберите правильный тип причастного оборота'
      ],
      questions: [
        { text: 'Because the team had refactored the authentication module, they were able to add OAuth support quickly.\n→ ___', answer: 'Having refactored the authentication module, the team was able to add OAuth support quickly.', explanation: 'Having + Past Participle для предшествующего действия' },
        { text: 'The API, which was designed to be RESTful, follows all HTTP conventions.\n→ ___', answer: 'Designed to be RESTful, the API follows all HTTP conventions.', explanation: 'Past Participle clause — пассивный смысл, замена which was' },
        { text: 'After it identifies the error, the system logs the stack trace automatically.\n→ ___', answer: 'Identifying the error, the system logs the stack trace automatically.', explanation: 'Present Participle для одновременного/последовательного действия' }
      ],
      solution: 'Правильные ответы:\n1. Having refactored the authentication module, the team was able to add OAuth support quickly.\n2. Designed to be RESTful, the API follows all HTTP conventions.\n3. Identifying the error, the system logs the stack trace automatically.',
      hint: 'Ключ к выбору типа: 1) Пассивный смысл → Past Participle; 2) Предшествующее действие → Having + Past Participle; 3) Одновременное/последовательное → Present Participle (-ing).',
      explanation: 'Причастные обороты — важный элемент академического и технического стиля. Они делают текст более компактным и профессиональным, избегая повторения подлежащего и союзов.'
    }
  ]
}
