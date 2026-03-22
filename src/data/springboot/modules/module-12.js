export default {
  id: 12,
  title: 'Flyway миграции',
  description: 'Версионирование схемы базы данных через Flyway: миграции, откат, baseline, лучшие практики',
  lessons: [
    {
      id: 1,
      title: 'Проблема без миграций и зачем нужен Flyway',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда несколько разработчиков работают над проектом, каждый меняет схему БД. Без инструмента миграций синхронизация схемы — настоящий кошмар.' },
        { type: 'heading', value: 'Проблемы без миграций' },
        { type: 'list', items: [
          'Разработчик А добавил колонку в таблицу — у разработчика Б ошибка',
          'На тест-сервере другая версия схемы чем на продакшене',
          'Нельзя откатить изменение схемы',
          'Нет истории изменений схемы БД'
        ]},
        { type: 'text', value: 'Flyway решает эти проблемы: каждое изменение схемы — отдельный SQL файл с номером версии. Flyway применяет их по порядку и запоминает что уже применено.' },
        { type: 'code', language: 'java', value: '<!-- pom.xml -->\n<dependency>\n    <groupId>org.flywaydb</groupId>\n    <artifactId>flyway-core</artifactId>\n</dependency>\n\n<!-- Для PostgreSQL дополнительно -->\n<dependency>\n    <groupId>org.flywaydb</groupId>\n    <artifactId>flyway-database-postgresql</artifactId>\n</dependency>' },
        { type: 'note', value: 'Flyway создаёт таблицу flyway_schema_history в вашей БД и хранит там историю применённых миграций. По этой таблице он знает что уже применено.' }
      ]
    },
    {
      id: 2,
      title: 'Структура файлов миграций',
      type: 'theory',
      content: [
        { type: 'text', value: 'Файлы миграций хранятся в src/main/resources/db/migration/ и именуются по строгому соглашению Flyway.' },
        { type: 'heading', value: 'Формат имени файла' },
        { type: 'code', language: 'java', value: '// Формат: V{версия}__{описание}.sql\n// Версия: числа с точкой или подчёркиванием\n// Двойное подчёркивание __ разделяет версию и описание\n\nsrc/main/resources/db/migration/\n├── V1__create_users_table.sql\n├── V2__create_products_table.sql\n├── V3__add_email_to_users.sql\n├── V4__create_orders_table.sql\n├── V4.1__add_index_to_orders.sql\n└── V5__add_status_column.sql\n\n// Также можно использовать repeatable миграции (R__)\n// Они применяются каждый раз когда содержимое меняется:\nsrc/main/resources/db/migration/\n└── R__create_views.sql' },
        { type: 'heading', value: 'Пример миграции' },
        { type: 'code', language: 'java', value: '-- V1__create_users_table.sql\nCREATE TABLE users (\n    id BIGSERIAL PRIMARY KEY,\n    username VARCHAR(50) NOT NULL UNIQUE,\n    email VARCHAR(255) NOT NULL UNIQUE,\n    password_hash VARCHAR(255) NOT NULL,\n    created_at TIMESTAMP NOT NULL DEFAULT NOW(),\n    active BOOLEAN NOT NULL DEFAULT TRUE\n);\n\nCREATE INDEX idx_users_email ON users(email);\n\n-- V2__create_products_table.sql\nCREATE TABLE products (\n    id BIGSERIAL PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    description TEXT,\n    price DECIMAL(10,2) NOT NULL,\n    category VARCHAR(50),\n    stock_quantity INTEGER DEFAULT 0,\n    created_at TIMESTAMP NOT NULL DEFAULT NOW()\n);' },
        { type: 'warning', value: 'Никогда не изменяй уже применённые миграции! Flyway проверяет контрольные суммы файлов. Если файл изменился — Flyway выдаст ошибку. Для изменений создавай новую миграцию.' }
      ]
    },
    {
      id: 3,
      title: 'Конфигурация Flyway',
      type: 'theory',
      content: [
        { type: 'text', value: 'Flyway автоматически подхватывает настройки подключения к БД из Spring DataSource. Дополнительные настройки через application.properties.' },
        { type: 'code', language: 'java', value: '# application.properties\n\n# Flyway включён по умолчанию если есть в classpath\nspring.flyway.enabled=true\n\n# Путь к миграциям (по умолчанию: classpath:db/migration)\nspring.flyway.locations=classpath:db/migration\n\n# Разрешить запуск на непустой БД (для первоначальной настройки)\nspring.flyway.baseline-on-migrate=true\nspring.flyway.baseline-version=0\n\n# Отключить проверку контрольных сумм (не рекомендуется в prod!)\nspring.flyway.validate-on-migrate=true\n\n# Схема для таблицы истории\nspring.flyway.schemas=public\n\n# Настройка ddl-auto при использовании Flyway\n# ВАЖНО: никогда не используй create или create-drop с Flyway!\nspring.jpa.hibernate.ddl-auto=validate' },
        { type: 'tip', value: 'При использовании Flyway всегда устанавливай spring.jpa.hibernate.ddl-auto=validate или none. Flyway управляет схемой, Hibernate только проверяет что схема соответствует Entity.' }
      ]
    },
    {
      id: 4,
      title: 'Наполнение данными: data migrations',
      type: 'theory',
      content: [
        { type: 'text', value: 'Flyway используется не только для изменения схемы, но и для начального наполнения данными (seed data).' },
        { type: 'code', language: 'java', value: '-- V3__insert_initial_data.sql\n-- Вставка начальных данных\nINSERT INTO roles (name) VALUES\n    (\'ROLE_USER\'),\n    (\'ROLE_ADMIN\'),\n    (\'ROLE_MODERATOR\');\n\nINSERT INTO categories (name, description) VALUES\n    (\'Электроника\', \'Телефоны, ноутбуки и гаджеты\'),\n    (\'Книги\', \'Бумажные и электронные книги\'),\n    (\'Спорт\', \'Спортивный инвентарь\');\n\n-- V4__add_admin_user.sql\n-- Добавление администратора (пароль хэшируется заранее)\nINSERT INTO users (username, email, password_hash, created_at)\nVALUES (\'admin\', \'admin@example.com\',\n        \'$2a$10$...\', NOW());\n\nINSERT INTO user_roles (user_id, role_id)\nSELECT u.id, r.id\nFROM users u, roles r\nWHERE u.username = \'admin\' AND r.name = \'ROLE_ADMIN\';' },
        { type: 'note', value: 'Для начальных данных в разработке используй data.sql (Spring Boot загружает его после создания схемы). Flyway лучше использовать для продакшн данных которые должны применяться в правильном порядке.' }
      ]
    },
    {
      id: 5,
      title: 'Практика: Настройка Flyway для проекта',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай полную миграцию для приложения блога с тремя связанными таблицами.',
      requirements: [
        'V1: таблица authors (id, name, email, bio, created_at)',
        'V2: таблица posts (id, title, content, author_id FK, published_at, status)',
        'V3: таблица comments (id, post_id FK, author_name, text, created_at)',
        'V4: индексы для часто используемых запросов',
        'V5: вставка начальных тестовых данных'
      ],
      expectedOutput: 'При запуске: Flyway применяет V1, V2, V3, V4, V5 последовательно\nСхема создана, индексы добавлены, тестовые данные вставлены',
      hint: 'Файлы в src/main/resources/db/migration/. V1 создаёт authors, V2 — posts с REFERENCES authors(id), V3 — comments с REFERENCES posts(id). application.properties: spring.jpa.hibernate.ddl-auto=validate',
      solution: '-- V1__create_authors_table.sql\nCREATE TABLE authors (\n    id BIGSERIAL PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(255) NOT NULL UNIQUE,\n    bio TEXT,\n    created_at TIMESTAMP NOT NULL DEFAULT NOW()\n);\n\n-- V2__create_posts_table.sql\nCREATE TABLE posts (\n    id BIGSERIAL PRIMARY KEY,\n    title VARCHAR(255) NOT NULL,\n    content TEXT NOT NULL,\n    author_id BIGINT NOT NULL REFERENCES authors(id) ON DELETE CASCADE,\n    published_at TIMESTAMP,\n    status VARCHAR(20) NOT NULL DEFAULT \'DRAFT\',\n    created_at TIMESTAMP NOT NULL DEFAULT NOW()\n);\n\n-- V3__create_comments_table.sql\nCREATE TABLE comments (\n    id BIGSERIAL PRIMARY KEY,\n    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,\n    author_name VARCHAR(100) NOT NULL,\n    text TEXT NOT NULL,\n    created_at TIMESTAMP NOT NULL DEFAULT NOW()\n);\n\n-- V4__add_indexes.sql\nCREATE INDEX idx_posts_author_id ON posts(author_id);\nCREATE INDEX idx_posts_status ON posts(status);\nCREATE INDEX idx_comments_post_id ON comments(post_id);\nCREATE INDEX idx_posts_published_at ON posts(published_at);\n\n-- V5__insert_test_data.sql\nINSERT INTO authors (name, email, bio) VALUES\n    (\'Иван Иванов\', \'ivan@blog.ru\', \'Java разработчик\'),\n    (\'Мария Петрова\', \'maria@blog.ru\', \'Frontend разработчик\');\n\nINSERT INTO posts (title, content, author_id, status, published_at) VALUES\n    (\'Введение в Spring Boot\', \'Spring Boot упрощает разработку...\',\n     1, \'PUBLISHED\', NOW()),\n    (\'JPA для начинающих\', \'JPA — это стандарт...\',\n     1, \'PUBLISHED\', NOW() - INTERVAL \'1 day\');\n\n-- application.properties:\n-- spring.flyway.enabled=true\n-- spring.jpa.hibernate.ddl-auto=validate',
      explanation: 'Каждая миграция — отдельный файл с уникальным номером версии. Flyway выполняет их строго по порядку. REFERENCES обеспечивает целостность данных на уровне БД. Индексы создаём отдельной миграцией — легче найти и при необходимости дропнуть. ddl-auto=validate: Hibernate не создаёт таблицы, только проверяет соответствие Entity и схемы.'
    },
    {
      id: 6,
      title: 'Практика: Миграция изменения схемы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Добавь новые возможности в существующую схему через безопасные миграции.',
      requirements: [
        'V6: добавь колонку tags (массив строк) к таблице posts',
        'V7: добавь таблицу post_likes (post_id, user_email, created_at) с уникальным ограничением',
        'V8: добавь VIEW popular_posts (посты с > 10 лайками)',
        'V9: Rename колонки author_name в comments на commenter_name',
        'Не забудь об обновлении Entity классов в Java'
      ],
      expectedOutput: 'Все 4 миграции применены последовательно\nVIEW popular_posts создан и работает\nELEMENT "commenter_name" доступен через Entity',
      hint: 'V6: ALTER TABLE posts ADD COLUMN tags TEXT[]. V7: CREATE TABLE с UNIQUE(post_id, user_email). V8: CREATE VIEW. V9: ALTER TABLE RENAME COLUMN. Обнови Entity после V9.',
      solution: '-- V6__add_tags_to_posts.sql\nALTER TABLE posts ADD COLUMN tags TEXT[] DEFAULT \'{}\';\n\n-- V7__create_post_likes.sql\nCREATE TABLE post_likes (\n    id BIGSERIAL PRIMARY KEY,\n    post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,\n    user_email VARCHAR(255) NOT NULL,\n    created_at TIMESTAMP NOT NULL DEFAULT NOW(),\n    CONSTRAINT uq_post_like UNIQUE (post_id, user_email)\n);\n\n-- V8__create_popular_posts_view.sql\nCREATE VIEW popular_posts AS\nSELECT p.id, p.title, p.author_id,\n       COUNT(pl.id) AS likes_count\nFROM posts p\nLEFT JOIN post_likes pl ON p.id = pl.post_id\nGROUP BY p.id, p.title, p.author_id\nHAVING COUNT(pl.id) > 10;\n\n-- V9__rename_author_name_in_comments.sql\nALTER TABLE comments\n    RENAME COLUMN author_name TO commenter_name;\n\n-- Обновлённый Entity класс:\n// @Column(name = "commenter_name")\n// private String commenterName; // было authorName',
      explanation: 'ALTER TABLE для изменения существующих таблиц — безопасная операция. ADD COLUMN с DEFAULT не блокирует таблицу надолго. RENAME COLUMN меняет имя без потери данных. После переименования надо обновить @Column(name) в Entity. VIEW создаётся как обычная таблица — Hibernate её игнорирует, но можно создать Entity с @Immutable для чтения.'
    }
  ]
}
