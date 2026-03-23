export default {
  id: 11,
  title: 'IT: System Design на English',
  description: 'Английская терминология системного проектирования: throughput, latency, CAP theorem, sharding',
  lessons: [
    {
      id: 1,
      title: 'Производительность: throughput, latency, bandwidth',
      type: 'theory',
      content: [
        { type: 'text', value: 'Эти три термина часто путают. Важно понимать их точный смысл для системных интервью и архитектурных обсуждений.' },
        { type: 'heading', value: 'Latency — задержка' },
        { type: 'text', value: 'Время от отправки запроса до получения первого байта ответа.\n\n"The average latency of our API is 120ms."\n"High latency makes the application feel sluggish."\n"We aim for P99 latency under 500ms." (P99 — 99-й перцентиль)\n"Network latency between regions can reach 200ms."' },
        { type: 'heading', value: 'Throughput — пропускная способность' },
        { type: 'text', value: 'Количество операций/запросов в единицу времени.\n\n"Our system handles a throughput of 50,000 requests per second."\n"After optimisation, throughput increased by 40%."\n"The message queue has a throughput of 1 million messages per second."' },
        { type: 'heading', value: 'Bandwidth — полоса пропускания' },
        { type: 'text', value: 'Максимальный объём данных, который может быть передан за единицу времени.\n\n"The server has 10 Gbps bandwidth."\n"Bandwidth is not the bottleneck — it\'s the processing time."\n"Video streaming requires high bandwidth."' },
        { type: 'tip', value: 'Аналогия для интервью: представьте трубу с водой. Bandwidth — диаметр трубы. Throughput — сколько воды течёт сейчас. Latency — время для капли воды пройти от A до B.' }
      ]
    },
    {
      id: 2,
      title: 'Масштабирование: scaling, sharding, replication',
      type: 'theory',
      content: [
        { type: 'text', value: 'Масштабирование — ключевая тема в system design интервью.' },
        { type: 'heading', value: 'Horizontal vs Vertical Scaling' },
        { type: 'text', value: '"Vertical scaling (scaling up): adding more CPU/RAM to an existing server."\n"Horizontal scaling (scaling out): adding more servers to the pool."\n"Horizontal scaling is generally preferred for stateless services."\n"Database scaling often starts vertical and moves to horizontal."' },
        { type: 'heading', value: 'Sharding — горизонтальное партиционирование БД' },
        { type: 'text', value: '"Sharding distributes data across multiple database instances."\n"Each shard holds a subset of the data."\n"We shard by user ID to distribute the load evenly."\n"Cross-shard queries are expensive and should be avoided."\n"Resharding is a complex operation requiring careful planning."' },
        { type: 'heading', value: 'Replication — репликация' },
        { type: 'text', value: '"Data replication improves both availability and read performance."\n"We use a master-replica setup: writes go to master, reads are distributed across replicas."\n"Replication lag is the delay between writing to master and the data appearing on replicas."\n"Synchronous replication: zero data loss, but higher latency."\n"Asynchronous replication: lower latency, but potential data loss on failure."' },
        { type: 'tip', value: 'В system design интервью всегда уточняйте: "Are we optimising for reads or writes?" и "What are the consistency requirements?" — это определяет архитектуру.' }
      ]
    },
    {
      id: 3,
      title: 'CAP Theorem и распределённые системы',
      type: 'theory',
      content: [
        { type: 'text', value: 'CAP theorem — обязательная тема для senior-инженеров. Нужно уметь объяснять её на английском.' },
        { type: 'heading', value: 'CAP Theorem' },
        { type: 'text', value: '"The CAP theorem states that a distributed system can guarantee at most two of the following three properties: Consistency, Availability, and Partition tolerance."\n\n"Consistency: every read receives the most recent write or an error."\n"Availability: every request receives a response (not necessarily the latest data)."\n"Partition tolerance: the system continues operating despite network partitions."' },
        { type: 'heading', value: 'CP vs AP systems' },
        { type: 'text', value: '"Since network partitions are unavoidable in distributed systems, the real trade-off is between Consistency and Availability."\n\n"CP systems (e.g., HBase, Zookeeper): prefer consistency over availability during a partition."\n"AP systems (e.g., DynamoDB, Cassandra): prefer availability over strict consistency."' },
        { type: 'heading', value: 'Eventual Consistency' },
        { type: 'text', value: '"Eventual consistency: given enough time without new updates, all replicas will converge to the same value."\n"Eventual consistency is acceptable for social media feeds but not for financial transactions."\n"Strong consistency guarantees that all clients see the same data simultaneously."' },
        { type: 'note', value: 'На интервью: "The CAP theorem actually has a subtlety — PACELC theorem extends it by also considering latency vs consistency trade-offs in the absence of partitions."' }
      ]
    },
    {
      id: 4,
      title: 'Consensus algorithms и distributed coordination',
      type: 'theory',
      content: [
        { type: 'text', value: 'Алгоритмы консенсуса обеспечивают согласованность в распределённых системах.' },
        { type: 'heading', value: 'Consensus — консенсус' },
        { type: 'text', value: '"Consensus is the process by which distributed nodes agree on a single value or state."\n"Consensus is required for leader election, distributed transactions, and configuration management."\n"Achieving consensus in the presence of failures is a fundamental challenge."' },
        { type: 'heading', value: 'Raft и Paxos' },
        { type: 'text', value: '"Raft is a consensus algorithm designed to be more understandable than Paxos."\n"In Raft, a single leader handles all writes and replicates them to followers."\n"Paxos is the foundational consensus algorithm, but is notoriously difficult to implement correctly."\n"Zookeeper uses a Paxos-like protocol called ZAB (Zookeeper Atomic Broadcast)."' },
        { type: 'heading', value: 'Leader election' },
        { type: 'text', value: '"Leader election ensures that only one node acts as the coordinator at any time."\n"If the leader fails, a new leader is elected from the remaining nodes."\n"The split-brain problem occurs when two nodes both believe they are the leader."' },
        { type: 'tip', value: 'Практичная фраза для интервью: "For this use case, I would use Zookeeper for distributed coordination and leader election, since it provides strong consistency guarantees out of the box."' }
      ]
    },
    {
      id: 5,
      title: 'Partition, load balancing, circuit breaker',
      type: 'theory',
      content: [
        { type: 'text', value: 'Термины, связанные с управлением нагрузкой и отказоустойчивостью.' },
        { type: 'heading', value: 'Load Balancing' },
        { type: 'text', value: '"A load balancer distributes incoming requests across multiple backend servers."\n"Round-robin: each server receives requests in turn."\n"Least connections: new requests go to the server with the fewest active connections."\n"Consistent hashing: ensures the same client always reaches the same server (useful for caching)."' },
        { type: 'heading', value: 'Circuit Breaker Pattern' },
        { type: 'text', value: '"A circuit breaker prevents a failing service from being overwhelmed with requests."\n"States: Closed (normal), Open (failing, requests blocked), Half-Open (testing recovery)."\n"When the error rate exceeds a threshold, the circuit breaker opens."\n"After a timeout, it enters half-open state and allows a few requests through to test recovery."' },
        { type: 'heading', value: 'Partitioning strategies' },
        { type: 'text', value: '"Range partitioning: data is divided based on ranges of a key (e.g., user IDs 1-1000 on shard 1)."\n"Hash partitioning: a hash function determines the partition for each record."\n"Directory-based partitioning: a lookup service maps keys to partitions."' }
      ]
    },
    {
      id: 6,
      title: 'Message queues и event-driven architecture',
      type: 'theory',
      content: [
        { type: 'text', value: 'Асинхронные архитектуры и очереди сообщений — неотъемлемая часть modern system design.' },
        { type: 'heading', value: 'Message Queue' },
        { type: 'text', value: '"A message queue decouples producers from consumers."\n"Producers publish messages without knowing who will consume them."\n"This allows asynchronous processing and improves resilience."\n"Popular implementations: RabbitMQ (message broker), Apache Kafka (event streaming platform)."' },
        { type: 'heading', value: 'Kafka terminology' },
        { type: 'text', value: '"Topic: a category of messages."\n"Partition: a topic is split into partitions for parallelism."\n"Producer: writes messages to topics."\n"Consumer: reads messages from topics."\n"Consumer group: multiple consumers sharing the work of processing a topic."\n"Offset: the position of a consumer within a partition."' },
        { type: 'heading', value: 'Event-driven architecture' },
        { type: 'text', value: '"In an event-driven system, components communicate by emitting and reacting to events."\n"Events are immutable facts: \'UserRegistered\', \'PaymentProcessed\', \'OrderShipped\'."\n"Event sourcing: the application state is derived from a sequence of events."' },
        { type: 'tip', value: 'Для интервью: "I would use Kafka for this because it provides durable, ordered, and replayable event streams, which is essential for building an audit trail and for re-processing historical data."' }
      ]
    },
    {
      id: 7,
      title: 'Практика: system design discussion',
      type: 'practice',
      difficulty: 'hard',
      description: 'Опишите архитектуру системы на английском, используя правильную терминологию.',
      requirements: [
        'Используйте минимум 10 терминов из модуля',
        'Структурируйте ответ: требования → компоненты → trade-offs',
        'Задание: Design a notification service for 10 million users'
      ],
      hint: 'Начните с: "Let me clarify the requirements first. Then I\'ll walk through the high-level architecture..."',
      solution: 'Let me walk through designing a notification service for 10 million users.\n\nFirst, the requirements: we need to support push notifications, emails, and in-app notifications. The system must handle high throughput — potentially millions of notifications per hour during peak times. Latency is less critical here; a few seconds of delay is acceptable for most notification types.\n\nFor the architecture, I would use an event-driven approach. When an event occurs (e.g., a new message, a payment confirmation), a producer publishes an event to a Kafka topic. This decouples the notification logic from the business logic.\n\nFor scalability, I would partition the Kafka topic by user ID to ensure ordered delivery per user. A fleet of consumer instances, organised in a consumer group, would read from these partitions and process notifications in parallel.\n\nThe notification workers would fan out to different delivery channels: FCM for push notifications, SendGrid for email, and a database write for in-app notifications. To handle temporary failures, each worker would implement a circuit breaker and exponential backoff for retries.\n\nFor availability, I would replicate the Kafka cluster with a replication factor of 3. This ensures no data loss even if two nodes fail simultaneously.\n\nThe trade-off here is between consistency and throughput. We accept eventual consistency — a notification might be delivered slightly late, but it will be delivered. This AP approach lets us achieve the throughput required.',
      explanation: 'Умение чётко объяснять архитектурные решения на английском — ключевой навык для senior и staff инженеров. В system design интервью важны и технические знания, и ясность изложения.'
    },
    {
      id: 8,
      title: 'Практика: терминология в контексте',
      type: 'practice',
      difficulty: 'medium',
      description: 'Заполните пропуски правильными терминами из области system design.',
      requirements: [
        'Выберите подходящий термин для каждого контекста',
        'Объясните свой выбор',
        'Словарь: latency, throughput, sharding, replication, consistency, partition tolerance, circuit breaker, load balancer'
      ],
      questions: [
        { text: 'Our database is a single node and is becoming a bottleneck. We need to distribute data across multiple nodes. We should implement ___.', answer: 'sharding', explanation: 'Sharding = горизонтальное разделение данных по нескольким узлам БД' },
        { text: 'When a downstream service is failing, we want to stop sending it requests immediately to prevent cascade failures. We should implement a ___.', answer: 'circuit breaker', explanation: 'Circuit breaker предотвращает каскадные отказы, прекращая запросы к нестабильному сервису' },
        { text: 'Our API handles 5,000 requests per second, but we need to understand how fast individual requests are processed. We should measure ___.', answer: 'latency', explanation: 'Latency = время обработки одного запроса; throughput = количество запросов в единицу времени' }
      ],
      solution: 'Правильные ответы:\n1. sharding\n2. circuit breaker\n3. latency',
      hint: 'Ключ к выбору: latency — скорость одного запроса; throughput — объём запросов; sharding — данные на разных серверах; replication — копии данных; circuit breaker — защита от каскадных сбоев.',
      explanation: 'Точное использование терминологии отличает опытного инженера от новичка. В международных командах неточная терминология приводит к недопониманиям и ошибочным архитектурным решениям.'
    }
  ]
}
