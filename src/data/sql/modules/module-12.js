export default {
  id: 12,
  title: 'Нормализация баз данных',
  description: 'Теория нормализации: 1NF, 2NF, 3NF и BCNF. Устранение аномалий избыточности данных. Когда денормализовать для производительности.',
  lessons: [
    {
      id: 1,
      title: 'Что такое нормализация и зачем она нужна',
      type: 'theory',
      content: [
        { type: 'text', value: 'Нормализация — процесс организации таблиц для устранения избыточности и аномалий. Без нормализации возникают три типа аномалий: вставки, обновления и удаления.' },
        { type: 'code', language: 'sql', value: '-- Ненормализованная таблица заказов (проблемная схема):\n-- orders_bad:\n-- order_id | customer_name | customer_email       | product_names           | product_prices | total\n-- 1        | Алия          | aliya@mail.ru        | iPhone, Чехол           | 95000, 5000    | 100000\n-- 2        | Алия          | aliya@mail.ru        | MacBook                 | 180000         | 180000\n-- 3        | Нурлан        | nurlan@mail.ru       | iPhone                  | 95000          | 95000\n\n-- Аномалия вставки:\n-- Нельзя добавить клиента без заказа\n-- Нельзя добавить товар без заказа\n\n-- Аномалия обновления:\n-- Алия сменила email -> нужно обновить ВСЕ строки с её заказами\n-- UPDATE orders_bad SET customer_email = \'new@mail.ru\' WHERE customer_name = \'Алия\';\n-- Если забыть строку 2 -> данные противоречивы!\n\n-- Аномалия удаления:\n-- Удалить заказ 3 -> теряем информацию о товаре iPhone в этом контексте\n-- Если у Нурлана только один заказ -> удаление = потеря клиента\n\n-- Нормализованная схема (после 3NF):\n-- customers: id, name, email\n-- products:  id, name, price\n-- orders:    id, customer_id, total, created_at\n-- order_items: order_id, product_id, quantity, unit_price\n-- Все аномалии устранены!' }
      ]
    },
    {
      id: 2,
      title: '1NF: Первая нормальная форма',
      type: 'theory',
      content: [
        { type: 'text', value: 'Первая нормальная форма (1NF) требует: атомарные значения (нет массивов/списков в ячейке), уникальные строки (есть PRIMARY KEY), нет повторяющихся групп столбцов.' },
        { type: 'code', language: 'sql', value: '-- НАРУШЕНИЕ 1NF: неатомарные значения (список в одном поле)\n-- orders_bad:\n-- id | customer | products          | prices\n-- 1  | Алия     | iPhone,Чехол      | 95000,5000\n\n-- НАРУШЕНИЕ 1NF: повторяющиеся группы столбцов\n-- orders_bad:\n-- id | customer | product1  | price1 | product2 | price2\n-- 1  | Алия     | iPhone    | 95000  | Чехол    | 5000\n-- (Сколько product_N столбцов создать? 5? 10? Неизвестно!)\n\n-- Привести к 1NF: разбить на отдельные строки\n-- Было:\n-- 1 | Алия | iPhone,Чехол | 95000,5000\n\n-- Стало (1NF соблюдена):\nCREATE TABLE order_items_1nf (\n    order_id    INTEGER,\n    customer    VARCHAR(100),\n    product     VARCHAR(200),\n    price       DECIMAL(10, 2),\n    PRIMARY KEY (order_id, product)  -- Составной PK, строки уникальны\n);\n\n-- order_id | customer | product | price\n-- 1        | Алия     | iPhone  | 95000\n-- 1        | Алия     | Чехол   | 5000\n-- 2        | Нурлан   | iPhone  | 95000\n\n-- Теперь:\n-- ✓ Атомарные значения (одно значение в ячейке)\n-- ✓ Есть PRIMARY KEY (order_id, product)\n-- ✓ Нет повторяющихся групп\n\n-- НО: customer избыточен -> дублируется в каждой строке заказа\n-- Нужна 2NF!' },
        { type: 'tip', value: '1NF нарушается когда в одной ячейке хранится несколько значений: через запятую, JSON-массив, или серия столбцов product1/product2/product3.' }
      ]
    },
    {
      id: 3,
      title: '2NF: Вторая нормальная форма',
      type: 'theory',
      content: [
        { type: 'text', value: '2NF = 1NF + нет частичных зависимостей. Каждый неключевой столбец должен зависеть от ВСЕГО составного ключа, а не от его части. Актуально только при составном PK.' },
        { type: 'code', language: 'sql', value: '-- Таблица в 1NF (но НЕ в 2NF):\n-- order_items_1nf: (order_id, product_id, quantity, product_name, product_price)\n-- PRIMARY KEY: (order_id, product_id)\n\n-- Частичные зависимости (нарушение 2NF):\n-- product_name  зависит ТОЛЬКО от product_id (не от order_id!)\n-- product_price зависит ТОЛЬКО от product_id (не от order_id!)\n-- quantity      зависит от (order_id, product_id) -> ОК\n\n-- Аномалия: изменить цену iPhone нужно во ВСЕХ строках order_items!\n\n-- Привести к 2NF: выделить частичные зависимости в отдельные таблицы\n\n-- Таблица products (зависит только от product_id)\nCREATE TABLE products (\n    id    SERIAL PRIMARY KEY,\n    name  VARCHAR(200) NOT NULL,\n    price DECIMAL(10, 2) NOT NULL\n);\n-- product_id -> product_name, product_price\n\n-- Таблица order_items (зависит от ВСЕГО ключа)\nCREATE TABLE order_items (\n    order_id   INTEGER,\n    product_id INTEGER REFERENCES products(id),\n    quantity   INTEGER NOT NULL CHECK (quantity > 0),\n    unit_price DECIMAL(10, 2) NOT NULL,  -- Цена на момент заказа!\n    PRIMARY KEY (order_id, product_id)\n);\n-- (order_id, product_id) -> quantity, unit_price\n\n-- Теперь:\n-- ✓ Изменить цену iPhone -> только в таблице products (1 строка)\n-- ✓ Нет дублирования product_name в каждой строке заказа\n-- ✓ unit_price зафиксирован на момент заказа (история цен)\n\n-- НО: в order_items ещё может быть customer_name -> нужна 3NF!' },
        { type: 'note', value: '2NF применима только к таблицам с составным PRIMARY KEY. Если PK — один столбец, таблица автоматически в 2NF (нет составного ключа -> нет частичных зависимостей).' }
      ]
    },
    {
      id: 4,
      title: '3NF: Третья нормальная форма',
      type: 'theory',
      content: [
        { type: 'text', value: '3NF = 2NF + нет транзитивных зависимостей. Неключевой столбец не должен зависеть от другого неключевого столбца. Иначе говоря: нет зависимостей вида PK -> A -> B.' },
        { type: 'code', language: 'sql', value: '-- Таблица в 2NF (но НЕ в 3NF):\n-- orders: (id, customer_id, customer_name, customer_email, customer_city, total)\n-- PRIMARY KEY: id\n\n-- Транзитивные зависимости (нарушение 3NF):\n-- id -> customer_id -> customer_name   (транзитивная!)\n-- id -> customer_id -> customer_email  (транзитивная!)\n-- id -> customer_id -> customer_city   (транзитивная!)\n-- id -> total                          (прямая, ОК)\n\n-- Аномалия: клиент сменил email\n-- UPDATE orders SET customer_email = \'new@mail.ru\' WHERE customer_id = 5;\n-- Обновить ВСЕ заказы клиента! (нарушение DRY)\n\n-- Привести к 3NF: убрать транзитивные зависимости\n\n-- Таблица customers (зависит от customer_id)\nCREATE TABLE customers (\n    id    BIGSERIAL PRIMARY KEY,\n    name  VARCHAR(200) NOT NULL,\n    email VARCHAR(255) UNIQUE NOT NULL,\n    city  VARCHAR(100)\n);\n\n-- Таблица orders (только прямые зависимости от id)\nCREATE TABLE orders (\n    id          BIGSERIAL PRIMARY KEY,\n    customer_id BIGINT NOT NULL REFERENCES customers(id),\n    total       DECIMAL(15, 2) NOT NULL,\n    status      VARCHAR(20) NOT NULL DEFAULT \'pending\',\n    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\n-- Теперь:\n-- ✓ Изменить email клиента -> одна строка в customers\n-- ✓ Информация о клиенте хранится в одном месте\n-- ✓ Нет транзитивных зависимостей\n\n-- BCNF (Бойс-Кодд): более строгая 3NF\n-- Каждый детерминант должен быть суперключом\n-- На практике различия 3NF и BCNF редко встречаются' },
        { type: 'tip', value: 'Простой способ проверить 3NF: задай вопрос "зависит ли столбец X от чего-то, кроме PRIMARY KEY?". Если да — нарушение 3NF, выноси в отдельную таблицу.' }
      ]
    },
    {
      id: 5,
      title: 'Денормализация: когда нарушать нормализацию',
      type: 'theory',
      content: [
        { type: 'text', value: 'Нормализация улучшает целостность данных но увеличивает количество JOIN. Иногда осознанная денормализация оправдана для производительности. Это компромисс, а не ошибка.' },
        { type: 'code', language: 'sql', value: '-- Пример: отчёт продаж с нормализованной схемой\n-- Медленный запрос (много JOIN):\nSELECT\n    c.name          AS customer,\n    p.name          AS product,\n    p.category,\n    oi.quantity,\n    oi.unit_price,\n    oi.quantity * oi.unit_price AS subtotal,\n    o.created_at\nFROM orders o\nJOIN customers c ON o.customer_id = c.id\nJOIN order_items oi ON o.id = oi.order_id\nJOIN products p ON oi.product_id = p.id\nWHERE o.created_at >= \'2024-01-01\';\n-- 4 таблицы, 3 JOIN -> может быть медленно на миллионах строк\n\n-- Денормализация 1: добавить избыточный столбец для ускорения\nALTER TABLE orders ADD COLUMN customer_name VARCHAR(200);\n-- Обновить при INSERT/UPDATE через триггер или приложение\n-- Теперь для простых запросов не нужен JOIN с customers\n\n-- Денормализация 2: таблица-агрегат (materialized summary)\nCREATE TABLE daily_sales_summary (\n    sale_date   DATE PRIMARY KEY,\n    total_orders    INTEGER,\n    total_revenue   DECIMAL(15, 2),\n    unique_customers INTEGER\n);\n-- Обновляется ночью через scheduled job\n-- Отчёт за последние 30 дней: SELECT * FROM daily_sales_summary\n-- Вместо GROUP BY по orders с миллионами строк\n\n-- Денормализация 3: JSONB для гибких атрибутов\n-- Вместо таблицы product_attributes (EAV антипаттерн):\nALTER TABLE products ADD COLUMN attributes JSONB;\n-- { \"color\": \"black\", \"storage\": \"256GB\", \"weight\": 187 }\n-- Избегаем сотни узких строк в EAV-таблице\n\n-- Правило денормализации:\n-- 1. Сначала нормализуй до 3NF\n-- 2. Измерь производительность (EXPLAIN ANALYZE)\n-- 3. Денормализуй только проблемные места\n-- 4. Документируй причину денормализации!' },
        { type: 'warning', value: 'Денормализация усложняет поддержку целостности данных. Нужно синхронизировать избыточные данные через триггеры или код приложения. Никогда не денормализуй заранее без измеренной проблемы.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Нормализация схемы магазина',
      type: 'practice',
      difficulty: 'hard',
      description: 'Проанализируй ненормализованную таблицу и приведи её к 3NF.',
      requirements: [
        'Определи нарушения 1NF в таблице raw_orders (несколько значений в ячейке)',
        'Определи нарушения 2NF (частичные зависимости от составного ключа)',
        'Определи нарушения 3NF (транзитивные зависимости)',
        'Создай нормализованную схему: customers, categories, products, orders, order_items',
        'Добавь FK ограничения и индексы на FK столбцы',
        'Напиши SELECT с JOIN эквивалентный исходному flat-запросу'
      ],
      hint: 'Начни с вопроса: "Какие данные могут измениться независимо?" Email клиента меняется независимо от заказа -> customers отдельно. Цена категории меняется независимо от товара -> category отдельно. Шаг за шагом.',
      solution: '-- Исходная ненормализованная таблица:\n-- raw_orders: (order_id, customer_name, customer_email, customer_city,\n--              product_names, product_prices, category_name, category_discount,\n--              quantities, order_date, order_total)\n\n-- НАРУШЕНИЯ:\n-- 1NF: product_names, product_prices, quantities - списки через запятую\n-- 2NF: customer_name/email/city зависят только от customer (не от продукта)\n-- 3NF: category_discount зависит от category_name, а не от order_id\n\n-- ШАГ 1: Нормализованная схема (3NF)\n\nCREATE TABLE customers (\n    id    BIGSERIAL PRIMARY KEY,\n    name  VARCHAR(200) NOT NULL,\n    email VARCHAR(255) UNIQUE NOT NULL,\n    city  VARCHAR(100)\n);\n\nCREATE TABLE categories (\n    id       SERIAL PRIMARY KEY,\n    name     VARCHAR(100) UNIQUE NOT NULL,\n    discount DECIMAL(4, 2) DEFAULT 0 CHECK (discount BETWEEN 0 AND 1)\n    -- discount здесь, т.к. зависит от категории, а не от товара\n);\n\nCREATE TABLE products (\n    id          BIGSERIAL PRIMARY KEY,\n    name        VARCHAR(300) NOT NULL,\n    base_price  DECIMAL(12, 2) NOT NULL CHECK (base_price > 0),\n    category_id INTEGER NOT NULL REFERENCES categories(id),\n    sku         VARCHAR(100) UNIQUE NOT NULL\n);\n\nCREATE TABLE orders (\n    id          BIGSERIAL PRIMARY KEY,\n    customer_id BIGINT NOT NULL REFERENCES customers(id),\n    total       DECIMAL(15, 2) NOT NULL CHECK (total >= 0),\n    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()\n);\n\nCREATE TABLE order_items (\n    order_id   BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,\n    product_id BIGINT NOT NULL REFERENCES products(id),\n    quantity   INTEGER NOT NULL CHECK (quantity > 0),\n    unit_price DECIMAL(12, 2) NOT NULL CHECK (unit_price > 0),\n    -- unit_price зафиксирован на момент заказа (цена может меняться!)\n    PRIMARY KEY (order_id, product_id)\n);\n\n-- ШАГ 2: Индексы на FK\nCREATE INDEX idx_products_category ON products(category_id);\nCREATE INDEX idx_orders_customer ON orders(customer_id);\nCREATE INDEX idx_order_items_product ON order_items(product_id);\n\n-- ШАГ 3: Запрос эквивалентный flat-таблице\nSELECT\n    o.id            AS order_id,\n    o.created_at    AS order_date,\n    c.name          AS customer_name,\n    c.email         AS customer_email,\n    c.city          AS customer_city,\n    p.name          AS product_name,\n    cat.name        AS category_name,\n    cat.discount    AS category_discount,\n    oi.quantity,\n    oi.unit_price,\n    oi.quantity * oi.unit_price AS subtotal,\n    o.total         AS order_total\nFROM orders o\nJOIN customers c     ON o.customer_id = c.id\nJOIN order_items oi  ON o.id = oi.order_id\nJOIN products p      ON oi.product_id = p.id\nJOIN categories cat  ON p.category_id = cat.id\nORDER BY o.created_at DESC, o.id, p.name;\n\n-- Преимущества нормализованной схемы:\n-- ✓ Изменить email клиента: UPDATE customers SET email = \'new@mail.ru\' WHERE id = 1;\n-- ✓ Изменить скидку категории: UPDATE categories SET discount = 0.15 WHERE id = 2;\n-- ✓ История цен: unit_price в order_items != текущий base_price в products\n-- ✓ Нет дублирования данных клиента в каждой строке заказа',
      explanation: 'Нормализация разбивает плоскую таблицу на связанные сущности: каждый факт хранится ровно в одном месте. 1NF устраняет списки в ячейках, 2NF убирает частичные зависимости от составного ключа, 3NF устраняет транзитивные зависимости через промежуточные столбцы. Итог: изменение любого атрибута требует UPDATE одной строки в одной таблице.'
    }
  ]
}
