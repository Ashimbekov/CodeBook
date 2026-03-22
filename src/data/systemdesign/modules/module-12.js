export default {
  id: 12,
  title: 'Consensus алгоритмы',
  description: 'Raft и Paxos: как распределённые системы достигают согласия. Leader election, log replication, Byzantine Fault Tolerance.',
  lessons: [
    {
      id: 1,
      title: 'Проблема консенсуса в распределённых системах',
      type: 'theory',
      content: [
        { type: 'text', value: 'Консенсус — соглашение между несколькими узлами о едином значении. Звучит просто, но в условиях отказов узлов и сетевых разделений это нетривиальная задача.' },
        { type: 'heading', value: 'Задача консенсуса' },
        { type: 'text', value: 'Требования:\n1. Соглашение (Agreement): все корректные узлы принимают одно значение\n2. Валидность (Validity): принятое значение было предложено одним из узлов\n3. Завершимость (Termination): в конечном итоге все узлы принимают решение\n\nПримеры задач:\n- Leader Election: кто главный сервер?\n- Distributed Lock: кто держит lock?\n- Replikated Log: в каком порядке выполнять команды?\n- Distributed Config: какое значение конфигурации правильное?' },
        { type: 'heading', value: 'FLP Impossibility' },
        { type: 'text', value: 'Теорема Фишера-Линча-Патерсона (1985): невозможно создать детерминированный алгоритм консенсуса, который гарантирует:\n- Безопасность (Safety): никогда не согласиться на неправильное значение\n- Живучесть (Liveness): всегда достигать решения\n- При возможных отказах узлов\n\nНа практике: Paxos и Raft жертвуют живучестью (могут не прогрессировать при сбоях), но безопасность гарантируют всегда.' },
        { type: 'tip', value: 'Знать теорему FLP полезно для собеседования, но на практике важнее знать: Raft используется в etcd (Kubernetes), Paxos — в Google Spanner и Chubby. Понимание высокого уровня достаточно.' }
      ]
    },
    {
      id: 2,
      title: 'Paxos: первый алгоритм консенсуса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Paxos — алгоритм консенсуса Лесли Лэмпорта (1989). Теоретически элегантен, но сложен в понимании и реализации.' },
        { type: 'heading', value: 'Роли в Paxos' },
        { type: 'text', value: 'Proposer: предлагает значение\nAcceptor: принимает или отвергает предложения\nLearner: узнаёт о принятом значении\n\nОдин узел может выполнять несколько ролей.' },
        { type: 'heading', value: 'Фазы Paxos' },
        { type: 'text', value: 'Фаза 1 (Prepare):\n  Proposer выбирает уникальный номер n\n  Посылает Prepare(n) всем Acceptors\n  Acceptor: если n > уже обещанного → Promise(n, last_accepted)\n\nФаза 2 (Accept):\n  Если Proposer получил Promise от большинства (quorum):\n  Посылает Accept(n, value) всем Acceptors\n  Acceptor: если n >= обещанного → принимает значение\n\nФаза 3 (Commit):\n  Если Accept получен от большинства → значение принято\n  Уведомить Learners' },
        { type: 'heading', value: 'Multi-Paxos' },
        { type: 'text', value: 'Basic Paxos: один консенсус для одного значения.\nMulti-Paxos: серия консенсусов для лога команд (репликация стейт-машины).\n\nОптимизация: избрать стабильного Leader → Leader пропускает Фазу 1 для последующих записей. Только Leader может предлагать → нет конфликтов Proposer\'ов.' },
        { type: 'note', value: 'Paxos очень сложно правильно реализовать. Лэмпорт сам написал "Paxos Made Simple" и "Paxos Made Live" признавая эту сложность. Поэтому создали Raft — специально для понятности.' }
      ]
    },
    {
      id: 3,
      title: 'Raft: понятный алгоритм консенсуса',
      type: 'theory',
      content: [
        { type: 'text', value: 'Raft создан в 2014 (Диего Ongaro, John Ousterhout) с явной целью быть понятнее Paxos. "Raft: In Search of an Understandable Consensus Algorithm."' },
        { type: 'heading', value: 'Роли в Raft' },
        { type: 'text', value: 'Leader: принимает все запросы, реплицирует лог, отправляет heartbeat\nFollower: пассивный, отвечает на запросы Leader\nCandidate: пытается стать Leader\n\nПереходы:\n  Все начинают как Followers\n  Если нет heartbeat → становится Candidate\n  Candidate → Leader при получении большинства голосов\n  Leader → Follower при обнаружении более нового term' },
        { type: 'heading', value: 'Leader Election (Выборы лидера)' },
        { type: 'text', value: 'Алгоритм:\n1. Follower не получает heartbeat → election timeout (случайный: 150–300 мс)\n2. Становится Candidate, инкрементирует term, голосует за себя\n3. Посылает RequestVote(term, lastLogIndex) всем узлам\n4. Узел голосует если: запрашиваемый term > текущего и лог не устарел\n5. Если получил большинство голосов → становится Leader\n6. Leader сразу шлёт heartbeat, чтобы остановить другие выборы\n\nСлучайный timeout: предотвращает split vote (все стартуют одновременно).' },
        { type: 'heading', value: 'Log Replication (Репликация лога)' },
        { type: 'text', value: 'Клиент: записать команду "SET x = 5"\nLeader добавляет в свой лог: [index=5, term=2, cmd="SET x = 5"]\nLeader посылает AppendEntries всем Followers\nBольшинство подтвердило → commit (применить к стейт-машине)\nLeader отвечает клиенту: "success"\nВ следующем AppendEntries уведомляет Followers о commit\nFollowers применяют команду к своей стейт-машине' }
      ]
    },
    {
      id: 4,
      title: 'Quorum: большинство голосов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Quorum — минимальное число узлов, необходимое для операции. Ключевая концепция для понимания fault tolerance в distributed системах.' },
        { type: 'heading', value: 'Формула Quorum' },
        { type: 'text', value: 'Для кластера из N узлов:\nQuorum = N/2 + 1 (floor)\n\n3 узла: quorum = 2 (большинство из 3)\n  Выдерживает 1 отказ: 3-1=2 = quorum\n\n5 узлов: quorum = 3\n  Выдерживает 2 отказа: 5-2=3 = quorum\n\n7 узлов: quorum = 4\n  Выдерживает 3 отказа: 7-3=4 = quorum\n\nОбщее правило: N = 2f+1 выдерживает f отказов.' },
        { type: 'heading', value: 'Почему нечётное число узлов' },
        { type: 'text', value: '4 узла:\n  Quorum = 3 (floor(4/2)+1)\n  Выдерживает 1 отказ: 4-1=3 = quorum\n  Выдерживает 2 отказа: 4-2=2 < quorum → нет!\n\n3 узла vs 4 узла:\n  Оба выдерживают только 1 отказ\n  Но 4-узловой кластер сложнее!\n  Вывод: 4 > 3 только по стоимости\n\nЭто объясняет, почему ZooKeeper, etcd, Raft кластеры рекомендуют 3 или 5 узлов (не 4, не 6).' },
        { type: 'tip', value: 'DynamoDB/Cassandra используют гибкий quorum: R + W > N (read quorum + write quorum > total nodes). Например N=3, W=2, R=2: при каждой записи подтверждают 2 ноды, при чтении читают с 2 нод → всегда пересечение ≥ 1 нода имеет актуальные данные.' }
      ]
    },
    {
      id: 5,
      title: 'Применение consensus алгоритмов на практике',
      type: 'practice',
      solution: 'Где используются consensus алгоритмы в реальных системах:\n\netcd (Kubernetes): Raft-консенсус, хранит весь cluster state (pods, configmaps, secrets). CP система — при потере quorum Kubernetes "замораживается". Типичный кластер: 3 или 5 нод.\n\nApache ZooKeeper (ZAB протокол): Leader Election в Kafka и HDFS, Distributed Locks, Service Discovery, конфигурации. До Kafka 3.x — обязательная зависимость.\n\nKafka KRaft (с версии 2.8): собственный Raft-like consensus вместо ZooKeeper, упрощает deployment.\n\nGoogle Chubby (Paxos): distributed lock service для leader election в Google internal systems.\n\nGoogle Spanner: Paxos для репликации + TrueTime API для глобальной согласованности транзакций через несколько датацентров.\n\nВывод: CP задачи (конфигурация кластера, distributed locks, leader election) → etcd/ZooKeeper с consensus алгоритмами.',
      explanation: 'На System Design интервью достаточно знать: etcd/ZooKeeper используют consensus и дают strong consistency (CP). Для Kubernetes state и distributed locks — единственный правильный выбор. Детали Raft (election timeout, log replication) нужны только если прямо спрашивают про алгоритм.',
      content: [
        { type: 'text', value: 'Где в реальных системах используются consensus алгоритмы.' },
        { type: 'heading', value: 'etcd и Kubernetes' },
        { type: 'text', value: 'etcd — distributed key-value хранилище, использует Raft.\nКубернетес хранит весь cluster state в etcd:\n  Какие pods запущены, на каких нодах\n  Конфигурации (ConfigMaps, Secrets)\n  Service endpoints\n\nТребование: строгая согласованность (CP). Лучше ошибка, чем неверное состояние кластера.\n\nЕсли etcd кластер теряет quorum (например, 2 из 3 нод недоступны) → Kubernetes "замораживается", новые изменения не принимаются.' },
        { type: 'heading', value: 'ZooKeeper' },
        { type: 'text', value: 'Apache ZooKeeper использует ZAB (ZooKeeper Atomic Broadcast, похож на Paxos).\nИспользуется для:\n- Leader Election в Kafka, HDFS\n- Distributed Locks\n- Service Discovery\n- Конфигурации\n\nKafka версий до 2.8 требовал ZooKeeper, теперь перешёл на KRaft (Kafka Raft).' },
        { type: 'heading', value: 'Google Spanner и Chubby' },
        { type: 'text', value: 'Chubby (Google): distributed lock service на основе Paxos. Используется для leader election в Google\'s internal systems.\n\nSpanner (Google): globally distributed database. Использует Paxos для репликации, TrueTime API для глобальной согласованности транзакций.' },
        { type: 'note', value: 'На System Design интервью: знать, что ZooKeeper/etcd используют consensus алгоритмы и обеспечивают strong consistency. Не нужно объяснять детали Raft, если не спрашивают. Достаточно сказать "etcd использует Raft для consensus".' }
      ]
    },
    {
      id: 6,
      title: 'Byzantine Fault Tolerance (BFT)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Raft и Paxos предполагают, что узлы могут отказывать, но не лгать. Byzantine Fault Tolerance — защита от злонамеренных или коррумпированных узлов.' },
        { type: 'heading', value: 'Задача Византийских Генералов' },
        { type: 'text', value: 'Несколько армий осаждают город. Генералы общаются через вестников.\nНекоторые генералы могут быть предателями — посылают противоречивые приказы.\nКак честные генералы достигнут согласия об атаке?\n\nВ IT-системах: "предатели" = взломанные или неисправные узлы, отправляющие поддельные данные.' },
        { type: 'heading', value: 'BFT требования' },
        { type: 'text', value: 'Для t Byzantine (злонамеренных) узлов:\nНужно минимум N = 3t + 1 узлов для достижения consensus.\n\nДля 1 предателя: нужно 4 узла (3*1+1=4)\nДля 10 предателей: нужно 31 узел\n\nЭто дорого! Поэтому BFT редко используется в традиционных distributed системах.' },
        { type: 'heading', value: 'Применение BFT' },
        { type: 'text', value: 'Blockchain: Bitcoin, Ethereum используют Proof-of-Work/Proof-of-Stake — форма BFT для публичных, недоверенных сетей.\n\nПрактический BFT (pBFT): используется в permissioned blockchains (Hyperledger Fabric).\n\nАвтопилоты самолётов: несколько независимых систем управления, результат = голосование.' },
        { type: 'tip', value: 'Для обычных System Design интервью BFT не нужен. Упомяните его только если обсуждаете blockchain или публичные распределённые системы с недоверенными узлами.' }
      ]
    }
  ]
}
