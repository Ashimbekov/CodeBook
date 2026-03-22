export default {
  id: 10,
  title: 'CREATE TABLE и типы данных',
  description: 'Создание таблиц: полный синтаксис CREATE TABLE, выбор правильных типов данных, ALTER TABLE для изменения структуры и DROP TABLE.',
  lessons: [
    {
      id: 1,
      title: 'CREATE TABLE: полный синтаксис',
      type: 'theory',
      content: [
        { type: 'text', value: 'CREATE TABLE определяет структуру новой таблицы. Правильное проектирование схемы критично — её сложно менять когда в таблице уже есть данные.' },
        { type: 'code', language: 'sql', value: 'CREATE TABLE users (\n    -- Столбцы с типами\n    id          BIGSERIAL PRIMARY KEY,\n    email       VARCHAR(255) NOT NULL,\n    username    VARCHAR(50) NOT NULL,\n    password_hash TEXT NOT NULL,\n    full_name   VARCHAR(200),\n    birth_date  DATE,\n    is_active   BOOLEAN NOT NULL DEFAULT TRUE,\n    role        VARCHAR(20) NOT NULL DEFAULT \'user\',\n    balance     DECIMAL(15, 2) NOT NULL DEFAULT 0.00,\n    metadata    JSONB,\n    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n\n    -- Ограничения на уровне таблицы\n    CONSTRAINT uq_users_email    UNIQUE (email),\n    CONSTRAINT uq_users_username UNIQUE (username),\n    CONSTRAINT ck_users_role     CHECK (role IN (\'user\', \'admin\', \'moderator\')),\n    CONSTRAINT ck_users_balance  CHECK (balance >= 0)\n);\n\n-- CREATE TABLE IF NOT EXISTS: не падать если таблица уже есть\nCREATE TABLE IF NOT EXISTS categories (\n    id   SERIAL PRIMARY KEY,\n    name VARCHAR(100) UNIQUE NOT NULL\n);' },
        { type: 'list', items: [
          'Именуй ограничения явно (CONSTRAINT имя) — легче читать сообщения об ошибках',
          'DEFAULT для created_at: NOW() или CURRENT_TIMESTAMP — автоматическая метка времени',
          'IF NOT EXISTS — безопасное создание: не упадёт если таблица уже существует',
          'NOT NULL без DEFAULT — поле обязательно при INSERT (нельзя вставить без указания)',
          'Используй BIGSERIAL для таблиц где возможны миллионы строк, SERIAL — для небольших'
        ]},
        { type: 'tip', value: 'Шаблон хорошей таблицы: id BIGSERIAL PRIMARY KEY, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(). Эти три поля нужны почти всегда. Добавляй NOT NULL везде где NULL не имеет смысла.' }
      ]
    },
    {
      id: 2,
      title: 'Числовые типы данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выбор правильного числового типа влияет на точность вычислений и размер хранилища.' },
        { type: 'code', language: 'sql', value: '-- Целые числа (от меньшего к большему)\nSMALLINT              -- 2 байта: -32768 до 32767. Для status, count <= 32K\nINTEGER (INT)         -- 4 байта: -2.1B до 2.1B. Стандартный выбор\nBIGINT                -- 8 байт: ±9.2 * 10^18. Для id больших таблиц\n\n-- Автоинкрементные счётчики\nSERIAL       -- INTEGER + автоинкремент (устаревший стиль)\nBIGSERIAL   -- BIGINT + автоинкремент\nGENERATED ALWAYS AS IDENTITY   -- Современный стандарт SQL\n\n-- Пример современного автоинкремента:\nCREATE TABLE events (\n    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY\n);\n\n-- Десятичные числа\nDECIMAL(precision, scale)  -- Точное: precision цифр, scale после запятой\nNUMERIC(precision, scale)  -- То же самое\nREAL                        -- 4 байта, ~7 знаков (неточное!)\nDOUBLE PRECISION            -- 8 байт, ~15 знаков (неточное!)\n\n-- Для денег: DECIMAL(15, 2)\n-- $9,999,999,999,999.99 максимум\nCREATE TABLE payments (\n    amount   DECIMAL(15, 2) NOT NULL CHECK (amount > 0),\n    currency CHAR(3) NOT NULL DEFAULT \'KZT\'  -- ISO код: KZT, USD, EUR\n);\n\n-- Специальный тип MONEY (PostgreSQL)\nSELECT \'125.50\'::MONEY;  -- $125.50 (зависит от локали)' },
        { type: 'warning', value: 'Никогда не используй FLOAT или REAL для финансовых данных! 0.1 + 0.2 = 0.30000000000000004 в IEEE 754. Используй DECIMAL(n,2).' }
      ]
    },
    {
      id: 3,
      title: 'Строковые типы и TEXT',
      type: 'theory',
      content: [
        { type: 'text', value: 'PostgreSQL предоставляет несколько строковых типов. На практике TEXT или VARCHAR(n) — самые распространённые.' },
        { type: 'code', language: 'sql', value: '-- CHAR(n): фиксированная длина, дополняется пробелами\nCHAR(2)   -- ISO коды стран: \'KZ\', \'RU\', \'US\'\nCHAR(3)   -- ISO валюты: \'KZT\', \'USD\'\n\n-- VARCHAR(n): переменная длина до n символов\nVARCHAR(50)   -- username: уйгурский, казахский, латинские символы\nVARCHAR(255)  -- email\nVARCHAR(500)  -- title, name\n\n-- TEXT: без ограничения длины\n-- В PostgreSQL практически то же самое что VARCHAR без (n)\nTEXT  -- Для body, description, content, bio\n\n-- Разница в PostgreSQL:\n-- VARCHAR(n) и TEXT хранятся одинаково (TOAST для длинных строк)\n-- VARCHAR(n) добавляет проверку длины\n-- CHAR(n) дополняет пробелами — лишняя память!\n\n-- Рекомендация:\n-- Используй VARCHAR(n) когда длина логически ограничена (email <= 255)\n-- Используй TEXT для свободного текста\n-- Избегай CHAR(n) кроме фиксированных кодов (коды стран, валют)\n\n-- Пример реальной таблицы\nCREATE TABLE articles (\n    id         BIGSERIAL PRIMARY KEY,\n    slug       VARCHAR(200) UNIQUE NOT NULL,  -- URL-адрес\n    title      VARCHAR(500) NOT NULL,\n    excerpt    VARCHAR(300),                  -- Краткое описание\n    body       TEXT,                          -- Полный текст\n    author_id  BIGINT NOT NULL,\n    tags       TEXT[]                         -- Массив тегов\n);' },
        { type: 'list', items: [
          'TEXT и VARCHAR без ограничения — одинаковы в PostgreSQL, оба используют TOAST',
          'VARCHAR(n) — добавляет только проверку длины, не влияет на хранение',
          'CHAR(n) дополняет строки пробелами — занимает лишнее место, лучше избегать',
          'TEXT[] — массив строк в PostgreSQL, полезен для тегов, списков разрешений',
          'Для сравнения без учёта регистра используй LOWER() или тип citext'
        ]},
        { type: 'tip', value: 'Практическое правило: используй TEXT везде где нет жёсткого ограничения длины. Используй VARCHAR(n) для полей с логически ограниченной длиной (email: 255, slug: 200). Это самодокументирует схему.' }
      ]
    },
    {
      id: 4,
      title: 'Дата, время и UUID',
      type: 'theory',
      content: [
        { type: 'text', value: 'Типы даты и времени критичны для аудита и временных рядов. UUID используется как альтернатива SERIAL для распределённых систем.' },
        { type: 'code', language: 'sql', value: '-- Типы дата/время\nDATE              -- Только дата: 2024-03-21\nTIME              -- Только время без пояса: 14:30:00\nTIMETZ            -- Время с часовым поясом\nTIMESTAMP         -- Дата + время без пояса: 2024-03-21 14:30:00\nTIMESTAMPTZ       -- Дата + время с часовым поясом (рекомендуется!)\nINTERVAL          -- Промежуток: \'2 hours\', \'3 days\', \'1 year 2 months\'\n\n-- ВСЕГДА используй TIMESTAMPTZ для хранения моментов времени!\n-- PostgreSQL конвертирует при записи и чтении по часовому поясу сессии\n\nCREATE TABLE events (\n    id          SERIAL PRIMARY KEY,\n    title       VARCHAR(200),\n    starts_at   TIMESTAMPTZ NOT NULL,\n    ends_at     TIMESTAMPTZ NOT NULL,\n    created_at  TIMESTAMPTZ DEFAULT NOW(),\n    CONSTRAINT ck_event_dates CHECK (ends_at > starts_at)\n);\n\n-- UUID: уникальный идентификатор (128 бит)\nCREATE EXTENSION IF NOT EXISTS pgcrypto;  -- Для gen_random_uuid()\n\nCREATE TABLE sessions (\n    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n    user_id    BIGINT NOT NULL,\n    token      TEXT NOT NULL,\n    expires_at TIMESTAMPTZ NOT NULL\n);\n-- UUID: a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11\n-- Преимущество: уникален глобально, не раскрывает счётчик записей\n\n-- INTERVAL в запросах\nSELECT NOW() + INTERVAL \'30 days\' AS future_date;\nSELECT NOW() - INTERVAL \'1 year\' AS last_year;\nSELECT AGE(NOW(), birth_date) AS age FROM users;' },
        { type: 'list', items: [
          'TIMESTAMPTZ (timestamp with time zone) — всегда предпочтительнее TIMESTAMP для prodction',
          'TIMESTAMP хранит без часового пояса — при переездах сервера данные становятся некорректными',
          'UUID не раскрывает счётчик записей и уникален глобально — полезно для публичных API',
          'INTERVAL поддерживает арифметику: NOW() - INTERVAL \'7 days\' — запросы за последнюю неделю',
          'DATE — только для хранения дат без времени: дни рождения, даты документов'
        ]},
        { type: 'tip', value: 'Всегда используй TIMESTAMPTZ вместо TIMESTAMP. Разница: TIMESTAMP хранит "наивное" время без зоны, TIMESTAMPTZ конвертирует в UTC при записи и обратно в зону сессии при чтении. Это устраняет баги с часовыми поясами.' }
      ]
    },
    {
      id: 5,
      title: 'JSONB: полуструктурированные данные',
      type: 'theory',
      content: [
        { type: 'text', value: 'JSONB позволяет хранить JSON-документы в PostgreSQL с поддержкой индексов и запросов. JSON хранит текст, JSONB — бинарное дерево (быстрее для запросов).' },
        { type: 'code', language: 'sql', value: '-- Создание таблицы с JSONB\nCREATE TABLE products (\n    id         SERIAL PRIMARY KEY,\n    name       VARCHAR(200),\n    category   VARCHAR(50),\n    price      DECIMAL(10, 2),\n    attributes JSONB  -- { "color": "red", "size": "XL", "weight": 1.5 }\n);\n\n-- Вставка JSON\nINSERT INTO products (name, attributes)\nVALUES (\n    \'iPhone 15\',\n    \'{"color": "Titanium", "storage": "256GB", "5G": true, "weight": 187}\'::JSONB\n);\n\n-- Чтение JSON полей\nSELECT\n    name,\n    attributes->>\'color\'    AS color,   -- Строка (text)\n    attributes->\'weight\'    AS weight,  -- JSON значение\n    attributes->>\'storage\'  AS storage\nFROM products;\n\n-- WHERE по JSON полю\nSELECT * FROM products\nWHERE attributes->>\'color\' = \'Titanium\';\n\nSELECT * FROM products\nWHERE (attributes->>\'weight\')::numeric > 150;\n\n-- Вложенные JSON\nSELECT metadata->\'address\'->>\'city\' AS city\nFROM users;\n\n-- JSONB индекс (GIN)\nCREATE INDEX idx_products_attributes ON products USING GIN(attributes);\n\n-- Проверка наличия ключа: @>\nSELECT * FROM products WHERE attributes @> \'{"5G": true}\';' },
        { type: 'list', items: [
          'JSONB хранит данные в бинарном формате (быстрее для запросов), JSON — как текст (сохраняет порядок ключей)',
          'Оператор ->> возвращает text, -> возвращает JSONB-значение',
          'GIN-индекс для JSONB: ускоряет операторы @> (содержит), ? (ключ существует)',
          '@> (содержит): WHERE attributes @> \'{"5G": true}\' — JSONB-поиск по значению',
          'JSONB подходит для переменных атрибутов (характеристики товаров), но не для данных требующих JOIN'
        ]},
        { type: 'tip', value: 'JSONB vs отдельные столбцы: используй JSONB для необязательных, переменных атрибутов (характеристики товаров). Для обязательных данных с постоянной схемой (email, статус) — отдельные столбцы надёжнее и быстрее.' }
      ]
    },
    {
      id: 6,
      title: 'ALTER TABLE: изменение структуры',
      type: 'theory',
      content: [
        { type: 'text', value: 'ALTER TABLE позволяет изменить структуру существующей таблицы: добавить/удалить столбцы, изменить тип, добавить ограничения.' },
        { type: 'code', language: 'sql', value: '-- Добавить столбец\nALTER TABLE users ADD COLUMN phone VARCHAR(20);\nALTER TABLE users ADD COLUMN last_login TIMESTAMPTZ;\nALTER TABLE users ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE;\n\n-- Удалить столбец\nALTER TABLE users DROP COLUMN temporary_field;\nALTER TABLE users DROP COLUMN IF EXISTS old_field;  -- Без ошибки если нет\n\n-- Изменить тип столбца\nALTER TABLE products ALTER COLUMN price TYPE DECIMAL(15, 2);\n-- Конвертация типов:\nALTER TABLE users ALTER COLUMN age TYPE BIGINT USING age::BIGINT;\n\n-- Переименовать столбец\nALTER TABLE users RENAME COLUMN phone TO phone_number;\n\n-- Переименовать таблицу\nALTER TABLE user_info RENAME TO users;\n\n-- Изменить DEFAULT\nALTER TABLE products ALTER COLUMN stock SET DEFAULT 0;\nALTER TABLE products ALTER COLUMN discount DROP DEFAULT;\n\n-- Добавить/удалить NOT NULL\nALTER TABLE users ALTER COLUMN email SET NOT NULL;\nALTER TABLE users ALTER COLUMN bio DROP NOT NULL;\n\n-- DROP TABLE\nDROP TABLE IF EXISTS temp_data;\nDROP TABLE products CASCADE;  -- Удалит и зависимые объекты (FK)' },
        { type: 'warning', value: 'ALTER TABLE может заблокировать таблицу в продакшн! Добавление NOT NULL к большой таблице требует FULL TABLE SCAN. Используй поэтапные миграции: добавь DEFAULT, затем SET NOT NULL.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Схема для интернет-магазина',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируй и создай схему базы данных для интернет-магазина.',
      requirements: [
        'Таблица categories: id, name, parent_id (самоссылка для подкатегорий), slug',
        'Таблица products: id, name, description, price, stock, category_id (FK), sku (уникальный код), attributes (JSONB), created_at',
        'Таблица customers: id, email, name, phone, created_at',
        'Таблица orders: id, customer_id (FK), total_amount, status, shipping_address (JSONB), created_at',
        'Таблица order_items: order_id, product_id, quantity, unit_price, subtotal (вычисляемый)',
        'Добавь CHECK ограничения: price > 0, stock >= 0, quantity > 0'
      ],
      hint: 'subtotal как вычисляемый столбец: subtotal DECIMAL(15,2) GENERATED ALWAYS AS (quantity * unit_price) STORED. parent_id REFERENCES categories(id) — самоссылка.',
      expectedOutput: 'Схема создана. Таблицы в порядке зависимостей:\nCREATE TABLE categories -- OK\nCREATE TABLE products   -- OK\nCREATE TABLE customers  -- OK\nCREATE TABLE orders     -- OK\nCREATE TABLE order_items -- OK\n\n\\d order_items:\n Column      | Type           | Nullable | Default\n-------------+----------------+----------+---------\n id          | bigint         | not null | nextval\n order_id    | bigint         | not null |\n product_id  | bigint         | not null |\n quantity    | integer        | not null |\n unit_price  | numeric(15,2)  | not null |\n subtotal    | numeric(15,2)  |          | GENERATED ALWAYS AS (quantity * unit_price) STORED\n\nALTER TABLE categories ADD COLUMN description TEXT -- OK\nALTER TABLE products ADD COLUMN image_url VARCHAR(500) -- OK\nALTER TABLE products ALTER COLUMN price TYPE DECIMAL(15,2) -- OK\n\nDROP TABLE temp_test -- OK',
      solution: 'CREATE TABLE categories (\n    id        SERIAL PRIMARY KEY,\n    name      VARCHAR(100) NOT NULL,\n    slug      VARCHAR(100) UNIQUE NOT NULL,\n    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL\n);\n\nCREATE TABLE products (\n    id          BIGSERIAL PRIMARY KEY,\n    name        VARCHAR(300) NOT NULL,\n    description TEXT,\n    price       DECIMAL(12, 2) NOT NULL CHECK (price > 0),\n    stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),\n    sku         VARCHAR(100) UNIQUE NOT NULL,\n    category_id INTEGER REFERENCES categories(id),\n    attributes  JSONB,\n    is_active   BOOLEAN NOT NULL DEFAULT TRUE,\n    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nCREATE TABLE customers (\n    id         BIGSERIAL PRIMARY KEY,\n    email      VARCHAR(255) UNIQUE NOT NULL,\n    name       VARCHAR(200) NOT NULL,\n    phone      VARCHAR(20),\n    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nCREATE TABLE orders (\n    id               BIGSERIAL PRIMARY KEY,\n    customer_id      BIGINT NOT NULL REFERENCES customers(id),\n    total_amount     DECIMAL(15, 2) NOT NULL CHECK (total_amount >= 0),\n    status           VARCHAR(20) NOT NULL DEFAULT \'pending\'\n                         CHECK (status IN (\'pending\',\'paid\',\'shipped\',\'delivered\',\'cancelled\')),\n    shipping_address JSONB,\n    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nCREATE TABLE order_items (\n    id         BIGSERIAL PRIMARY KEY,\n    order_id   BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,\n    product_id BIGINT NOT NULL REFERENCES products(id),\n    quantity   INTEGER NOT NULL CHECK (quantity > 0),\n    unit_price DECIMAL(12, 2) NOT NULL CHECK (unit_price > 0),\n    subtotal   DECIMAL(15, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED\n);\n\n-- Индексы\nCREATE INDEX idx_products_category ON products(category_id);\nCREATE INDEX idx_orders_customer ON orders(customer_id);\nCREATE INDEX idx_order_items_order ON order_items(order_id);\nCREATE INDEX idx_orders_status ON orders(status);',
      explanation: 'Схема интернет-магазина: иерархические категории через self-reference, JSONB для shipping_address и product attributes, вычисляемый столбец subtotal, CHECK ограничения, CASCADE DELETE для order_items.'
    }
  ]
}
