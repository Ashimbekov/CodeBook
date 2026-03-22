export default {
  id: 1,
  title: 'Введение в базы данных',
  description: 'Основы реляционных баз данных: что такое СУБД, таблицы, строки и столбцы, первичные ключи, типы данных и первые шаги в SQL.',
  lessons: [
    {
      id: 1,
      title: 'Что такое база данных и СУБД',
      type: 'theory',
      content: [
        { type: 'text', value: 'База данных (БД) — организованная коллекция структурированных данных. СУБД (Система управления базами данных) — программа для создания и управления БД. PostgreSQL, MySQL, SQLite — популярные СУБД.' },
        { type: 'heading', value: 'Виды баз данных' },
        { type: 'list', value: ['Реляционные (SQL): данные в таблицах со связями — PostgreSQL, MySQL, SQLite, Oracle', 'Документоориентированные (NoSQL): JSON-документы — MongoDB, CouchDB', 'Ключ-значение: Redis, DynamoDB', 'Графовые: Neo4j — для связей между сущностями', 'Колоночные: ClickHouse — для аналитики'] },
        { type: 'tip', value: 'Реляционные БД используются в 70% проектов. SQL (Structured Query Language) — стандартный язык для работы с ними. Изучив PostgreSQL, ты можешь работать с любой реляционной СУБД с минимальными отличиями.' }
      ]
    },
    {
      id: 2,
      title: 'Таблицы, строки и столбцы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реляционная БД хранит данные в таблицах (relations). Каждая таблица — это набор строк (записей/кортежей) и столбцов (полей/атрибутов).' },
        { type: 'heading', value: 'Структура таблицы' },
        { type: 'code', language: 'sql', value: '-- Таблица users:\n-- +----+----------+-----------+-----+\n-- | id | name     | email     | age |\n-- +----+----------+-----------+-----+\n-- |  1 | Алия     | a@mail.ru |  25 |\n-- |  2 | Нурлан   | n@mail.ru |  30 |\n-- |  3 | Фарида   | f@mail.ru |  22 |\n-- +----+----------+-----------+-----+\n\n-- Терминология:\n-- Таблица (table) = отношение (relation)\n-- Строка  (row)   = запись (record) = кортеж (tuple)\n-- Столбец (column)= поле (field)   = атрибут (attribute)\n-- Значение NULL   = отсутствующее/неизвестное значение\n-- Схема (schema)  = структура таблицы (имена и типы столбцов)' },
        { type: 'note', value: 'Каждая строка должна быть уникально идентифицируема. Для этого используется первичный ключ (Primary Key).' }
      ]
    },
    {
      id: 3,
      title: 'Первичный ключ (Primary Key)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Первичный ключ (PK) — столбец или набор столбцов, уникально идентифицирующий каждую строку в таблице. PK не может быть NULL и должен быть уникальным.' },
        { type: 'code', language: 'sql', value: '-- Создание таблицы с первичным ключом\nCREATE TABLE users (\n    id        SERIAL PRIMARY KEY,  -- Автоинкремент (1, 2, 3...)\n    email     VARCHAR(100) UNIQUE NOT NULL,\n    name      VARCHAR(100) NOT NULL,\n    age       INTEGER,\n    created_at TIMESTAMP DEFAULT NOW()\n);\n\n-- SERIAL = INTEGER + AUTO_INCREMENT + SEQUENCE\n-- Каждая новая строка получает id = id предыдущей + 1\n\n-- Составной первичный ключ (из нескольких столбцов)\nCREATE TABLE order_items (\n    order_id   INTEGER,\n    product_id INTEGER,\n    quantity   INTEGER,\n    PRIMARY KEY (order_id, product_id)  -- Пара order_id+product_id уникальна\n);' },
        { type: 'tip', value: 'Используй SERIAL (или BIGSERIAL для больших таблиц) для числового автоинкрементного PK. В PostgreSQL 10+ есть также GENERATED ALWAYS AS IDENTITY — более стандартный вариант.' }
      ]
    },
    {
      id: 4,
      title: 'Типы данных в PostgreSQL',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый столбец имеет тип данных, который определяет какие значения можно в нём хранить. Правильный выбор типа экономит место и предотвращает ошибки.' },
        { type: 'code', language: 'sql', value: '-- Числовые типы\nSMALLINT     -- 2 байта, -32768 до 32767\nINTEGER      -- 4 байта, ~2 млрд\nBIGINT       -- 8 байт, очень большие числа\nDECIMAL(10,2)-- Точное десятичное (10 цифр, 2 после запятой) — для денег!\nREAL         -- 4 байта, ~7 знаков точности\nDOUBLE PRECISION -- 8 байт, ~15 знаков\n\n-- Строковые типы\nCHAR(n)      -- Строка фиксированной длины n (дополняется пробелами)\nVARCHAR(n)   -- Строка до n символов (без дополнения)\nTEXT         -- Строка произвольной длины (PostgreSQL-специфичный)\n\n-- Дата и время\nDATE         -- Только дата: 2024-01-15\nTIME         -- Только время: 14:30:00\nTIMESTAMP    -- Дата и время: 2024-01-15 14:30:00\nTIMESTAMPTZ  -- С часовым поясом (рекомендуется!)\nINTERVAL     -- Промежуток: \'2 hours 30 minutes\'\n\n-- Логический тип\nBOOLEAN      -- TRUE / FALSE / NULL\n\n-- Другие\nJSONB        -- JSON (бинарный, с индексами)\nUUID         -- Уникальный идентификатор: a0eebc99-...\nARRAY        -- Массив: INTEGER[], TEXT[]' },
        { type: 'warning', value: 'Для денег НИКОГДА не используй FLOAT или REAL — они имеют погрешности! Используй DECIMAL(15,2) или INTEGER (в копейках/тиынах).' }
      ]
    },
    {
      id: 5,
      title: 'Первые SQL запросы: SELECT',
      type: 'theory',
      content: [
        { type: 'text', value: 'SELECT — самый важный SQL-оператор. Он извлекает данные из таблицы. Начнём с самых простых запросов.' },
        { type: 'code', language: 'sql', value: '-- Выбрать все столбцы всех строк\nSELECT * FROM users;\n\n-- Выбрать конкретные столбцы\nSELECT name, email FROM users;\n\n-- Псевдоним (alias) для столбца\nSELECT name AS "Имя пользователя", email AS "Email" FROM users;\n\n-- Вычисляемые столбцы\nSELECT\n    name,\n    age,\n    age * 365 AS days_lived,       -- Умножение\n    UPPER(name) AS name_upper      -- Функция\nFROM users;\n\n-- Константы и выражения\nSELECT\n    1 + 1 AS two,                  -- 2\n    \'Привет\' AS greeting,          -- Привет\n    NOW() AS current_time;         -- Текущее время\n\n-- Убрать дубликаты\nSELECT DISTINCT city FROM users;   -- Уникальные города' },
        { type: 'heading', value: 'Структура SELECT-запроса' },
        { type: 'list', items: [
          'SELECT * — выбрать все столбцы (удобно при изучении, но избегай в продакшне)',
          'SELECT col1, col2 — выбирать только нужные столбцы (эффективнее)',
          'AS — псевдоним для столбца или вычисляемого выражения',
          'DISTINCT — убрать дублирующиеся строки по выбранным столбцам',
          'Вычисляемые столбцы: age * 365, UPPER(name), NOW() — любые выражения'
        ]},
        { type: 'tip', value: 'Избегай SELECT * в приложениях: он передаёт лишние данные по сети и ломается при изменении схемы таблицы. Всегда явно перечисляй нужные столбцы: SELECT id, name, email FROM users.' }
      ]
    },
    {
      id: 6,
      title: 'NULL: отсутствие значения',
      type: 'theory',
      content: [
        { type: 'text', value: 'NULL — специальное значение означающее "неизвестно" или "не задано". NULL не равен ничему, даже самому себе. Это частый источник ошибок у новичков.' },
        { type: 'code', language: 'sql', value: '-- NULL не равен NULL!\nSELECT NULL = NULL;    -- Возвращает NULL (не TRUE!)\nSELECT NULL = 0;       -- NULL\nSELECT NULL + 5;       -- NULL (любая арифметика с NULL = NULL)\nSELECT NULL OR TRUE;   -- TRUE (единственный особый случай в логике)\n\n-- Правильная проверка на NULL:\nSELECT * FROM users WHERE age IS NULL;      -- Есть NULL\nSELECT * FROM users WHERE age IS NOT NULL;  -- Нет NULL\n\n-- COALESCE: заменяет NULL на значение по умолчанию\nSELECT name, COALESCE(phone, \'Не указан\') AS phone\nFROM users;\n\n-- NULLIF: возвращает NULL если значения равны\nSELECT NULLIF(age, 0) FROM users;  -- 0 -> NULL, остальное без изменений' },
        { type: 'warning', value: 'Никогда не пиши WHERE age = NULL или WHERE age != NULL — это ВСЕГДА вернёт 0 строк! Используй только IS NULL и IS NOT NULL.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Создание первой базы данных',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай таблицу для хранения информации о студентах и наполни её данными.',
      requirements: [
        'Таблица students с полями: id (PK, SERIAL), first_name (VARCHAR(50)), last_name (VARCHAR(50)), email (UNIQUE, NOT NULL), birth_date (DATE), gpa (DECIMAL(3,2)), enrolled_at (TIMESTAMP, DEFAULT NOW())',
        'Вставь минимум 5 студентов с разными данными (один с NULL в gpa)',
        'SELECT: все столбцы всех студентов',
        'SELECT: только имя и email',
        'SELECT: вычисляемый столбец full_name = first_name + " " + last_name',
        'SELECT: студенты где gpa IS NULL'
      ],
      hint: 'Конкатенация строк в PostgreSQL: first_name || \' \' || last_name. Для вставки нескольких строк используй один INSERT с несколькими VALUES.',
      expectedOutput: 'CREATE TABLE students -- OK\n\nINSERT 0 5\n\nSELECT * FROM students:\n id | first_name | last_name   | email           | birth_date | gpa  | enrolled_at\n----+------------+-------------+-----------------+------------+------+-------------------\n  1 | Алия       | Джакупова   | aliya@uni.kz    | 2002-03-15 | 3.85 | 2026-03-21 10:00\n  2 | Нурлан     | Сейтов      | nurlan@uni.kz   | 2001-07-22 | 3.40 | 2026-03-21 10:00\n  3 | Фарида     | Бекова      | farida@uni.kz   | 2003-01-08 | 4.00 | 2026-03-21 10:00\n  4 | Асет       | Молдабеков  | aset@uni.kz     | 2002-11-30 | NULL | 2026-03-21 10:00\n  5 | Гульнар    | Ахметова    | gulnar@uni.kz   | 2001-05-19 | 2.95 | 2026-03-21 10:00\n(5 rows)\n\nSELECT full_name, gpa:\n full_name              | gpa\n-----------------------+---------\n Алия Джакупова        | 3.85\n Нурлан Сейтов         | 3.40\n Фарида Бекова         | 4.00\n Асет Молдабеков       | Не задан\n Гульнар Ахметова      | 2.95\n\nWHERE gpa IS NULL:\n id | first_name | last_name\n----+------------+------------\n  4 | Асет       | Молдабеков\n(1 row)',
      solution: '-- Создание таблицы\nCREATE TABLE students (\n    id          SERIAL PRIMARY KEY,\n    first_name  VARCHAR(50) NOT NULL,\n    last_name   VARCHAR(50) NOT NULL,\n    email       VARCHAR(100) UNIQUE NOT NULL,\n    birth_date  DATE,\n    gpa         DECIMAL(3, 2),\n    enrolled_at TIMESTAMP DEFAULT NOW()\n);\n\n-- Вставка данных\nINSERT INTO students (first_name, last_name, email, birth_date, gpa) VALUES\n    (\'Алия\',   \'Джакупова\',  \'aliya@uni.kz\',   \'2002-03-15\', 3.85),\n    (\'Нурлан\', \'Сейтов\',     \'nurlan@uni.kz\',  \'2001-07-22\', 3.40),\n    (\'Фарида\', \'Бекова\',     \'farida@uni.kz\',  \'2003-01-08\', 4.00),\n    (\'Асет\',   \'Молдабеков\', \'aset@uni.kz\',    \'2002-11-30\', NULL),\n    (\'Гульнар\',\'Ахметова\',   \'gulnar@uni.kz\',  \'2001-05-19\', 2.95);\n\n-- Все студенты\nSELECT * FROM students;\n\n-- Только имя и email\nSELECT first_name, email FROM students;\n\n-- Полное имя\nSELECT\n    id,\n    first_name || \' \' || last_name AS full_name,\n    email,\n    COALESCE(gpa::TEXT, \'Не задан\') AS gpa\nFROM students;\n\n-- Студенты без GPA\nSELECT * FROM students WHERE gpa IS NULL;',
      explanation: 'Это базовая структура любой работы с БД: CREATE TABLE (определение схемы), INSERT (наполнение), SELECT (чтение). SERIAL автоматически создаёт последовательность для id.'
    }
  ]
}
