export default {
  id: 2,
  title: 'Первый проект',
  description: 'django-admin и manage.py: создание проекта и приложений, управление командами, настройка базы данных и запуск сервера разработки',
  lessons: [
    {
      id: 1,
      title: 'django-admin: инструмент создания проектов',
      type: 'theory',
      content: [
        { type: 'text', value: 'django-admin — утилита командной строки Django, доступная после установки. Используется в основном для создания новых проектов. После создания проекта все дальнейшие команды выполняются через manage.py.' },
        { type: 'code', language: 'python', value: '# Доступные команды django-admin:\n# django-admin startproject <name>  -- создать проект\n# django-admin help                  -- список команд\n# django-admin version               -- версия Django\n\n# Создание проекта с указанием директории:\n# django-admin startproject mysite .  # точка = текущая директория\n# django-admin startproject mysite    # создаст вложенную папку\n\n# Разница:\n# Без точки:\n# mysite/\n#   manage.py\n#   mysite/\n#     settings.py\n\n# С точкой (в текущей папке):\n# manage.py\n# mysite/\n#   settings.py\n\nprint("django-admin startproject mysite . -- рекомендуемый вариант")' },
        { type: 'tip', value: 'Рекомендую создавать проект с точкой: django-admin startproject mysite . в уже созданной директории проекта. Так manage.py находится в корне, что удобнее при работе с Docker и CI/CD.' }
      ]
    },
    {
      id: 2,
      title: 'manage.py: основные команды',
      type: 'theory',
      content: [
        { type: 'text', value: 'manage.py — главный инструмент разработчика Django. Через него запускается сервер, создаются приложения, выполняются миграции и многое другое.' },
        { type: 'code', language: 'python', value: '# python manage.py <команда>\n\n# Сервер разработки:\n# python manage.py runserver           # порт 8000\n# python manage.py runserver 8080      # другой порт\n# python manage.py runserver 0:8000    # доступен извне\n\n# Работа с приложениями:\n# python manage.py startapp blog       # создать приложение\n\n# Миграции:\n# python manage.py makemigrations     # создать миграции\n# python manage.py migrate            # применить миграции\n# python manage.py showmigrations     # статус миграций\n\n# Оболочка (Shell):\n# python manage.py shell              # интерактивная оболочка Django\n# python manage.py shell_plus         # расширенная (django-extensions)\n\n# Пользователи:\n# python manage.py createsuperuser    # создать администратора\n# python manage.py changepassword     # сменить пароль\n\n# Проверка:\n# python manage.py check              # проверить конфигурацию\n# python manage.py test               # запустить тесты' },
        { type: 'heading', value: 'Полезные команды для отладки и данных' },
        { type: 'code', language: 'python', value: '# Работа с данными:\n# python manage.py dumpdata blog.Article --indent 2 > articles.json  # экспорт в JSON\n# python manage.py loaddata articles.json                            # импорт из JSON\n\n# Работа с миграциями:\n# python manage.py migrate blog 0003           # откатить до миграции 0003\n# python manage.py sqlmigrate blog 0001        # показать SQL миграции\n# python manage.py squashmigrations blog 0001 0005  # объединить миграции\n\n# Статика:\n# python manage.py collectstatic               # собрать статику в STATIC_ROOT\n# python manage.py findstatic style.css        # найти файл статики\n\n# Кеш:\n# python manage.py createcachetable           # создать таблицу для кеша\n# python manage.py clearcache                 # очистить кеш (django-extensions)\n\n# Список всех доступных команд:\n# python manage.py help\n# python manage.py help <команда>             # описание конкретной команды' },
        { type: 'tip', value: 'Команда python manage.py check --deploy проверяет настройки для продакшн-деплоя: HTTPS, SECRET_KEY, DEBUG=False и другие параметры безопасности.' }
      ]
    },
    {
      id: 3,
      title: 'Настройка базы данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django поддерживает PostgreSQL, MySQL, SQLite, Oracle. По умолчанию используется SQLite — удобно для разработки. В продакшне чаще используют PostgreSQL.' },
        { type: 'code', language: 'python', value: '# settings.py\n\n# SQLite (по умолчанию, для разработки)\nDATABASES = {\n    "default": {\n        "ENGINE": "django.db.backends.sqlite3",\n        "NAME": BASE_DIR / "db.sqlite3",\n    }\n}\n\n# PostgreSQL (для продакшна)\n# pip install psycopg2-binary\nDATABASES = {\n    "default": {\n        "ENGINE": "django.db.backends.postgresql",\n        "NAME": "mydb",\n        "USER": "myuser",\n        "PASSWORD": "mypassword",\n        "HOST": "localhost",\n        "PORT": "5432",\n    }\n}\n\n# MySQL\n# pip install mysqlclient\nDATABASES = {\n    "default": {\n        "ENGINE": "django.db.backends.mysql",\n        "NAME": "mydb",\n        "USER": "root",\n        "PASSWORD": "password",\n        "HOST": "127.0.0.1",\n        "PORT": "3306",\n    }\n}' },
        { type: 'tip', value: 'Для продакшна храни DATABASE_URL в переменных окружения и используй пакет dj-database-url: DATABASES = {"default": dj_database_url.config(default=os.environ["DATABASE_URL"])}' }
      ]
    },
    {
      id: 4,
      title: 'Первые миграции и superuser',
      type: 'theory',
      content: [
        { type: 'text', value: 'После создания проекта нужно применить начальные миграции (для встроенных приложений Django) и создать суперпользователя для доступа к admin-панели.' },
        { type: 'code', language: 'python', value: '# 1. Применяем встроенные миграции Django\n# python manage.py migrate\n\n# Вывод:\n# Operations to perform:\n#   Apply all migrations: admin, auth, contenttypes, sessions\n# Running migrations:\n#   Applying contenttypes.0001_initial... OK\n#   Applying auth.0001_initial... OK\n#   ...\n\n# 2. Создаём суперпользователя\n# python manage.py createsuperuser\n# Username: admin\n# Email: admin@example.com\n# Password: ****\n\n# 3. Запускаем сервер\n# python manage.py runserver\n\n# 4. Открываем admin: http://127.0.0.1:8000/admin/\n\nprint("После migrate создаётся db.sqlite3 с таблицами Django")' },
        { type: 'note', value: 'migrate создаёт таблицы для auth (пользователи), admin (логи), sessions (сессии) и contenttypes. Без этого admin-панель не работает.' }
      ]
    },
    {
      id: 5,
      title: 'Django Shell: интерактивная работа',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django Shell — интерактивная Python-оболочка с полностью настроенным Django. Позволяет тестировать ORM-запросы, создавать объекты и исследовать приложение.' },
        { type: 'code', language: 'python', value: '# python manage.py shell\n# >>> import django\n# >>> from django.contrib.auth.models import User\n\n# Создание пользователя\nfrom django.contrib.auth.models import User\nuser = User.objects.create_user("john", "john@example.com", "pass123")\nprint(user.id)  # 1\nprint(user.username)  # john\n\n# Получение всех пользователей\nusers = User.objects.all()\nprint(users)  # <QuerySet [<User: admin>, <User: john>]>\n\n# Поиск по полю\nadmin = User.objects.get(username="admin")\nprint(admin.is_superuser)  # True\n\n# Фильтрация\nactive_users = User.objects.filter(is_active=True)\nprint(active_users.count())  # 2' },
        { type: 'tip', value: 'Установи ipython для удобной оболочки: pip install ipython. Django Shell автоматически обнаружит его. Команды с историей, автодополнение, красивая печать объектов.' }
      ]
    },
    {
      id: 6,
      title: 'Кастомные команды manage.py',
      type: 'theory',
      content: [
        { type: 'text', value: 'Можно создавать собственные команды manage.py для автоматизации задач: импорт данных, очистка базы, генерация отчётов.' },
        { type: 'code', language: 'python', value: '# Структура кастомной команды:\n# myapp/management/commands/import_data.py\n\nfrom django.core.management.base import BaseCommand\n\nclass Command(BaseCommand):\n    help = "Импортирует данные из CSV файла"\n\n    def add_arguments(self, parser):\n        parser.add_argument("filename", type=str, help="Путь к CSV файлу")\n        parser.add_argument(\n            "--dry-run",\n            action="store_true",\n            help="Запуск без сохранения данных"\n        )\n\n    def handle(self, *args, **options):\n        filename = options["filename"]\n        dry_run = options["dry_run"]\n\n        self.stdout.write(f"Импорт из {filename}...")\n\n        if dry_run:\n            self.stdout.write(self.style.WARNING("Режим dry-run: данные не сохраняются"))\n        else:\n            # Здесь логика импорта\n            self.stdout.write(self.style.SUCCESS("Импорт завершён!")) \n\n# Запуск:\n# python manage.py import_data data.csv\n# python manage.py import_data data.csv --dry-run' },
        { type: 'heading', value: 'Команда для очистки старых данных' },
        { type: 'code', language: 'python', value: '# myapp/management/commands/cleanup_old_records.py\nfrom django.core.management.base import BaseCommand\nfrom django.utils import timezone\nfrom datetime import timedelta\nfrom myapp.models import LogEntry\n\nclass Command(BaseCommand):\n    help = "Удаляет записи логов старше N дней"\n\n    def add_arguments(self, parser):\n        parser.add_argument(\n            "--days",\n            type=int,\n            default=30,\n            help="Удалить записи старше этого количества дней (по умолчанию: 30)"\n        )\n\n    def handle(self, *args, **options):\n        days = options["days"]\n        cutoff = timezone.now() - timedelta(days=days)\n        deleted_count, _ = LogEntry.objects.filter(created_at__lt=cutoff).delete()\n        self.stdout.write(\n            self.style.SUCCESS(f"Удалено {deleted_count} записей старше {days} дней")\n        )\n\n# Запуск через cron каждую ночь:\n# 0 2 * * * /path/to/venv/bin/python manage.py cleanup_old_records --days 30' },
        { type: 'note', value: 'Структура директорий для команды: myapp/management/__init__.py, myapp/management/commands/__init__.py, myapp/management/commands/my_command.py. Оба __init__.py должны существовать (могут быть пустыми).' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Настройка проекта',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настрой Django-проект с несколькими приложениями и кастомной командой manage.py.',
      requirements: [
        'Проект shop с приложениями: products, users',
        'Настрой PostgreSQL в settings.py (или оставь SQLite с переменными окружения)',
        'Создай кастомную команду seed_db которая создаёт тестовые данные',
        'В seed_db создай 3 тестовых пользователя через User.objects.create_user()',
        'Команда выводит "Создано N пользователей" в зелёном цвете'
      ],
      expectedOutput: 'python manage.py seed_db\n> Создано 3 пользователей',
      hint: 'Создай директорию management/commands/ внутри приложения. Файл команды — это Python-класс Command(BaseCommand) с методом handle(). self.style.SUCCESS() красит вывод зелёным.',
      solution: '# users/management/__init__.py (пустой)\n# users/management/commands/__init__.py (пустой)\n# users/management/commands/seed_db.py\n\nfrom django.core.management.base import BaseCommand\nfrom django.contrib.auth.models import User\n\nclass Command(BaseCommand):\n    help = "Создаёт тестовые данные"\n\n    def handle(self, *args, **options):\n        test_users = [\n            ("alice", "alice@test.com", "pass123"),\n            ("bob", "bob@test.com", "pass123"),\n            ("charlie", "charlie@test.com", "pass123"),\n        ]\n        count = 0\n        for username, email, password in test_users:\n            if not User.objects.filter(username=username).exists():\n                User.objects.create_user(username, email, password)\n                count += 1\n        self.stdout.write(\n            self.style.SUCCESS(f"Создано {count} пользователей")\n        )',
      explanation: 'Директория management/commands/ обязательна — Django ищет команды именно там. handle() — основной метод выполнения. exists() проверяет существование перед созданием — команда идемпотентна (можно запускать несколько раз). style.SUCCESS() делает текст зелёным в терминале.'
    }
  ]
}
