export default {
  id: 6,
  title: 'Миграции',
  description: 'makemigrations и migrate в Django: создание и применение миграций, зависимости, отмена миграций и управление схемой базы данных',
  lessons: [
    {
      id: 1,
      title: 'Что такое миграции и зачем они нужны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Миграции — это способ Django синхронизировать модели Python с реальной схемой базы данных. Каждое изменение модели фиксируется в файле миграции, который можно применить к любой базе.' },
        { type: 'code', language: 'python', value: '# Цикл работы с миграциями:\n\n# 1. Изменяем модель в models.py\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    # Добавляем новое поле:\n    excerpt = models.TextField(blank=True)  # НОВОЕ ПОЛЕ\n\n# 2. Создаём миграцию\n# python manage.py makemigrations\n# Создаёт: blog/migrations/0002_article_excerpt.py\n\n# 3. Просматриваем SQL который будет выполнен\n# python manage.py sqlmigrate blog 0002\n# BEGIN;\n# ALTER TABLE "blog_article" ADD COLUMN "excerpt" text NOT NULL DEFAULT "";\n# COMMIT;\n\n# 4. Применяем миграцию к базе данных\n# python manage.py migrate\n# Running migrations:\n#   Applying blog.0002_article_excerpt... OK\n\nprint("Никогда не редактируй применённые миграции!")' },
        { type: 'tip', value: 'Файлы миграций нужно добавлять в систему контроля версий (git). Они описывают историю изменений схемы базы данных — это ценная информация для команды.' }
      ]
    },
    {
      id: 2,
      title: 'makemigrations: создание миграций',
      type: 'theory',
      content: [
        { type: 'text', value: 'makemigrations анализирует текущие модели и существующие миграции, затем создаёт файл с изменениями. Каждая миграция — это Python-класс.' },
        { type: 'code', language: 'python', value: '# Команды makemigrations:\n\n# Создать миграции для всех приложений\n# python manage.py makemigrations\n\n# Создать только для конкретного приложения\n# python manage.py makemigrations blog\n\n# С пояснением (будет в комментарии миграции)\n# python manage.py makemigrations --name "add_excerpt_to_article" blog\n\n# Проверить что нет несозданных миграций (для CI/CD)\n# python manage.py makemigrations --check\n\n# Пример сгенерированного файла миграции:\n# blog/migrations/0002_article_excerpt.py\n\n# from django.db import migrations, models\n#\n# class Migration(migrations.Migration):\n#     dependencies = [\n#         ("blog", "0001_initial"),\n#     ]\n#     operations = [\n#         migrations.AddField(\n#             model_name="article",\n#             name="excerpt",\n#             field=models.TextField(blank=True, default=""),\n#         ),\n#     ]' },
        { type: 'note', value: 'При добавлении поля без default или blank=True Django спрашивает: "Provide a default value?" — нужно дать значение по умолчанию для существующих записей в базе.' }
      ]
    },
    {
      id: 3,
      title: 'migrate: применение миграций',
      type: 'theory',
      content: [
        { type: 'text', value: 'migrate применяет или отменяет миграции к базе данных. Отслеживает историю применённых миграций в таблице django_migrations.' },
        { type: 'code', language: 'python', value: '# Применить все непримененные миграции\n# python manage.py migrate\n\n# Мигрировать только конкретное приложение\n# python manage.py migrate blog\n\n# Откатить до конкретной миграции (ОСТОРОЖНО: потеря данных!)\n# python manage.py migrate blog 0001\n\n# Полный откат приложения\n# python manage.py migrate blog zero\n\n# Статус миграций\n# python manage.py showmigrations\n# blog\n#  [X] 0001_initial\n#  [X] 0002_article_excerpt\n#  [ ] 0003_article_author  <-- не применена\n\n# python manage.py showmigrations blog --list\n\n# Таблица django_migrations в БД хранит историю:\n# app | name | applied\n# blog | 0001_initial | 2024-01-15\n# blog | 0002_article_excerpt | 2024-01-20' },
        { type: 'warning', value: 'Откат миграции (migrate blog 0001) может безвозвратно удалить данные из таблиц. В продакшне всегда делай резервную копию базы перед откатом миграций!' }
      ]
    },
    {
      id: 4,
      title: 'DataMigrations: изменение данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда нужно не только изменить схему, но и преобразовать существующие данные. Для этого используют миграции данных (data migrations).' },
        { type: 'code', language: 'python', value: '# Создание data migration:\n# python manage.py makemigrations --empty blog --name "populate_slugs"\n\n# blog/migrations/0004_populate_slugs.py\nfrom django.db import migrations\nfrom django.utils.text import slugify\n\ndef populate_slugs(apps, schema_editor):\n    """Заполняем slug на основе title"""\n    Article = apps.get_model("blog", "Article")  # НЕ импортируй напрямую!\n    for article in Article.objects.all():\n        if not article.slug:\n            article.slug = slugify(article.title)\n            article.save(update_fields=["slug"])\n\ndef reverse_populate_slugs(apps, schema_editor):\n    """Функция отмены (необязательна)"""\n    Article = apps.get_model("blog", "Article")\n    Article.objects.all().update(slug="")\n\nclass Migration(migrations.Migration):\n    dependencies = [\n        ("blog", "0003_article_slug"),\n    ]\n    operations = [\n        migrations.RunPython(populate_slugs, reverse_populate_slugs),\n    ]' },
        { type: 'tip', value: 'В data migration ВСЕГДА используй apps.get_model(), а не прямой импорт модели. Прямой импорт даст текущую версию модели, а не ту что была на момент миграции — это может сломать исторические миграции.' }
      ]
    },
    {
      id: 5,
      title: 'Конфликты миграций и squash',
      type: 'theory',
      content: [
        { type: 'text', value: 'В командной разработке могут возникать конфликты миграций. squashmigrations сжимает множество миграций в одну — ускоряет деплой на новых серверах.' },
        { type: 'code', language: 'python', value: '# Конфликт: два разработчика одновременно создали миграции\n# blog/migrations/0003_alice_changes.py\n# blog/migrations/0003_bob_changes.py\n\n# Решение — создать merge migration:\n# python manage.py makemigrations --merge\n# Создаёт: blog/migrations/0004_merge_20240115_alice_bob.py\n\n# squashmigrations — сжатие миграций\n# python manage.py squashmigrations blog 0001 0010\n# Создаёт: blog/migrations/0001_squashed_0010.py\n# Заменяет миграции 0001-0010 одной оптимизированной\n\n# После применения squashed migration на всех серверах:\n# 1. Удали оригинальные 0001-0010 файлы\n# 2. Обнови replaces в squashed файле\n\n# Полезные команды:\n# python manage.py showmigrations                     -- статус всех\n# python manage.py sqlmigrate blog 0003              -- SQL конкретной\n# python manage.py dbshell                           -- консоль БД\n# python manage.py migrate blog 0003                 -- применить до 0003\nprint("squash ускоряет инициализацию новых инстансов")' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Управление миграциями',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай приложение и управляй миграциями: добавляй поля, создавай data migration.',
      requirements: [
        'Создай модель Article: title (CharField), content (TextField), created_at (auto_now_add)',
        'Создай и применив начальную миграцию 0001_initial',
        'Добавь поле slug (SlugField, unique=True, blank=True)',
        'Создай миграцию 0002_article_slug',
        'Создай data migration 0003_populate_slugs которая заполняет slug из title через slugify()',
        'Выведи python manage.py showmigrations blog после всех операций'
      ],
      expectedOutput: 'blog\n [X] 0001_initial\n [X] 0002_article_slug\n [X] 0003_populate_slugs',
      hint: 'slugify("Привет мир") -> "privet-mir". apps.get_model("blog", "Article") в data migration. makemigrations --empty blog --name populate_slugs для пустой миграции.',
      solution: '# blog/models.py (после всех изменений)\nfrom django.db import models\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    content = models.TextField()\n    slug = models.SlugField(max_length=200, unique=True, blank=True)\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    def __str__(self):\n        return self.title\n\n# blog/migrations/0002_article_slug.py\nfrom django.db import migrations, models\n\nclass Migration(migrations.Migration):\n    dependencies = [("blog", "0001_initial")]\n    operations = [\n        migrations.AddField(\n            model_name="article",\n            name="slug",\n            field=models.SlugField(blank=True, max_length=200, unique=True, default=""),\n            preserve_default=False,\n        ),\n    ]\n\n# blog/migrations/0003_populate_slugs.py\nfrom django.db import migrations\nfrom django.utils.text import slugify\n\ndef populate_slugs(apps, schema_editor):\n    Article = apps.get_model("blog", "Article")\n    for article in Article.objects.all():\n        if not article.slug:\n            base_slug = slugify(article.title)\n            slug = base_slug\n            counter = 1\n            while Article.objects.filter(slug=slug).exclude(pk=article.pk).exists():\n                slug = f"{base_slug}-{counter}"\n                counter += 1\n            article.slug = slug\n            article.save(update_fields=["slug"])\n\nclass Migration(migrations.Migration):\n    dependencies = [("blog", "0002_article_slug")]\n    operations = [migrations.RunPython(populate_slugs, migrations.RunPython.noop)]',
      explanation: 'Data migration использует apps.get_model() для получения "исторической" версии модели. Логика уникальности slug: если slug уже занят, добавляем -1, -2 и т.д. preserve_default=False говорит Django что default="") временный и не должен добавляться в модель. RunPython.noop означает что отмена миграции ничего не делает.'
    }
  ]
}
