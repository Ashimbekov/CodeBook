export default {
  id: 3,
  title: 'Сортировка и лимиты',
  description: 'Управление порядком и количеством результатов: ORDER BY с ASC/DESC, сортировка по нескольким столбцам, LIMIT и OFFSET для пагинации.',
  lessons: [
    {
      id: 1,
      title: 'ORDER BY: сортировка результатов',
      type: 'theory',
      content: [
        { type: 'text', value: 'ORDER BY сортирует результаты запроса. Без ORDER BY порядок строк НЕ гарантирован — СУБД может вернуть их в любом порядке.' },
        { type: 'heading', value: 'Основы ORDER BY' },
        { type: 'code', language: 'sql', value: '-- ASC (Ascending) — по возрастанию (по умолчанию)\nSELECT * FROM products ORDER BY price;         -- От дешёвых к дорогим\nSELECT * FROM products ORDER BY price ASC;     -- То же самое явно\n\n-- DESC (Descending) — по убыванию\nSELECT * FROM products ORDER BY price DESC;    -- От дорогих к дешёвым\n\n-- Сортировка по строкам\nSELECT * FROM users ORDER BY name;             -- Алфавитный порядок\nSELECT * FROM users ORDER BY name DESC;        -- Обратный алфавитный\n\n-- Сортировка по дате\nSELECT * FROM orders ORDER BY created_at DESC; -- Новые сначала\nSELECT * FROM orders ORDER BY created_at ASC;  -- Старые сначала\n\n-- По псевдониму или позиции\nSELECT name, price * 1.1 AS price_with_tax\nFROM products\nORDER BY price_with_tax DESC;\n-- Или по номеру столбца (не рекомендуется — хрупко):\nORDER BY 2 DESC;' },
        { type: 'note', value: 'Порядок строк в SQL без ORDER BY непредсказуем. Никогда не полагайся на "порядок вставки" — это не гарантировано стандартом SQL.' }
      ]
    },
    {
      id: 2,
      title: 'Сортировка по нескольким столбцам',
      type: 'theory',
      content: [
        { type: 'text', value: 'ORDER BY может принимать несколько столбцов. Сортировка происходит по первому столбцу, затем среди равных — по второму, и так далее.' },
        { type: 'code', language: 'sql', value: '-- Сначала по категории (алфавит), потом по цене (убывание)\nSELECT name, category, price\nFROM products\nORDER BY category ASC, price DESC;\n\n-- Результат:\n-- Аксессуары | 45000  <- дорогие аксессуары сначала\n-- Аксессуары |  3500\n-- Ноутбуки   | 450000 <- дорогие ноутбуки сначала\n-- Планшеты   | 250000\n-- Телефоны   | 185000\n\n-- Три уровня сортировки\nSELECT * FROM employees\nORDER BY\n    department ASC,   -- 1. По отделу\n    salary DESC,      -- 2. По зарплате (в каждом отделе)\n    name ASC;         -- 3. По имени (при равной зарплате)\n\n-- Сортировка с вычислением\nSELECT\n    name,\n    salary * 12 AS annual_salary\nFROM employees\nORDER BY salary * 12 DESC;  -- Годовая зарплата убывание' },
        { type: 'tip', value: 'Многоуровневая сортировка: перечисляй столбцы через запятую в порядке важности. Первый столбец — основная сортировка, остальные — тай-брейкеры.' }
      ]
    },
    {
      id: 3,
      title: 'NULL в сортировке: NULLS FIRST / NULLS LAST',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию NULL считается больше любого значения в PostgreSQL (при ASC — NULL идут последними). Это можно изменить явно.' },
        { type: 'code', language: 'sql', value: '-- PostgreSQL по умолчанию:\n-- ASC:  NULL идут ПОСЛЕДНИМИ (NULLS LAST)\n-- DESC: NULL идут ПЕРВЫМИ (NULLS FIRST)\n\nSELECT name, rating\nFROM products\nORDER BY rating ASC;    -- NULL в конце: 2.8, 4.1, 4.2, ..., NULL\n\nSELECT name, rating\nFROM products\nORDER BY rating DESC;   -- NULL в начале: NULL, 4.9, 4.8, ...\n\n-- Явное управление\nSELECT name, rating\nFROM products\nORDER BY rating ASC NULLS FIRST;   -- NULL в начале при ASC\n\nSELECT name, rating\nFROM products\nORDER BY rating DESC NULLS LAST;   -- NULL в конце при DESC\n\n-- Практический паттерн: товары без рейтинга в конец\nSELECT name, COALESCE(rating::TEXT, \'—\') AS rating\nFROM products\nORDER BY rating DESC NULLS LAST;' }
      ]
    },
    {
      id: 4,
      title: 'LIMIT: ограничение количества строк',
      type: 'theory',
      content: [
        { type: 'text', value: 'LIMIT ограничивает количество возвращаемых строк. Используется для вывода топ-N записей и пагинации.' },
        { type: 'code', language: 'sql', value: '-- Топ-5 самых дорогих товаров\nSELECT name, price\nFROM products\nORDER BY price DESC\nLIMIT 5;\n\n-- Последний заказ пользователя\nSELECT *\nFROM orders\nWHERE user_id = 42\nORDER BY created_at DESC\nLIMIT 1;\n\n-- Топ-3 пользователя по количеству заказов\nSELECT user_id, COUNT(*) AS order_count\nFROM orders\nGROUP BY user_id\nORDER BY order_count DESC\nLIMIT 3;\n\n-- LIMIT 0 — вернёт 0 строк (но схему видно в psql)\nSELECT * FROM products LIMIT 0;\n\n-- LIMIT ALL — без ограничений (редко нужен)\nSELECT * FROM products LIMIT ALL;' }
      ]
    },
    {
      id: 5,
      title: 'OFFSET: пропуск строк для пагинации',
      type: 'theory',
      content: [
        { type: 'text', value: 'OFFSET пропускает указанное количество строк перед возвратом результата. Вместе с LIMIT реализует пагинацию.' },
        { type: 'code', language: 'sql', value: '-- Пагинация: 10 элементов на странице\n-- Страница 1 (строки 1-10)\nSELECT * FROM products\nORDER BY id\nLIMIT 10 OFFSET 0;\n\n-- Страница 2 (строки 11-20)\nSELECT * FROM products\nORDER BY id\nLIMIT 10 OFFSET 10;\n\n-- Страница 3 (строки 21-30)\nSELECT * FROM products\nORDER BY id\nLIMIT 10 OFFSET 20;\n\n-- Формула: OFFSET = (номер_страницы - 1) * размер_страницы\n-- Страница N, размер 10: OFFSET = (N-1) * 10\n\n-- С фильтрацией и сортировкой\nSELECT name, price, rating\nFROM products\nWHERE category = \'Телефоны\'\nORDER BY price ASC\nLIMIT 5 OFFSET 5;  -- Вторая страница телефонов' },
        { type: 'warning', value: 'OFFSET + LIMIT медленно работает на больших таблицах! При OFFSET 100000 СУБД всё равно читает 100000 строк чтобы их пропустить. Для больших данных используй keyset pagination (WHERE id > last_seen_id).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Топ-N запросы и пагинация',
      type: 'practice',
      difficulty: 'easy',
      description: 'Напиши запросы для получения топ-N записей и реализации пагинации.',
      requirements: [
        'Используй таблицу products из предыдущего модуля',
        'Запрос 1: топ-3 самых дорогих товара',
        'Запрос 2: топ-5 товаров с лучшим рейтингом (NULL в конце)',
        'Запрос 3: самый дешёвый товар в категории "Телефоны"',
        'Запрос 4: все товары отсортированные по категории и цене, страница 2 (по 3 товара на странице)',
        'Запрос 5: последние 2 добавленных товара'
      ],
      hint: 'Страница 2 из 3 = LIMIT 3 OFFSET 3. Самый дешёвый = ORDER BY price ASC LIMIT 1 с фильтром категории.',
      solution: '-- 1. Топ-3 дорогих\nSELECT name, price\nFROM products\nORDER BY price DESC\nLIMIT 3;\n\n-- 2. Топ-5 по рейтингу (NULL в конце)\nSELECT name, COALESCE(rating::TEXT, \'—\') AS rating\nFROM products\nORDER BY rating DESC NULLS LAST\nLIMIT 5;\n\n-- 3. Самый дешёвый телефон\nSELECT name, price\nFROM products\nWHERE category = \'Телефоны\'\nORDER BY price ASC\nLIMIT 1;\n\n-- 4. Страница 2 (по 3 товара)\nSELECT name, category, price\nFROM products\nORDER BY category ASC, price ASC\nLIMIT 3 OFFSET 3;\n\n-- 5. Последние 2 добавленных\nSELECT name, created_at\nFROM products\nORDER BY created_at DESC\nLIMIT 2;',
      explanation: 'ORDER BY + LIMIT — самый частый паттерн в SQL. NULLS LAST обеспечивает корректный порядок при наличии NULL. Пагинация: OFFSET = (страница - 1) * размер.'
    }
  ]
}
