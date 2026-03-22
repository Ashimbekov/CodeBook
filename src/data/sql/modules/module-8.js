export default {
  id: 8,
  title: 'Подзапросы',
  description: 'Подзапросы (subqueries) в SQL: в SELECT, FROM, WHERE. Операторы IN, EXISTS, ANY, ALL. Коррелированные подзапросы и оптимизация.',
  lessons: [
    {
      id: 1,
      title: 'Подзапросы в WHERE с IN',
      type: 'theory',
      content: [
        { type: 'text', value: 'Подзапрос — это SELECT внутри другого SELECT. Самый простой случай: подзапрос в WHERE через IN — возвращает список значений для фильтрации.' },
        { type: 'code', language: 'sql', value: '-- Найти пользователей которые делали заказы\nSELECT name, email\nFROM users\nWHERE id IN (\n    SELECT DISTINCT user_id\n    FROM orders\n    WHERE status = \'completed\'\n);\n-- Подзапрос возвращает список user_id с завершёнными заказами\n-- Внешний запрос фильтрует пользователей\n\n-- Эквивалентно с JOIN:\nSELECT DISTINCT u.name, u.email\nFROM users u\nJOIN orders o ON u.id = o.user_id\nWHERE o.status = \'completed\';\n-- JOIN обычно быстрее для этого случая\n\n-- NOT IN: пользователи БЕЗ заказов\nSELECT name, email\nFROM users\nWHERE id NOT IN (\n    SELECT DISTINCT user_id\n    FROM orders\n    WHERE user_id IS NOT NULL  -- ВАЖНО: NULL в подзапросе ломает NOT IN!\n);\n\n-- Товары которых нет ни в одном заказе\nSELECT name, price\nFROM products\nWHERE id NOT IN (\n    SELECT DISTINCT product_id\n    FROM orders\n    WHERE product_id IS NOT NULL\n);' },
        { type: 'list', items: [
          'IN с подзапросом: подзапрос возвращает список значений, внешний запрос фильтрует по нему',
          'NOT IN опасен с NULL: если подзапрос вернёт NULL, NOT IN всегда возвращает FALSE',
          'Всегда добавляй WHERE column IS NOT NULL в подзапрос для NOT IN',
          'IN эквивалентен EXISTS для проверки существования — EXISTS часто быстрее',
          'JOIN обычно эффективнее подзапроса с IN — оптимизатор лучше строит план'
        ]},
        { type: 'tip', value: 'Золотое правило: NOT IN с подзапросом — замени на NOT EXISTS. При наличии NULL в подзапросе NOT IN возвращает FALSE для всех строк. NOT EXISTS такой проблемы не имеет.' }
      ]
    },
    {
      id: 2,
      title: 'EXISTS: проверка существования',
      type: 'theory',
      content: [
        { type: 'text', value: 'EXISTS проверяет возвращает ли подзапрос хотя бы одну строку. Возвращает TRUE/FALSE. Эффективнее IN для больших таблиц — останавливается при первом совпадении.' },
        { type: 'code', language: 'sql', value: '-- Пользователи с хотя бы одним завершённым заказом\nSELECT name, email\nFROM users u\nWHERE EXISTS (\n    SELECT 1  -- Содержимое SELECT не важно, важно что строка есть\n    FROM orders o\n    WHERE o.user_id = u.id     -- Коррелированный: ссылается на u!\n      AND o.status = \'completed\'\n);\n\n-- NOT EXISTS: пользователи без завершённых заказов\nSELECT name, email\nFROM users u\nWHERE NOT EXISTS (\n    SELECT 1\n    FROM orders o\n    WHERE o.user_id = u.id\n      AND o.status = \'completed\'\n);\n\n-- EXISTS vs IN: когда что использовать?\n-- EXISTS быстрее когда подзапрос возвращает много строк (останавливается раньше)\n-- IN лучше читается для небольших списков\n-- NOT EXISTS более надёжен чем NOT IN (проблема с NULL)\n\n-- Проверить наличие хотя бы одной записи в таблице\nSELECT EXISTS(SELECT 1 FROM orders) AS has_orders;  -- TRUE/FALSE' },
        { type: 'tip', value: 'В EXISTS пишут SELECT 1 или SELECT * — не имеет значения что именно в SELECT, важна только ли есть результат. SELECT 1 — стандартное соглашение.' }
      ]
    },
    {
      id: 3,
      title: 'Подзапросы в FROM (производные таблицы)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Подзапрос в FROM создаёт временную "производную таблицу" (derived table). Нужен когда нельзя сослаться на псевдоним из SELECT в WHERE.' },
        { type: 'code', language: 'sql', value: '-- Нельзя использовать псевдоним из SELECT в WHERE\n-- ОШИБКА: SELECT price * 0.9 AS sale_price FROM products WHERE sale_price < 50000\n\n-- Решение через подзапрос в FROM:\nSELECT name, sale_price\nFROM (\n    SELECT name, price * 0.9 AS sale_price\n    FROM products\n) AS discounted               -- Псевдоним обязателен!\nWHERE sale_price < 50000;\n\n-- Статистика по категориям, затем фильтруем\nSELECT category, avg_price\nFROM (\n    SELECT\n        category,\n        ROUND(AVG(price), 0) AS avg_price\n    FROM products\n    GROUP BY category\n) AS category_stats\nWHERE avg_price > 50000\nORDER BY avg_price DESC;\n\n-- Сложный пример: топ продавцов по месяцам\nSELECT\n    month,\n    seller,\n    monthly_revenue\nFROM (\n    SELECT\n        DATE_TRUNC(\'month\', o.created_at) AS month,\n        u.name AS seller,\n        SUM(o.amount) AS monthly_revenue,\n        RANK() OVER (PARTITION BY DATE_TRUNC(\'month\', o.created_at)\n                     ORDER BY SUM(o.amount) DESC) AS rank\n    FROM orders o\n    JOIN users u ON o.user_id = u.id\n    GROUP BY 1, 2\n) ranked\nWHERE rank = 1;' },
        { type: 'list', items: [
          'Подзапрос в FROM называется "производная таблица" или "inline view"',
          'Псевдоним обязателен: FROM (...) AS alias — без него ошибка синтаксиса',
          'Используй когда нужно фильтровать по вычисленному значению (HAVING альтернатива для агрегатов)',
          'Позволяет использовать оконные функции (RANK, ROW_NUMBER) и затем фильтровать по ним',
          'CTE (WITH) — более читаемая альтернатива подзапросу в FROM'
        ]},
        { type: 'tip', value: 'Подзапрос в FROM нужен в двух случаях: 1) Когда надо использовать псевдоним из SELECT в WHERE/HAVING. 2) Когда надо фильтровать по результату оконной функции. В остальных случаях CTE читаемее.' }
      ]
    },
    {
      id: 4,
      title: 'Подзапросы в SELECT (скалярные)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Скалярный подзапрос в SELECT возвращает ровно одно значение. Выполняется для каждой строки внешнего запроса.' },
        { type: 'code', language: 'sql', value: '-- Количество заказов для каждого пользователя (коррелированный)\nSELECT\n    u.name,\n    (\n        SELECT COUNT(*)\n        FROM orders o\n        WHERE o.user_id = u.id\n    ) AS order_count\nFROM users u;\n-- Для каждого пользователя выполняется отдельный COUNT запрос\n-- Работает, но медленнее LEFT JOIN + GROUP BY\n\n-- Лучше через LEFT JOIN:\nSELECT u.name, COUNT(o.id) AS order_count\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name;\n\n-- Когда скалярный подзапрос оправдан: сравнение с агрегатом\nSELECT\n    name,\n    price,\n    price - (SELECT AVG(price) FROM products) AS diff_from_avg,\n    ROUND(price / (SELECT AVG(price) FROM products) * 100, 1) AS pct_of_avg\nFROM products\nORDER BY diff_from_avg DESC;' },
        { type: 'list', items: [
          'Скалярный подзапрос должен возвращать ровно 1 строку и 1 столбец — иначе ошибка',
          'Коррелированный подзапрос ссылается на столбец внешнего запроса (u.id)',
          'Коррелированный подзапрос в SELECT выполняется для каждой строки — может быть медленным',
          'LEFT JOIN + GROUP BY обычно быстрее коррелированного подзапроса в SELECT',
          'Скалярный подзапрос оправдан для сравнения с одним агрегатом (AVG, MAX по всей таблице)'
        ]},
        { type: 'tip', value: 'Если видишь скалярный подзапрос в SELECT ссылающийся на внешнюю строку — это коррелированный подзапрос. Он выполняется N раз (по одному на строку). Попробуй заменить на JOIN для больших таблиц.' }
      ]
    },
    {
      id: 5,
      title: 'ANY / ALL: сравнение с набором',
      type: 'theory',
      content: [
        { type: 'text', value: 'ANY возвращает TRUE если условие истинно хотя бы для одного значения из подзапроса. ALL — если условие истинно для ВСЕХ значений.' },
        { type: 'code', language: 'sql', value: '-- ANY (эквивалентно IN для равенства)\nSELECT name, price FROM products\nWHERE price = ANY(SELECT price FROM products WHERE category = \'Телефоны\');\n-- = ANY идентично IN\n\n-- Но ANY мощнее — работает с любыми операторами:\nSELECT name, salary FROM employees\nWHERE salary > ANY(\n    SELECT salary FROM employees WHERE department = \'Sales\'\n);\n-- Зарплата больше хотя бы одной зарплаты в отделе продаж\n-- = зарплата больше МИНИМАЛЬНОЙ зарплаты в продажах\n\n-- ALL: больше ВСЕХ зарплат в sales (больше максимальной)\nSELECT name, salary FROM employees\nWHERE salary > ALL(\n    SELECT salary FROM employees WHERE department = \'Sales\'\n);\n\n-- Практический пример: товары дороже всех товаров в категории "Аксессуары"\nSELECT name, price\nFROM products\nWHERE price > ALL(\n    SELECT price FROM products WHERE category = \'Аксессуары\'\n);\n-- Эквивалентно:\nSELECT name, price\nFROM products\nWHERE price > (SELECT MAX(price) FROM products WHERE category = \'Аксессуары\');' },
        { type: 'list', items: [
          '= ANY эквивалентно IN, <> ALL эквивалентно NOT IN — выбирай более читаемый вариант',
          '> ANY = больше минимума из набора, > ALL = больше максимума из набора',
          '< ANY = меньше максимума, < ALL = меньше минимума',
          'ANY/ALL с NULL в подзапросе: > ALL вернёт FALSE если есть NULL (как NOT IN)',
          'На практике ANY/ALL редко используют — заменяют на IN/EXISTS/MAX/MIN'
        ]},
        { type: 'tip', value: 'Памятка: val > ANY(список) = val > MIN(список); val > ALL(список) = val > MAX(список). Используй MAX/MIN вместо ALL/ANY — код понятнее и оптимизатор лучше с ними работает.' }
      ]
    },
    {
      id: 6,
      title: 'CTE (WITH): именованные подзапросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'CTE (Common Table Expressions) позволяют давать имена подзапросам через WITH. Делает сложные запросы читаемыми и позволяет переиспользовать подзапросы.' },
        { type: 'code', language: 'sql', value: '-- Синтаксис CTE\nWITH\n    cte_name AS (\n        SELECT ...\n    )\nSELECT * FROM cte_name;\n\n-- Пример: найти пользователей с выше среднего потраченной суммой\nWITH user_totals AS (\n    SELECT\n        user_id,\n        SUM(amount) AS total_spent\n    FROM orders\n    WHERE status = \'completed\'\n    GROUP BY user_id\n),\navg_spending AS (\n    SELECT AVG(total_spent) AS avg_spent\n    FROM user_totals\n)\nSELECT\n    u.name,\n    ut.total_spent,\n    avg.avg_spent,\n    ut.total_spent - avg.avg_spent AS above_average\nFROM user_totals ut\nJOIN users u ON ut.user_id = u.id\nCROSS JOIN avg_spending avg\nWHERE ut.total_spent > avg.avg_spent\nORDER BY ut.total_spent DESC;\n\n-- Рекурсивный CTE: обход иерархии\nWITH RECURSIVE org_chart AS (\n    -- Базовый случай: директор (нет менеджера)\n    SELECT id, name, manager_id, 0 AS level\n    FROM employees\n    WHERE manager_id IS NULL\n\n    UNION ALL\n\n    -- Рекурсия: добавляем подчинённых\n    SELECT e.id, e.name, e.manager_id, oc.level + 1\n    FROM employees e\n    JOIN org_chart oc ON e.manager_id = oc.id\n)\nSELECT\n    REPEAT(\'  \', level) || name AS org_chart,\n    level\nFROM org_chart\nORDER BY level, name;' },
        { type: 'list', items: [
          'CTE (WITH) — именованный подзапрос выполняемый один раз и доступный по имени',
          'Несколько CTE разделяются запятой, каждый может ссылаться на предыдущий',
          'WITH RECURSIVE — рекурсивный CTE для иерархий, графов, последовательностей',
          'Рекурсивный CTE: базовый случай UNION ALL рекурсивный шаг',
          'В PostgreSQL CTE по умолчанию — барьер оптимизации (optimization fence); добавь NOT MATERIALIZED для встраивания'
        ]},
        { type: 'tip', value: 'CTE против подзапросов в FROM: CTE читаемее и позволяет переиспользовать. Для производительности: в PostgreSQL 12+ CTE inline по умолчанию для независимых CTE. Добавь MATERIALIZED если нужно вычислить один раз.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Коррелированные подзапросы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реши задачи используя различные виды подзапросов.',
      requirements: [
        'Запрос 1: товары дороже средней цены в своей категории (коррелированный подзапрос)',
        'Запрос 2: пользователи сделавшие заказ в первые 7 дней (EXISTS)',
        'Запрос 3: найти самый дорогой заказ каждого пользователя (подзапрос в WHERE)',
        'Запрос 4: CTE для подсчёта: среднее количество заказов на пользователя, потом найти пользователей выше среднего',
        'Запрос 5: категории где ВСЕ товары имеют рейтинг > 4.0 (ALL или NOT EXISTS)'
      ],
      hint: 'Запрос 1: WHERE p.price > (SELECT AVG(p2.price) FROM products p2 WHERE p2.category = p.category). Запрос 3: WHERE o.amount = (SELECT MAX(o2.amount) FROM orders o2 WHERE o2.user_id = o.user_id).',
      expectedOutput: 'Товары дороже средней цены в своей категории:\n name            | category   | price    | avg_in_category\n-----------------+------------+----------+-----------------\n Ноутбук Dell    | Ноутбуки   | 85000.00 |       65000.00\n Телефон Samsung | Телефоны   | 65000.00 |       42000.00\n(2 rows)\n\nПользователи, купившие "Ноутбук Dell" (EXISTS):\n user_id | name\n---------+--------\n       1 | Алия\n       5 | Ерлан\n(2 rows)\n\nСамый большой заказ каждого пользователя (коррелированный подзапрос):\n user_name | max_order_amount\n-----------+-----------------\n Алия      |        85000.00\n Нурлан    |        45000.00\n Фарида    |        32000.00\n(3 rows)\n\nТовары не купленные никем (NOT IN):\n product_id | name\n------------+-------\n         15 | Кабель USB\n         18 | Чехол\n(2 rows)',
      solution: '-- 1. Товары дороже средней цены в своей категории\nSELECT\n    p.name,\n    p.category,\n    p.price,\n    ROUND((SELECT AVG(p2.price) FROM products p2 WHERE p2.category = p.category), 0) AS cat_avg\nFROM products p\nWHERE p.price > (\n    SELECT AVG(p2.price)\n    FROM products p2\n    WHERE p2.category = p.category\n)\nORDER BY p.category, p.price DESC;\n\n-- 2. Пользователи с заказом в первые 7 дней после регистрации\nSELECT u.name, u.email\nFROM users u\nWHERE EXISTS (\n    SELECT 1\n    FROM orders o\n    WHERE o.user_id = u.id\n      AND o.created_at <= u.created_at + INTERVAL \'7 days\'\n);\n\n-- 3. Самый дорогой заказ каждого пользователя\nSELECT\n    u.name,\n    o.id AS order_id,\n    o.amount\nFROM orders o\nJOIN users u ON o.user_id = u.id\nWHERE o.amount = (\n    SELECT MAX(o2.amount)\n    FROM orders o2\n    WHERE o2.user_id = o.user_id\n);\n\n-- 4. CTE: пользователи с числом заказов выше среднего\nWITH order_counts AS (\n    SELECT user_id, COUNT(*) AS cnt\n    FROM orders\n    GROUP BY user_id\n),\navg_count AS (\n    SELECT AVG(cnt) AS avg_orders FROM order_counts\n)\nSELECT\n    u.name,\n    oc.cnt AS order_count,\n    ROUND(ac.avg_orders, 2) AS avg\nFROM order_counts oc\nJOIN users u ON oc.user_id = u.id\nCROSS JOIN avg_count ac\nWHERE oc.cnt > ac.avg_orders;\n\n-- 5. Категории где все товары имеют рейтинг > 4.0\nSELECT DISTINCT category\nFROM products p\nWHERE NOT EXISTS (\n    SELECT 1\n    FROM products p2\n    WHERE p2.category = p.category\n      AND (p2.rating IS NULL OR p2.rating <= 4.0)\n);',
      explanation: 'Коррелированный подзапрос ссылается на столбец внешнего запроса (p.category). Выполняется для каждой строки. EXISTS с NOT EXISTS надёжнее NOT IN при наличии NULL. CTE делают сложные запросы читаемыми.'
    }
  ]
}
