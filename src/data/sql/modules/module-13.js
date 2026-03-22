export default {
  id: 13,
  title: 'Представления (Views)',
  description: 'Виртуальные таблицы на основе SELECT-запросов. Создание, изменение и удаление представлений. Обновляемые и необновляемые views. Материализованные представления в PostgreSQL.',
  lessons: [
    {
      id: 1,
      title: 'Что такое представление (View)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Представление (View) — сохранённый SQL-запрос, который ведёт себя как таблица. Данные не хранятся физически: каждый обращение к view выполняет исходный SELECT. View упрощает сложные запросы, скрывает детали схемы и ограничивает доступ к данным.' },
        { type: 'heading', value: 'Синтаксис создания View' },
        { type: 'code', language: 'sql', value: '-- Создание простого представления\nCREATE VIEW active_customers AS\nSELECT\n    id,\n    name,\n    email,\n    created_at\nFROM customers\nWHERE status = \'active\';\n\n-- Использование как обычная таблица\nSELECT * FROM active_customers;\nSELECT name, email FROM active_customers WHERE name LIKE \'А%\';\n\n-- Представление со сложным запросом\nCREATE VIEW order_summary AS\nSELECT\n    o.id            AS order_id,\n    c.name          AS customer_name,\n    c.email,\n    COUNT(oi.product_id)            AS items_count,\n    SUM(oi.quantity * oi.unit_price) AS total_amount,\n    o.created_at\nFROM orders o\nJOIN customers c    ON o.customer_id = c.id\nJOIN order_items oi ON o.id = oi.order_id\nGROUP BY o.id, c.name, c.email, o.created_at;\n\n-- Теперь сложный запрос стал простым:\nSELECT * FROM order_summary WHERE total_amount > 10000;' },
        { type: 'tip', value: 'View — это "сохранённый запрос с именем". Основные сценарии использования: упрощение сложных JOIN, ограничение доступа (предоставить права на view, а не на таблицу), обратная совместимость при изменении схемы.' }
      ]
    },
    {
      id: 2,
      title: 'Управление представлениями: CREATE, ALTER, DROP',
      type: 'theory',
      content: [
        { type: 'text', value: 'View можно создавать, изменять и удалять. В PostgreSQL ALTER VIEW ограничен — для изменения запроса используют CREATE OR REPLACE VIEW.' },
        { type: 'code', language: 'sql', value: '-- CREATE OR REPLACE: заменить если существует\nCREATE OR REPLACE VIEW active_customers AS\nSELECT\n    id,\n    name,\n    email,\n    phone,        -- Добавили новый столбец\n    created_at\nFROM customers\nWHERE status = \'active\' AND deleted_at IS NULL;\n\n-- Ограничение: нельзя убрать столбцы через REPLACE\n-- (изменится порядок или состав -> нужен DROP + CREATE)\n\n-- Переименовать view\nALTER VIEW active_customers RENAME TO active_users;\n\n-- Изменить схему view\nALTER VIEW order_summary SET SCHEMA reporting;\n\n-- Добавить комментарий\nCOMMENT ON VIEW active_users IS\n    \'Список активных пользователей без удалённых\';\n\n-- Удалить view\nDROP VIEW active_users;\n\n-- Удалить view и всё что от него зависит\nDROP VIEW order_summary CASCADE;\n\n-- Список всех view в текущей схеме\nSELECT table_name, view_definition\nFROM information_schema.views\nWHERE table_schema = \'public\'\nORDER BY table_name;' },
        { type: 'note', value: 'CREATE OR REPLACE VIEW позволяет добавлять новые столбцы в конец и изменять определения существующих столбцов. Нельзя удалять столбцы или менять их порядок — для этого нужно DROP + CREATE.' }
      ]
    },
    {
      id: 3,
      title: 'Обновляемые представления (Updatable Views)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Простые view можно использовать в INSERT/UPDATE/DELETE. PostgreSQL автоматически транслирует операции на базовую таблицу. View обновляемо если: основано на одной таблице, нет DISTINCT/GROUP BY/HAVING/UNION/агрегатных функций.' },
        { type: 'code', language: 'sql', value: '-- Обновляемый view\nCREATE VIEW young_employees AS\nSELECT id, name, email, age, department_id\nFROM employees\nWHERE age < 30;\n\n-- INSERT через view (строка попадёт в employees)\nINSERT INTO young_employees (name, email, age, department_id)\nVALUES (\'Айдос\', \'aidos@company.kz\', 25, 3);\n\n-- UPDATE через view\nUPDATE young_employees SET email = \'new@company.kz\' WHERE id = 42;\n\n-- DELETE через view\nDELETE FROM young_employees WHERE id = 42;\n\n-- WITH CHECK OPTION: запрещает вставку/обновление записей\n-- которые не попадают в WHERE условие view\nCREATE VIEW young_employees_checked AS\nSELECT id, name, email, age, department_id\nFROM employees\nWHERE age < 30\nWITH CHECK OPTION;\n\n-- Это вызовет ошибку (age = 35 не соответствует WHERE age < 30):\n-- INSERT INTO young_employees_checked (name, age) VALUES (\'Тест\', 35);\n-- ERROR: new row violates check option for view "young_employees_checked"\n\n-- LOCAL vs CASCADED CHECK OPTION для вложенных views:\nCREATE VIEW it_employees AS\nSELECT * FROM young_employees_checked\nWHERE department_id = 5\nWITH LOCAL CHECK OPTION;  -- Проверяет только условие THIS view\n-- CASCADED (по умолчанию): проверяет все вложенные views' },
        { type: 'warning', value: 'View с JOIN, GROUP BY, DISTINCT, агрегатами или подзапросами не является обновляемым. Для изменения данных через сложный view используй INSTEAD OF триггеры (см. модуль про триггеры).' }
      ]
    },
    {
      id: 4,
      title: 'Материализованные представления (Materialized Views)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Материализованное представление (Materialized View) физически хранит результат запроса. Данные не обновляются автоматически — нужно явно вызвать REFRESH. Идеально для дорогих запросов с редко меняющимися данными.' },
        { type: 'code', language: 'sql', value: '-- Создание материализованного view\nCREATE MATERIALIZED VIEW monthly_sales AS\nSELECT\n    DATE_TRUNC(\'month\', o.created_at)::DATE  AS month,\n    c.city,\n    COUNT(DISTINCT o.id)                      AS orders_count,\n    SUM(oi.quantity * oi.unit_price)          AS revenue,\n    COUNT(DISTINCT o.customer_id)             AS unique_customers\nFROM orders o\nJOIN customers c    ON o.customer_id = c.id\nJOIN order_items oi ON o.id = oi.order_id\nGROUP BY DATE_TRUNC(\'month\', o.created_at), c.city\nORDER BY month DESC, revenue DESC;\n\n-- Можно создать индекс на материализованном view!\nCREATE INDEX idx_monthly_sales_month ON monthly_sales(month);\nCREATE INDEX idx_monthly_sales_city  ON monthly_sales(city);\n\n-- Запрос мгновенный (данные закэшированы):\nSELECT * FROM monthly_sales WHERE month >= \'2024-01-01\';\n\n-- Обновить данные (блокирует view на время обновления)\nREFRESH MATERIALIZED VIEW monthly_sales;\n\n-- Обновить без блокировки (нужен UNIQUE индекс)\nCREATE UNIQUE INDEX idx_monthly_sales_pk\n    ON monthly_sales(month, city);\n\nREFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales;\n-- Во время обновления view доступен для чтения!\n\n-- Настроить автообновление через pg_cron (расширение):\n-- SELECT cron.schedule(\'refresh-monthly-sales\', \'0 3 * * *\',\n--   \'REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_sales\');\n\n-- Удалить\nDROP MATERIALIZED VIEW monthly_sales;' },
        { type: 'tip', value: 'Используй Materialized View для: тяжёлых аналитических запросов (секунды -> миллисекунды), отчётов которые обновляются раз в час/ночь, дашбордов с большим числом пользователей. REFRESH CONCURRENTLY требует уникальный индекс но не блокирует читателей.' }
      ]
    },
    {
      id: 5,
      title: 'View для безопасности: Row-Level Security и маскирование данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'View — мощный инструмент безопасности. Можно предоставить доступ к view вместо таблицы, скрывая чувствительные столбцы и строки. Это альтернатива или дополнение к Row-Level Security.' },
        { type: 'code', language: 'sql', value: '-- Таблица employees содержит зарплаты и личные данные\n-- CREATE TABLE employees (id, name, email, phone, salary, ssn, department_id, ...)\n\n-- View для HR: полные данные только своего отдела\nCREATE VIEW hr_department_view AS\nSELECT\n    e.id, e.name, e.email, e.phone,\n    e.salary,           -- HR видит зарплаты\n    e.department_id,\n    d.name AS dept_name\nFROM employees e\nJOIN departments d ON e.department_id = d.id\nWHERE e.department_id = current_setting(\'app.current_dept\')::INTEGER;\n-- current_setting(): переменная сессии, задаётся приложением\n\n-- View для сотрудников: без зарплат и SSN\nCREATE VIEW employee_public_info AS\nSELECT\n    id,\n    name,\n    email,\n    -- НЕТ salary, ssn, phone\n    department_id\nFROM employees\nWHERE active = TRUE;\n\n-- Маскирование данных: показывать частично\nCREATE VIEW masked_customers AS\nSELECT\n    id,\n    name,\n    -- Маскируем email: a****@mail.ru\n    LEFT(email, 1) || \'****\' || SUBSTRING(email FROM POSITION(\'@\' IN email))\n        AS email_masked,\n    -- Маскируем телефон: +7 (XXX) XXX-XX-** (последние 2 скрыты)\n    REGEXP_REPLACE(phone, \'(\\d{2})$\', \'**\') AS phone_masked,\n    created_at\nFROM customers;\n\n-- Дать права на view (не на таблицу!):\nGRANT SELECT ON employee_public_info TO app_readonly_role;\nGRANT SELECT ON masked_customers TO support_role;\n-- REVOKE SELECT ON employees FROM support_role; (если был)' },
        { type: 'note', value: 'View с SECURITY DEFINER выполняется с правами создателя view, а не вызывающего пользователя. Это позволяет пользователям читать данные через view даже если у них нет прав на базовую таблицу. Используй осторожно!' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Создание аналитических представлений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай набор представлений для аналитики интернет-магазина.',
      requirements: [
        'View customer_stats: customer_id, name, email, total_orders, total_spent, avg_order_value, last_order_date',
        'View top_products: product_id, name, category, total_sold, total_revenue, avg_rating — отсортировано по total_revenue DESC',
        'View low_stock: товары где stock_quantity < 10, с последней датой продажи',
        'Materialized view weekly_revenue: неделя, выручка, количество заказов — с UNIQUE индексом для CONCURRENT refresh',
        'Проверь что View использует индексы: EXPLAIN на запрос к customer_stats с WHERE'
      ],
      hint: 'Для customer_stats используй LEFT JOIN чтобы включить клиентов без заказов. DATE_TRUNC(\'week\', created_at) группирует по неделям. Для REFRESH CONCURRENTLY нужен UNIQUE INDEX.',
      expectedOutput: 'Представления созданы:\nCREATE VIEW active_products -- OK\nCREATE VIEW customer_stats -- OK\nCREATE VIEW weekly_revenue -- OK\nCREATE MATERIALIZED VIEW product_category_stats -- OK\n\nSELECT * FROM active_products LIMIT 3:\n id | name          | price    | category   | stock\n----+---------------+----------+------------+-------\n  1 | Ноутбук Dell  | 85000.00 | Ноутбуки   |    12\n  3 | Телефон Xiaomi| 35000.00 | Телефоны   |    30\n(2 rows)\n\nSELECT * FROM customer_stats ORDER BY total_spent DESC LIMIT 2:\n customer_name | order_count | total_spent  | last_order\n---------------+-------------+--------------+------------\n Алия          |           5 |   250000.00  | 2026-03-15\n Нурлан        |           3 |   120000.00  | 2026-03-10\n(2 rows)\n\nSELECT * FROM weekly_revenue:\n week       | orders | revenue\n------------+--------+----------\n 2026-03-16 |     15 | 750000.00\n 2026-03-09 |     12 | 580000.00\n(2 rows)\n\nREFRESH MATERIALIZED VIEW CONCURRENTLY product_category_stats -- OK',
      solution: '-- 1. Статистика клиентов\nCREATE VIEW customer_stats AS\nSELECT\n    c.id                        AS customer_id,\n    c.name,\n    c.email,\n    COUNT(o.id)                 AS total_orders,\n    COALESCE(SUM(o.total), 0)   AS total_spent,\n    COALESCE(AVG(o.total), 0)   AS avg_order_value,\n    MAX(o.created_at)           AS last_order_date\nFROM customers c\nLEFT JOIN orders o ON c.id = o.customer_id\nGROUP BY c.id, c.name, c.email;\n\n-- 2. Топ товары\nCREATE VIEW top_products AS\nSELECT\n    p.id                                     AS product_id,\n    p.name,\n    cat.name                                 AS category,\n    SUM(oi.quantity)                         AS total_sold,\n    SUM(oi.quantity * oi.unit_price)         AS total_revenue,\n    ROUND(AVG(r.rating)::NUMERIC, 2)         AS avg_rating\nFROM products p\nJOIN categories cat   ON p.category_id = cat.id\nLEFT JOIN order_items oi ON p.id = oi.product_id\nLEFT JOIN reviews r   ON p.id = r.product_id\nGROUP BY p.id, p.name, cat.name\nORDER BY total_revenue DESC NULLS LAST;\n\n-- 3. Товары с низким запасом\nCREATE VIEW low_stock AS\nSELECT\n    p.id,\n    p.name,\n    p.stock_quantity,\n    MAX(o.created_at) AS last_sale_date\nFROM products p\nLEFT JOIN order_items oi ON p.id = oi.product_id\nLEFT JOIN orders o ON oi.order_id = o.id\nWHERE p.stock_quantity < 10\nGROUP BY p.id, p.name, p.stock_quantity\nORDER BY p.stock_quantity;\n\n-- 4. Материализованный view: выручка по неделям\nCREATE MATERIALIZED VIEW weekly_revenue AS\nSELECT\n    DATE_TRUNC(\'week\', created_at)::DATE AS week_start,\n    COUNT(*)                              AS orders_count,\n    SUM(total)                            AS revenue\nFROM orders\nGROUP BY DATE_TRUNC(\'week\', created_at)\nORDER BY week_start;\n\nCREATE UNIQUE INDEX idx_weekly_revenue_week\n    ON weekly_revenue(week_start);\n\n-- Обновление без блокировки:\nREFRESH MATERIALIZED VIEW CONCURRENTLY weekly_revenue;\n\n-- 5. Проверка плана запроса\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT * FROM customer_stats WHERE total_spent > 50000\nORDER BY total_spent DESC LIMIT 10;\n-- Если Seq Scan на customers -> добавь индекс или используй mat.view',
      explanation: 'Views инкапсулируют сложные запросы и упрощают работу приложения. Materialized view особенно ценны для аналитики: запрос к weekly_revenue занимает микросекунды вместо секунд на больших данных. CONCURRENT refresh позволяет обновлять данные без простоя.'
    }
  ]
}
