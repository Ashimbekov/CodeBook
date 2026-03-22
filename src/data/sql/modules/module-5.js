export default {
  id: 5,
  title: 'GROUP BY и HAVING',
  description: 'Группировка данных с GROUP BY, агрегация по группам, фильтрация групп через HAVING и порядок выполнения SQL-запроса.',
  lessons: [
    {
      id: 1,
      title: 'GROUP BY: группировка строк',
      type: 'theory',
      content: [
        { type: 'text', value: 'GROUP BY объединяет строки с одинаковыми значениями в группы и применяет агрегатные функции к каждой группе отдельно.' },
        { type: 'heading', value: 'Принцип работы GROUP BY' },
        { type: 'code', language: 'sql', value: '-- Количество товаров в каждой категории\nSELECT\n    category,\n    COUNT(*) AS product_count\nFROM products\nGROUP BY category;\n\n-- Результат:\n-- category    | product_count\n-- Телефоны    |      4\n-- Планшеты    |      2\n-- Ноутбуки    |      1\n-- Аксессуары  |      3\n\n-- Несколько агрегатов в одной группировке\nSELECT\n    category,\n    COUNT(*)              AS count,\n    ROUND(AVG(price), 0)  AS avg_price,\n    MIN(price)            AS min_price,\n    MAX(price)            AS max_price,\n    SUM(stock)            AS total_stock\nFROM products\nGROUP BY category\nORDER BY avg_price DESC;\n\n-- Правило: в SELECT можно использовать только\n-- 1) Столбцы из GROUP BY\n-- 2) Агрегатные функции\n-- Нельзя: SELECT name, category, COUNT(*) -- name не в GROUP BY!') },
        { type: 'warning', value: 'В SELECT при GROUP BY можно указывать только столбцы из GROUP BY и агрегатные функции. Любой другой столбец вызовет ошибку: "column must appear in the GROUP BY clause".' }
      ]
    },
    {
      id: 2,
      title: 'GROUP BY по нескольким столбцам',
      type: 'theory',
      content: [
        { type: 'text', value: 'GROUP BY может включать несколько столбцов — тогда группы формируются по уникальным комбинациям всех указанных столбцов.' },
        { type: 'code', language: 'sql', value: '-- Количество заказов по пользователю И статусу\nSELECT\n    user_id,\n    status,\n    COUNT(*) AS order_count,\n    SUM(amount) AS total_amount\nFROM orders\nGROUP BY user_id, status\nORDER BY user_id, status;\n\n-- Результат:\n-- user_id | status    | order_count | total_amount\n-- 1       | cancelled |      1      | 55000\n-- 1       | completed |      1      | 185000\n-- 1       | pending   |      1      | 250000\n-- 2       | completed |      2      | 230000\n-- ...\n\n-- Продажи по году и месяцу\nSELECT\n    EXTRACT(YEAR  FROM created_at) AS year,\n    EXTRACT(MONTH FROM created_at) AS month,\n    COUNT(*) AS orders,\n    SUM(amount) AS revenue\nFROM orders\nGROUP BY\n    EXTRACT(YEAR  FROM created_at),\n    EXTRACT(MONTH FROM created_at)\nORDER BY year, month;\n\n-- Группировка по выражению (псевдоним не работает в GROUP BY!)\nSELECT\n    DATE_TRUNC(\'month\', created_at) AS month,\n    SUM(amount) AS revenue\nFROM orders\nGROUP BY DATE_TRUNC(\'month\', created_at)\nORDER BY month;' }
      ]
    },
    {
      id: 3,
      title: 'HAVING: фильтрация групп',
      type: 'theory',
      content: [
        { type: 'text', value: 'HAVING фильтрует группы после агрегации. WHERE фильтрует строки ДО группировки, HAVING — ПОСЛЕ. Это принципиальное отличие.' },
        { type: 'code', language: 'sql', value: '-- Категории с более чем 2 товарами\nSELECT category, COUNT(*) AS count\nFROM products\nGROUP BY category\nHAVING COUNT(*) > 2;\n\n-- Пользователи с суммой заказов > 200000 тг\nSELECT\n    user_id,\n    COUNT(*) AS order_count,\n    SUM(amount) AS total_spent\nFROM orders\nGROUP BY user_id\nHAVING SUM(amount) > 200000\nORDER BY total_spent DESC;\n\n-- WHERE vs HAVING\nSELECT category, AVG(price) AS avg_price\nFROM products\nWHERE stock > 0             -- Фильтруем строки ДО группировки (только товары в наличии)\nGROUP BY category\nHAVING AVG(price) > 50000   -- Фильтруем группы ПОСЛЕ агрегации\nORDER BY avg_price DESC;\n\n-- Нельзя: HAVING с неагрегированным столбцом без GROUP BY\n-- Нельзя: HAVING без GROUP BY (технически можно, но смысл теряется)\n-- Нельзя использовать псевдоним из SELECT в HAVING:\n-- ОШИБКА: HAVING avg_price > 50000\n-- Правильно: HAVING AVG(price) > 50000' },
        { type: 'tip', value: 'WHERE vs HAVING: WHERE = "какие строки взять для агрегации", HAVING = "какие группы показать в результате". Используй WHERE везде где возможно — это быстрее (меньше данных для GROUP BY).' }
      ]
    },
    {
      id: 4,
      title: 'Порядок выполнения SQL-запроса',
      type: 'theory',
      content: [
        { type: 'text', value: 'SQL-запрос выполняется не в том порядке в котором написан. Понимание этого порядка объясняет почему нельзя использовать псевдонимы SELECT в WHERE.' },
        { type: 'code', language: 'sql', value: '-- Порядок НАПИСАНИЯ:\n-- SELECT ... FROM ... WHERE ... GROUP BY ... HAVING ... ORDER BY ... LIMIT\n\n-- Порядок ВЫПОЛНЕНИЯ:\n-- 1. FROM     — определяем таблицы/JOIN\n-- 2. WHERE    — фильтруем строки\n-- 3. GROUP BY — группируем\n-- 4. HAVING   — фильтруем группы\n-- 5. SELECT   — вычисляем выражения и псевдонимы\n-- 6. ORDER BY — сортируем (МОЖЕТ использовать псевдонимы SELECT!)\n-- 7. LIMIT/OFFSET — обрезаем результат\n\n-- Почему нельзя в WHERE использовать псевдоним из SELECT:\nSELECT price * 0.9 AS discounted_price\nFROM products\nWHERE discounted_price < 50000;  -- ОШИБКА! SELECT ещё не выполнен\n\n-- Правильно:\nSELECT price * 0.9 AS discounted_price\nFROM products\nWHERE price * 0.9 < 50000;     -- ОК\n-- Или через подзапрос:\nSELECT * FROM (\n    SELECT name, price * 0.9 AS discounted_price FROM products\n) sub\nWHERE discounted_price < 50000;' }
      ]
    },
    {
      id: 5,
      title: 'ROLLUP и CUBE: итоги',
      type: 'theory',
      content: [
        { type: 'text', value: 'ROLLUP и CUBE — расширения GROUP BY для создания иерархических итогов. ROLLUP добавляет строки с промежуточными и общими итогами.' },
        { type: 'code', language: 'sql', value: '-- GROUP BY ROLLUP: подитоги по каждому уровню\nSELECT\n    COALESCE(category, \'ИТОГО\') AS category,\n    COALESCE(status, \'Все статусы\') AS status,\n    COUNT(*) AS count,\n    SUM(amount) AS total\nFROM orders\nJOIN products ON orders.product_id = products.id\nGROUP BY ROLLUP(category, status)\nORDER BY category NULLS LAST, status NULLS LAST;\n\n-- Результат включает:\n-- category конкретная + status конкретный (обычные строки)\n-- category конкретная + NULL (итог по категории)\n-- NULL + NULL (общий итог)\n\n-- GROUP BY CUBE: все возможные комбинации\nGROUP BY CUBE(year, quarter, category)\n-- Включает: year+quarter+category, year+quarter, year+category,\n--           quarter+category, year, quarter, category, итого\n\n-- GROUPING SETS: явное указание группировок\nGROUP BY GROUPING SETS (\n    (category, status),  -- По категории и статусу\n    (category),          -- Только по категории\n    ()                   -- Общий итог\n);' }
      ]
    },
    {
      id: 6,
      title: 'Практические паттерны GROUP BY',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим реальные бизнес-задачи решаемые через GROUP BY.' },
        { type: 'code', language: 'sql', value: '-- Топ-5 категорий по выручке\nSELECT\n    p.category,\n    SUM(o.amount) AS revenue\nFROM orders o\nJOIN products p ON o.product_id = p.id\nWHERE o.status = \'completed\'\nGROUP BY p.category\nORDER BY revenue DESC\nLIMIT 5;\n\n-- Покупатели которые сделали > 2 заказов\nSELECT\n    u.name,\n    COUNT(o.id) AS orders,\n    SUM(o.amount) AS total_spent\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name\nHAVING COUNT(o.id) > 2\nORDER BY total_spent DESC;\n\n-- Средний рейтинг товаров по категориям\n-- только для категорий с минимум 3 оценками\nSELECT\n    category,\n    COUNT(rating)          AS rated_count,\n    ROUND(AVG(rating), 2)  AS avg_rating\nFROM products\nWHERE rating IS NOT NULL\nGROUP BY category\nHAVING COUNT(rating) >= 3\nORDER BY avg_rating DESC;' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Аналитика по заказам',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай аналитические отчёты используя GROUP BY и HAVING.',
      requirements: [
        'Запрос 1: количество заказов и общая сумма по каждому пользователю',
        'Запрос 2: только пользователи с суммой заказов > 300000 тг (HAVING)',
        'Запрос 3: статистика по статусам (количество, сумма, процент от общего)',
        'Запрос 4: выручка по месяцам за 2024 год',
        'Запрос 5: пользователи которые делали только отменённые заказы'
      ],
      hint: 'Процент: ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2). Только отменённые: HAVING COUNT(*) = COUNT(*) FILTER (WHERE status = "cancelled"). Для запроса 5 можно также: HAVING MIN(status) = MAX(status) AND MIN(status) = "cancelled".',
      solution: '-- 1. Заказы и сумма по пользователю\nSELECT\n    user_id,\n    COUNT(*) AS order_count,\n    SUM(amount) AS total_amount,\n    ROUND(AVG(amount), 0) AS avg_order\nFROM orders\nGROUP BY user_id\nORDER BY total_amount DESC;\n\n-- 2. Только "тяжёлые" покупатели\nSELECT\n    user_id,\n    COUNT(*) AS order_count,\n    SUM(amount) AS total_spent\nFROM orders\nGROUP BY user_id\nHAVING SUM(amount) > 300000\nORDER BY total_spent DESC;\n\n-- 3. Статистика по статусам\nSELECT\n    status,\n    COUNT(*) AS count,\n    SUM(amount) AS total,\n    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) AS percent_of_total\nFROM orders\nGROUP BY status;\n\n-- 4. Выручка по месяцам 2024\nSELECT\n    DATE_TRUNC(\'month\', created_at) AS month,\n    COUNT(*) AS orders,\n    SUM(amount) AS revenue\nFROM orders\nWHERE EXTRACT(YEAR FROM created_at) = 2024\n  AND status = \'completed\'\nGROUP BY DATE_TRUNC(\'month\', created_at)\nORDER BY month;\n\n-- 5. Только с отменёнными заказами\nSELECT user_id\nFROM orders\nGROUP BY user_id\nHAVING COUNT(*) = COUNT(*) FILTER (WHERE status = \'cancelled\');',
      explanation: 'GROUP BY + HAVING — мощный инструмент аналитики. WHERE фильтрует строки (до GROUP BY), HAVING — группы (после). SUM(COUNT(*)) OVER () — это оконная функция для процентов, рассмотрим в следующих модулях.'
    }
  ]
}
