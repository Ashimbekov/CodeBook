export default {
  id: 2,
  title: 'SELECT и фильтрация',
  description: 'Фильтрация данных с WHERE: операторы сравнения, логические операторы AND/OR/NOT, BETWEEN, IN, LIKE, ILIKE и работа с NULL.',
  lessons: [
    {
      id: 1,
      title: 'WHERE: фильтрация строк',
      type: 'theory',
      content: [
        { type: 'text', value: 'WHERE позволяет отбирать только строки удовлетворяющие условию. Без WHERE запрос возвращает ВСЕ строки таблицы.' },
        { type: 'heading', value: 'Операторы сравнения' },
        { type: 'code', language: 'sql', value: '-- Равенство и неравенство\nSELECT * FROM users WHERE age = 25;\nSELECT * FROM users WHERE age != 25;   -- или <>\nSELECT * FROM users WHERE age <> 25;\n\n-- Больше/меньше\nSELECT * FROM users WHERE age > 18;\nSELECT * FROM users WHERE age >= 18;\nSELECT * FROM users WHERE age < 30;\nSELECT * FROM users WHERE age <= 30;\n\n-- Строки: сравниваются лексикографически\nSELECT * FROM products WHERE name = \'iPhone 15\';\nSELECT * FROM products WHERE price > 50000;\n\n-- Даты\nSELECT * FROM orders WHERE created_at > \'2024-01-01\';\nSELECT * FROM users WHERE birth_date < \'2000-01-01\';' }
      ]
    },
    {
      id: 2,
      title: 'AND, OR, NOT: логические операторы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Логические операторы позволяют комбинировать несколько условий. AND — оба условия истинны. OR — хотя бы одно. NOT — отрицание.' },
        { type: 'code', language: 'sql', value: '-- AND: оба условия должны выполняться\nSELECT * FROM users\nWHERE age >= 18\n  AND city = \'Алматы\';\n\n-- OR: хотя бы одно условие\nSELECT * FROM products\nWHERE category = \'Телефоны\'\n   OR category = \'Планшеты\';\n\n-- NOT: отрицание\nSELECT * FROM users\nWHERE NOT (city = \'Алматы\');\n-- Эквивалентно:\nSELECT * FROM users WHERE city != \'Алматы\';\n\n-- Комбинирование (скобки важны!)\nSELECT * FROM products\nWHERE (category = \'Телефоны\' OR category = \'Планшеты\')\n  AND price < 100000\n  AND stock > 0;\n\n-- Приоритет без скобок: AND выполняется раньше OR\n-- WHERE a = 1 OR b = 2 AND c = 3\n-- Читается как: WHERE a = 1 OR (b = 2 AND c = 3)\n-- Всегда используй скобки при смешивании AND и OR!' },
        { type: 'warning', value: 'AND имеет более высокий приоритет чем OR. WHERE a OR b AND c читается как WHERE a OR (b AND c). Всегда используй скобки для ясности.' }
      ]
    },
    {
      id: 3,
      title: 'BETWEEN: диапазон значений',
      type: 'theory',
      content: [
        { type: 'text', value: 'BETWEEN ... AND ... проверяет попадание значения в диапазон. Границы ВКЛЮЧЕНЫ. Работает с числами, датами и строками.' },
        { type: 'code', language: 'sql', value: '-- Числовой диапазон (включительно: 18 и 65 тоже подходят)\nSELECT * FROM employees\nWHERE age BETWEEN 18 AND 65;\n-- Эквивалентно:\nWHERE age >= 18 AND age <= 65;\n\n-- Диапазон цен\nSELECT * FROM products\nWHERE price BETWEEN 10000 AND 50000;\n\n-- Диапазон дат\nSELECT * FROM orders\nWHERE created_at BETWEEN \'2024-01-01\' AND \'2024-12-31\';\n\n-- NOT BETWEEN\nSELECT * FROM products\nWHERE price NOT BETWEEN 10000 AND 50000;\n-- Вернёт цены < 10000 И цены > 50000\n\n-- Строки: лексикографический порядок\nSELECT * FROM products\nWHERE name BETWEEN \'A\' AND \'M\';  -- Имена от A до M' },
        { type: 'tip', value: 'BETWEEN с датами: для включения всего последнего дня используй \'2024-12-31 23:59:59\' или лучше: created_at >= \'2024-01-01\' AND created_at < \'2025-01-01\'.' }
      ]
    },
    {
      id: 4,
      title: 'IN: список значений',
      type: 'theory',
      content: [
        { type: 'text', value: 'IN проверяет принадлежность значения к списку. Это короткая замена нескольким OR-условиям.' },
        { type: 'code', language: 'sql', value: '-- Вместо длинного OR\nSELECT * FROM products\nWHERE category = \'Телефоны\'\n   OR category = \'Планшеты\'\n   OR category = \'Ноутбуки\';\n\n-- Используй IN (короче и понятнее)\nSELECT * FROM products\nWHERE category IN (\'Телефоны\', \'Планшеты\', \'Ноутбуки\');\n\n-- NOT IN\nSELECT * FROM users\nWHERE country NOT IN (\'KZ\', \'RU\', \'BY\');\n\n-- IN с числами\nSELECT * FROM orders\nWHERE status_id IN (1, 2, 3);\n\n-- Подзапрос в IN (рассмотрим подробнее в модуле 8)\nSELECT * FROM products\nWHERE category_id IN (\n    SELECT id FROM categories WHERE name = \'Электроника\'\n);\n\n-- ВАЖНО: NOT IN с NULL!\n-- Если в списке есть NULL, NOT IN вернёт пустой результат!\nSELECT * FROM users WHERE city NOT IN (\'Алматы\', NULL);\n-- Всегда возвращает 0 строк! Используй IS NOT NULL вместе с NOT IN' },
        { type: 'warning', value: 'NOT IN + NULL = ловушка! Если хотя бы одно значение в списке NULL, NOT IN вернёт 0 строк. Всегда явно исключай NULL: WHERE city NOT IN (список) AND city IS NOT NULL.' }
      ]
    },
    {
      id: 5,
      title: 'LIKE и ILIKE: поиск по шаблону',
      type: 'theory',
      content: [
        { type: 'text', value: 'LIKE позволяет искать строки по шаблону с подстановочными символами. % — любые символы (включая ноль), _ — ровно один символ. ILIKE — регистронезависимый вариант.' },
        { type: 'code', language: 'sql', value: '-- % — любое количество любых символов\nSELECT * FROM users WHERE name LIKE \'А%\';      -- Начинается на А\nSELECT * FROM users WHERE name LIKE \'%ов\';     -- Заканчивается на ов\nSELECT * FROM users WHERE name LIKE \'%ан%\';    -- Содержит ан\nSELECT * FROM users WHERE email LIKE \'%@gmail.com\'; -- Gmail адреса\n\n-- _ — ровно один символ\nSELECT * FROM products WHERE code LIKE \'A__\';  -- A + 2 символа: A12, ABC\nSELECT * FROM users WHERE phone LIKE \'+7 (___)___-__-__\';\n\n-- ILIKE — регистронезависимый (PostgreSQL)\nSELECT * FROM products WHERE name ILIKE \'%iphone%\';\n-- Найдёт: iPhone, IPHONE, iphone, IPhone\n\n-- NOT LIKE\nSELECT * FROM users WHERE email NOT LIKE \'%test%\';\n\n-- Спецсимволы в шаблоне: экранирование через ESCAPE\nSELECT * FROM products WHERE discount LIKE \'50\\%\' ESCAPE \'\\\';\n-- Ищет буквальный знак %' },
        { type: 'note', value: 'LIKE с % в начале (LIKE \'%слово\') не может использовать индекс! Это приводит к полному сканированию таблицы. Для полнотекстового поиска используй tsvector/tsquery в PostgreSQL.' }
      ]
    },
    {
      id: 6,
      title: 'IS NULL / IS NOT NULL: проверка на NULL',
      type: 'theory',
      content: [
        { type: 'text', value: 'Специальные операторы для проверки на NULL. Нельзя использовать = NULL или != NULL — они всегда возвращают NULL (которое приравнивается к FALSE).' },
        { type: 'code', language: 'sql', value: '-- Найти строки где phone не заполнен\nSELECT * FROM users WHERE phone IS NULL;\n\n-- Найти строки где phone заполнен\nSELECT * FROM users WHERE phone IS NOT NULL;\n\n-- Комбинирование с другими условиями\nSELECT * FROM employees\nWHERE department IS NULL\n  AND hire_date > \'2023-01-01\';\n\n-- COALESCE: значение по умолчанию для NULL\nSELECT\n    name,\n    COALESCE(phone, \'Не указан\') AS phone,\n    COALESCE(city, country, \'Неизвестно\') AS location\nFROM users;\n-- COALESCE возвращает первое НЕ NULL значение\n\n-- NULLIF: вернуть NULL если значения равны\nSELECT NULLIF(score, 0) AS score FROM exams;\n-- Если score = 0, вернёт NULL; иначе вернёт score\n-- Полезно для избежания деления на ноль:\nSELECT total / NULLIF(count, 0) AS average FROM stats;' },
        { type: 'list', items: [
          'IS NULL — единственный правильный способ проверить NULL. = NULL всегда даёт NULL',
          'IS NOT NULL — строки, где значение задано',
          'COALESCE(a, b, c) — возвращает первое не-NULL значение из списка',
          'NULLIF(a, b) — возвращает NULL если a = b, иначе a. Предотвращает деление на ноль',
          'NULL в ORDER BY: по умолчанию NULL считается больше всех значений в PostgreSQL'
        ]},
        { type: 'tip', value: 'COALESCE очень полезен в SELECT для отображения: COALESCE(middle_name, \'\') позволяет конкатенировать ФИО без NULL. COALESCE(discount, 0) позволяет считать итог без проверки на NULL.' }
      ]
    },
    {
      id: 7,
      title: 'Сложные условия WHERE',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реальные запросы часто сочетают несколько условий. Важно правильно расставлять скобки и понимать порядок вычисления.' },
        { type: 'code', language: 'sql', value: '-- Пример: интернет-магазин\n-- Найти доступные товары в ценовом диапазоне\n-- определённых категорий кроме распродажных\n\nSELECT\n    name,\n    price,\n    category,\n    stock\nFROM products\nWHERE\n    -- Условие по цене\n    price BETWEEN 5000 AND 100000\n    -- Одна из допустимых категорий\n    AND category IN (\'Телефоны\', \'Планшеты\', \'Ноутбуки\')\n    -- Есть в наличии\n    AND stock > 0\n    -- Не устаревшая модель\n    AND (discontinued IS NULL OR discontinued = FALSE)\n    -- Имя содержит год\n    AND name LIKE \'%202%\';\n\n-- Ещё пример: поиск пользователей\nSELECT * FROM users\nWHERE\n    (age BETWEEN 18 AND 35 OR is_premium = TRUE)\n    AND email NOT LIKE \'%deleted%\'\n    AND last_login IS NOT NULL\n    AND last_login > NOW() - INTERVAL \'90 days\';' },
        { type: 'list', items: [
          'Сложные WHERE читаются лучше с отступами и комментариями для каждого блока условий',
          'Скобки в (a OR b) AND c обязательны — AND приоритетнее OR без скобок',
          'Условия на NULL: (col IS NULL OR col = value) — стандартный паттерн',
          'NOW() - INTERVAL "90 days" — динамические фильтры по времени без хардкода дат',
          'Порядок условий в WHERE не влияет на результат, но влияет на читаемость'
        ]},
        { type: 'tip', value: 'При написании сложных WHERE-условий сначала напиши запрос по частям и проверяй каждую. Добавляй условия постепенно: сначала проверь базовый SELECT, затем добавляй AND-условия одно за другим.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Фильтрация данных магазина',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши SQL-запросы для фильтрации данных интернет-магазина.',
      requirements: [
        'Создай таблицу products: id, name, category, price, stock, rating, created_at',
        'Вставь 8-10 товаров разных категорий',
        'Запрос 1: товары дешевле 30000 тг',
        'Запрос 2: товары категории "Телефоны" или "Аксессуары"',
        'Запрос 3: товары с рейтингом от 4.0 до 5.0 в наличии',
        'Запрос 4: товары с именем содержащим "Pro"',
        'Запрос 5: товары без рейтинга (NULL) или с рейтингом ниже 3.0'
      ],
      hint: 'Для запроса 3: WHERE rating BETWEEN 4.0 AND 5.0 AND stock > 0. Для запроса 5: WHERE rating IS NULL OR rating < 3.0.',
      expectedOutput: 'Запрос 1 — товары дороже 50000:\n name            | price    | category\n-----------------+----------+----------\n Ноутбук Dell    | 85000.00 | Ноутбуки\n Телефон Samsung | 65000.00 | Телефоны\n(2 rows)\n\nЗапрос 2 — поиск LIKE "нот%":\n name            | price\n-----------------+----------\n Ноутбук Dell    | 85000.00\n Ноутбук HP      | 45000.00\n(2 rows)\n\nЗапрос 3 — рейтинг BETWEEN 4.0 AND 5.0 и stock > 0:\n name           | rating | stock\n----------------+--------+-------\n Ноутбук Dell   |   4.5  |   12\n Телефон Xiaomi |   4.2  |   30\n(2 rows)\n\nЗапрос 4 — ORDER BY price DESC LIMIT 3:\n name            | price\n-----------------+----------\n Ноутбук Dell    | 85000.00\n Телефон Samsung | 65000.00\n Ноутбук HP      | 45000.00\n(3 rows)\n\nЗапрос 5 — rating IS NULL OR rating < 3.0:\n name          | rating\n---------------+--------\n Кабель USB    | NULL\n Чехол дешёвый |   2.5\n(2 rows)',
      solution: 'CREATE TABLE products (\n    id         SERIAL PRIMARY KEY,\n    name       VARCHAR(100) NOT NULL,\n    category   VARCHAR(50),\n    price      DECIMAL(10, 2) NOT NULL,\n    stock      INTEGER DEFAULT 0,\n    rating     DECIMAL(2, 1),\n    created_at TIMESTAMP DEFAULT NOW()\n);\n\nINSERT INTO products (name, category, price, stock, rating) VALUES\n    (\'iPhone 15 Pro\',  \'Телефоны\',   \'185000\', 15, 4.8),\n    (\'Samsung S24\',    \'Телефоны\',   \'160000\', 20, 4.5),\n    (\'Наушники AirPods\',\'Аксессуары\', \'45000\', 50, 4.7),\n    (\'Чехол для iPhone\',\'Аксессуары\', \'3500\',  100, 4.2),\n    (\'iPad Pro\',       \'Планшеты\',   \'250000\',  8, 4.9),\n    (\'Xiaomi 13\',      \'Телефоны\',    \'85000\', 30, 4.3),\n    (\'Кабель USB-C\',   \'Аксессуары\',  \'2500\', 200, NULL),\n    (\'Galaxy Tab\',     \'Планшеты\',   \'120000\', 12, 4.1),\n    (\'Redmi Note Pro\', \'Телефоны\',    \'55000\', 45, 2.8),\n    (\'MacBook Pro\',    \'Ноутбуки\',   \'450000\',  5, 4.9);\n\n-- 1. Дешевле 30000 тг\nSELECT name, price FROM products WHERE price < 30000;\n\n-- 2. Телефоны или Аксессуары\nSELECT name, category, price\nFROM products\nWHERE category IN (\'Телефоны\', \'Аксессуары\');\n\n-- 3. Рейтинг 4.0-5.0 в наличии\nSELECT name, rating, stock\nFROM products\nWHERE rating BETWEEN 4.0 AND 5.0\n  AND stock > 0;\n\n-- 4. Имя содержит "Pro"\nSELECT name, category, price\nFROM products\nWHERE name LIKE \'%Pro%\';\n\n-- 5. Без рейтинга или рейтинг < 3.0\nSELECT name, COALESCE(rating::TEXT, \'Нет рейтинга\') AS rating\nFROM products\nWHERE rating IS NULL OR rating < 3.0;',
      explanation: 'Фильтрация — основа SQL. Комбинация BETWEEN, IN, LIKE и IS NULL покрывает большинство реальных задач. Обрати внимание на COALESCE для замены NULL в выводе.'
    }
  ]
}
