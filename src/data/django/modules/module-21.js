export default {
  id: 21,
  title: 'Celery и фоновые задачи',
  description: 'Celery, Redis брокер, @shared_task, beat расписание — выносим тяжёлые операции из HTTP запроса.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен Celery',
      type: 'theory',
      content: [
        { type: 'text', value: 'Celery — распределённая система обработки задач. Позволяет выполнять тяжёлые операции асинхронно, не блокируя HTTP ответ: отправка email, генерация отчётов, обработка изображений.' },
        { type: 'tip', value: 'Представь: пользователь загружает видео. Если обрабатывать в HTTP запросе — он ждёт минуты. С Celery: сразу отвечаем "принято в обработку", а Celery-воркер делает всё в фоне.' },
        { type: 'heading', value: 'Компоненты Celery' },
        { type: 'list', items: [
          'Producer — Django приложение, ставящее задачи в очередь',
          'Broker — очередь сообщений (Redis, RabbitMQ)',
          'Worker — процесс, выполняющий задачи',
          'Backend — хранилище результатов (Redis, Django ORM)',
          'Beat — планировщик периодических задач'
        ]},
        { type: 'code', language: 'python', value: '# Установка\npip install celery redis\n\n# Запуск воркера\ncelery -A myproject worker -l info\n\n# Запуск планировщика\ncelery -A myproject beat -l info' }
      ]
    },
    {
      id: 2,
      title: 'Настройка Celery в Django проекте',
      type: 'theory',
      content: [
        { type: 'text', value: 'Celery интегрируется с Django через специальный файл конфигурации и настройки в settings.py.' },
        { type: 'code', language: 'python', value: '# myproject/celery.py\nimport os\nfrom celery import Celery\n\nos.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")\n\napp = Celery("myproject")\napp.config_from_object("django.conf:settings", namespace="CELERY")\napp.autodiscover_tasks()  # автоматически находит tasks.py во всех приложениях\n\n# myproject/__init__.py\nfrom .celery import app as celery_app\n__all__ = ("celery_app",)' },
        { type: 'code', language: 'python', value: '# settings.py\nCELERY_BROKER_URL = "redis://localhost:6379/0"\nCELERY_RESULT_BACKEND = "redis://localhost:6379/0"\nCELERY_ACCEPT_CONTENT = ["json"]\nCELERY_TASK_SERIALIZER = "json"\nCELERY_RESULT_SERIALIZER = "json"\nCELERY_TIMEZONE = "Asia/Almaty"' }
      ]
    },
    {
      id: 3,
      title: '@shared_task — создание задач',
      type: 'theory',
      content: [
        { type: 'text', value: '@shared_task — рекомендуемый декоратор для создания задач в переиспользуемых приложениях. Не привязан к конкретному экземпляру Celery.' },
        { type: 'code', language: 'python', value: '# myapp/tasks.py\nfrom celery import shared_task\nfrom django.core.mail import send_mail\nfrom .models import Article\n\n@shared_task\ndef send_welcome_email(user_id):\n    """Отправка приветственного письма"""\n    from django.contrib.auth.models import User\n    user = User.objects.get(id=user_id)\n    send_mail(\n        "Добро пожаловать!",\n        f"Привет, {user.username}! Рады видеть тебя.",\n        "noreply@example.com",\n        [user.email]\n    )\n    return f"Email отправлен: {user.email}"\n\n@shared_task\ndef generate_report(date_from, date_to):\n    """Генерация отчёта (тяжёлая операция)"""\n    articles = Article.objects.filter(\n        created_at__range=[date_from, date_to]\n    ).count()\n    return {"articles_count": articles}' },
        { type: 'code', language: 'python', value: '# Вызов задачи из view\nfrom .tasks import send_welcome_email, generate_report\n\n# Асинхронно (в фоне)\nsend_welcome_email.delay(user.id)\n\n# С задержкой 60 секунд\nsend_welcome_email.apply_async(args=[user.id], countdown=60)\n\n# Получение результата (блокирует до завершения)\nresult = generate_report.delay("2024-01-01", "2024-12-31")\ndata = result.get(timeout=30)  # ждём максимум 30 секунд' }
      ]
    },
    {
      id: 4,
      title: 'Celery Beat — периодические задачи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Celery Beat — планировщик, который запускает задачи по расписанию. Аналог cron, но интегрированный с Django.' },
        { type: 'code', language: 'python', value: '# settings.py\nfrom celery.schedules import crontab\n\nCELERY_BEAT_SCHEDULE = {\n    # Каждый час\n    "send-hourly-digest": {\n        "task": "myapp.tasks.send_hourly_digest",\n        "schedule": 3600.0,  # каждые 3600 секунд\n    },\n    # Каждый день в 8:00\n    "daily-report": {\n        "task": "myapp.tasks.generate_daily_report",\n        "schedule": crontab(hour=8, minute=0),\n    },\n    # Каждый понедельник в 9:00\n    "weekly-newsletter": {\n        "task": "myapp.tasks.send_newsletter",\n        "schedule": crontab(hour=9, minute=0, day_of_week=1),\n    },\n    # Каждые 5 минут\n    "check-payments": {\n        "task": "myapp.tasks.check_pending_payments",\n        "schedule": crontab(minute="*/5"),\n        "args": ("pending",),\n    },\n}' }
      ]
    },
    {
      id: 5,
      title: 'Обработка ошибок и retry',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задачи Celery могут завершаться с ошибками. Встроенный механизм retry позволяет автоматически повторять задачу при сбое.' },
        { type: 'code', language: 'python', value: 'from celery import shared_task\nfrom celery.exceptions import MaxRetriesExceededError\nimport requests\n\n@shared_task(bind=True, max_retries=3, default_retry_delay=60)\ndef send_webhook(self, url, data):\n    """Отправка webhook с retry при ошибке"""\n    try:\n        response = requests.post(url, json=data, timeout=10)\n        response.raise_for_status()\n        return {"status": "ok", "code": response.status_code}\n    except requests.RequestException as exc:\n        # Повторяем через 60 * (номер попытки) секунд\n        raise self.retry(exc=exc, countdown=60 * (self.request.retries + 1))\n\n@shared_task(bind=True)\ndef process_payment(self, payment_id):\n    """Обработка платежа с экспоненциальным backoff"""\n    try:\n        # ... логика платежа ...\n        pass\n    except Exception as exc:\n        raise self.retry(exc=exc, countdown=2 ** self.request.retries)' },
        { type: 'tip', value: 'bind=True делает первым аргументом self — ссылку на текущую задачу. Это нужно для доступа к self.retry(), self.request.retries и другим атрибутам задачи.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Email задача с Celery',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай Celery задачу для отправки email уведомлений при регистрации пользователя.',
      requirements: [
        'Задача send_welcome_email(user_id) в tasks.py',
        'Использует @shared_task с bind=True и max_retries=3',
        'При ошибке отправки делает retry с задержкой 30 секунд',
        'В сигнале post_save на User вызывает задачу через .delay()',
        'Задача логирует результат через Python logging'
      ],
      expectedOutput: 'Создание User -> задача в очереди -> воркер отправляет email\nВ логах: "Email отправлен пользователю username"',
      hint: 'В сигнале используй transaction.on_commit(lambda: send_welcome_email.delay(user.id)) — это гарантирует выполнение после сохранения транзакции.',
      solution: '# tasks.py\nimport logging\nfrom celery import shared_task\nfrom django.core.mail import send_mail\n\nlogger = logging.getLogger(__name__)\n\n@shared_task(bind=True, max_retries=3)\ndef send_welcome_email(self, user_id):\n    from django.contrib.auth.models import User\n    try:\n        user = User.objects.get(id=user_id)\n        send_mail(\n            "Добро пожаловать!",\n            f"Привет, {user.username}!",\n            "noreply@example.com",\n            [user.email]\n        )\n        logger.info(f"Email отправлен пользователю {user.username}")\n    except Exception as exc:\n        raise self.retry(exc=exc, countdown=30)\n\n# signals.py\nfrom django.db import transaction\nfrom django.db.models.signals import post_save\nfrom django.dispatch import receiver\nfrom django.contrib.auth.models import User\nfrom .tasks import send_welcome_email\n\n@receiver(post_save, sender=User)\ndef on_user_created(sender, instance, created, **kwargs):\n    if created:\n        transaction.on_commit(lambda: send_welcome_email.delay(instance.id))',
      explanation: 'transaction.on_commit гарантирует, что задача будет поставлена в очередь только после успешного сохранения пользователя в БД. Это предотвращает ситуацию, когда воркер пытается найти пользователя, который ещё не записан.'
    },
    {
      id: 7,
      title: 'Практика: Beat расписание для отчётов',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой периодические задачи Celery Beat для ежедневной очистки и еженедельного отчёта.',
      requirements: [
        'Задача cleanup_old_sessions() — удаляет сессии старше 30 дней',
        'Задача weekly_stats_report() — считает статистику за неделю и логирует',
        'cleanup_old_sessions запускается каждый день в 3:00 ночи',
        'weekly_stats_report запускается каждое воскресенье в 10:00',
        'Настроить CELERY_BEAT_SCHEDULE в settings.py'
      ],
      expectedOutput: 'celery -A myproject beat -l info\n[03:00] Выполняется cleanup_old_sessions\n[Sun 10:00] Выполняется weekly_stats_report',
      hint: 'Используй crontab(hour=3, minute=0) для 3:00. День недели: 0=понедельник, 6=воскресенье.',
      solution: '# tasks.py\nfrom celery import shared_task\nfrom django.contrib.sessions.models import Session\nfrom django.utils import timezone\nfrom datetime import timedelta\nimport logging\n\nlogger = logging.getLogger(__name__)\n\n@shared_task\ndef cleanup_old_sessions():\n    threshold = timezone.now() - timedelta(days=30)\n    deleted, _ = Session.objects.filter(expire_date__lt=threshold).delete()\n    logger.info(f"Удалено {deleted} старых сессий")\n    return deleted\n\n@shared_task\ndef weekly_stats_report():\n    from django.contrib.auth.models import User\n    week_ago = timezone.now() - timedelta(days=7)\n    new_users = User.objects.filter(date_joined__gte=week_ago).count()\n    logger.info(f"Новых пользователей за неделю: {new_users}")\n    return new_users\n\n# settings.py\nfrom celery.schedules import crontab\nCELERY_BEAT_SCHEDULE = {\n    "cleanup-sessions": {\n        "task": "myapp.tasks.cleanup_old_sessions",\n        "schedule": crontab(hour=3, minute=0),\n    },\n    "weekly-report": {\n        "task": "myapp.tasks.weekly_stats_report",\n        "schedule": crontab(hour=10, minute=0, day_of_week=6),\n    },\n}',
      explanation: 'day_of_week=6 в Celery — воскресенье (0=понедельник). Задачи Beat выполняются воркером как обычные Celery задачи — Beat только ставит их в очередь по расписанию.'
    }
  ]
}
