export default {
  id: 37,
  title: '2000 слов уровня B1',
  description: 'Ключевые слова уровня B1 для IT-специалистов: технические глаголы, архитектура, DevOps, базы данных, сети, бизнес, Agile, коммуникация, фразовые глаголы и обзорный словарь.',
  lessons: [
    {
      id: 1,
      title: 'Слова: Technical Verbs',
      type: 'practice',
      difficulty: 'medium',
      description: 'Изучите слова по теме "Technical Verbs" и составьте с каждым по предложению.',
      requirements: ['Выучить 20 слов', 'Составить предложения'],
      expectedOutput: 'Предложения с каждым словом',
      hint: 'Используйте слова в IT-контексте',
      solution: '1. deploy (деплоить) — We deploy the app every Friday.\n2. implement (реализовать) — I need to implement the new feature by Monday.\n3. maintain (поддерживать) — Our team maintains the legacy codebase.\n4. optimize (оптимизировать) — We optimized the query and cut response time in half.\n5. configure (настраивать) — Configure the environment variables before running the server.\n6. integrate (интегрировать) — We integrated Stripe for payments.\n7. validate (валидировать) — Always validate user input on the server side.\n8. execute (выполнять) — The script executes automatically every night.\n9. initialize (инициализировать) — Initialize the database connection at startup.\n10. migrate (мигрировать) — We migrated the database to PostgreSQL last quarter.\n11. refactor (рефакторить) — I refactored the authentication module to reduce complexity.\n12. debug (отлаживать) — It took two hours to debug the race condition.\n13. compile (компилировать) — The TypeScript compiles to JavaScript before deployment.\n14. iterate (итерировать) — We iterate over the list and filter invalid entries.\n15. escalate (эскалировать) — If you cannot fix it in an hour, escalate to the team lead.\n16. provision (провизионировать) — We provision new servers using Terraform.\n17. deprecate (депрекейтить) — This endpoint is deprecated; use /v2/users instead.\n18. authenticate (аутентифицировать) — The middleware authenticates every incoming request.\n19. serialize (сериализовать) — We serialize the object to JSON before sending it over the network.\n20. benchmark (бенчмаркить) — We benchmarked three libraries and chose the fastest one.',
      explanation: 'Эти слова часто встречаются в технической документации, код-ревью и обсуждениях на митингах.'
    },
    {
      id: 2,
      title: 'Слова: Architecture',
      type: 'practice',
      difficulty: 'medium',
      description: 'Изучите слова по теме "Architecture" и составьте с каждым по предложению.',
      requirements: ['Выучить 20 слов', 'Составить предложения'],
      expectedOutput: 'Предложения с каждым словом',
      hint: 'Используйте слова в IT-контексте',
      solution: '1. microservice (микросервис) — Each microservice owns its own database.\n2. monolith (монолит) — We are slowly breaking the monolith into smaller services.\n3. middleware (промежуточное ПО) — The middleware logs every request before it reaches the handler.\n4. endpoint (эндпоинт) — The /health endpoint returns the status of the service.\n5. payload (полезная нагрузка) — The payload of the webhook is a JSON object.\n6. throughput (пропускная способность) — High throughput is critical for our streaming pipeline.\n7. latency (задержка) — We reduced latency by caching frequent queries.\n8. scalability (масштабируемость) — Scalability was the main reason we chose Kubernetes.\n9. redundancy (избыточность) — Redundancy ensures the system stays up if one node fails.\n10. resilience (устойчивость) — We designed for resilience by adding circuit breakers.\n11. idempotent (идемпотентный) — Make the retry logic safe by keeping operations idempotent.\n12. stateless (без состояния) — REST APIs should be stateless for easy horizontal scaling.\n13. decoupling (развязывание) — Decoupling the services reduces the blast radius of failures.\n14. abstraction (абстракция) — A good abstraction hides implementation details from callers.\n15. encapsulation (инкапсуляция) — Encapsulation keeps internal state private and safe.\n16. polymorphism (полиморфизм) — Polymorphism lets us swap implementations without changing the caller.\n17. singleton (синглтон) — The logger is implemented as a singleton shared across modules.\n18. facade (фасад) — The facade pattern simplifies the complex subsystem API.\n19. adapter (адаптер) — We used an adapter to wrap the third-party SDK in our interface.\n20. proxy (прокси) — The proxy intercepts calls and adds rate limiting.',
      explanation: 'Эти слова часто встречаются в архитектурных обсуждениях, RFC-документах и system design интервью.'
    },
    {
      id: 3,
      title: 'Слова: DevOps',
      type: 'practice',
      difficulty: 'medium',
      description: 'Изучите слова по теме "DevOps" и составьте с каждым по предложению.',
      requirements: ['Выучить 20 слов', 'Составить предложения'],
      expectedOutput: 'Предложения с каждым словом',
      hint: 'Используйте слова в IT-контексте',
      solution: '1. pipeline (пайплайн) — The CI/CD pipeline runs tests on every pull request.\n2. container (контейнер) — Each service runs in its own container.\n3. orchestration (оркестрация) — Kubernetes handles orchestration of our containers.\n4. provisioning (провизионирование) — Provisioning a new environment takes under five minutes.\n5. monitoring (мониторинг) — We set up monitoring with Prometheus and Grafana.\n6. alerting (алертинг) — Alerting rules notify the on-call engineer when error rate spikes.\n7. rollback (откат) — We triggered a rollback after the deploy caused 500 errors.\n8. canary (канарейка) — The canary release sent 5% of traffic to the new version.\n9. artifact (артефакт) — The build artifact is stored in S3 after a successful build.\n10. registry (реестр) — The Docker registry holds all our container images.\n11. namespace (пространство имён) — Each team has its own namespace in the Kubernetes cluster.\n12. ingress (ингресс) — The ingress controller routes external traffic to internal services.\n13. daemon (демон) — The log daemon runs in the background on every node.\n14. scheduler (планировщик) — The scheduler decides which node runs each pod.\n15. cluster (кластер) — The production cluster has twelve nodes.\n16. node (нода) — One node went down but the cluster stayed healthy.\n17. replica (реплика) — We run three replicas of each service for high availability.\n18. sidecar (сайдкар) — The sidecar container handles service mesh communication.\n19. probe (проба) — The liveness probe restarts the pod if the health check fails.\n20. secret (секрет) — Database passwords are stored as Kubernetes secrets.',
      explanation: 'Эти слова часто встречаются в DevOps-документации, Helm charts, Terraform-конфигурациях и Daily Standups.'
    },
    {
      id: 4,
      title: 'Слова: Databases',
      type: 'practice',
      difficulty: 'medium',
      description: 'Изучите слова по теме "Databases" и составьте с каждым по предложению.',
      requirements: ['Выучить 20 слов', 'Составить предложения'],
      expectedOutput: 'Предложения с каждым словом',
      hint: 'Используйте слова в IT-контексте',
      solution: '1. query (запрос) — The query took 3 seconds because there was no index.\n2. index (индекс) — Adding an index on the email column improved lookup speed.\n3. migration (миграция) — Run the migration script before deploying the new version.\n4. transaction (транзакция) — Wrap both inserts in a transaction to keep them atomic.\n5. constraint (ограничение) — A unique constraint prevents duplicate email addresses.\n6. normalization (нормализация) — Normalization removes redundant data from the schema.\n7. denormalization (денормализация) — We denormalized the table to speed up reporting queries.\n8. replication (репликация) — Read replicas handle reporting queries to reduce load on the primary.\n9. partitioning (партиционирование) — Partitioning the table by month made archiving much easier.\n10. cursor (курсор) — We used a cursor to process the large dataset in batches.\n11. aggregation (агрегация) — The aggregation pipeline groups sales by region and date.\n12. projection (проекция) — Use projection to return only the fields the client actually needs.\n13. materialized (материализованный) — The materialized view is refreshed every hour.\n14. snapshot (снимок) — We took a snapshot of the production database before the migration.\n15. consistency (консистентность) — Strong consistency guarantees all reads see the latest write.\n16. isolation (изоляция) — The isolation level determines how concurrent transactions interact.\n17. durability (долговечность) — Durability means committed data survives a server crash.\n18. deadlock (дедлок) — A deadlock occurred when two transactions waited on each other.\n19. sharding (шардинг) — Sharding splits the data across multiple database servers.\n20. backup (резервная копия) — We run automated backups every night and test them monthly.',
      explanation: 'Эти слова часто встречаются в схемах баз данных, code review, обсуждениях производительности и собеседованиях.'
    },
    {
      id: 5,
      title: 'Слова: Networking',
      type: 'practice',
      difficulty: 'medium',
      description: 'Изучите слова по теме "Networking" и составьте с каждым по предложению.',
      requirements: ['Выучить 20 слов', 'Составить предложения'],
      expectedOutput: 'Предложения с каждым словом',
      hint: 'Используйте слова в IT-контексте',
      solution: '1. protocol (протокол) — HTTPS is the standard protocol for secure web communication.\n2. handshake (рукопожатие) — The TLS handshake establishes an encrypted connection.\n3. encryption (шифрование) — End-to-end encryption ensures only the recipient can read the message.\n4. certificate (сертификат) — The SSL certificate expired and the site showed a security warning.\n5. proxy (прокси) — Requests go through a reverse proxy before reaching the application.\n6. gateway (шлюз) — The API gateway handles authentication and rate limiting for all services.\n7. firewall (файрвол) — The firewall blocks all inbound traffic except ports 80 and 443.\n8. subnet (подсеть) — The database servers live in a private subnet with no internet access.\n9. bandwidth (пропускная способность) — High-resolution video streaming requires a lot of bandwidth.\n10. packet (пакет) — Each packet contains a header with routing information.\n11. routing (маршрутизация) — Routing rules send traffic to the nearest data center.\n12. DNS (DNS) — The DNS record was updated but propagation took 24 hours.\n13. socket (сокет) — The WebSocket connection stays open for real-time updates.\n14. tunnel (туннель) — We use an SSH tunnel to access the database securely.\n15. payload (тело запроса) — Keep the payload small to reduce transfer time.\n16. header (заголовок) — The Authorization header carries the JWT token.\n17. timeout (таймаут) — Set a reasonable timeout so failed requests do not block the thread.\n18. retry (повтор) — Implement exponential backoff in your retry logic.\n19. throttle (ограничение) — We throttle the API to 100 requests per minute per user.\n20. circuit-breaker (автоматический выключатель) — The circuit-breaker opens when the downstream service fails repeatedly.',
      explanation: 'Эти слова часто встречаются в документации по сетям, архитектурных обсуждениях и диагностике проблем.'
    },
    {
      id: 6,
      title: 'Слова: Business',
      type: 'practice',
      difficulty: 'medium',
      description: 'Изучите слова по теме "Business" и составьте с каждым по предложению.',
      requirements: ['Выучить 20 слов', 'Составить предложения'],
      expectedOutput: 'Предложения с каждым словом',
      hint: 'Используйте слова в IT-контексте',
      solution: '1. stakeholder (заинтересованная сторона) — We need to align with all stakeholders before starting the project.\n2. roadmap (дорожная карта) — The product roadmap shows what we plan to deliver each quarter.\n3. milestone (веха) — Hitting the Q2 milestone means the MVP is ready for beta users.\n4. deliverable (результат) — The main deliverable for this sprint is the login flow.\n5. estimate (оценка) — My estimate for the task is three days but it could be five.\n6. blocker (блокер) — The missing design spec is a blocker for the frontend team.\n7. priority (приоритет) — Security fixes always have the highest priority.\n8. scope (объём) — Adding the new feature would change the scope significantly.\n9. alignment (согласованность) — We need alignment between engineering and product before kick-off.\n10. bandwidth (ресурс) — I do not have the bandwidth to take on another project this month.\n11. leverage (использовать) — We can leverage the existing infrastructure to cut costs.\n12. synergy (синергия) — The partnership creates synergy between the two product teams.\n13. initiative (инициатива) — The performance initiative is the top engineering priority this half.\n14. strategy (стратегия) — Our strategy is to ship fast and iterate based on user feedback.\n15. objective (цель) — The objective is to reduce churn by 10% by end of year.\n16. metric (метрика) — Track the right metric; otherwise you optimize for the wrong thing.\n17. benchmark (ориентир) — Our benchmark is industry-average page load time under two seconds.\n18. compliance (соответствие) — GDPR compliance requires us to store EU data in EU data centers.\n19. governance (управление) — Good data governance means knowing who can access what and why.\n20. audit (аудит) — The security audit revealed three critical vulnerabilities.',
      explanation: 'Эти слова часто встречаются на деловых митингах, в переписке с менеджерами и в стратегических документах.'
    },
    {
      id: 7,
      title: 'Слова: Agile',
      type: 'practice',
      difficulty: 'medium',
      description: 'Изучите слова по теме "Agile" и составьте с каждым по предложению.',
      requirements: ['Выучить 20 слов', 'Составить предложения'],
      expectedOutput: 'Предложения с каждым словом',
      hint: 'Используйте слова в IT-контексте',
      solution: '1. sprint (спринт) — This sprint focuses on performance improvements.\n2. backlog (бэклог) — We refined the backlog and prioritized the top ten items.\n3. standup (стендап) — The standup starts at 9 AM sharp every weekday.\n4. retrospective (ретроспектива) — In the retrospective we identified slow code reviews as a recurring problem.\n5. velocity (скорость команды) — Our velocity increased after we reduced work in progress.\n6. burndown (диаграмма сгорания) — The burndown chart shows we are on track to finish by Friday.\n7. epic (эпик) — The authentication epic contains five user stories.\n8. story (история) — Each story should be small enough to complete within one sprint.\n9. acceptance (приёмка) — The acceptance criteria define when we can mark a story as done.\n10. refinement (грумминг) — During refinement we break large stories into smaller tasks.\n11. kanban (канбан) — We switched to kanban because our work items had unpredictable size.\n12. blocker (блокер) — Raise a blocker immediately; do not wait until the next standup.\n13. impediment (препятствие) — The Scrum Master removes impediments so the team can focus.\n14. increment (инкремент) — Each sprint produces a potentially shippable product increment.\n15. release (релиз) — We plan one major release per quarter with smaller patches in between.\n16. ceremony (церемония) — Sprint planning is a ceremony that should not exceed two hours.\n17. facilitator (фасилитатор) — The Scrum Master acts as facilitator for all team ceremonies.\n18. cross-functional (кросс-функциональный) — A cross-functional team includes developers, QA, and design.\n19. self-organizing (самоорганизующийся) — A self-organizing team decides how to reach the sprint goal.\n20. continuous (непрерывный) — Continuous delivery means code can be released at any time.',
      explanation: 'Эти слова часто встречаются на Agile-церемониях, в Jira, и в разговорах с Scrum Masters.'
    },
    {
      id: 8,
      title: 'Слова: Communication',
      type: 'practice',
      difficulty: 'medium',
      description: 'Изучите слова по теме "Communication" и составьте с каждым по предложению.',
      requirements: ['Выучить 20 слов', 'Составить предложения'],
      expectedOutput: 'Предложения с каждым словом',
      hint: 'Используйте слова в IT-контексте',
      solution: '1. elaborate (разъяснить) — Could you elaborate on the caching strategy you mentioned?\n2. clarify (уточнить) — I need to clarify the requirements before I start coding.\n3. summarize (резюмировать) — Let me summarize what we agreed on before we close the meeting.\n4. emphasize (подчеркнуть) — I want to emphasize that security must not be skipped.\n5. acknowledge (признать) — I acknowledge that the deadline was missed; here is our plan.\n6. postpone (перенести) — We decided to postpone the release until the bug is fixed.\n7. delegate (делегировать) — The tech lead delegated the database design to a senior engineer.\n8. negotiate (переговорить) — We negotiated a two-week extension for the integration work.\n9. compromise (компромисс) — We reached a compromise: deliver the MVP now and add features later.\n10. persuade (убедить) — I persuaded the team to adopt code linting standards.\n11. recommend (рекомендовать) — I recommend using Redis for the session store.\n12. suggest (предложить) — Can I suggest we move the meeting to Thursday?\n13. propose (предложить формально) — I propose we adopt a feature-flag strategy for all major releases.\n14. approve (одобрить) — The PR was approved after two rounds of review.\n15. reject (отклонить) — The team rejected the proposal because it added too much complexity.\n16. escalate (эскалировать) — If the vendor does not respond today, we must escalate to management.\n17. follow-up (продолжить) — I will follow up on the open questions after the call.\n18. circle-back (вернуться к теме) — Let us circle back to the deployment plan at the end of the sprint.\n19. align (согласовать) — We need to align on the API contract before both teams start coding.\n20. sync (синхронизироваться) — Can we sync tomorrow morning before the client call?',
      explanation: 'Эти слова часто встречаются в деловых письмах, митингах и переписке в Slack или по email.'
    },
    {
      id: 9,
      title: 'Слова: Phrasal Verbs',
      type: 'practice',
      difficulty: 'medium',
      description: 'Изучите слова по теме "Phrasal Verbs" и составьте с каждым по предложению.',
      requirements: ['Выучить 20 слов', 'Составить предложения'],
      expectedOutput: 'Предложения с каждым словом',
      hint: 'Используйте слова в IT-контексте',
      solution: '1. set up (настроить) — Set up the local environment using the README instructions.\n2. log in (войти) — Log in with your SSO credentials to access the dashboard.\n3. break down (разбить) — Break down the epic into stories before sprint planning.\n4. roll back (откатить) — We had to roll back the release because of a critical bug.\n5. opt in (согласиться) — Users must opt in to receive marketing emails.\n6. phase out (постепенно убрать) — We are phasing out the old API over the next three months.\n7. scale up (масштабировать вверх) — Scale up the web tier when CPU exceeds 80% for five minutes.\n8. spin up (запустить) — Spin up a new instance to handle the traffic spike.\n9. tear down (уничтожить) — Tear down the test environment after the end-to-end suite finishes.\n10. sign off (одобрить) — The product manager needs to sign off before we ship.\n11. drill down (углубиться) — Drill down into the logs to find the root cause.\n12. ramp up (наращивать) — We are ramping up the canary deployment to 50% of traffic.\n13. roll out (выпустить) — We will roll out the new feature to all users next week.\n14. plug in (подключить) — Plug in the new payment provider without changing existing code.\n15. shut down (выключить) — Shut down the old servers after the migration is complete.\n16. boot up (загрузить) — The container takes ten seconds to boot up.\n17. back up (создать резервную копию) — Back up the database before running the schema migration.\n18. branch off (ответвиться) — Branch off from main and name the branch after the ticket number.\n19. check out (переключиться) — Check out the feature branch and pull the latest changes.\n20. merge in (вмерджить) — Merge in the hotfix branch immediately after the fix is verified.',
      explanation: 'Эти фразовые глаголы часто встречаются в разговорной речи разработчиков, в Slack и в технических обсуждениях.'
    },
    {
      id: 10,
      title: 'Слова: Review Mix',
      type: 'practice',
      difficulty: 'medium',
      description: 'Изучите слова по теме "Review Mix" и составьте с каждым по предложению.',
      requirements: ['Выучить 20 слов', 'Составить предложения'],
      expectedOutput: 'Предложения с каждым словом',
      hint: 'Используйте слова в IT-контексте',
      solution: '1. comprehensive (всесторонний) — We need a comprehensive test suite before the next release.\n2. straightforward (простой) — The fix is straightforward: just add a null check.\n3. feasible (осуществимый) — Is it feasible to ship the feature before the end of the quarter?\n4. scalable (масштабируемый) — Design the system to be scalable from day one.\n5. maintainable (сопровождаемый) — Write maintainable code so the next developer understands it quickly.\n6. deprecated (устаревший) — The v1 endpoint is deprecated and will be removed in six months.\n7. legacy (легаси) — Nobody wants to work on the legacy codebase, but someone has to.\n8. robust (надёжный) — The error handling needs to be more robust for edge cases.\n9. vulnerable (уязвимый) — The library is vulnerable to SQL injection attacks.\n10. redundant (избыточный) — Remove the redundant validation that is already handled upstream.\n11. concurrent (параллельный) — Concurrent writes caused a race condition in the cache layer.\n12. asynchronous (асинхронный) — Use asynchronous calls to avoid blocking the event loop.\n13. deterministic (детерминированный) — Tests must be deterministic; flaky tests erode confidence.\n14. immutable (неизменяемый) — Immutable data structures prevent accidental side effects.\n15. ephemeral (эфемерный) — Containers are ephemeral; do not store state inside them.\n16. idiomatic (идиоматический) — Write idiomatic Go instead of translating Java patterns directly.\n17. opinionated (с выраженной позицией) — Rails is an opinionated framework that prefers convention over configuration.\n18. agnostic (независимый) — The service is cloud-agnostic and runs on AWS, GCP, or Azure.\n19. polymorphic (полиморфный) — The polymorphic association allows a comment to belong to any model.\n20. declarative (декларативный) — Kubernetes uses a declarative model: you describe the desired state.',
      explanation: 'Эти слова встречаются повсюду в IT: в код-ревью, документации, обсуждениях и технических статьях.'
    }
  ]
}
