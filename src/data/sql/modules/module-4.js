export default {
  id: 4,
  title: 'Агрегатные функции',
  description: 'Агрегация данных: COUNT, SUM, AVG, MIN, MAX, их применение с WHERE и фильтрация NULL. Вычисление итогов и статистики по таблице.',
  lessons: [
    {
      id: 1,
      title: 'COUNT: подсчёт строк',
      type: 'theory',
      content: [
        { type: 'text', value: 'COUNT подсчитывает количество строк или значений. COUNT(*) считает все строки включая NULL, COUNT(column) игнорирует NULL.' },
        { type: 'code', language: 'sql', value: '-- COUNT(*) — общее количество строк\nSELECT COUNT(*) FROM users;            -- Все пользователи\nSELECT COUNT(*) FROM orders WHERE status = \'completed\';\n\n-- COUNT(column) — строки где column NOT NULL\nSELECT COUNT(phone) FROM users;        -- Пользователи с телефоном\nSELECT COUNT(rating) FROM products;    -- Товары с рейтингом (не NULL)\n\n-- Разница:\n-- COUNT(*)    = 10 (все строки)\n-- COUNT(phone)= 7  (у 3 пользователей phone IS NULL)\n\n-- COUNT(DISTINCT) — уникальные значения\nSELECT COUNT(DISTINCT category) FROM products; -- Количество категорий\nSELECT COUNT(DISTINCT user_id) FROM orders;    -- Пользователей с заказами\n\n-- Псевдоним для результата\nSELECT COUNT(*) AS total_users FROM users;\nSELECT COUNT(*) AS total_orders,\n       COUNT(DISTINCT user_id) AS unique_customers\nFROM orders;' },
        { type: 'list', items: [
          'COUNT(*) считает все строки включая NULL — используй для подсчёта записей',
          'COUNT(col) считает строки где col IS NOT NULL — для заполненных полей',
          'COUNT(DISTINCT col) — количество уникальных значений (исключая NULL)',
          'Агрегатная функция без GROUP BY возвращает одну строку по всей таблице',
          'COUNT возвращает 0 если строк нет, другие агрегаты возвращают NULL'
        ]},
        { type: 'tip', value: 'COUNT(*) vs COUNT(col): используй COUNT(*) для подсчёта строк, COUNT(col) для подсчёта заполненных значений. COUNT(*) быстрее — он не читает значения, только проверяет существование строки.' }
      ]
    },
    {
      id: 2,
      title: 'SUM и AVG: сумма и среднее',
      type: 'theory',
      content: [
        { type: 'text', value: 'SUM суммирует числовые значения, AVG вычисляет среднее. Оба игнорируют NULL.' },
        { type: 'code', language: 'sql', value: '-- SUM: общая сумма\nSELECT SUM(price) AS total_revenue FROM orders;\nSELECT SUM(stock * price) AS inventory_value FROM products;\n\n-- SUM с условием (вместо WHERE для всей таблицы)\nSELECT\n    SUM(CASE WHEN status = \'completed\' THEN amount ELSE 0 END) AS completed_revenue,\n    SUM(CASE WHEN status = \'pending\'   THEN amount ELSE 0 END) AS pending_revenue\nFROM orders;\n\n-- AVG: среднее значение (игнорирует NULL!)\nSELECT AVG(rating) FROM products;        -- Среднее только по товарам с рейтингом\nSELECT AVG(salary) FROM employees;\n\n-- Точность AVG: результат тип NUMERIC/DOUBLE\nSELECT ROUND(AVG(price), 2) AS avg_price FROM products;\n\n-- AVG vs вычисленное вручную\nSELECT\n    AVG(rating) AS avg_by_function,\n    SUM(rating) / COUNT(rating) AS avg_manual,   -- То же самое (оба игнорируют NULL)\n    SUM(rating) / COUNT(*) AS avg_with_nulls      -- Другой результат! NULL делает знаменатель больше\nFROM products;' },
        { type: 'warning', value: 'AVG(column) игнорирует NULL строки! Если у 3 из 10 строк рейтинг NULL, AVG считает по 7 строкам. Если нужно включить NULL как 0: AVG(COALESCE(rating, 0)).' }
      ]
    },
    {
      id: 3,
      title: 'MIN и MAX: минимум и максимум',
      type: 'theory',
      content: [
        { type: 'text', value: 'MIN и MAX находят наименьшее и наибольшее значение. Работают с числами, строками и датами. Игнорируют NULL.' },
        { type: 'code', language: 'sql', value: '-- Числа\nSELECT MIN(price) AS min_price, MAX(price) AS max_price FROM products;\nSELECT MIN(salary), MAX(salary), MAX(salary) - MIN(salary) AS spread FROM employees;\n\n-- Строки (лексикографически)\nSELECT MIN(name) AS first_alphabetically,\n       MAX(name) AS last_alphabetically\nFROM users;\n\n-- Даты (MIN = самая старая, MAX = самая новая)\nSELECT\n    MIN(created_at) AS first_order,\n    MAX(created_at) AS last_order\nFROM orders;\n\n-- Практическое: ценовой диапазон в каждой категории\n-- (это уже GROUP BY — следующий модуль)\nSELECT\n    category,\n    MIN(price) AS min_price,\n    MAX(price) AS max_price,\n    ROUND(AVG(price), 0) AS avg_price\nFROM products\nGROUP BY category;\n\n-- Все агрегаты вместе\nSELECT\n    COUNT(*)              AS total_products,\n    COUNT(rating)         AS rated_products,\n    ROUND(AVG(price), 2)  AS avg_price,\n    SUM(stock)            AS total_in_stock,\n    MIN(price)            AS cheapest,\n    MAX(price)            AS most_expensive\nFROM products;' },
        { type: 'list', items: [
          'MIN и MAX игнорируют NULL — они работают только с имеющимися значениями',
          'Для строк: MIN возвращает лексикографически первое, MAX — последнее',
          'Для дат: MIN = самая ранняя дата, MAX = самая поздняя',
          'MAX(salary) - MIN(salary) — разброс зарплат, диапазон',
          'В GROUP BY: MIN/MAX считаются для каждой группы отдельно'
        ]},
        { type: 'tip', value: 'MIN и MAX с датами — отличный способ найти первую и последнюю транзакцию пользователя, дату регистрации и последней активности. Комбинируй с GROUP BY: SELECT user_id, MIN(created_at), MAX(created_at) FROM orders GROUP BY user_id.' }
      ]
    },
    {
      id: 4,
      title: 'Агрегаты с WHERE',
      type: 'theory',
      content: [
        { type: 'text', value: 'WHERE фильтрует строки ДО применения агрегатных функций. Это позволяет считать статистику только по части данных.' },
        { type: 'code', language: 'sql', value: '-- Статистика только по телефонам\nSELECT\n    COUNT(*) AS phone_count,\n    AVG(price) AS avg_price,\n    MIN(price) AS min_price,\n    MAX(price) AS max_price\nFROM products\nWHERE category = \'Телефоны\';\n\n-- Общая выручка за конкретный месяц\nSELECT SUM(amount) AS monthly_revenue\nFROM orders\nWHERE created_at >= \'2024-01-01\'\n  AND created_at < \'2024-02-01\'\n  AND status = \'completed\';\n\n-- Количество активных пользователей\nSELECT COUNT(*) AS active_users\nFROM users\nWHERE last_login > NOW() - INTERVAL \'30 days\';\n\n-- Средний рейтинг только высококачественных товаров\nSELECT ROUND(AVG(rating), 2) AS avg_premium_rating\nFROM products\nWHERE price > 50000\n  AND rating IS NOT NULL;\n\n-- Нельзя использовать агрегат в WHERE!\n-- ОШИБКА: SELECT * FROM products WHERE AVG(price) > 100;\n-- Для этого нужен HAVING (следующий модуль)' },
        { type: 'note', value: 'WHERE применяется ДО агрегации. Нельзя фильтровать по результату агрегатной функции через WHERE — для этого есть HAVING (GROUP BY + HAVING).' }
      ]
    },
    {
      id: 5,
      title: 'STRING_AGG и ARRAY_AGG: агрегация строк',
      type: 'theory',
      content: [
        { type: 'text', value: 'Помимо числовых агрегатов, PostgreSQL предоставляет STRING_AGG (конкатенация строк) и ARRAY_AGG (сбор в массив).' },
        { type: 'code', language: 'sql', value: '-- STRING_AGG: объединение строк через разделитель\nSELECT STRING_AGG(name, \', \') AS all_names FROM users;\n-- "Алия, Нурлан, Фарида"\n\n-- С сортировкой внутри агрегата\nSELECT STRING_AGG(name, \', \' ORDER BY name) AS sorted_names FROM users;\n\n-- Практически: список категорий товаров\nSELECT STRING_AGG(DISTINCT category, \' | \' ORDER BY category) AS categories\nFROM products;\n\n-- ARRAY_AGG: собрать значения в массив\nSELECT ARRAY_AGG(name) AS name_array FROM users;\n-- {Алия, Нурлан, Фарида}\n\nSELECT ARRAY_AGG(DISTINCT category ORDER BY category) AS categories\nFROM products;\n\n-- BOOL_AND / BOOL_OR\nSELECT\n    BOOL_AND(is_active) AS all_active,  -- TRUE если ВСЕ активны\n    BOOL_OR(is_premium) AS any_premium  -- TRUE если ХОТЬ ОДИН премиум\nFROM users;' },
        { type: 'list', items: [
          'STRING_AGG(col, разделитель) — PostgreSQL. В MySQL: GROUP_CONCAT(col SEPARATOR ",")',
          'Поддерживает ORDER BY внутри: STRING_AGG(name, ", " ORDER BY name)',
          'ARRAY_AGG возвращает PostgreSQL массив — удобно передавать в приложение',
          'BOOL_AND — TRUE если все значения TRUE, BOOL_OR — TRUE если хоть одно TRUE',
          'Все эти функции игнорируют NULL, если не указать COALESCE'
        ]},
        { type: 'tip', value: 'STRING_AGG отлично подходит для создания CSV-списков в запросе: список тегов, ролей, категорий через запятую. Комбинируй с GROUP BY: SELECT user_id, STRING_AGG(role, ", ") FROM user_roles GROUP BY user_id.' }
      ]
    },
    {
      id: 6,
      title: 'FILTER: условная агрегация',
      type: 'theory',
      content: [
        { type: 'text', value: 'FILTER позволяет применять условие внутри агрегатной функции — считать статистику по разным подмножествам в одном запросе.' },
        { type: 'code', language: 'sql', value: '-- Сравнение через CASE (классический подход)\nSELECT\n    COUNT(*) AS total,\n    COUNT(CASE WHEN status = \'active\'   THEN 1 END) AS active,\n    COUNT(CASE WHEN status = \'inactive\' THEN 1 END) AS inactive\nFROM users;\n\n-- То же самое через FILTER (PostgreSQL 9.4+, чище)\nSELECT\n    COUNT(*)                              AS total,\n    COUNT(*) FILTER (WHERE status = \'active\')   AS active,\n    COUNT(*) FILTER (WHERE status = \'inactive\') AS inactive,\n    AVG(price) FILTER (WHERE category = \'Телефоны\') AS avg_phone_price,\n    AVG(price) FILTER (WHERE category = \'Ноутбуки\') AS avg_laptop_price\nFROM products;\n\n-- Сравнение продаж по кварталам в одном запросе\nSELECT\n    SUM(amount) FILTER (WHERE EXTRACT(QUARTER FROM created_at) = 1) AS q1,\n    SUM(amount) FILTER (WHERE EXTRACT(QUARTER FROM created_at) = 2) AS q2,\n    SUM(amount) FILTER (WHERE EXTRACT(QUARTER FROM created_at) = 3) AS q3,\n    SUM(amount) FILTER (WHERE EXTRACT(QUARTER FROM created_at) = 4) AS q4\nFROM orders\nWHERE EXTRACT(YEAR FROM created_at) = 2024;' },
        { type: 'tip', value: 'FILTER — элегантная замена CASE WHEN внутри агрегатов. Код становится более читаемым особенно при большом количестве условий.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Статистика продаж',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши аналитические запросы для статистики магазина.',
      requirements: [
        'Создай таблицу orders: id, user_id, product_id, amount, quantity, status (pending/completed/cancelled), created_at',
        'Вставь минимум 10 заказов разных статусов',
        'Запрос 1: общее количество заказов, сумма и среднее по статусам',
        'Запрос 2: количество уникальных покупателей и среднее число заказов на покупателя',
        'Запрос 3: самый дорогой и самый дешёвый заказ, разница между ними',
        'Запрос 4: статистика по статусам в одном запросе (FILTER)'
      ],
      hint: 'Среднее число заказов: COUNT(*) / COUNT(DISTINCT user_id). Или через ROUND для точности. Для FILTER: COUNT(*) FILTER (WHERE status = \'completed\') AS completed_count.',
      expectedOutput: 'Общая статистика заказов:\n total_orders | completed | cancelled | avg_amount | max_amount | min_amount\n--------------+-----------+-----------+------------+------------+------------\n          150 |        98 |        15 |   45230.00 |  250000.00 |    500.00\n(1 row)\n\nСреднее количество заказов на пользователя:\n avg_orders_per_user\n---------------------\n               12.50\n(1 row)\n\nСтатистика товаров по категориям:\n category   | total_products | avg_price  | max_price\n------------+----------------+------------+----------\n Ноутбуки   |             12 |  65000.00  | 85000.00\n Телефоны   |             25 |  42000.00  | 65000.00\n Аксессуары |             40 |   3500.00  | 15000.00\n(3 rows)\n\nПользователи без заказов (COUNT = 0):\n user_id | name     | order_count\n---------+----------+-------------\n      15 | Болат    |           0\n      23 | Айгуль   |           0\n(2 rows)',
      solution: 'CREATE TABLE orders (\n    id         SERIAL PRIMARY KEY,\n    user_id    INTEGER NOT NULL,\n    product_id INTEGER,\n    amount     DECIMAL(10, 2) NOT NULL,\n    quantity   INTEGER DEFAULT 1,\n    status     VARCHAR(20) DEFAULT \'pending\',\n    created_at TIMESTAMP DEFAULT NOW()\n);\n\nINSERT INTO orders (user_id, product_id, amount, quantity, status, created_at) VALUES\n    (1, 1, 185000, 1, \'completed\', \'2024-01-05\'),\n    (2, 3, 45000,  2, \'completed\', \'2024-01-08\'),\n    (1, 5, 250000, 1, \'pending\',   \'2024-01-10\'),\n    (3, 2, 160000, 1, \'cancelled\', \'2024-01-12\'),\n    (4, 4, 7000,   3, \'completed\', \'2024-01-15\'),\n    (2, 6, 85000,  1, \'completed\', \'2024-02-01\'),\n    (5, 1, 185000, 1, \'pending\',   \'2024-02-03\'),\n    (3, 8, 120000, 1, \'completed\', \'2024-02-10\'),\n    (1, 9, 55000,  2, \'cancelled\', \'2024-02-15\'),\n    (4, 10,450000, 1, \'completed\', \'2024-03-01\');\n\n-- 1. Общая статистика\nSELECT\n    COUNT(*)                    AS total_orders,\n    SUM(amount)                 AS total_revenue,\n    ROUND(AVG(amount), 2)       AS avg_order_amount\nFROM orders;\n\n-- 2. Уникальные покупатели\nSELECT\n    COUNT(DISTINCT user_id)             AS unique_buyers,\n    COUNT(*)                            AS total_orders,\n    ROUND(COUNT(*) * 1.0 / COUNT(DISTINCT user_id), 2) AS avg_orders_per_buyer\nFROM orders;\n\n-- 3. Диапазон заказов\nSELECT\n    MIN(amount)               AS min_order,\n    MAX(amount)               AS max_order,\n    MAX(amount) - MIN(amount) AS range\nFROM orders;\n\n-- 4. По статусам через FILTER\nSELECT\n    COUNT(*)                                       AS total,\n    COUNT(*) FILTER (WHERE status = \'completed\')   AS completed,\n    COUNT(*) FILTER (WHERE status = \'pending\')     AS pending,\n    COUNT(*) FILTER (WHERE status = \'cancelled\')   AS cancelled,\n    SUM(amount) FILTER (WHERE status = \'completed\') AS completed_revenue\nFROM orders;',
      explanation: 'Агрегатные функции — основа аналитики. COUNT(DISTINCT) для уникальных значений. FILTER делает условную агрегацию в одном запросе вместо нескольких. Умножение на 1.0 для получения дробного результата при делении целых чисел.'
    }
  ]
}
