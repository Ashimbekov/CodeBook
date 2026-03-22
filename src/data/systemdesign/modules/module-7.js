export default {
  id: 7,
  title: 'CAP теорема',
  description: 'CAP теорема: Consistency, Availability, Partition Tolerance. CP vs AP системы. Теорема PACELC. Практическое применение при выборе БД.',
  lessons: [
    {
      id: 1,
      title: 'CAP теорема: основы',
      type: 'theory',
      description: 'CAP теорема Брюера: Consistency (актуальные данные), Availability (всегда отвечает), Partition Tolerance (работает при разрыве сети). P всегда нужен → выбор CP vs AP.',
      solution: 'C: все узлы видят одни данные. A: всегда отвечает (возможно stale). P: работает при network partition. P неизбежен в реальных системах → выбираем CP или AP. CA существует только в теории (один сервер). CAP важен только ВО ВРЕМЯ partition.',
      content: [
        { type: 'text', value: 'CAP теорема (Эрик Брюер, 2000) утверждает: распределённая система не может одновременно гарантировать все три свойства — Consistency, Availability, Partition Tolerance.' },
        { type: 'heading', value: 'Три свойства CAP' },
        { type: 'text', value: 'C — Consistency (Согласованность):\nКаждое чтение возвращает самые актуальные данные или ошибку. Все узлы видят одни и те же данные в один момент времени.\n\nA — Availability (Доступность):\nКаждый запрос получает ответ (не ошибку), хотя данные могут быть устаревшими. Система всегда отвечает.\n\nP — Partition Tolerance (Устойчивость к разделению):\nСистема продолжает работать, даже если некоторые узлы не могут общаться между собой (network partition — разрыв связи между узлами).' },
        { type: 'heading', value: 'Почему P всегда нужен' },
        { type: 'text', value: 'Network partitions в распределённых системах неизбежны: кабели рвутся, маршрутизаторы падают, датацентры теряют связь. Отказаться от P невозможно.\n\nПоэтому реальный выбор: CP или AP.\nCА-системы существуют только в теории (один сервер — нет partition).' },
        { type: 'tip', value: 'Важно: CAP описывает поведение только во время network partition. В нормальном режиме система может быть и consistent, и available. Выбор CP vs AP влияет только на то, что происходит при сбое сети.' }
      ]
    },
    {
      id: 2,
      title: 'CP системы: согласованность важнее доступности',
      type: 'theory',
      description: 'CP при partition: возвращает 503 вместо устаревших данных. Примеры: ZooKeeper, etcd, PostgreSQL с синхронной репликацией. Когда выбирать: финансы, locks, бронирование.',
      solution: 'CP при partition: DC2 не может синхронизироваться с DC1 → возвращает 503. Примеры: ZooKeeper, etcd (Kubernetes), HBase, Redis strong consistency, PostgreSQL синхронная репликация. Выбирать при: финансовые транзакции, distributed locks, конфигурации, бронирование.',
      content: [
        { type: 'text', value: 'CP системы жертвуют доступностью ради согласованности. При network partition — возвращают ошибку, а не устаревшие данные.' },
        { type: 'heading', value: 'Как ведёт себя CP система при partition' },
        { type: 'text', value: 'Сценарий: два датацентра DC1 и DC2, между ними разрыв связи.\n\nCP поведение:\n- Запрос на чтение в DC2: система обнаруживает, что не может синхронизироваться с DC1\n- Возвращает ошибку: "503 Service Unavailable" или "data not available"\n- Клиент получает ошибку, но не устаревшие данные\n\nПоследствия: часть пользователей не может работать, но данные всегда корректны.' },
        { type: 'heading', value: 'Примеры CP систем' },
        { type: 'list', value: [
          'ZooKeeper — координация в distributed системах',
          'Etcd — хранилище конфигураций Kubernetes',
          'HBase — NoSQL база данных',
          'Redis в режиме strong consistency',
          'PostgreSQL с синхронной репликацией'
        ]},
        { type: 'heading', value: 'Когда выбирать CP' },
        { type: 'list', value: [
          'Финансовые транзакции (деньги должны быть корректны)',
          'Координация распределённых систем (election, locks)',
          'Конфигурации и метаданные (лучше ошибка, чем неверная конфигурация)',
          'Системы бронирования (лучше не продать, чем продать дважды)'
        ]}
      ]
    },
    {
      id: 3,
      title: 'AP системы: доступность важнее согласованности',
      type: 'theory',
      description: 'AP при partition: продолжает работать с stale данными, после восстановления — reconciliation. Примеры: Cassandra, DynamoDB, DNS. Когда выбирать: соцсети, корзина, метрики.',
      solution: 'AP при partition: каждый DC работает независимо, возвращает stale data. После восстановления: reconciliation конфликтов. Примеры: Cassandra (tunable), DynamoDB eventual, CouchDB, DNS. Выбирать при: лайки/посты, корзина (лучше stale чем 503), метрики, кеш/CDN.',
      content: [
        { type: 'text', value: 'AP системы жертвуют строгой согласованностью ради доступности. При network partition продолжают работать, возможно возвращая устаревшие данные.' },
        { type: 'heading', value: 'Как ведёт себя AP система при partition' },
        { type: 'text', value: 'Сценарий: разрыв между DC1 и DC2.\n\nAP поведение:\n- Каждый датацентр продолжает принимать и читать данные независимо\n- DC2 возвращает данные, которые были до разрыва (stale data)\n- После восстановления связи — reconciliation: конфликты разрешаются\n\nПоследствия: система работает, но данные могут быть временно несогласованными.' },
        { type: 'heading', value: 'Примеры AP систем' },
        { type: 'list', value: [
          'Cassandra — tunable consistency, по умолчанию AP',
          'DynamoDB — eventual consistency по умолчанию',
          'CouchDB — eventual consistency',
          'DNS — классический пример AP',
          'Amazon Shopping Cart — история знаменитой AP статьи Dynamo'
        ]},
        { type: 'heading', value: 'Когда выбирать AP' },
        { type: 'list', value: [
          'Социальные сети (лайки, посты — небольшая задержка не критична)',
          'Корзина покупок (лучше показать что-то, чем ошибку)',
          'Системы метрик и аналитики',
          'Кеш и CDN'
        ]},
        { type: 'note', value: 'Amazon опубликовал знаменитую статью "Dynamo: Amazon\'s Highly Available Key-value Store". Они выбрали AP: корзина должна работать всегда, даже если данные временно не синхронизированы между регионами. Конфликты разрешаются при следующем обращении.' }
      ]
    },
    {
      id: 4,
      title: 'Уровни согласованности (Consistency Levels)',
      type: 'theory',
      description: 'Спектр согласованности: Strong → Sequential → Causal → Read-Your-Own-Writes → Eventual → Weak. Tunable consistency в Cassandra (QUORUM, ONE, ALL).',
      solution: 'Strong (ZooKeeper): последнее значение всегда. Causal: пост виден до комментария к нему. Read-Your-Writes: свои записи видишь сразу. Eventual: в конечном счёте придут к одному значению. Cassandra tunable: QUORUM (большинство нод), ONE (одна нода), ALL (все ноды).',
      content: [
        { type: 'text', value: 'CAP — упрощение реальности. На практике согласованность — это спектр, а не бинарный выбор.' },
        { type: 'heading', value: 'Уровни согласованности (от сильного к слабому)' },
        { type: 'text', value: 'Strong Consistency (Linearizability):\nКаждое чтение видит последнюю запись. Как будто система один сервер.\nПример: ZooKeeper, etcd. Медленнее.\n\nSequential Consistency:\nОперации выполняются в некотором порядке, согласованном для всех клиентов.\n\nCausal Consistency:\nПричинно-следственные зависимости сохраняются. Если вы написали пост, а потом комментарий — все увидят пост раньше комментария.\n\nRead Your Own Writes:\nВы всегда видите свои недавние записи, даже если другие ещё нет.\n\nEventual Consistency:\nВ конечном итоге все узлы придут к одному значению. Не гарантирует время.\n\nWeak Consistency:\nПосле записи нет гарантий, когда другие увидят данные. Максимальная скорость.' },
        { type: 'tip', value: 'Cassandra позволяет настраивать уровень согласованности для каждого запроса: QUORUM (большинство нод ответили), ONE (ответила одна нода), ALL (ответили все ноды). Это "tunable consistency".' }
      ]
    },
    {
      id: 5,
      title: 'PACELC: расширение CAP теоремы',
      type: 'theory',
      description: 'PACELC: при Partition → A или C; Else → Latency или Consistency. Cassandra = PA/EL (доступность + скорость). PostgreSQL = PC/EC (всегда согласован).',
      solution: 'PACELC: P→(A или C), E→(L или C). Cassandra: PA/EL — при partition AP, обычно низкая latency. DynamoDB: PA/EL (default), PC/EC (strong consistency option). PostgreSQL: PC/EC. В нормальном режиме: синхронная репликация (C) медленнее асинхронной (L).',
      content: [
        { type: 'text', value: 'CAP говорит только о поведении при partition. Но что происходит в нормальном режиме? PACELC добавляет это измерение.' },
        { type: 'heading', value: 'PACELC: PAC ELC' },
        { type: 'text', value: 'P — если Partition:\n  А — выбираем Availability\n  или C — выбираем Consistency\n\nE — Else (в нормальном режиме):\n  L — выбираем Latency (скорость)\n  или C — выбираем Consistency\n\nПример: Cassandra — PA/EL\n- При partition: AP (продолжает работать, eventual consistency)\n- Без partition: выбирает Low Latency (не ждёт подтверждения всех нод)\n\nDynamoDB — PA/EL (по умолчанию) или PC/EC (при strong consistency)\nPostgreSQL — PC/EC (всегда consistent)' },
        { type: 'note', value: 'PACELC более реалистична, чем CAP. В нормальном режиме системы выбирают между latency и consistency — это тоже trade-off. Реплицировать данные синхронно (consistency) медленнее, чем асинхронно (latency).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: выбор системы по CAP',
      type: 'practice',
      description: 'Практика выбора CP vs AP для 4 сценариев: банковский перевод, лайки YouTube, distributed lock, Shopping Cart — с обоснованием и технологиями.',
      requirements: [
        'Определить что хуже для каждого сценария: ошибка или устаревшие данные',
        'Выбрать CP или AP систему с обоснованием',
        'Назвать конкретные технологии для реализации',
        'Описать поведение системы при network partition',
        'Объяснить уровень согласованности (strong, eventual, read-your-own-writes)'
      ],
      hint: 'Для каждого сценария задай ключевой вопрос: "Что хуже — получить ошибку или получить устаревшие данные?" Финансовые операции → ошибка предпочтительнее. Социальный контент → допустимы устаревшие данные. Это и есть выбор CP vs AP.',
      expectedOutput: 'Для каждого из четырёх сценариев выбрана CP или AP система. Обосновано что важнее: согласованность или доступность. Названы конкретные технологии. Описано поведение при разрыве сети. Указаны trade-offs выбора.',
      solution: 'Сценарий 1 (банковский перевод): CP система — PostgreSQL с ACID + синхронная репликация. При partition лучше вернуть 503, чем провести перевод с ошибкой согласованности.\n\nСценарий 2 (лайки YouTube): AP система — Redis INCR + Cassandra. Показать "10,001 лайк" вместо "10,002" — допустимо. Важна высокая доступность.\n\nСценарий 3 (Distributed Lock): строго CP — ZooKeeper или etcd. Split-brain (два процесса держат lock одновременно) — катастрофа. Лучше никто не получит lock, чем оба.\n\nСценарий 4 (Shopping Cart): AP с Read-Your-Writes consistency — DynamoDB eventual consistency + session affinity. Пользователь должен видеть свои изменения, но небольшая задержка для других допустима.',
      explanation: 'Ключевой вопрос: что хуже — получить ошибку или получить устаревшие данные? Для денег ошибка предпочтительнее. Для социальных данных — допустимы устаревшие. CAP описывает поведение только при network partition — в нормальной работе система может быть и consistent, и available.',
      content: [
        { type: 'text', value: 'Применим CAP теорему к реальным сценариям проектирования.' },
        { type: 'heading', value: 'Сценарий 1: Банковский перевод' },
        { type: 'text', value: 'Требования: строгая согласованность, нельзя потерять транзакцию, нельзя допустить двойное списание.\n\nВыбор: CP система\nПочему: при network partition лучше вернуть ошибку ("сервис временно недоступен"), чем провести перевод в непоследовательном состоянии.\n\nТехнологии: PostgreSQL (ACID) + синхронная репликация или распределённые транзакции (2PC).' },
        { type: 'heading', value: 'Сценарий 2: Лайки на видео YouTube' },
        { type: 'text', value: 'Требования: высокая доступность, допустима небольшая задержка в обновлении счётчика.\n\nВыбор: AP система\nПочему: видео показывает "10,001 лайк" вместо "10,002 лайк" — не критично. Важнее, чтобы счётчик работал всегда.\n\nТехнологии: Redis (INCR) + Cassandra для персистентности.' },
        { type: 'heading', value: 'Сценарий 3: Distributed Lock' },
        { type: 'text', value: 'Требования: только один процесс должен держать lock в любой момент времени.\n\nВыбор: CP система (строго!)\nПочему: если два процесса одновременно думают, что держат lock (split-brain) — катастрофа. Лучше ни один не получит lock, чем оба.\n\nТехнологии: ZooKeeper, etcd, Redis с Redlock алгоритмом (с осторожностью).' },
        { type: 'heading', value: 'Сценарий 4: Shopping Cart' },
        { type: 'text', value: 'Требования: корзина должна работать всегда. Если пользователь добавил товар, он должен его видеть.\n\nВыбор: AP с Read-Your-Writes consistency\nПочему: если магазин недоступен, пользователь уходит. Лучше временно показать устаревшую корзину.\n\nТехнологии: DynamoDB с eventual consistency + session affinity для read-your-own-writes.' },
        { type: 'tip', value: 'Золотое правило: сначала спросите "что хуже: получить ошибку или устаревшие данные?" Если ошибка хуже — AP. Если устаревшие данные хуже — CP.' }
      ]
    }
  ]
}
