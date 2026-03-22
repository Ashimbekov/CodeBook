export default {
  id: 11,
  title: 'Ограничения и индексы',
  description: 'Обеспечение целостности данных: PRIMARY KEY, FOREIGN KEY, UNIQUE, CHECK, NOT NULL. Индексы для ускорения запросов: B-tree, GIN, GiST и стратегии индексирования.',
  lessons: [
    {
      id: 1,
      title: 'PRIMARY KEY: уникальный идентификатор',
      type: 'theory',
      content: [
        { type: 'text', value: 'PRIMARY KEY — фундаментальное ограничение. Автоматически создаёт уникальный индекс и NOT NULL. Каждая таблица должна иметь PK.' },
        { type: 'code', language: 'sql', value: '-- Простой PK: один столбец\nCREATE TABLE users (\n    id SERIAL PRIMARY KEY,\n    -- Или:\n    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY\n);\n\n-- Составной PK: несколько столбцов\nCREATE TABLE order_items (\n    order_id   INTEGER,\n    product_id INTEGER,\n    quantity   INTEGER,\n    PRIMARY KEY (order_id, product_id)  -- Пара уникальна\n);\n\n-- Добавить PK к существующей таблице\nALTER TABLE old_table ADD PRIMARY KEY (id);\n\n-- UUID как PK (популярно в распределённых системах)\nCREATE EXTENSION IF NOT EXISTS pgcrypto;\nCREATE TABLE events (\n    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n    name VARCHAR(200)\n);\n\n-- Выбор PK:\n-- SERIAL/BIGSERIAL: просто, быстро, компактно, но предсказуемо\n-- UUID: глобально уникальный, но больше (16 байт vs 8), медленнее для JOIN\n-- ULID, KSUID: компромисс (UUID + сортируемость по времени)' },
        { type: 'list', items: [
          'PRIMARY KEY автоматически создаёт уникальный B-tree индекс и добавляет NOT NULL',
          'Каждая таблица должна иметь PRIMARY KEY — без него невозможна репликация и UPDATE по строке',
          'SERIAL = INTEGER + последовательность, BIGSERIAL = BIGINT + последовательность',
          'GENERATED ALWAYS AS IDENTITY — стандарт SQL, предпочтительнее SERIAL в новом коде',
          'UUID как PK: плюс — глобальная уникальность; минус — фрагментация B-tree, 16 байт vs 8'
        ]},
        { type: 'tip', value: 'Для новых таблиц используй: id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY. Это SQL-стандарт (ISO), работает во всех СУБД. SERIAL — PostgreSQL-специфика, хотя тоже работает отлично.' }
      ]
    },
    {
      id: 2,
      title: 'FOREIGN KEY: целостность связей',
      type: 'theory',
      content: [
        { type: 'text', value: 'FOREIGN KEY обеспечивает ссылочную целостность: значение во внешнем ключе должно существовать в referenced таблице. Предотвращает "висячие" ссылки.' },
        { type: 'code', language: 'sql', value: '-- Базовый FK\nCREATE TABLE orders (\n    id          SERIAL PRIMARY KEY,\n    user_id     INTEGER NOT NULL REFERENCES users(id),\n    -- Или явно:\n    user_id     INTEGER NOT NULL,\n    CONSTRAINT fk_orders_users FOREIGN KEY (user_id)\n        REFERENCES users(id)\n);\n\n-- Что происходит при удалении родительской записи?\n\n-- ON DELETE RESTRICT (по умолчанию): запрещает удаление если есть дочерние\nREFERENCES users(id) ON DELETE RESTRICT\n\n-- ON DELETE CASCADE: удаляет все дочерние записи\nREFERENCES users(id) ON DELETE CASCADE\n-- Удалил пользователя -> все его заказы тоже удалены!\n\n-- ON DELETE SET NULL: FK становится NULL\nREFERENCES users(id) ON DELETE SET NULL\n-- Удалил пользователя -> orders.user_id = NULL\n\n-- ON DELETE SET DEFAULT: FK устанавливается в DEFAULT\nREFERENCES users(id) ON DELETE SET DEFAULT\n\n-- ON UPDATE CASCADE: обновляет FK при изменении PK\nREFERENCES users(id) ON UPDATE CASCADE\n\n-- Отложенные (deferred) ограничения\nCONSTRAINT fk_order_user FOREIGN KEY (user_id)\n    REFERENCES users(id)\n    DEFERRABLE INITIALLY DEFERRED;\n-- Проверяется при COMMIT, а не сразу' },
        { type: 'tip', value: 'Всегда создавай индекс на столбцах FK! PostgreSQL автоматически создаёт индекс для PK и UNIQUE, но НЕ для FK. Добавь: CREATE INDEX idx_orders_user_id ON orders(user_id);' }
      ]
    },
    {
      id: 3,
      title: 'UNIQUE и CHECK ограничения',
      type: 'theory',
      content: [
        { type: 'text', value: 'UNIQUE гарантирует уникальность значения в столбце. CHECK задаёт произвольное условие для значений.' },
        { type: 'code', language: 'sql', value: '-- UNIQUE на один столбец\nCREATE TABLE users (\n    email    VARCHAR(255) UNIQUE NOT NULL,\n    username VARCHAR(50)  UNIQUE NOT NULL\n);\n\n-- UNIQUE на несколько столбцов (уникальна комбинация)\nCREATE TABLE user_roles (\n    user_id INTEGER,\n    role    VARCHAR(50),\n    UNIQUE (user_id, role)  -- Один пользователь не может иметь одну роль дважды\n);\n\n-- Именованное UNIQUE ограничение\nCREATE TABLE products (\n    sku VARCHAR(100),\n    CONSTRAINT uq_products_sku UNIQUE (sku)\n);\n\n-- CHECK: произвольное условие\nCREATE TABLE employees (\n    salary    DECIMAL(10, 2) CHECK (salary > 0),\n    hire_date DATE,\n    end_date  DATE,\n    CHECK (end_date IS NULL OR end_date > hire_date),  -- Конец после начала\n    age       INTEGER CHECK (age BETWEEN 18 AND 100)\n);\n\n-- CHECK с функцией\nCREATE TABLE orders (\n    status VARCHAR(20)\n        CHECK (status IN (\'pending\', \'paid\', \'shipped\', \'delivered\', \'cancelled\')),\n    phone  VARCHAR(20)\n        CHECK (phone ~ \'^\\\\+?[0-9]{10,15}$\')  -- Regex проверка\n);\n\n-- Добавить ограничение к существующей таблице\nALTER TABLE products ADD CONSTRAINT ck_price_positive CHECK (price > 0);\nALTER TABLE users ADD CONSTRAINT uq_phone UNIQUE (phone);' },
        { type: 'list', items: [
          'UNIQUE автоматически создаёт индекс — запросы WHERE email = ... будут быстрыми',
          'UNIQUE на несколько столбцов: уникальна комбинация, каждый столбец по отдельности может повторяться',
          'CHECK с NULL: CHECK (salary > 0) пропускает NULL — добавь NOT NULL для полного ограничения',
          'Именованные ограничения (CONSTRAINT имя) дают понятные сообщения об ошибках',
          'CHECK с регулярным выражением (~): мощная валидация форматов прямо в БД'
        ]},
        { type: 'tip', value: 'Именуй ограничения по шаблону: uq_{таблица}_{столбец} для UNIQUE, ck_{таблица}_{поле} для CHECK, fk_{таблица}_{ссылка} для FK. При нарушении PostgreSQL выдаст понятное сообщение: "нарушено ограничение uq_users_email".' }
      ]
    },
    {
      id: 4,
      title: 'Индексы: ускорение SELECT',
      type: 'theory',
      content: [
        { type: 'text', value: 'Индекс — структура данных позволяющая СУБД быстро находить строки без полного сканирования таблицы. B-tree индекс — самый распространённый тип.' },
        { type: 'code', language: 'sql', value: '-- Создание B-tree индекса (по умолчанию)\nCREATE INDEX idx_users_email ON users(email);\nCREATE INDEX idx_orders_user_id ON orders(user_id);  -- Для FK!\nCREATE INDEX idx_orders_created_at ON orders(created_at);\n\n-- Составной индекс: порядок важен!\n-- Ускоряет: WHERE user_id = X, WHERE user_id = X AND status = Y\n-- НЕ ускоряет: WHERE status = Y (нет user_id слева)\nCREATE INDEX idx_orders_user_status ON orders(user_id, status);\n\n-- Уникальный индекс (то же что UNIQUE ограничение)\nCREATE UNIQUE INDEX idx_users_email_unique ON users(email);\n\n-- Частичный индекс: индексировать только подмножество строк\n-- Если 90% заказов completed — индекс только на активные\nCREATE INDEX idx_orders_pending ON orders(created_at)\nWHERE status IN (\'pending\', \'paid\');\n\n-- Функциональный индекс\nCREATE INDEX idx_users_email_lower ON users(LOWER(email));\n-- Теперь работает: WHERE LOWER(email) = \'user@mail.ru\'\n\n-- GIN индекс для JSONB\nCREATE INDEX idx_products_attrs ON products USING GIN(attributes);\n-- Ускоряет: WHERE attributes @> \'{"color": "red"}\'\n\n-- Индекс для LIKE с % в конце (не в начале!)\nCREATE INDEX idx_products_name ON products(name varchar_pattern_ops);\n-- WHERE name LIKE \'iPhone%\' будет использовать индекс' },
        { type: 'note', value: 'Индексы ускоряют SELECT но замедляют INSERT/UPDATE/DELETE — нужно поддерживать индексную структуру. Не добавляй индекс на каждый столбец!' }
      ]
    },
    {
      id: 5,
      title: 'EXPLAIN: анализ использования индексов',
      type: 'theory',
      content: [
        { type: 'text', value: 'EXPLAIN показывает план выполнения запроса. EXPLAIN ANALYZE реально выполняет запрос и показывает фактическое время.' },
        { type: 'code', language: 'sql', value: '-- Посмотреть план запроса\nEXPLAIN\nSELECT * FROM orders WHERE user_id = 1;\n\n-- С реальным выполнением\nEXPLAIN ANALYZE\nSELECT * FROM orders WHERE user_id = 1;\n\n-- Что смотреть в EXPLAIN:\n-- Seq Scan: последовательное сканирование (без индекса)\n-- Index Scan: использует индекс (хорошо!)\n-- Index Only Scan: данные берутся прямо из индекса (отлично!)\n-- Bitmap Index Scan: для нескольких условий\n-- Hash Join, Merge Join, Nested Loop: типы JOIN\n\n-- cost=0.00..8.27 rows=1 width=100\n-- cost=первая_строка..последняя_строка\n-- rows=оценочное количество строк\n-- width=средний размер строки в байтах\n\n-- Пример плохого запроса:\nEXPLAIN SELECT * FROM orders WHERE EXTRACT(YEAR FROM created_at) = 2024;\n-- Результат: Seq Scan (индекс на created_at не используется!)\n\n-- Лучше:\nEXPLAIN SELECT * FROM orders\nWHERE created_at >= \'2024-01-01\' AND created_at < \'2025-01-01\';\n-- Результат: Index Scan using idx_orders_created_at' },
        { type: 'list', items: [
          'EXPLAIN без ANALYZE — оценка стоимости без выполнения запроса',
          'EXPLAIN ANALYZE — реально выполняет запрос и показывает фактическое время',
          'Seq Scan — полное сканирование таблицы; Index Scan — использование индекса',
          'Index Only Scan — самый быстрый: все нужные данные есть в индексе, таблица не читается',
          'Функции в WHERE (EXTRACT, LOWER, YEAR) обычно предотвращают использование индекса — используй диапазоны'
        ]},
        { type: 'note', value: 'EXPLAIN (ANALYZE, BUFFERS) показывает использование кэша страниц: hits (данные уже в памяти) и reads (чтение с диска). Это помогает найти запросы с чрезмерными чтениями с диска.' }
      ]
    },
    {
      id: 6,
      title: 'Стратегии индексирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильный выбор столбцов для индексирования — искусство. Слишком мало — медленные запросы, слишком много — медленные вставки.' },
        { type: 'code', language: 'sql', value: '-- Правило: создавай индекс если:\n-- 1. Столбец в WHERE, JOIN ON, ORDER BY\n-- 2. Таблица большая (> 1000 строк)\n-- 3. Запрос возвращает < 20% строк\n\n-- ВСЕГДА индексируй:\n-- 1. Внешние ключи (FK)\nCREATE INDEX idx_orders_user_id ON orders(user_id);\nCREATE INDEX idx_orders_product_id ON orders(product_id);\n\n-- 2. Поля поиска и фильтрации\nCREATE INDEX idx_users_email ON users(email);\nCREATE INDEX idx_products_sku ON products(sku);\n\n-- 3. Поля часто используемые в ORDER BY\nCREATE INDEX idx_orders_created_at ON orders(created_at DESC);\n\n-- Когда НЕ нужен индекс:\n-- Таблицы с < 1000 строк\n-- Столбцы с малым количеством уникальных значений (status: 5 значений)\n-- Столбцы редко используемые в WHERE\n\n-- CONCURRENT: создание без блокировки таблицы\nCREATE INDEX CONCURRENTLY idx_users_phone ON users(phone);\n-- Медленнее но не блокирует INSERT/UPDATE/DELETE\n\n-- Просмотр индексов таблицы\nSELECT indexname, indexdef\nFROM pg_indexes\nWHERE tablename = \'orders\';\n\n-- Размер индекса\nSELECT\n    indexname,\n    pg_size_pretty(pg_relation_size(indexname::regclass)) AS size\nFROM pg_indexes\nWHERE tablename = \'orders\';' },
        { type: 'list', items: [
          'Правило 20%: индекс эффективен если запрос возвращает менее 20% строк таблицы',
          'CREATE INDEX CONCURRENTLY — создание без блокировки, обязательно для продакшн-БД',
          'Каждый индекс замедляет INSERT/UPDATE/DELETE и занимает место — не добавляй лишних',
          'Столбцы с низкой кардинальностью (status, is_active) — плохие кандидаты для обычного индекса',
          'pg_indexes — системная таблица PostgreSQL со всеми индексами, pg_stat_user_indexes — со статистикой использования'
        ]},
        { type: 'tip', value: 'Аудит неиспользуемых индексов: SELECT schemaname, relname, indexrelname FROM pg_stat_user_indexes WHERE idx_scan = 0. Индекс с idx_scan = 0 никогда не использовался — удали его, он только замедляет запись.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Оптимизация схемы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Добавь ограничения и индексы к схеме интернет-магазина.',
      requirements: [
        'Добавь все необходимые FK ограничения к существующим таблицам',
        'Добавь индексы на все FK столбцы',
        'Добавь частичный индекс только для активных заказов (status NOT IN cancelled)',
        'Добавь функциональный индекс для поиска товаров по имени без учёта регистра',
        'Добавь ограничение CHECK для поля status в orders',
        'Использую EXPLAIN ANALYZE: сравни план до и после добавления индекса'
      ],
      hint: 'Частичный индекс: CREATE INDEX idx_active_orders ON orders(created_at) WHERE status != "cancelled". EXPLAIN ANALYZE перед индексом должен показать Seq Scan, после — Index Scan.',
      expectedOutput: 'Ограничения добавлены:\nALTER TABLE products ADD CONSTRAINT chk_price CHECK (price > 0) -- OK\nALTER TABLE orders ADD CONSTRAINT chk_status CHECK (status IN (\'pending\',\'completed\',\'cancelled\')) -- OK\nALTER TABLE customers ADD CONSTRAINT uq_email UNIQUE (email) -- OK\n\nТест ограничений:\nINSERT продукт с price=-100 => ERROR: новое значение строки нарушает ограничение-проверку "chk_price"\nINSERT заказ со статусом "shipped" => ERROR: нарушено ограничение-проверку "chk_status"\n\nИндексы созданы:\nCREATE INDEX idx_products_category -- OK\nCREATE INDEX idx_orders_status_created -- OK\nCREATE UNIQUE INDEX idx_customers_email -- OK\nCREATE INDEX idx_active_orders ON orders(created_at) WHERE status != \'cancelled\' -- OK\n\nEXPLAIN ANALYZE до индекса:\n-> Seq Scan on orders  (cost=0.00..450.00 rows=10000 width=80) (actual time=0.050..12.350 rows=8500)\n\nEXPLAIN ANALYZE после индекса:\n-> Index Scan using idx_active_orders on orders  (cost=0.29..8.30 rows=1 width=80) (actual time=0.030..0.040 rows=1)',
      solution: '-- FK индексы (обязательны!)\nCREATE INDEX idx_orders_customer_id   ON orders(customer_id);\nCREATE INDEX idx_order_items_order_id ON order_items(order_id);\nCREATE INDEX idx_order_items_product  ON order_items(product_id);\nCREATE INDEX idx_products_category    ON products(category_id);\nCREATE INDEX idx_categories_parent    ON categories(parent_id);\n\n-- Индекс для поиска заказов по дате\nCREATE INDEX idx_orders_created_at ON orders(created_at DESC);\n\n-- Частичный индекс: только активные заказы\nCREATE INDEX idx_active_orders_date ON orders(created_at DESC)\nWHERE status NOT IN (\'cancelled\', \'delivered\');\n\n-- Функциональный индекс для регистронезависимого поиска\nCREATE INDEX idx_products_name_lower ON products(LOWER(name));\n-- Теперь работает: WHERE LOWER(name) LIKE \'%iphone%\'\n\n-- Составной индекс для частого запроса (статус + дата)\nCREATE INDEX idx_orders_status_date ON orders(status, created_at DESC);\n\n-- Добавить CHECK если не был создан при CREATE TABLE\nALTER TABLE orders\nADD CONSTRAINT ck_orders_status\nCHECK (status IN (\'pending\', \'paid\', \'shipped\', \'delivered\', \'cancelled\'));\n\n-- Проверка плана запроса\nEXPLAIN ANALYZE\nSELECT *\nFROM orders\nWHERE customer_id = 1\n  AND status = \'pending\'\nORDER BY created_at DESC;\n\n-- Просмотр всех индексов\nSELECT\n    tablename,\n    indexname,\n    pg_size_pretty(pg_relation_size(indexname::regclass)) AS size\nFROM pg_indexes\nWHERE schemaname = \'public\'\nORDER BY pg_relation_size(indexname::regclass) DESC;',
      explanation: 'Правильная расстановка индексов критична: FK без индекса делает JOIN медленным. Частичный индекс на активные заказы меньше и быстрее полного. Функциональный индекс LOWER() нужен для кейс-инсенситив поиска.'
    }
  ]
}
