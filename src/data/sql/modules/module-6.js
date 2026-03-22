export default {
  id: 6,
  title: 'JOIN: основы',
  description: 'Объединение таблиц: INNER JOIN, LEFT JOIN, RIGHT JOIN, синтаксис ON и USING, работа с несколькими JOIN и типичные паттерны.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны JOIN: нормализация данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'В нормализованных БД данные разбиты по нескольким таблицам чтобы избежать дублирования. JOIN объединяет таблицы по связывающим столбцам.' },
        { type: 'heading', value: 'Проблема без JOIN vs с JOIN' },
        { type: 'code', language: 'sql', value: '-- Без нормализации (плохо): дублирование данных\n-- orders: id | user_name | user_email | product_name | price | ...\n-- При изменении email пользователя — обновлять сотни строк!\n\n-- С нормализацией (хорошо): данные в разных таблицах\n-- users:    id | name | email\n-- products: id | name | price\n-- orders:   id | user_id | product_id | amount | created_at\n\n-- JOIN объединяет таблицы через внешний ключ (FK)\nSELECT\n    users.name        AS customer,\n    products.name     AS product,\n    orders.amount,\n    orders.created_at\nFROM orders\nJOIN users    ON orders.user_id    = users.id\nJOIN products ON orders.product_id = products.id;\n\n-- Псевдонимы таблиц (алиасы) — стандартная практика\nSELECT\n    u.name    AS customer,\n    p.name    AS product,\n    o.amount\nFROM orders  o\nJOIN users   u ON o.user_id    = u.id\nJOIN products p ON o.product_id = p.id;' }
      ]
    },
    {
      id: 2,
      title: 'INNER JOIN: только совпадающие строки',
      type: 'theory',
      content: [
        { type: 'text', value: 'INNER JOIN (или просто JOIN) возвращает только строки у которых есть совпадение в обеих таблицах. Строки без пары отбрасываются.' },
        { type: 'code', language: 'sql', value: '-- INNER JOIN (JOIN = то же самое)\nSELECT o.id, u.name, o.amount\nFROM orders o\nINNER JOIN users u ON o.user_id = u.id;\n\n-- Эквивалентно:\nSELECT o.id, u.name, o.amount\nFROM orders o\nJOIN users u ON o.user_id = u.id;\n\n-- Что произойдёт:\n-- orders.user_id = 1 -> users.id = 1 -> СОВПАДЕНИЕ -> включаем строку\n-- orders.user_id = 99 -> users.id = 99 -> НЕТ ПОЛЬЗОВАТЕЛЯ -> строка отбрасывается\n\n-- Пример: заказы с информацией о покупателе и товаре\nSELECT\n    o.id         AS order_id,\n    u.name       AS customer,\n    u.email,\n    p.name       AS product,\n    p.category,\n    o.quantity,\n    o.amount,\n    o.status,\n    o.created_at\nFROM orders     o\nJOIN users      u ON o.user_id    = u.id\nJOIN products   p ON o.product_id = p.id\nWHERE o.status = \'completed\'\nORDER BY o.created_at DESC;' },
        { type: 'note', value: 'INNER JOIN исключает пользователей у которых нет заказов, и заказы у которых нет пользователя (например, удалённые). Если нужны все записи — используй LEFT JOIN.' }
      ]
    },
    {
      id: 3,
      title: 'LEFT JOIN: все строки левой таблицы',
      type: 'theory',
      content: [
        { type: 'text', value: 'LEFT JOIN возвращает ВСЕ строки из левой таблицы (FROM) и совпадающие строки из правой. Для строк без пары — NULL в столбцах правой таблицы.' },
        { type: 'code', language: 'sql', value: '-- Все пользователи и их заказы (включая тех кто не заказывал)\nSELECT\n    u.id,\n    u.name,\n    o.id AS order_id,\n    o.amount\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;\n\n-- Результат:\n-- u.id | u.name  | order_id | amount\n--   1  | Алия    |     1    | 185000   <- заказ есть\n--   1  | Алия    |     3    | 250000   <- второй заказ\n--   2  | Нурлан  |     2    | 45000\n--   3  | Фарида  |   NULL   |  NULL    <- НЕТ заказов!\n--   4  | Асет    |     4    | 7000\n\n-- Найти пользователей БЕЗ заказов\nSELECT u.id, u.name\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.id IS NULL;  -- NULL в правой = нет совпадения\n\n-- Статистика включая пользователей без заказов\nSELECT\n    u.name,\n    COUNT(o.id) AS order_count,    -- NULL не считается!\n    COALESCE(SUM(o.amount), 0) AS total_spent\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name\nORDER BY total_spent DESC;' },
        { type: 'tip', value: 'COUNT(o.id) с LEFT JOIN: COUNT(*) посчитает строки с NULL тоже, а COUNT(o.id) — только реальные совпадения. Всегда используй COUNT(column_from_right_table) после LEFT JOIN.' }
      ]
    },
    {
      id: 4,
      title: 'RIGHT JOIN и FULL JOIN',
      type: 'theory',
      content: [
        { type: 'text', value: 'RIGHT JOIN — зеркало LEFT JOIN: все строки правой таблицы. На практике почти всегда заменяется на LEFT JOIN (меняем порядок таблиц). FULL JOIN — все строки обеих таблиц.' },
        { type: 'code', language: 'sql', value: '-- RIGHT JOIN: все записи из правой таблицы\nSELECT u.name, o.id, o.amount\nFROM orders o\nRIGHT JOIN users u ON o.user_id = u.id;\n-- Эквивалентно:\nSELECT u.name, o.id, o.amount\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id;\n-- Используй LEFT JOIN — более читаемо\n\n-- FULL OUTER JOIN: все строки обеих таблиц\nSELECT u.name, o.id, o.amount\nFROM users u\nFULL OUTER JOIN orders o ON u.id = o.user_id;\n\n-- Результат: пользователи без заказов (NULL в order) +\n--             заказы без пользователей (NULL в user) +\n--             все совпадения\n\n-- Найти "осиротевшие" записи с обеих сторон\nSELECT\n    u.name AS user,\n    o.id AS order_id\nFROM users u\nFULL OUTER JOIN orders o ON u.id = o.user_id\nWHERE u.id IS NULL OR o.id IS NULL;  -- Только несовпадающие' },
        { type: 'list', items: [
          'RIGHT JOIN = LEFT JOIN с переставленными таблицами — предпочитай LEFT JOIN для единообразия',
          'FULL OUTER JOIN включает ВСЕ строки обеих таблиц, независимо от совпадений',
          'FULL OUTER JOIN с WHERE IS NULL — находит "несогласованные" данные с обеих сторон',
          'FULL OUTER JOIN используется для аудита целостности данных',
          'MySQL до 8.0 не поддерживает FULL OUTER JOIN — эмулируй через LEFT UNION RIGHT'
        ]},
        { type: 'tip', value: 'В команде принято использовать только LEFT JOIN (не RIGHT). Это упрощает чтение: главная таблица всегда слева (в FROM), зависимые — справа (в JOIN). RIGHT JOIN читается менее интуитивно.' }
      ]
    },
    {
      id: 5,
      title: 'USING и NATURAL JOIN: краткий синтаксис',
      type: 'theory',
      content: [
        { type: 'text', value: 'USING — краткая запись когда имена столбцов в обеих таблицах одинаковые. NATURAL JOIN автоматически ищет одинаковые имена (использовать осторожно).' },
        { type: 'code', language: 'sql', value: '-- ON (стандартный способ)\nSELECT * FROM orders o JOIN users u ON o.user_id = u.id;\n\n-- USING (краткий способ когда имена совпадают)\n-- Если в обеих таблицах столбец называется "user_id"\nSELECT * FROM orders JOIN users USING (user_id);\n\n-- USING не дублирует столбец в результате!\n-- ON:    orders.user_id и users.id — два отдельных столбца\n-- USING: один столбец user_id\n\n-- Несколько столбцов в USING\nSELECT *\nFROM order_items\nJOIN products USING (product_id);\n\n-- NATURAL JOIN (осторожно!): автоматически соединяет по всем одинаковым именам\nSELECT * FROM orders NATURAL JOIN users;\n-- Найдёт: id (одинаковое в обеих!) и user_id -> может вернуть неожиданный результат!\n-- НИКОГДА не используй NATURAL JOIN в продакшн-коде' },
        { type: 'warning', value: 'NATURAL JOIN опасен! Если позже добавится столбец с одинаковым именем в обе таблицы, запрос сломается. Всегда явно указывай ON или USING.' }
      ]
    },
    {
      id: 6,
      title: 'Несколько JOIN: объединение трёх и более таблиц',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реальные запросы часто объединяют 3-5 таблиц. JOIN-ы выполняются последовательно слева направо.' },
        { type: 'code', language: 'sql', value: '-- Полный отчёт: заказы + пользователи + товары + категории\nSELECT\n    o.id          AS order_id,\n    u.name        AS customer,\n    u.email,\n    p.name        AS product,\n    c.name        AS category,   -- из таблицы categories\n    o.quantity,\n    o.amount,\n    o.status,\n    o.created_at\nFROM orders     o\nJOIN users      u ON o.user_id     = u.id\nJOIN products   p ON o.product_id  = p.id\nJOIN categories c ON p.category_id = c.id\nWHERE o.created_at >= \'2024-01-01\'\nORDER BY o.created_at DESC;\n\n-- Смешивание типов JOIN\nSELECT\n    u.name,\n    o.amount,\n    a.street AS address  -- может быть NULL если адрес не указан\nFROM users u\nJOIN orders o ON u.id = o.user_id         -- Только заказы (INNER)\nLEFT JOIN addresses a ON u.id = a.user_id  -- Адрес необязателен\nWHERE o.status = \'completed\';' },
        { type: 'list', items: [
          'JOIN-ы выполняются последовательно: результат каждого становится входом следующего',
          'Псевдонимы таблиц (o, u, p) — обязательны при нескольких JOIN для однозначности',
          'Можно смешивать типы JOIN: INNER для обязательных связей, LEFT для необязательных',
          'При LEFT JOIN стоп: WHERE на столбцы правой таблицы превращает LEFT в INNER',
          'Порядок JOIN может влиять на производительность — оптимизатор обычно справляется сам'
        ]},
        { type: 'tip', value: 'Паттерн: делай INNER JOIN для обязательных связей (заказ всегда имеет пользователя), LEFT JOIN для необязательных (у пользователя может не быть адреса). WHERE фильтрует после всех JOIN-ов.' }
      ]
    },
    {
      id: 7,
      title: 'JOIN с GROUP BY: аналитика',
      type: 'theory',
      content: [
        { type: 'text', value: 'JOIN часто комбинируют с GROUP BY для создания аналитических отчётов объединяющих данные из нескольких таблиц.' },
        { type: 'code', language: 'sql', value: '-- Топ-3 категории по выручке\nSELECT\n    p.category,\n    COUNT(o.id)    AS orders,\n    SUM(o.amount)  AS revenue\nFROM products p\nJOIN orders o ON p.id = o.product_id\nWHERE o.status = \'completed\'\nGROUP BY p.category\nORDER BY revenue DESC\nLIMIT 3;\n\n-- Пользователи с количеством заказов по статусам\nSELECT\n    u.name,\n    COUNT(o.id)    AS total_orders,\n    COUNT(o.id) FILTER (WHERE o.status = \'completed\')  AS completed,\n    COUNT(o.id) FILTER (WHERE o.status = \'cancelled\')  AS cancelled,\n    COALESCE(SUM(o.amount) FILTER (WHERE o.status = \'completed\'), 0) AS revenue\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name\nORDER BY revenue DESC;' },
        { type: 'list', items: [
          'JOIN + GROUP BY — основной паттерн для аналитических отчётов по нескольким таблицам',
          'LEFT JOIN + GROUP BY включает в отчёт пользователей с нулевыми показателями',
          'COUNT(o.id) FILTER (WHERE ...) — условный подсчёт без подзапроса (PostgreSQL)',
          'COALESCE(SUM(...), 0) заменяет NULL на 0 для пользователей без заказов',
          'GROUP BY u.id, u.name — указывай id чтобы различать пользователей с одинаковым именем'
        ]},
        { type: 'tip', value: 'Для аналитики с несколькими метриками используй FILTER (WHERE ...) вместо подзапросов или CASE WHEN. Это чище и быстрее. Пример: COUNT(*) FILTER (WHERE status = \'completed\') считает только завершённые заказы.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Отчёт по заказам с JOIN',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай полные аналитические отчёты объединяя несколько таблиц.',
      requirements: [
        'Используй таблицы: users, products, orders',
        'Запрос 1: полный список заказов с именем покупателя и названием товара',
        'Запрос 2: все пользователи и количество их заказов (включая тех у кого 0)',
        'Запрос 3: топ-3 покупателя по потраченной сумме',
        'Запрос 4: пользователи которые никогда не делали заказов',
        'Запрос 5: выручка по категориям товаров'
      ],
      hint: 'Пользователи без заказов: LEFT JOIN + WHERE o.id IS NULL. Выручка по категориям: JOIN products, потом GROUP BY category. Запрос 2 требует LEFT JOIN чтобы включить пользователей с 0 заказов.',
      expectedOutput: 'Заказы с именами пользователей (INNER JOIN):\n order_id | user_name | amount    | status\n----------+-----------+-----------+-----------\n        1 | Алия      | 85000.00  | completed\n        2 | Нурлан    | 45000.00  | pending\n        3 | Алия      | 32000.00  | completed\n(3 rows)\n\nВсе пользователи с количеством заказов (LEFT JOIN):\n user_name | order_count | total_spent\n-----------+-------------+-------------\n Алия      |           2 |  117000.00\n Нурлан    |           1 |   45000.00\n Фарида    |           0 |       0.00\n(3 rows)\n\nПользователи без заказов:\n user_id | user_name\n---------+-----------\n       3 | Фарида\n(1 row)\n\nВыручка по категориям:\n category   | revenue    | orders_count\n------------+------------+--------------\n Ноутбуки   | 450000.00  |            7\n Телефоны   | 320000.00  |            9\n(2 rows)',
      solution: '-- 1. Заказы с покупателем и товаром\nSELECT\n    o.id            AS order_id,\n    u.name          AS customer,\n    p.name          AS product,\n    o.quantity,\n    o.amount,\n    o.status,\n    o.created_at\nFROM orders o\nJOIN users    u ON o.user_id    = u.id\nJOIN products p ON o.product_id = p.id\nORDER BY o.created_at DESC;\n\n-- 2. Пользователи + количество заказов\nSELECT\n    u.name,\n    COUNT(o.id) AS order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name\nORDER BY order_count DESC;\n\n-- 3. Топ-3 покупателя\nSELECT\n    u.name,\n    COUNT(o.id)   AS orders,\n    SUM(o.amount) AS total_spent\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name\nORDER BY total_spent DESC\nLIMIT 3;\n\n-- 4. Пользователи без заказов\nSELECT u.id, u.name, u.email\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nWHERE o.id IS NULL;\n\n-- 5. Выручка по категориям\nSELECT\n    p.category,\n    COUNT(o.id)         AS total_orders,\n    SUM(o.amount)       AS revenue,\n    ROUND(AVG(o.amount), 0) AS avg_order\nFROM orders o\nJOIN products p ON o.product_id = p.id\nWHERE o.status = \'completed\'\nGROUP BY p.category\nORDER BY revenue DESC;',
      explanation: 'JOIN + GROUP BY — основа аналитической работы с SQL. LEFT JOIN с WHERE o.id IS NULL — паттерн для поиска "осиротевших" записей. COUNT(o.id) считает только реальные совпадения, не NULL.'
    }
  ]
}
