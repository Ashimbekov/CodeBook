export default {
  id: 9,
  title: 'Discourse Markers и Connecting Ideas',
  description: 'Связующие слова и дискурсивные маркеры для структурированной речи и письма',
  lessons: [
    {
      id: 1,
      title: 'Маркеры добавления и перечисления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Дискурсивные маркеры — это слова и фразы, которые связывают части текста. Без них речь звучит отрывисто, с ними — плавно и логично.' },
        { type: 'heading', value: 'Простое добавление' },
        { type: 'text', value: '"Additionally, the service supports WebSocket connections."\n"Furthermore, this approach reduces latency by 30%."\n"Moreover, the solution is backwards compatible."\n"In addition to REST, the API supports GraphQL."' },
        { type: 'heading', value: 'Перечисление по порядку' },
        { type: 'text', value: '"First and foremost, we need to assess the security implications."\n"To begin with, let\'s review the architecture."\n"Subsequently, the data is processed by the pipeline."\n"Finally, the results are stored in the database."' },
        { type: 'heading', value: 'Подчёркивание важности' },
        { type: 'text', value: '"Above all, security should be the primary concern."\n"Most importantly, the system must be fault-tolerant."\n"Crucially, this decision affects backward compatibility."' },
        { type: 'tip', value: 'В технических презентациях структурирующие маркеры помогают аудитории следить за вашей мыслью. "First... Then... Finally..." — простейшая, но очень эффективная структура.' }
      ]
    },
    {
      id: 2,
      title: 'Маркеры противопоставления и уступки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Эти маркеры особенно важны при аргументации технических решений, где всегда есть trade-offs.' },
        { type: 'heading', value: 'Противопоставление' },
        { type: 'text', value: '"However, this approach has significant scalability limitations."\n"On the other hand, microservices introduce operational complexity."\n"In contrast, the event-driven approach handles high concurrency more gracefully."\n"Conversely, increasing consistency reduces availability."' },
        { type: 'heading', value: 'Уступка — несмотря на' },
        { type: 'text', value: '"Although the solution is not perfect, it meets the current requirements."\n"Despite the higher complexity, microservices offer better scalability."\n"Even though the initial setup is expensive, the long-term benefits justify the investment."\n"While the approach works for small datasets, it does not scale well."' },
        { type: 'heading', value: 'Неожиданный результат' },
        { type: 'text', value: '"Nevertheless, the team delivered the feature on time."\n"Nonetheless, the performance improvements were significant."\n"Yet, the legacy system continues to handle critical business logic."\n"Still, the refactoring is considered a success."' },
        { type: 'tip', value: 'В ADR-документах (Architecture Decision Records) маркеры противопоставления незаменимы: "This approach provides X. However, it requires Y. Despite Z, the team chose this option because..."' }
      ]
    },
    {
      id: 3,
      title: 'Маркеры причины и следствия',
      type: 'theory',
      content: [
        { type: 'text', value: 'При анализе технических проблем и описании архитектурных решений важно чётко выражать причинно-следственные связи.' },
        { type: 'heading', value: 'Причина' },
        { type: 'text', value: '"Due to increased traffic, the service became overloaded."\n"Owing to the lack of proper indexing, queries were slow."\n"As a result of the database migration, some features were temporarily unavailable."\n"Because of the misconfigured firewall, external requests were being blocked."' },
        { type: 'heading', value: 'Следствие' },
        { type: 'text', value: '"As a result, response times increased by 300%."\n"Consequently, the team had to roll back the deployment."\n"Therefore, we decided to adopt a microservices architecture."\n"Hence, the API must be versioned carefully.\n"Thus, backward compatibility is maintained."' },
        { type: 'heading', value: 'Цель' },
        { type: 'text', value: '"In order to improve performance, we implemented caching."\n"With a view to reducing latency, the team introduced a CDN."\n"So as to maintain backward compatibility, the old endpoints are kept."' },
        { type: 'note', value: '"Therefore" и "Thus" звучат очень академично и часто используются в whitepaper-документах и RFC. В разговорной речи предпочтительнее "so" или "as a result".' }
      ]
    },
    {
      id: 4,
      title: 'Маркеры пояснения и иллюстрации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда объясняете технические концепции, эти маркеры помогают сделать объяснение понятнее.' },
        { type: 'heading', value: 'Пояснение' },
        { type: 'text', value: '"In other words, the system uses lazy loading to improve startup performance."\n"That is to say, the API is idempotent — calling it multiple times has the same effect."\n"To put it simply, this pattern separates read and write operations."\n"To clarify, the token expires after 24 hours, not 24 minutes."' },
        { type: 'heading', value: 'Иллюстрация примером' },
        { type: 'text', value: '"For example, consider a scenario where multiple users try to update the same record."\n"For instance, if the primary node fails, the replica automatically takes over."\n"To illustrate, imagine a distributed system with three nodes."\n"Take, for example, the CAP theorem: it states that..."' },
        { type: 'heading', value: 'Уточнение и ограничение' },
        { type: 'text', value: '"In particular, the authentication service must be highly available."\n"Specifically, the issue occurs when more than 1000 concurrent connections are established."\n"More precisely, the algorithm runs in O(n log n) time, not O(n)."\n"To be precise, the SLA guarantees 99.9% uptime, excluding planned maintenance."' }
      ]
    },
    {
      id: 5,
      title: 'Маркеры обобщения и завершения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Грамотное завершение технических текстов и выступлений требует специальных маркеров.' },
        { type: 'heading', value: 'Обобщение' },
        { type: 'text', value: '"In summary, we have three main options for the database layer."\n"To summarise, the proposed architecture addresses all the identified requirements."\n"In brief, the new approach reduces both latency and operational costs."\n"Overall, the migration can be considered successful."' },
        { type: 'heading', value: 'Завершение' },
        { type: 'text', value: '"In conclusion, we recommend adopting the microservices approach."\n"To conclude, the evidence strongly supports the event-driven architecture."\n"Ultimately, the decision comes down to a trade-off between complexity and scalability."\n"All in all, the refactoring has improved code quality significantly."' },
        { type: 'heading', value: 'Ссылка на другое' },
        { type: 'text', value: '"With reference to your earlier point about scalability..."\n"Regarding the security concerns raised in the previous section..."\n"As for the deployment strategy, we will address this in the next sprint."\n"Concerning the API versioning policy, please refer to the ADR-003 document."' },
        { type: 'tip', value: 'Хорошая техническая презентация следует формуле: "Tell them what you\'ll tell them (intro) → Tell them (content, с маркерами структуры) → Tell them what you told them (conclusion с In summary/To conclude)."' }
      ]
    },
    {
      id: 6,
      title: 'Дискурсивные маркеры в разговорной речи',
      type: 'theory',
      content: [
        { type: 'text', value: 'В устной речи (стендапы, митинги, интервью) используются более разговорные маркеры.' },
        { type: 'heading', value: 'Согласие и продолжение мысли' },
        { type: 'text', value: '"Right, so what I\'m trying to say is..."\n"Exactly, and on top of that..."\n"Absolutely, building on that point..."\n"Fair enough. That said, we need to consider..."' },
        { type: 'heading', value: 'Переход к другой теме' },
        { type: 'text', value: '"Moving on to the performance metrics..."\n"Switching gears for a moment..."\n"Before I forget, let me mention..."\n"Going back to what Alex said earlier..."' },
        { type: 'heading', value: 'Покупка времени для мысли' },
        { type: 'text', value: '"Let me think about that for a second..."\n"That\'s a good point. Essentially, what we\'re looking at is..."\n"Well, the thing is..."\n"I mean, from a technical standpoint..."' },
        { type: 'note', value: 'Filler phrases (buying time): "Well...", "You know...", "I mean...", "Essentially...", "Basically..." — это нормально в речи, но их следует избегать в письме. В письме используйте чёткие структурирующие маркеры.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: структурированный технический ответ',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напишите структурированный ответ на технический вопрос, используя дискурсивные маркеры.',
      requirements: [
        'Используйте минимум 8 разных дискурсивных маркеров',
        'Структурируйте ответ с вступлением, основной частью и заключением',
        'Вопрос: "How would you design a URL shortening service?"'
      ],
      hint: 'Структура: вступление (первым делом определим требования) → компоненты (сначала... затем... далее...) → trade-offs (однако... несмотря на...) → заключение (в итоге...).',
      solution: 'To begin with, let me clarify the requirements. A URL shortening service needs to handle high read traffic, as shortened URLs are read far more often than they are created. Furthermore, the system must be highly available since link unavailability directly impacts user experience.\n\nIn terms of architecture, I would first design the data storage layer. Specifically, I would use a key-value store such as Redis for the URL mapping, due to its sub-millisecond read performance. However, for persistence and analytics, a relational database would also be needed.\n\nFor the shortening algorithm, I would use base-62 encoding of a sequential ID. Consequently, this gives us 62^7 = over 3.5 trillion unique URLs. In contrast to random hashing, sequential IDs are easier to manage and avoid collisions by design.\n\nRegarding scalability, the read path must be heavily cached. As a result, a CDN layer in front of the redirect endpoints would dramatically reduce database load. Nevertheless, cache invalidation must be handled carefully for updated or deleted URLs.\n\nIn summary, the core design consists of: a database for persistent storage, a cache layer for high-performance reads, a load balancer for traffic distribution, and an analytics pipeline for click tracking. Overall, this architecture can handle billions of requests per day while maintaining sub-10ms redirect latency.',
      explanation: 'Хорошо структурированный ответ с дискурсивными маркерами демонстрирует не только знание технических концепций, но и способность чётко и логично излагать мысли — ключевой навык для senior-инженеров и архитекторов.'
    }
  ]
}
