export default {
  id: 5,
  title: 'Базы данных: SQL vs NoSQL',
  description: 'Реляционные vs нереляционные БД. ACID vs BASE. CAP теорема. Когда выбирать SQL, когда NoSQL. Виды NoSQL: документные, key-value, колоночные, графовые.',
  lessons: [
    {
      id: 1,
      title: 'SQL: реляционные базы данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реляционные базы данных (RDBMS) хранят данные в таблицах со строгой схемой. Связи между таблицами определены через внешние ключи. SQL — язык запросов.' },
        { type: 'heading', value: 'Сильные стороны SQL' },
        { type: 'list', value: [
          'ACID транзакции: гарантия целостности данных',
          'Сложные запросы: JOIN нескольких таблиц, агрегации',
          'Зрелость: десятилетия оптимизаций и инструментов',
          'Структурированные данные с четкими связями',
          'Строгая схема: ошибки типов обнаруживаются на уровне БД'
        ]},
        { type: 'heading', value: 'Ограничения SQL' },
        { type: 'list', value: [
          'Горизонтальное масштабирование сложно (шардирование требует усилий)',
          'Жёсткая схема: изменение структуры таблицы — сложная операция (ALTER TABLE)',
          'Плохо справляется с неструктурированными данными',
          'При очень высоком числе записей JOIN-ы становятся дорогими'
        ]},
        { type: 'heading', value: 'Когда использовать SQL' },
        { type: 'list', value: [
          'Финансовые системы: транзакции критически важны',
          'ERP/CRM: сложные связи между сущностями',
          'Данные с чёткой структурой и схемой',
          'Нужны сложные запросы с агрегациями и JOIN',
          'Команда хорошо знает SQL'
        ]},
        { type: 'note', value: 'Популярные SQL БД: PostgreSQL (мощный, open-source, рекомендован для новых проектов), MySQL (популярен в web), Oracle/SQL Server (enterprise), SQLite (встраиваемая).' }
      ]
    },
    {
      id: 2,
      title: 'NoSQL: виды и применения',
      type: 'theory',
      content: [
        { type: 'text', value: 'NoSQL — "Not Only SQL". Семейство БД с разными моделями данных, оптимизированных для конкретных задач.' },
        { type: 'heading', value: 'Key-Value хранилища' },
        { type: 'text', value: 'Примеры: Redis, DynamoDB, Memcached\nМодель: словарь key → value\nПлюсы: максимальная скорость, O(1) для get/set\nМинусы: нет сложных запросов\nПрименение: сессии, кеш, счётчики, feature flags' },
        { type: 'heading', value: 'Документные БД' },
        { type: 'text', value: 'Примеры: MongoDB, CouchDB, Firestore\nМодель: коллекции документов (JSON/BSON)\nПлюсы: гибкая схема, хорошо для иерархических данных\nМинусы: сложно делать JOIN между документами\nПрименение: каталоги товаров, профили пользователей, контент-менеджмент' },
        { type: 'heading', value: 'Колоночные БД (Wide Column)' },
        { type: 'text', value: 'Примеры: Cassandra, HBase, Google Bigtable\nМодель: строки с динамическими колонками\nПлюсы: огромные объёмы данных, отличная запись, горизонтальное масштабирование\nМинусы: нет JOIN, нет транзакций\nПрименение: IoT данные, временные ряды, логи, activity feeds' },
        { type: 'heading', value: 'Графовые БД' },
        { type: 'text', value: 'Примеры: Neo4j, Amazon Neptune\nМодель: вершины (nodes) и рёбра (edges)\nПлюсы: эффективные запросы по связям\nМинусы: специализированный язык, сложнее масштабировать\nПрименение: социальные графы, рекомендательные системы, fraud detection' }
      ]
    },
    {
      id: 3,
      title: 'ACID: гарантии транзакций в SQL',
      type: 'theory',
      content: [
        { type: 'text', value: 'ACID — аббревиатура четырёх свойств, которые гарантируют надёжность транзакций в реляционных БД.' },
        { type: 'heading', value: 'A — Atomicity (Атомарность)' },
        { type: 'text', value: 'Транзакция выполняется целиком или не выполняется совсем. Нет "наполовину выполненных" операций.\n\nПример: перевод денег с счёта A на счёт B:\n  BEGIN TRANSACTION\n    UPDATE accounts SET balance = balance - 100 WHERE id = A\n    UPDATE accounts SET balance = balance + 100 WHERE id = B\n  COMMIT\n\nЕсли второй UPDATE упал → откат (ROLLBACK) обоих изменений. Деньги не пропадут.' },
        { type: 'heading', value: 'C — Consistency (Согласованность)' },
        { type: 'text', value: 'После транзакции БД переходит из одного корректного состояния в другое. Все ограничения (constraints) соблюдены.\n\nПример: баланс не может быть отрицательным. Если транзакция нарушает это — БД откатит её.' },
        { type: 'heading', value: 'I — Isolation (Изолированность)' },
        { type: 'text', value: 'Параллельные транзакции не видят незакоммиченных изменений друг друга. Уровни изоляции:\n- Read Uncommitted: видит грязные данные (редко используется)\n- Read Committed: видит только закоммиченные (стандарт PostgreSQL)\n- Repeatable Read: одни и те же данные при повторном чтении\n- Serializable: полная изоляция (медленнее, но безопаснее)' },
        { type: 'heading', value: 'D — Durability (Долговечность)' },
        { type: 'text', value: 'После COMMIT данные сохранены навсегда, даже при сбое сервера. Достигается через WAL (Write-Ahead Log): изменения сначала пишутся в журнал на диск.' },
        { type: 'tip', value: 'ACID — это то, за что мы платим ценой производительности. Для высоконагруженных систем иногда выбирают NoSQL с BASE-гарантиями, жертвуя строгой согласованностью ради скорости.' }
      ]
    },
    {
      id: 4,
      title: 'BASE: модель согласованности NoSQL',
      type: 'theory',
      content: [
        { type: 'text', value: 'BASE — противоположность ACID. Модель, принятая в большинстве NoSQL систем, ориентированных на доступность и масштабируемость.' },
        { type: 'heading', value: 'B — Basically Available (Базовая доступность)' },
        { type: 'text', value: 'Система гарантирует доступность, даже ценой возможных частичных отказов. Например, если 1 из 10 нод Cassandra недоступна — система всё равно отвечает, просто без данных с этой ноды.' },
        { type: 'heading', value: 'S — Soft State (Мягкое состояние)' },
        { type: 'text', value: 'Состояние системы может меняться со временем даже без новых входящих данных (из-за процессов eventual consistency).' },
        { type: 'heading', value: 'E — Eventually Consistent (Возможная согласованность)' },
        { type: 'text', value: 'Система в конечном итоге достигает согласованности, но не гарантирует мгновенной согласованности.\n\nПример DNS: вы изменили IP записи. Изменение распространяется по всем DNS-серверам за 24–48 часов. В течение этого времени разные пользователи видят разные IP.' },
        { type: 'heading', value: 'Пример Eventual Consistency в социальной сети' },
        { type: 'text', value: 'Instagram: вы обновили аватар. Где-то в мире пользователи ещё 1–2 секунды видят старый аватар — данные ещё не реплицировались. Это приемлемо: не нужна банковская точность.' },
        { type: 'note', value: 'BASE vs ACID — это trade-off: доступность vs согласованность. Для финансовых операций — ACID. Для лайков, счётчиков просмотров, социальных фидов — BASE вполне достаточно.' }
      ]
    },
    {
      id: 5,
      title: 'Когда выбирать SQL, когда NoSQL',
      type: 'practice',
      solution: 'Финансовая система (банк, платежи): PostgreSQL — ACID транзакции обязательны, сложные запросы агрегации, структурированные данные.\n\nСессии и кеш: Redis (Key-Value) — максимальная скорость, TTL, простые операции get/set.\n\nКаталог товаров с разными атрибутами: MongoDB (Document) — гибкая схема (телефон: {процессор, RAM}, одежда: {размер, цвет}), нет JOIN между документами.\n\nИстория сообщений мессенджера: Cassandra (Wide Column) — огромный объём записей (100B/день), append-only паттерн, шардирование по chat_id.\n\nСоциальный граф (рекомендации, друзья): Neo4j (Graph) — эффективные traversal запросы ("друзья друзей", "кто ещё купил это").\n\nТипичная комбинация: PostgreSQL + Redis + Cassandra для разных задач одной системы.',
      explanation: 'Выбор БД определяется тремя факторами: структура данных (нормализованная/иерархическая/граф), паттерн доступа (CRUD с JOIN / key-value / time-series / graph traversal) и требования к согласованности (ACID vs eventual). На интервью допустимо использовать несколько БД — это правильный ответ.',
      content: [
        { type: 'text', value: 'На интервью часто спрашивают: "Какую БД вы выберете и почему?" Вот практическое руководство.' },
        { type: 'heading', value: 'Выбор SQL' },
        { type: 'text', value: 'Используйте SQL (PostgreSQL/MySQL), если:\n- Данные структурированы и схема стабильна\n- Нужны сложные запросы и агрегации\n- Требуется строгая согласованность (банки, финансы, заказы)\n- Связи между сущностями сложные и важны\n- Команда хорошо знает SQL\n\nПримеры: банковское ПО, системы заказов, HR-системы, ERP' },
        { type: 'heading', value: 'Выбор Key-Value (Redis/DynamoDB)' },
        { type: 'text', value: 'Используйте, если:\n- Нужна максимальная скорость для простых операций\n- Данные модели: настройки пользователя, сессии, кеш\n- Нет сложных запросов\n\nПримеры: кеш, сессии, rate limiting, leaderboards, feature flags' },
        { type: 'heading', value: 'Выбор Document DB (MongoDB)' },
        { type: 'text', value: 'Используйте, если:\n- Гибкая/изменяемая схема (разные атрибуты у разных объектов)\n- Данные иерархические и хранятся вместе\n- Быстрые итерации, схема часто меняется\n\nПримеры: каталоги товаров с разными атрибутами, профили пользователей, CMS' },
        { type: 'heading', value: 'Выбор Wide Column (Cassandra)' },
        { type: 'text', value: 'Используйте, если:\n- Очень большой объём записей (млрд+ в день)\n- Данные временные ряды или append-only\n- Нужно глобальное географическое распределение\n\nПримеры: IoT телеметрия, история сообщений (как в Facebook Messenger), метрики' },
        { type: 'tip', value: 'На интервью можно выбрать несколько БД для разных задач в одной системе. Например: PostgreSQL для профилей и заказов + Redis для кеша и сессий + Cassandra для истории активности. Это нормально и правильно.' }
      ]
    },
    {
      id: 6,
      title: 'Индексы: как БД ускоряет поиск',
      type: 'theory',
      content: [
        { type: 'text', value: 'Индекс — вспомогательная структура данных для быстрого поиска. Как индекс в книге: не нужно перечитывать всё — сразу открываем нужную страницу.' },
        { type: 'heading', value: 'Как работает B-Tree индекс' },
        { type: 'text', value: 'Без индекса: SELECT * FROM users WHERE email = "alice@example.com"\n→ Full Table Scan: проверяем каждую строку → O(N)\n\nС индексом на поле email:\n→ B-Tree поиск: O(log N)\n\nПри 1 млн строк: 1,000,000 операций → 20 операций. В 50,000 раз быстрее!' },
        { type: 'heading', value: 'Типы индексов' },
        { type: 'text', value: 'B-Tree: для диапазонных запросов (>, <, BETWEEN, LIKE "prefix%")\nHash: для точных совпадений (=), быстрее B-Tree, но нет диапазонов\nGiST/GIN: для full-text search, JSON, геоданных\nComposite: по нескольким колонкам: INDEX(last_name, first_name)' },
        { type: 'heading', value: 'Цена индексов' },
        { type: 'text', value: 'Индексы ускоряют чтение, но замедляют запись. При INSERT/UPDATE/DELETE — нужно обновить все индексы.\n\nПравило: создавайте индексы по полям, которые:\n1. Часто используются в WHERE\n2. Часто используются для JOIN\n3. Часто используются для ORDER BY' },
        { type: 'note', value: 'Типичная ошибка: слишком много индексов. Если у таблицы 20 индексов, каждая вставка обновляет 20 B-деревьев. Производительность записи падает. Держите баланс: индексы только для реально используемых запросов.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: проектируем схему данных',
      type: 'practice',
      solution: 'Схема для системы бронирования авиабилетов (PostgreSQL):\n\nТаблица flights: id, origin, destination, departure_time, arrival_time, total_seats\nИндекс: (origin, destination, departure_time) для поиска рейсов\n\nТаблица seats: id, flight_id (FK), seat_number, class (ENUM), status (AVAILABLE/BOOKED)\nИндекс: (flight_id, status) для поиска свободных мест\n\nТаблица bookings: id, user_id (FK), seat_id (FK UNIQUE), payment_status, created_at\nUNIQUE на seat_id — гарантирует одно бронирование на место\n\nРешение конкурентного бронирования:\nBEGIN TRANSACTION → SELECT ... FOR UPDATE (pessimistic lock) → проверить status=AVAILABLE → UPDATE seats SET status=BOOKED → INSERT bookings → COMMIT\n\nFOR UPDATE блокирует строку — второй запрос ждёт, видит BOOKED и возвращает ошибку.',
      explanation: 'UNIQUE constraint на seat_id — защита на уровне БД от двойного бронирования. FOR UPDATE (pessimistic locking) работает при высокой конкуренции за одно место. Альтернатива — optimistic locking с version counter (лучше при редких конфликтах). Индексы подобраны под конкретные запросы: поиск рейсов и поиск свободных мест.',
      content: [
        { type: 'text', value: 'Спроектируем схему данных для реального сценария — системы бронирования билетов.' },
        { type: 'heading', value: 'Требования' },
        { type: 'text', value: '- Пользователи могут искать рейсы\n- Бронировать места\n- Оплачивать\n- Один пользователь = один билет на место\n- Конкурентные бронирования (несколько людей пытаются занять одно место)' },
        { type: 'heading', value: 'Схема БД (PostgreSQL)' },
        { type: 'text', value: 'Таблица flights:\n  id (PK), origin, destination, departure_time, arrival_time, total_seats\n  Индекс: (origin, destination, departure_time)\n\nТаблица seats:\n  id (PK), flight_id (FK), seat_number, class, status [AVAILABLE/BOOKED]\n  Индекс: (flight_id, status)\n\nТаблица bookings:\n  id (PK), user_id (FK), seat_id (FK UNIQUE), created_at, payment_status\n  UNIQUE на seat_id: гарантирует, что одно место = одно бронирование\n\nТаблица users:\n  id (PK), email (UNIQUE), name, phone' },
        { type: 'heading', value: 'Решение конкурентного бронирования' },
        { type: 'text', value: 'Псевдокод транзакции:\n\nBEGIN TRANSACTION\n  -- Заблокировать строку для обновления\n  seat = SELECT * FROM seats WHERE id = ? AND status = "AVAILABLE" FOR UPDATE\n  if seat is null: ROLLBACK, return "Место занято"\n  \n  UPDATE seats SET status = "BOOKED" WHERE id = seat.id\n  INSERT INTO bookings (user_id, seat_id, ...) VALUES (...)\nCOMMIT\n\nFOR UPDATE — pessimistic lock. Другие транзакции ждут, пока эта не завершится.' },
        { type: 'tip', value: 'FOR UPDATE (pessimistic locking) — просто и надёжно для бронирования. Альтернатива: optimistic locking с version counter — сначала читаем, потом обновляем только если версия не изменилась. Лучше при редких конфликтах.' }
      ]
    }
  ]
}
