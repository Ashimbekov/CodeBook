export default {
  id: 9,
  title: 'INSERT, UPDATE, DELETE',
  description: 'Изменение данных в SQL: INSERT для добавления, UPDATE для обновления, DELETE для удаления, RETURNING для получения изменённых данных и безопасные паттерны.',
  lessons: [
    {
      id: 1,
      title: 'INSERT: добавление данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'INSERT добавляет новые строки в таблицу. Можно вставлять одну или несколько строк за один запрос.' },
        { type: 'code', language: 'sql', value: '-- Базовый синтаксис: явное перечисление столбцов\nINSERT INTO users (name, email, age)\nVALUES (\'Алия Джакупова\', \'aliya@mail.ru\', 25);\n\n-- Множественная вставка (один запрос — быстрее!)\nINSERT INTO users (name, email, age) VALUES\n    (\'Нурлан Сейтов\',  \'nurlan@mail.ru\', 30),\n    (\'Фарида Бекова\',  \'farida@mail.ru\', 22),\n    (\'Асет Молдабеков\',\'aset@mail.ru\',   28);\n\n-- Вставка без перечисления столбцов (порядок = порядку в таблице)\n-- ПЛОХАЯ практика! Зависит от порядка столбцов\nINSERT INTO users VALUES (DEFAULT, \'name\', \'email@mail.ru\', 25, NOW());\n\n-- INSERT ... SELECT: вставка из другой таблицы\nINSERT INTO archive_users (name, email, archived_at)\nSELECT name, email, NOW()\nFROM users\nWHERE last_login < NOW() - INTERVAL \'1 year\';\n\n-- ON CONFLICT (upsert): вставить или обновить\nINSERT INTO users (email, name)\nVALUES (\'aliya@mail.ru\', \'Алия Новое Имя\')\nON CONFLICT (email) DO UPDATE\n    SET name = EXCLUDED.name,\n        updated_at = NOW();\n-- Если email уже есть — обновляем; иначе — вставляем\n\n-- ON CONFLICT DO NOTHING: игнорировать дубликаты\nINSERT INTO tags (name)\nVALUES (\'react\'), (\'sql\'), (\'react\')  -- \'react\' дубликат\nON CONFLICT (name) DO NOTHING;       -- Второй react игнорируется' },
        { type: 'list', items: [
          'Всегда указывай список столбцов явно: INSERT INTO t (col1, col2) — защита от изменений схемы',
          'Множественная вставка одним запросом в 10-100 раз быстрее отдельных INSERT',
          'INSERT ... SELECT — эффективное копирование данных между таблицами',
          'ON CONFLICT DO UPDATE — атомарный upsert, EXCLUDED содержит вставляемые значения',
          'ON CONFLICT DO NOTHING — идемпотентная вставка, игнорирует дубликаты без ошибки'
        ]},
        { type: 'tip', value: 'Upsert-паттерн через ON CONFLICT — предпочтительный способ "вставить или обновить". Избегай SELECT + if exists + INSERT/UPDATE — это не атомарно и имеет race condition в concurrent среде.' }
      ]
    },
    {
      id: 2,
      title: 'RETURNING: получение данных после изменения',
      type: 'theory',
      content: [
        { type: 'text', value: 'RETURNING возвращает данные изменённых строк. Это PostgreSQL-расширение. Позволяет узнать сгенерированный id, timestamp и другие поля без дополнительного SELECT.' },
        { type: 'code', language: 'sql', value: '-- Получить id новой записи\nINSERT INTO users (name, email)\nVALUES (\'Новый пользователь\', \'new@mail.ru\')\nRETURNING id;\n-- Возвращает: id = 42 (например)\n\n-- Получить всю вставленную строку\nINSERT INTO orders (user_id, product_id, amount)\nVALUES (1, 3, 45000)\nRETURNING *;\n-- Возвращает все поля включая created_at (DEFAULT NOW())\n\n-- RETURNING с UPDATE\nUPDATE products\nSET price = price * 1.10\nWHERE category = \'Телефоны\'\nRETURNING id, name, price;\n-- Показывает новые цены всех обновлённых товаров\n\n-- RETURNING с DELETE\nDELETE FROM sessions\nWHERE expires_at < NOW()\nRETURNING user_id, created_at, expires_at;\n-- Возвращает удалённые сессии для лога\n\n-- Использование в CTE\nWITH inserted AS (\n    INSERT INTO orders (user_id, amount)\n    VALUES (1, 10000)\n    RETURNING id, user_id, amount\n)\nSELECT id AS order_id, amount FROM inserted;' },
        { type: 'tip', value: 'RETURNING незаменим в приложениях: INSERT ... RETURNING id позволяет получить автосгенерированный id без дополнительного SELECT. Это одна из мощнейших функций PostgreSQL.' }
      ]
    },
    {
      id: 3,
      title: 'UPDATE: обновление данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'UPDATE изменяет значения в существующих строках. ВСЕГДА используй WHERE чтобы не обновить ВСЮ таблицу!' },
        { type: 'code', language: 'sql', value: '-- Обновление одной строки\nUPDATE users\nSET name = \'Алия Новая\',\n    updated_at = NOW()\nWHERE id = 1;\n\n-- Обновление нескольких столбцов\nUPDATE products\nSET\n    price = 95000,\n    stock = stock - 5,\n    updated_at = NOW()\nWHERE id = 3;\n\n-- Обновление вычисленным значением\nUPDATE products\nSET price = price * 1.10  -- Повышаем цену на 10%\nWHERE category = \'Телефоны\';\n\n-- UPDATE с JOIN (обновить на основе данных другой таблицы)\nUPDATE orders o\nSET status = \'cancelled\'\nFROM users u\nWHERE o.user_id = u.id\n  AND u.is_blocked = TRUE;\n-- Отменяем заказы заблокированных пользователей\n\n-- ОПАСНО: UPDATE без WHERE = обновление ВСЕЙ таблицы!\n-- UPDATE products SET price = 0;  <- НИКОГДА ТАК НЕ ДЕЛАЙ\n\n-- Безопасный паттерн: сначала SELECT, потом UPDATE\n-- Шаг 1: проверь что обновится\nSELECT id, name, price FROM products WHERE category = \'Телефоны\';\n-- Шаг 2: если всё правильно — обновляй\nUPDATE products SET price = price * 1.10 WHERE category = \'Телефоны\';' },
        { type: 'warning', value: 'UPDATE без WHERE — одна из самых опасных ошибок в SQL! Всегда сначала делай SELECT с тем же WHERE чтобы убедиться что изменяются нужные строки.' }
      ]
    },
    {
      id: 4,
      title: 'DELETE: удаление данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'DELETE удаляет строки из таблицы. Без WHERE — удаляет ВСЕ строки. TRUNCATE быстрее для удаления всех строк.' },
        { type: 'code', language: 'sql', value: '-- Удаление конкретной строки\nDELETE FROM users WHERE id = 42;\n\n-- Удаление по условию\nDELETE FROM sessions WHERE expires_at < NOW();\nDELETE FROM products WHERE stock = 0 AND discontinued = TRUE;\n\n-- DELETE с JOIN (удалить на основе другой таблицы)\nDELETE FROM orders o\nUSING users u\nWHERE o.user_id = u.id\n  AND u.is_deleted = TRUE;\n-- Удаляем заказы удалённых пользователей\n\n-- ОПАСНО: DELETE без WHERE = удаление ВСЕХ строк!\n-- DELETE FROM products;  <- НИКОГДА!\n\n-- TRUNCATE: быстрое удаление всех строк\nTRUNCATE TABLE sessions;            -- Все строки, счётчик serial НЕ сбрасывается\nTRUNCATE TABLE sessions RESTART IDENTITY;  -- Сбросить счётчик serial\nTRUNCATE TABLE orders, order_items CASCADE; -- Каскадно\n\n-- Разница DELETE vs TRUNCATE:\n-- DELETE: логирует каждую строку, можно откатить (ROLLBACK), медленнее\n-- TRUNCATE: быстро, minimal logging, CASCADE удаляет зависимые таблицы\n\n-- Soft delete (рекомендуется!): не удалять реально\nALTER TABLE users ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE;\nALTER TABLE users ADD COLUMN deleted_at TIMESTAMP;\n\nUPDATE users\nSET is_deleted = TRUE, deleted_at = NOW()\nWHERE id = 42;' },
        { type: 'list', items: [
          'DELETE без WHERE удаляет ВСЕ строки — всегда проверяй WHERE сначала через SELECT',
          'TRUNCATE быстрее DELETE для очистки всей таблицы — не логирует каждую строку',
          'DELETE USING — PostgreSQL-синтаксис для удаления с JOIN по другой таблице',
          'Soft delete: добавь is_deleted + deleted_at вместо физического удаления — сохраняет историю',
          'CASCADE в DELETE FROM FK: если ON DELETE CASCADE — дочерние записи удалятся автоматически'
        ]},
        { type: 'warning', value: 'Перед DELETE всегда выполни тот же WHERE в SELECT: SELECT * FROM orders WHERE user_id = 42 — убедись что удаляешь нужные записи. Только потом DELETE. ROLLBACK возможен только внутри транзакции.' }
      ]
    },
    {
      id: 5,
      title: 'Транзакции: атомарность операций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Транзакция объединяет несколько операций в один атомарный блок. Либо все выполняются, либо ни одна. COMMIT фиксирует, ROLLBACK откатывает.' },
        { type: 'code', language: 'sql', value: '-- Перевод денег: списание И зачисление должны произойти вместе\nBEGIN;  -- Начало транзакции\n\nUPDATE accounts\nSET balance = balance - 10000\nWHERE user_id = 1;\n\nUPDATE accounts\nSET balance = balance + 10000\nWHERE user_id = 2;\n\n-- Проверяем что баланс не ушёл в минус\nSELECT balance FROM accounts WHERE user_id = 1;\n-- Если balance >= 0:\n\nCOMMIT;  -- Фиксируем транзакцию\n-- Или: ROLLBACK;  -- Откатываем ВСЕ изменения\n\n-- SAVEPOINT: частичный откат\nBEGIN;\nINSERT INTO orders (user_id, amount) VALUES (1, 5000);\nSAVEPOINT after_insert;\n\nUPDATE products SET stock = stock - 1 WHERE id = 3;\n-- Если что-то пошло не так:\nROLLBACK TO after_insert;  -- Откатываем только UPDATE\n-- Или:\nCOMMIT;  -- Фиксируем оба изменения' },
        { type: 'note', value: 'В PostgreSQL каждый одиночный SQL-запрос по умолчанию выполняется в автоматической транзакции (autocommit). BEGIN...COMMIT нужен для группировки нескольких запросов.' }
      ]
    },
    {
      id: 6,
      title: 'Безопасные паттерны изменения данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Лучшие практики для безопасного изменения данных в продакшн-базах.' },
        { type: 'code', language: 'sql', value: '-- Паттерн 1: SELECT перед UPDATE/DELETE\n-- Сначала проверяем что изменим\nSELECT id, name, price FROM products WHERE category = \'Ноутбуки\';\n-- Затем меняем\nUPDATE products SET price = price * 1.05 WHERE category = \'Ноутбуки\';\n\n-- Паттерн 2: транзакция с проверкой\nBEGIN;\nUPDATE orders SET status = \'shipped\' WHERE id = 1;\n-- Проверяем результат\nSELECT id, status FROM orders WHERE id = 1;\n-- Если всё правильно:\nCOMMIT;\n-- Иначе:\n-- ROLLBACK;\n\n-- Паттерн 3: soft delete вместо реального удаления\nUPDATE users\nSET deleted_at = NOW(), is_active = FALSE\nWHERE id = $1;  -- $1 = параметр из приложения\n\n-- Паттерн 4: аудит через триггер или запись в лог-таблицу\nINSERT INTO audit_log (table_name, operation, record_id, changed_at, changed_by)\nVALUES (\'products\', \'UPDATE\', 5, NOW(), current_user);\n\n-- Паттерн 5: upsert для идемпотентности\nINSERT INTO user_settings (user_id, key, value)\nVALUES (1, \'theme\', \'dark\')\nON CONFLICT (user_id, key) DO UPDATE\n    SET value = EXCLUDED.value,\n        updated_at = NOW();' },
        { type: 'list', items: [
          'SELECT перед UPDATE/DELETE — обязательная проверка перед деструктивной операцией',
          'Транзакция с ROLLBACK: BEGIN → изменения → SELECT проверка → COMMIT или ROLLBACK',
          'Параметризованные запросы ($1, $2) — защита от SQL-инъекций и повторное использование плана',
          'Audit log: таблица для хранения кто, что и когда изменил — базовая практика безопасности',
          'Upsert через ON CONFLICT обеспечивает идемпотентность: повторный вызов не создаёт дубликатов'
        ]},
        { type: 'tip', value: 'Чеклист безопасного изменения данных: 1) SELECT с тем же WHERE, 2) BEGIN транзакцию, 3) выполни изменение, 4) проверь RETURNING или SELECT, 5) COMMIT если всё правильно. Никогда не пропускай шаги.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: CRUD операции',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй полный набор операций CRUD для системы управления студентами.',
      requirements: [
        'INSERT: добавь 3 студента через один INSERT с RETURNING id',
        'INSERT ... SELECT: скопируй студентов с GPA > 3.8 в таблицу honor_students',
        'UPDATE: повысь GPA всех студентов на 0.1 (но не выше 4.0), RETURNING покажи изменения',
        'DELETE: удали студентов с GPA < 2.0, RETURNING покажи кто удалён',
        'ON CONFLICT: вставь студента с существующим email, обнови его имя',
        'Транзакция: перевести студента из одной группы в другую (UPDATE двух таблиц)'
      ],
      hint: 'LEAST(gpa + 0.1, 4.0) — функция минимума из двух значений. RETURNING * покажет состояние ДО или ПОСЛЕ? (После изменения для UPDATE/DELETE — после). Транзакция: BEGIN...COMMIT.',
      expectedOutput: 'INSERT нового студента RETURNING:\n id | first_name | email           | gpa\n----+------------+-----------------+------\n  6 | Айдар      | aidar@uni.kz    | 3.20\n(1 row)\n\nUPDATE повышение GPA на 0.1 (LEAST 4.0) RETURNING:\n id | name    | old_gpa | new_gpa\n----+---------+---------+---------\n  1 | Алия    |    3.85 |    3.95\n  3 | Фарида  |    4.00 |    4.00\n(2 rows)\n\nDELETE студента без GPA RETURNING:\n id | first_name | last_name\n----+------------+------------\n  4 | Асет       | Молдабеков\n(1 row)\n\nТранзакция зачисления 3 студентов:\nBEGIN\nINSERT 0 1\nINSERT 0 1\nINSERT 0 1\nCOMMIT\n\nUPSERT через ON CONFLICT DO UPDATE:\n id | email         | gpa\n----+---------------+------\n  1 | aliya@uni.kz  | 3.95\n(1 row) -- обновлена запись, не вставлена новая',
      solution: 'CREATE TABLE students (\n    id         SERIAL PRIMARY KEY,\n    name       VARCHAR(100) NOT NULL,\n    email      VARCHAR(100) UNIQUE NOT NULL,\n    gpa        DECIMAL(3, 2),\n    group_id   INTEGER,\n    enrolled   TIMESTAMP DEFAULT NOW()\n);\n\nCREATE TABLE honor_students (\n    student_id  INTEGER,\n    name        VARCHAR(100),\n    gpa         DECIMAL(3, 2),\n    awarded_at  TIMESTAMP DEFAULT NOW()\n);\n\n-- 1. INSERT с RETURNING\nINSERT INTO students (name, email, gpa, group_id) VALUES\n    (\'Алия Джакупова\',  \'aliya@uni.kz\',  3.90, 1),\n    (\'Нурлан Сейтов\',   \'nurlan@uni.kz\', 3.50, 1),\n    (\'Фарида Бекова\',   \'farida@uni.kz\', 1.80, 2)\nRETURNING id, name;\n\n-- 2. Копирование отличников\nINSERT INTO honor_students (student_id, name, gpa)\nSELECT id, name, gpa\nFROM students\nWHERE gpa > 3.8;\n\n-- 3. Повысить GPA\nUPDATE students\nSET gpa = LEAST(gpa + 0.1, 4.0)\nWHERE gpa IS NOT NULL\nRETURNING id, name, gpa AS new_gpa;\n\n-- 4. Удаление слабых студентов\nDELETE FROM students\nWHERE gpa < 2.0\nRETURNING id, name, gpa;\n\n-- 5. Upsert\nINSERT INTO students (name, email, gpa, group_id)\nVALUES (\'Алия Обновлённая\', \'aliya@uni.kz\', 3.95, 1)\nON CONFLICT (email) DO UPDATE\n    SET name = EXCLUDED.name,\n        gpa  = EXCLUDED.gpa;\n\n-- 6. Транзакция: перевод в другую группу\nBEGIN;\nUPDATE students SET group_id = 2 WHERE id = 2;\n-- Если нужно обновить и таблицу групп:\nUPDATE groups SET student_count = student_count - 1 WHERE id = 1;\nUPDATE groups SET student_count = student_count + 1 WHERE id = 2;\nCOMMIT;',
      explanation: 'RETURNING — PostgreSQL суперсила для получения изменённых данных без дополнительного SELECT. LEAST(value, 4.0) гарантирует верхнюю границу. ON CONFLICT (upsert) — атомарная операция "вставить или обновить".'
    }
  ]
}
