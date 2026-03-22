export default {
  id: 7,
  title: 'JOIN: продвинутый',
  description: 'Продвинутые техники JOIN: FULL OUTER JOIN, CROSS JOIN, самосоединение (self-join), условия JOIN кроме равенства и оптимизация.',
  lessons: [
    {
      id: 1,
      title: 'FULL OUTER JOIN: все строки обеих таблиц',
      type: 'theory',
      content: [
        { type: 'text', value: 'FULL OUTER JOIN возвращает все строки из обеих таблиц. Для строк без совпадения — NULL в столбцах другой таблицы.' },
        { type: 'code', language: 'sql', value: '-- Все пользователи и все заказы\n-- включая пользователей без заказов и заказы без пользователей\nSELECT\n    u.id   AS user_id,\n    u.name AS user_name,\n    o.id   AS order_id,\n    o.amount\nFROM users u\nFULL OUTER JOIN orders o ON u.id = o.user_id;\n\n-- Результат:\n-- user_id | user_name | order_id | amount\n--    1    | Алия      |    1     | 185000  <- совпадение\n--    3    | Фарида    |   NULL   |  NULL   <- пользователь без заказов\n--   NULL  | NULL      |   15     |  5000   <- заказ без пользователя\n\n-- Симуляция FULL OUTER JOIN через UNION (для СУБД без него)\nSELECT u.name, o.id, o.amount\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\n\nUNION ALL\n\nSELECT u.name, o.id, o.amount\nFROM orders o\nLEFT JOIN users u ON o.user_id = u.id\nWHERE u.id IS NULL;\n-- Второй SELECT добавляет заказы без пользователей\n\n-- Практическое применение: аудит несоответствий\nSELECT\n    COALESCE(u.name, \'УДАЛЁН\') AS user,\n    COALESCE(o.id::TEXT, \'НЕТ ЗАКАЗОВ\') AS order_status\nFROM users u\nFULL OUTER JOIN orders o ON u.id = o.user_id\nWHERE u.id IS NULL OR o.user_id IS NULL;' }
      ]
    },
    {
      id: 2,
      title: 'CROSS JOIN: декартово произведение',
      type: 'theory',
      content: [
        { type: 'text', value: 'CROSS JOIN возвращает все возможные комбинации строк из двух таблиц. Результат: N × M строк. Используется для генерации комбинаций.' },
        { type: 'code', language: 'sql', value: '-- 3 цвета × 4 размера = 12 комбинаций\nSELECT c.name AS color, s.name AS size\nFROM colors c\nCROSS JOIN sizes s;\n-- Результат:\n-- Красный | XS\n-- Красный | S\n-- Красный | M\n-- Синий   | XS\n-- ...\n\n-- Старый синтаксис (избегай — выглядит как ошибочный JOIN)\nSELECT c.name, s.name FROM colors c, sizes s;\n\n-- Практическое применение 1: генерация матрицы\n-- Все сочетания продавцов и месяцев\nSELECT\n    s.name AS seller,\n    m.month_num\nFROM sellers s\nCROSS JOIN generate_series(1, 12) AS m(month_num)\nORDER BY s.name, m.month_num;\n\n-- Практическое применение 2: случайные пары\nSELECT\n    a.name AS player1,\n    b.name AS player2\nFROM players a\nCROSS JOIN players b\nWHERE a.id < b.id  -- Избегаем дубликатов и самопар\nORDER BY a.name, b.name;' },
        { type: 'warning', value: 'CROSS JOIN опасен! 1000 строк × 1000 строк = 1 000 000 строк. Всегда проверяй размеры таблиц перед CROSS JOIN.' }
      ]
    },
    {
      id: 3,
      title: 'Self-join: соединение таблицы с собой',
      type: 'theory',
      content: [
        { type: 'text', value: 'Self-join — объединение таблицы с самой собой через разные псевдонимы. Используется для иерархических данных (сотрудник-менеджер) и сравнения строк.' },
        { type: 'code', language: 'sql', value: '-- Таблица employees: id, name, salary, manager_id (-> id той же таблицы)\nCREATE TABLE employees (\n    id         SERIAL PRIMARY KEY,\n    name       VARCHAR(100),\n    salary     DECIMAL(10, 2),\n    manager_id INTEGER REFERENCES employees(id)  -- Самоссылка!\n);\n\n-- Self-join: найти сотрудника и его менеджера\nSELECT\n    e.name   AS employee,\n    e.salary,\n    m.name   AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id;\n-- LEFT JOIN: директор не имеет менеджера (manager_id IS NULL) — тоже показываем\n\n-- Результат:\n-- employee | salary  | manager\n-- Алия     | 150000  | Нурлан    <- у Алии менеджер Нурлан\n-- Нурлан   | 300000  | NULL      <- Нурлан — директор, нет менеджера\n\n-- Найти сотрудников которые зарабатывают больше своего менеджера\nSELECT\n    e.name    AS employee,\n    e.salary  AS emp_salary,\n    m.name    AS manager,\n    m.salary  AS mgr_salary\nFROM employees e\nJOIN employees m ON e.manager_id = m.id\nWHERE e.salary > m.salary;' }
      ]
    },
    {
      id: 4,
      title: 'JOIN с неравенством и диапазонами',
      type: 'theory',
      content: [
        { type: 'text', value: 'ON в JOIN не ограничен равенством. Можно использовать любые операторы сравнения для сложных условий соединения.' },
        { type: 'code', language: 'sql', value: '-- Найти продукты в ценовом диапазоне каждой категории скидок\n-- discount_bands: min_price, max_price, discount_pct\nSELECT\n    p.name,\n    p.price,\n    d.discount_pct\nFROM products p\nJOIN discount_bands d\n    ON p.price BETWEEN d.min_price AND d.max_price;\n\n-- Overlapping periods: найти конфликтующие бронирования\n-- bookings: id, room_id, start_date, end_date\nSELECT\n    a.id AS booking1,\n    b.id AS booking2,\n    a.room_id\nFROM bookings a\nJOIN bookings b\n    ON a.room_id = b.room_id\n    AND a.id <> b.id\n    AND a.start_date < b.end_date\n    AND a.end_date > b.start_date;\n-- Находит пары бронирований в одной комнате с пересекающимися датами\n\n-- Ранжирование: найти для каждого товара цены в категории выше и ниже\nSELECT\n    a.name,\n    a.price,\n    COUNT(b.id) AS cheaper_in_category\nFROM products a\nJOIN products b\n    ON a.category = b.category\n    AND b.price < a.price\nGROUP BY a.id, a.name, a.price;' }
      ]
    },
    {
      id: 5,
      title: 'Lateral Join: зависимые подзапросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'LATERAL позволяет использовать столбцы левой таблицы в подзапросе JOIN. Это как коррелированный подзапрос но в форме JOIN.' },
        { type: 'code', language: 'sql', value: '-- Топ-2 заказа каждого пользователя\nSELECT\n    u.name,\n    latest.id AS order_id,\n    latest.amount\nFROM users u\nCROSS JOIN LATERAL (\n    SELECT id, amount\n    FROM orders\n    WHERE user_id = u.id         -- Ссылка на u из внешнего запроса!\n    ORDER BY created_at DESC\n    LIMIT 2\n) AS latest;\n\n-- Без LATERAL это невозможно в обычном подзапросе JOIN\n\n-- Ещё пример: последний заказ каждого пользователя\nSELECT\n    u.name,\n    last_order.amount,\n    last_order.created_at\nFROM users u\nLEFT JOIN LATERAL (\n    SELECT amount, created_at\n    FROM orders\n    WHERE user_id = u.id\n    ORDER BY created_at DESC\n    LIMIT 1\n) AS last_order ON TRUE;  -- LEFT JOIN LATERAL всегда ON TRUE' },
        { type: 'note', value: 'LATERAL JOIN — мощный инструмент PostgreSQL. На каждую строку левой таблицы выполняется отдельный подзапрос. Полезен когда нужен TOP-N на группу.' }
      ]
    },
    {
      id: 6,
      title: 'Производительность JOIN: индексы',
      type: 'theory',
      content: [
        { type: 'text', value: 'JOIN по столбцам без индекса может быть медленным. Внешние ключи (FK) должны иметь индекс для быстрой работы JOIN.' },
        { type: 'code', language: 'sql', value: '-- Плохо: JOIN без индекса на orders.user_id\nSELECT * FROM users u JOIN orders o ON u.id = o.user_id;\n-- Для каждой строки users делается FULL SCAN orders!\n\n-- Хорошо: создаём индекс на внешнем ключе\nCREATE INDEX idx_orders_user_id ON orders(user_id);\nCREATE INDEX idx_orders_product_id ON orders(product_id);\nCREATE INDEX idx_orders_status ON orders(status);\n-- Теперь JOIN использует INDEX SCAN — намного быстрее!\n\n-- Составной индекс для частого фильтра + JOIN\nCREATE INDEX idx_orders_user_status ON orders(user_id, status);\n-- Ускорит: WHERE user_id = X AND status = \'completed\'\n\n-- EXPLAIN ANALYZE: посмотреть план запроса\nEXPLAIN ANALYZE\nSELECT u.name, COUNT(o.id)\nFROM users u\nJOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.name;\n-- Hash Join (быстро) vs Nested Loop (может быть медленно)\n\n-- Создание таблицы с FK автоматически НЕ создаёт индекс в PostgreSQL!\n-- (В MySQL FK-индекс создаётся автоматически)\n-- Нужно создавать вручную!' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Иерархия сотрудников',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай и исследуй иерархическую структуру организации через self-join.',
      requirements: [
        'Создай таблицу employees с полями: id, name, position, salary, department, manager_id (FK на id)',
        'Вставь данные: 1 директор, 2 менеджера (подчинённые директора), 4 разработчика (по 2 у каждого менеджера)',
        'Запрос 1: все сотрудники с именем их менеджера (NULL для директора)',
        'Запрос 2: менеджеры и количество их прямых подчинённых',
        'Запрос 3: сотрудники зарабатывающие больше своего менеджера',
        'Запрос 4: средняя зарплата в командах каждого менеджера'
      ],
      hint: 'Self-join: aliases e (сотрудник) и m (менеджер). ON e.manager_id = m.id. Подчинённые менеджера: JOIN employees e ON m.id = e.manager_id GROUP BY m.id, m.name.',
      solution: 'CREATE TABLE employees (\n    id         SERIAL PRIMARY KEY,\n    name       VARCHAR(100) NOT NULL,\n    position   VARCHAR(100),\n    salary     DECIMAL(10, 2),\n    department VARCHAR(50),\n    manager_id INTEGER REFERENCES employees(id)\n);\n\nINSERT INTO employees (name, position, salary, department, manager_id) VALUES\n    (\'Асет Молдабеков\',   \'Директор\',           500000, \'Management\', NULL),\n    (\'Нурлан Сейтов\',     \'Менеджер Backend\',   350000, \'Engineering\', 1),\n    (\'Фарида Бекова\',     \'Менеджер Frontend\',  320000, \'Engineering\', 1),\n    (\'Алия Джакупова\',    \'Backend разработчик\',200000, \'Engineering\', 2),\n    (\'Бекзат Уразов\',     \'Backend разработчик\',190000, \'Engineering\', 2),\n    (\'Гульнар Ахметова\',  \'Frontend разработчик\',185000, \'Engineering\', 3),\n    (\'Санжар Токтаров\',   \'Frontend разработчик\',180000, \'Engineering\', 3);\n\n-- 1. Сотрудники и менеджеры\nSELECT\n    e.name     AS employee,\n    e.position,\n    e.salary,\n    m.name     AS manager\nFROM employees e\nLEFT JOIN employees m ON e.manager_id = m.id\nORDER BY e.manager_id NULLS FIRST, e.name;\n\n-- 2. Менеджеры и подчинённые\nSELECT\n    m.name     AS manager,\n    COUNT(e.id) AS direct_reports\nFROM employees m\nJOIN employees e ON m.id = e.manager_id\nGROUP BY m.id, m.name\nORDER BY direct_reports DESC;\n\n-- 3. Зарабатывают больше менеджера\nSELECT\n    e.name     AS employee,\n    e.salary   AS emp_salary,\n    m.name     AS manager,\n    m.salary   AS mgr_salary,\n    e.salary - m.salary AS difference\nFROM employees e\nJOIN employees m ON e.manager_id = m.id\nWHERE e.salary > m.salary;\n\n-- 4. Средняя зарплата команды\nSELECT\n    m.name                   AS manager,\n    COUNT(e.id)              AS team_size,\n    ROUND(AVG(e.salary), 0)  AS avg_team_salary,\n    MIN(e.salary)            AS min_salary,\n    MAX(e.salary)            AS max_salary\nFROM employees m\nJOIN employees e ON m.id = e.manager_id\nGROUP BY m.id, m.name\nORDER BY avg_team_salary DESC;',
      explanation: 'Self-join с разными псевдонимами (e и m) позволяет сравнивать строки одной таблицы. Иерархия сотрудников — классическое применение. LEFT JOIN включает директора (нет менеджера).'
    }
  ]
}
