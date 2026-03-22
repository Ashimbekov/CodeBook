export default {
  id: 9,
  title: 'Alembic: миграции базы данных',
  description: 'Управление схемой базы данных через Alembic: инициализация, создание миграций, применение и откат, работа с async SQLAlchemy',
  lessons: [
    {
      id: 1,
      title: 'Что такое миграции и зачем Alembic',
      type: 'theory',
      content: [
        { type: 'text', value: 'Миграции — способ эволюции схемы базы данных. Alembic отслеживает изменения моделей и создаёт SQL скрипты для их применения. Без миграций при изменении модели нужно вручную менять БД.' },
        { type: 'tip', value: 'Alembic как git для базы данных: каждое изменение схемы — отдельный коммит. Можно применять вперёд (upgrade) и откатывать (downgrade).' },
        { type: 'heading', value: 'Установка и инициализация' },
        { type: 'code', language: 'python', value: 'pip install alembic\n\n# Инициализировать Alembic в проекте\nalembic init alembic\n\n# Для async SQLAlchemy:\nalembic init -t async alembic\n\n# Создаётся структура:\n# alembic/\n#   env.py          — конфигурация миграций\n#   script.py.mako  — шаблон файла миграции\n#   versions/       — директория с файлами миграций\n# alembic.ini       — конфигурация Alembic' }
      ]
    },
    {
      id: 2,
      title: 'Настройка alembic.ini и env.py',
      type: 'theory',
      content: [
        { type: 'text', value: 'Нужно настроить подключение к БД в alembic.ini и указать metadata моделей в env.py для автогенерации миграций.' },
        { type: 'heading', value: 'alembic.ini — URL базы данных' },
        { type: 'code', language: 'python', value: '# alembic.ini\n[alembic]\nscript_location = alembic\n\n# Можно использовать переменную окружения:\nsqlalchemy.url = postgresql+asyncpg://user:password@localhost:5432/mydb\n\n# Или через env.py (рекомендуется для секретов):\n# sqlalchemy.url =  # оставить пустым, заполнить в env.py' },
        { type: 'heading', value: 'env.py — настройка для async' },
        { type: 'code', language: 'python', value: '# alembic/env.py\nimport asyncio\nfrom logging.config import fileConfig\nfrom sqlalchemy.ext.asyncio import async_engine_from_config\nfrom sqlalchemy import pool\nfrom alembic import context\nfrom app.database import Base  # импорт Base с моделями\nfrom app.models import *  # импорт ВСЕХ моделей (нужно для автогенерации)\nimport os\n\nconfig = context.config\nfileConfig(config.config_file_name)\n\n# Используем переменную окружения\nconfig.set_main_option("sqlalchemy.url",\n    os.environ.get("DATABASE_URL", "postgresql+asyncpg://user:pass@localhost/db"))\n\ntarget_metadata = Base.metadata  # ВАЖНО: указать metadata с моделями\n\ndef run_migrations_offline() -> None:\n    url = config.get_main_option("sqlalchemy.url")\n    context.configure(url=url, target_metadata=target_metadata, literal_binds=True)\n    with context.begin_transaction():\n        context.run_migrations()\n\nasync def run_async_migrations() -> None:\n    connectable = async_engine_from_config(\n        config.get_section(config.config_ini_section),\n        prefix="sqlalchemy.",\n        poolclass=pool.NullPool,\n    )\n    async with connectable.connect() as connection:\n        await connection.run_sync(do_run_migrations)\n    await connectable.dispose()\n\ndef do_run_migrations(connection):\n    context.configure(connection=connection, target_metadata=target_metadata)\n    with context.begin_transaction():\n        context.run_migrations()\n\ndef run_migrations_online() -> None:\n    asyncio.run(run_async_migrations())\n\nif context.is_offline_mode():\n    run_migrations_offline()\nelse:\n    run_migrations_online()' }
      ]
    },
    {
      id: 3,
      title: 'Создание и применение миграций',
      type: 'theory',
      content: [
        { type: 'text', value: 'После настройки можно автоматически генерировать миграции из изменений моделей и применять их к БД.' },
        { type: 'heading', value: 'Основные команды Alembic' },
        { type: 'code', language: 'python', value: '# Автоматически создать миграцию из изменений моделей\nalembic revision --autogenerate -m "create users table"\n\n# Создать пустую миграцию (заполнить вручную)\nalembic revision -m "add indexes"\n\n# Применить все ожидающие миграции\nalembic upgrade head\n\n# Применить конкретную миграцию\nalembic upgrade +1  # следующая\nalembic upgrade abc123  # по ID\n\n# Откатить последнюю миграцию\nalembic downgrade -1\n\n# Откатить все миграции\nalembic downgrade base\n\n# Показать текущую версию\nalembic current\n\n# Показать историю миграций\nalembic history --verbose' }
      ]
    },
    {
      id: 4,
      title: 'Файл миграции',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждая миграция — Python файл с функциями upgrade() и downgrade(). upgrade() применяет изменения, downgrade() откатывает.' },
        { type: 'heading', value: 'Структура файла миграции' },
        { type: 'code', language: 'python', value: '"""create users table\n\nRevision ID: abc123def456\nRevises:\nCreate Date: 2024-01-15 10:00:00\n"""\nfrom alembic import op\nimport sqlalchemy as sa\n\nrevision = "abc123def456"\ndown_revision = None  # первая миграция\nbranch_labels = None\ndepends_on = None\n\ndef upgrade() -> None:\n    op.create_table(\n        "users",\n        sa.Column("id", sa.Integer(), nullable=False),\n        sa.Column("name", sa.String(100), nullable=False),\n        sa.Column("email", sa.String(255), nullable=False),\n        sa.Column("password_hash", sa.String(255), nullable=False),\n        sa.Column("is_active", sa.Boolean(), server_default="true"),\n        sa.Column("created_at", sa.DateTime(timezone=True),\n                  server_default=sa.func.now()),\n        sa.PrimaryKeyConstraint("id")\n    )\n    op.create_index("ix_users_email", "users", ["email"], unique=True)\n    op.create_index("ix_users_id", "users", ["id"])\n\ndef downgrade() -> None:\n    op.drop_index("ix_users_email", "users")\n    op.drop_table("users")' }
      ]
    },
    {
      id: 5,
      title: 'Типичные операции в миграциях',
      type: 'theory',
      content: [
        { type: 'text', value: 'Alembic предоставляет богатый API для операций с таблицами: добавление столбцов, индексов, внешних ключей, переименование.' },
        { type: 'heading', value: 'Операции op.X' },
        { type: 'code', language: 'python', value: 'def upgrade() -> None:\n    # Добавить столбец\n    op.add_column("users",\n        sa.Column("bio", sa.Text(), nullable=True))\n\n    # Изменить тип столбца\n    op.alter_column("users", "name",\n        existing_type=sa.String(100),\n        type_=sa.String(200))\n\n    # Удалить столбец\n    op.drop_column("users", "old_field")\n\n    # Переименовать таблицу\n    op.rename_table("old_name", "new_name")\n\n    # Добавить внешний ключ\n    op.add_column("posts",\n        sa.Column("category_id", sa.Integer(), sa.ForeignKey("categories.id")))\n\n    # Добавить индекс\n    op.create_index("idx_posts_user_id", "posts", ["user_id"])\n\n    # Составной индекс\n    op.create_index("idx_posts_user_status", "posts", ["user_id", "status"])\n\n    # Выполнить произвольный SQL\n    op.execute("UPDATE users SET is_active = true WHERE is_active IS NULL")' }
      ]
    },
    {
      id: 6,
      title: 'Практика: миграции для блог-приложения',
      type: 'practice',
      difficulty: 'hard',
      description: 'Настройте Alembic для блог-приложения и создайте цепочку миграций: создание таблиц, добавление полей, создание индексов.',
      requirements: [
        'Инициализируй Alembic с поддержкой async',
        'Настрой env.py для чтения DATABASE_URL из переменной окружения',
        'Миграция 1: создать таблицу users (id, name, email, password_hash, created_at)',
        'Миграция 2: создать таблицу posts (id, title, content, user_id FK, created_at)',
        'Миграция 3: добавить поле bio в users и индекс на posts.user_id',
        'Миграция 4: добавить таблицу tags и связь post_tags (many-to-many)',
        'Протестировать: upgrade head, current, downgrade -1'
      ],
      hint: 'Для many-to-many таблицы: op.create_table("post_tags", Column("post_id", FK), Column("tag_id", FK)). Составной PK: PrimaryKeyConstraint("post_id", "tag_id").',
      solution: '# Migration 1: users\ndef upgrade() -> None:\n    op.create_table("users",\n        sa.Column("id", sa.Integer(), primary_key=True),\n        sa.Column("name", sa.String(100), nullable=False),\n        sa.Column("email", sa.String(255), unique=True, nullable=False),\n        sa.Column("password_hash", sa.String(255), nullable=False),\n        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now())\n    )\n\n# Migration 2: posts\ndef upgrade() -> None:\n    op.create_table("posts",\n        sa.Column("id", sa.Integer(), primary_key=True),\n        sa.Column("title", sa.String(255), nullable=False),\n        sa.Column("content", sa.Text(), nullable=False),\n        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),\n        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now())\n    )\n\n# Migration 3: add bio and index\ndef upgrade() -> None:\n    op.add_column("users", sa.Column("bio", sa.Text(), nullable=True))\n    op.create_index("idx_posts_user_id", "posts", ["user_id"])\n\n# Migration 4: tags many-to-many\ndef upgrade() -> None:\n    op.create_table("tags",\n        sa.Column("id", sa.Integer(), primary_key=True),\n        sa.Column("name", sa.String(50), unique=True)\n    )\n    op.create_table("post_tags",\n        sa.Column("post_id", sa.Integer(), sa.ForeignKey("posts.id")),\n        sa.Column("tag_id", sa.Integer(), sa.ForeignKey("tags.id")),\n        sa.PrimaryKeyConstraint("post_id", "tag_id")\n    )',
      explanation: 'Цепочка миграций: каждая ссылается на предыдущую через down_revision. Составной PK в post_tags предотвращает дублирование связей. Индексы на FK столбцах критичны для производительности JOIN запросов.'
    }
  ]
}
