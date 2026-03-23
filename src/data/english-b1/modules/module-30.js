export default {
  id: 30,
  title: 'Practice: IT Terms and Jargon',
  description: 'Практические упражнения на IT-термины, аббревиатуры и профессиональный жаргон. Определения, контекст и использование.',
  lessons: [
    {
      id: 1,
      title: 'Backend and architecture terms',
      type: 'practice',
      description: 'Изучи термины Backend и Architecture, используй их в предложениях.',
      solution: 'Ключевые термины:\nAPI — интерфейс взаимодействия программ\nmicroservices — независимые сервисы\nload balancer — распределение трафика\nreverse proxy — перенаправление запросов\nidempotency — повторный запрос = тот же результат\neventual consistency — согласованность со временем',
      content: [
        { type: 'text', value: 'Сопоставь термины с определениями и практикуй их использование в предложениях.' }
      ],
      tasks: [
        { term: 'API (Application Programming Interface)', definition: 'Интерфейс, позволяющий программам взаимодействовать друг с другом.', example: '"The mobile app communicates with the server through our REST API."' },
        { term: 'microservices', definition: 'Архитектурный стиль, разбивающий приложение на небольшие независимые сервисы.', example: '"We split the monolith into microservices to scale each component independently."' },
        { term: 'load balancer', definition: 'Компонент, распределяющий входящий трафик между несколькими серверами.', example: '"The load balancer routes requests to the least busy server."' },
        { term: 'reverse proxy', definition: 'Сервер, принимающий запросы от клиентов и перенаправляющий их к бэкенд-серверам.', example: '"We use Nginx as a reverse proxy in front of our Node.js servers."' },
        { term: 'idempotency', definition: 'Свойство операции, при котором повторное выполнение даёт тот же результат.', example: '"HTTP GET and DELETE should be idempotent."' },
        { term: 'eventual consistency', definition: 'Модель согласованности, при которой данные становятся согласованными со временем.', example: '"In this distributed system, eventual consistency is acceptable for the news feed."' }
      ]
    },
    {
      id: 2,
      title: 'DevOps and deployment terms',
      type: 'practice',
      description: 'Изучи DevOps и Deployment термины, используй их в предложениях.',
      solution: 'Ключевые термины:\nCI/CD — автоматическая сборка и деплой\ncontainer — изолированная среда\norchestration — управление контейнерами\nblue-green deployment — zero-downtime обновления\nrollback — возврат к предыдущей версии\nIaC — управление инфраструктурой через код',
      tasks: [
        { term: 'CI/CD (Continuous Integration/Continuous Deployment)', definition: 'Практика автоматической сборки, тестирования и деплоя кода.', example: '"Our CI/CD pipeline runs tests on every push and deploys to production automatically."' },
        { term: 'container', definition: 'Изолированная среда выполнения для приложения со всеми зависимостями.', example: '"We run each microservice in its own Docker container."' },
        { term: 'orchestration', definition: 'Автоматическое управление контейнерами: деплой, масштабирование, восстановление.', example: '"Kubernetes handles container orchestration in our production cluster."' },
        { term: 'blue-green deployment', definition: 'Стратегия деплоя с двумя идентичными средами для zero-downtime обновлений.', example: '"We use blue-green deployment to switch traffic to the new version without downtime."' },
        { term: 'rollback', definition: 'Возврат к предыдущей версии после неудачного деплоя.', example: '"The deployment failed, so we triggered an automatic rollback."' },
        { term: 'infrastructure as code (IaC)', definition: 'Управление инфраструктурой через код и конфигурационные файлы.', example: '"We manage all our AWS resources using Terraform for infrastructure as code."' }
      ]
    },
    {
      id: 3,
      title: 'Database terms',
      type: 'practice',
      description: 'Изучи Database термины, используй их в предложениях.',
      solution: 'Ключевые термины:\nACID — свойства надёжных транзакций\nindex — ускорение поиска\nsharding — горизонтальное разбиение БД\nreplication — копирование данных\nN+1 problem — N+1 лишних запросов\nmigration — изменение схемы БД',
      tasks: [
        { term: 'ACID', definition: 'Atomicity, Consistency, Isolation, Durability — свойства надёжных транзакций БД.', example: '"PostgreSQL supports ACID transactions, making it suitable for financial data."' },
        { term: 'index', definition: 'Структура данных для ускорения поиска в базе данных.', example: '"We added an index on the email column to speed up login queries."' },
        { term: 'sharding', definition: 'Горизонтальное разбиение БД на части для масштабирования.', example: '"We shard the database by user ID to distribute the load."' },
        { term: 'replication', definition: 'Копирование данных на несколько серверов для надёжности и производительности.', example: '"Database replication ensures no data loss if the primary server fails."' },
        { term: 'N+1 problem', definition: 'Проблема производительности: вместо одного запроса выполняется N+1 запросов.', example: '"We solved the N+1 problem by using eager loading instead of lazy loading."' },
        { term: 'migration', definition: 'Скрипт, изменяющий схему БД контролируемым образом.', example: '"Before deploying, run the database migration to add the new column."' }
      ]
    },
    {
      id: 4,
      title: 'Security terms',
      type: 'practice',
      description: 'Изучи Security термины, используй их в предложениях.',
      solution: 'Ключевые термины:\nauthentication — "кто ты?" (проверка личности)\nauthorization — "что тебе разрешено?" (права доступа)\nXSS — внедрение скрипта на страницу\nSQL injection — вредоносный SQL\nJWT — токен с проверкой подлинности\nrate limiting — ограничение запросов',
      tasks: [
        { term: 'authentication', definition: 'Проверка личности пользователя ("кто ты?").', example: '"The system uses OAuth 2.0 for authentication."' },
        { term: 'authorization', definition: 'Проверка прав доступа ("что тебе разрешено?").', example: '"Authorization is handled by RBAC — Role-Based Access Control."' },
        { term: 'XSS (Cross-Site Scripting)', definition: 'Уязвимость, позволяющая внедрить вредоносный скрипт на страницу.', example: '"Always sanitize user input to prevent XSS attacks."' },
        { term: 'SQL injection', definition: 'Атака через вредоносный SQL в пользовательском вводе.', example: '"Use parameterized queries to prevent SQL injection."' },
        { term: 'JWT (JSON Web Token)', definition: 'Компактный формат для передачи информации с проверкой подлинности.', example: '"After login, we issue a JWT that the client sends with every request."' },
        { term: 'rate limiting', definition: 'Ограничение количества запросов от одного клиента за период времени.', example: '"Rate limiting prevents brute force attacks on the login endpoint."' }
      ]
    },
    {
      id: 5,
      title: 'Performance terms',
      type: 'practice',
      description: 'Изучи Performance термины, используй их в предложениях.',
      solution: 'Ключевые термины:\nlatency — задержка между запросом и ответом\nthroughput — пропускная способность\ncaching — хранение частых данных\nbottleneck — узкое место\np95/p99 percentile — 95/99% запросов быстрее\nprofiling — анализ производительности',
      tasks: [
        { term: 'latency', definition: 'Задержка — время между запросом и началом ответа.', example: '"Our target is p99 latency under 100ms."' },
        { term: 'throughput', definition: 'Пропускная способность — количество запросов/операций в единицу времени.', example: '"The system handles 10,000 requests per second throughput."' },
        { term: 'caching', definition: 'Хранение часто запрашиваемых данных для ускорения доступа.', example: '"We added Redis caching and reduced database load by 70%."' },
        { term: 'bottleneck', definition: 'Узкое место — компонент, ограничивающий общую производительность.', example: '"The database turned out to be the bottleneck in our architecture."' },
        { term: 'p95/p99 percentile', definition: '95-й/99-й процентиль — 95%/99% запросов выполнены быстрее этого значения.', example: '"P99 latency is 500ms — most users experience much faster responses."' },
        { term: 'profiling', definition: 'Анализ производительности кода для нахождения медленных участков.', example: '"After profiling, we found that the image resizing was taking 80% of the time."' }
      ]
    },
    {
      id: 6,
      title: 'Agile and process terms',
      type: 'practice',
      description: 'Изучи Agile и Process термины, используй их в предложениях.',
      solution: 'Ключевые термины:\nsprint — итерация 1-2 недели\nbacklog — список задач по приоритету\nretrospective — анализ спринта\nvelocity — story points за спринт\ndefinition of done — критерии завершённости\nkanban — визуальное управление задачами',
      tasks: [
        { term: 'sprint', definition: 'Итерация в Scrum, обычно 1-2 недели.', example: '"We plan which features to build at the start of each sprint."' },
        { term: 'backlog', definition: 'Список задач, упорядоченных по приоритету.', example: '"The product backlog has over 200 items."' },
        { term: 'retrospective', definition: 'Встреча команды в конце спринта для анализа и улучшения процессов.', example: '"In the retrospective, we decided to improve our code review process."' },
        { term: 'velocity', definition: 'Количество story points, выполняемых командой за спринт.', example: '"Our team velocity is about 40 story points per sprint."' },
        { term: 'definition of done (DoD)', definition: 'Чёткий список критериев завершённости задачи.', example: '"According to our DoD, all features need tests and documentation before closing."' },
        { term: 'kanban', definition: 'Методология управления работой с помощью визуальных карточек и колонок.', example: '"We use a Kanban board in Jira to visualize our workflow."' }
      ]
    },
    {
      id: 7,
      title: 'Match terms with definitions',
      type: 'practice',
      description: 'Сопоставь IT-термин с правильным определением.',
      solution: 'Правильные ответы:\n1. Race condition — баг, возникающий когда результат зависит от порядка выполнения параллельных процессов (вариант B).\n2. Technical debt — накопленные компромиссы в коде, которые замедляют разработку (вариант C).\n3. Memory leak — программа выделяет память, но не освобождает её (вариант B).',
      content: [
        { type: 'text', value: 'Сопоставь термин с правильным определением.' }
      ],
      tasks: [
        {
          question: 'What is a "race condition"?',
          options: [
            'A performance optimization technique',
            'A bug that occurs when two threads access shared data simultaneously',
            'A type of database index',
            'A deployment strategy'
          ],
          correct: 1,
          explanation: 'Race condition (состояние гонки) — баг, возникающий когда результат зависит от порядка выполнения параллельных процессов.'
        },
        {
          question: 'What does "technical debt" mean?',
          options: [
            'Money owed for software licenses',
            'Bugs in the production system',
            'The implied cost of shortcuts and poor code that will need fixing later',
            'Outstanding tasks in the backlog'
          ],
          correct: 2,
          explanation: 'Technical debt (технический долг) — накопленные компромиссы в коде, которые замедляют разработку и требуют рефакторинга в будущем.'
        },
        {
          question: 'What is a "memory leak"?',
          options: [
            'When sensitive data is exposed',
            'When memory is allocated but never freed, causing gradual memory exhaustion',
            'When a program uses too much CPU',
            'When data is lost during a crash'
          ],
          correct: 1,
          explanation: 'Memory leak (утечка памяти) — ситуация, когда программа выделяет память, но не освобождает её, что приводит к постепенному истощению памяти.'
        }
      ]
    },
    {
      id: 8,
      title: 'Fill in the blanks with IT terms',
      type: 'practice',
      description: 'Заполни пропуски подходящим IT-термином.',
      solution: 'Правильные ответы:\n1. N+1 (проблема N+1 запросов)\n2. environment variables / configuration management\n3. CI/CD (автоматическая сборка и тестирование)\n4. bottleneck / single point of failure',
      content: [
        { type: 'text', value: 'Заполни пропуски подходящим IT-термином.' }
      ],
      tasks: [
        {
          sentence: 'Our application suffered from the _____ problem — for each post, it made a separate database query to fetch the author.',
          answer: 'N+1',
          hint: 'Один запрос для списка + N запросов для деталей'
        },
        {
          sentence: 'We use _____ to handle the different environments: development, staging, and production.',
          answer: 'environment variables / configuration management',
          hint: 'Способ конфигурировать приложение для разных сред'
        },
        {
          sentence: 'Before pushing to main, the _____ pipeline runs all unit tests and integration tests automatically.',
          answer: 'CI/CD',
          hint: 'Автоматическая сборка и тестирование'
        },
        {
          sentence: 'The _____ is too slow — all requests must pass through the payment service, even those that don\'t need it.',
          answer: 'bottleneck / single point of failure',
          hint: 'Узкое место в архитектуре'
        }
      ]
    },
    {
      id: 9,
      title: 'IT abbreviations quiz',
      type: 'practice',
      description: 'Расшифруй IT-аббревиатуру и объясни её значение.',
      solution: 'Правильные ответы:\nORM — Object-Relational Mapping (абстракция работы с БД)\nREST — Representational State Transfer (стиль API)\nSOLID — 5 принципов ООП\nSLA — Service Level Agreement (договор об уровне сервиса)\nTDD — Test-Driven Development (тесты до кода)\nDRY — Don\'t Repeat Yourself (не повторяй код)',
      content: [
        { type: 'text', value: 'Расшифруй аббревиатуру и объясни, что она означает.' }
      ],
      tasks: [
        { abbr: 'ORM', full: 'Object-Relational Mapping', explanation: 'Инструмент, абстрагирующий работу с БД через объекты программы.' },
        { abbr: 'REST', full: 'Representational State Transfer', explanation: 'Архитектурный стиль для создания API на основе HTTP.' },
        { abbr: 'SOLID', full: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion', explanation: 'Пять принципов объектно-ориентированного программирования.' },
        { abbr: 'SLA', full: 'Service Level Agreement', explanation: 'Соглашение об уровне обслуживания — договор о доступности и производительности.' },
        { abbr: 'TDD', full: 'Test-Driven Development', explanation: 'Разработка через тестирование: сначала тест, потом код.' },
        { abbr: 'DRY', full: 'Don\'t Repeat Yourself', explanation: 'Принцип: каждая единица знания должна иметь единственное представление в системе.' }
      ]
    },
    {
      id: 10,
      title: 'Context understanding: jargon in use',
      type: 'practice',
      description: 'Прочитай диалог и объясни значение выделенных IT-терминов.',
      solution: 'Правильные ответы:\nperf regression — ухудшение производительности\np99 latency — 99% запросов выполняются быстрее 800мс (было 80мс)\nN+1 problem — лишние SQL-запросы для каждого объекта\ninstrumentation — добавление кода для измерения и мониторинга',
      content: [
        { type: 'text', value: 'Прочитай диалог и объясни значение выделенных терминов.' }
      ],
      dialogue: '"Hey, we\'re seeing a major perf regression since yesterday\'s deploy. The **p99 latency** jumped from 80ms to 800ms. Can you take a look? I suspect it\'s the new **ORM query** we added — it might be causing an **N+1 problem**. We should add some **instrumentation** to confirm before we roll back."',
      tasks: [
        { term: 'perf regression', explanation: 'Performance regression — ухудшение производительности по сравнению с предыдущей версией.' },
        { term: 'p99 latency', explanation: '99-й процентиль задержки — 99% запросов выполняются быстрее этого значения. Прыжок с 80мс до 800мс — критическое ухудшение.' },
        { term: 'N+1 problem', explanation: 'Проблема производительности: вместо одного SQL-запроса выполняется N+1 запросов (один для списка + по одному для каждого элемента).' },
        { term: 'instrumentation', explanation: 'Добавление кода для измерения и мониторинга — логирование, трейсинг, метрики.' }
      ]
    }
  ]
}
