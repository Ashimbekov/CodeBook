export default {
  id: 21,
  title: 'Celery и фоновые задачи',
  description: 'Celery от установки до продакшена: брокеры, задачи, retry, цепочки, приоритеты, мониторинг, Docker — всё для асинхронной обработки.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен Celery',
      type: 'theory',
      content: [
        { type: 'text', value: 'Celery — распределённая система обработки задач (distributed task queue). Позволяет выполнять тяжёлые операции асинхронно, не блокируя HTTP ответ пользователю.' },
        { type: 'heading', value: 'Проблема без Celery' },
        { type: 'code', language: 'python', value: '# views.py — БЕЗ Celery (плохо)\ndef register_user(request):\n    user = User.objects.create_user(**form.cleaned_data)\n\n    # Пользователь ЖДЁТ пока всё это выполнится:\n    send_welcome_email(user)          # 2-5 сек (SMTP)\n    resize_avatar(user.avatar)         # 3-10 сек (CPU)\n    sync_to_crm(user)                  # 1-3 сек (HTTP API)\n    generate_recommendations(user)     # 5-15 сек (ML модель)\n\n    # Итого: 11-33 секунды ожидания!\n    return JsonResponse({"status": "ok"})' },
        { type: 'heading', value: 'Решение с Celery' },
        { type: 'code', language: 'python', value: '# views.py — С Celery (хорошо)\ndef register_user(request):\n    user = User.objects.create_user(**form.cleaned_data)\n\n    # Всё уходит в фоновую очередь — пользователь не ждёт:\n    send_welcome_email.delay(user.id)        # ~1 мс\n    resize_avatar.delay(user.id)              # ~1 мс\n    sync_to_crm.delay(user.id)               # ~1 мс\n    generate_recommendations.delay(user.id)   # ~1 мс\n\n    # Итого: ~4 мс — мгновенный ответ!\n    return JsonResponse({"status": "ok"})' },
        { type: 'heading', value: 'Когда использовать Celery' },
        { type: 'list', items: [
          'Отправка email/SMS/push уведомлений',
          'Обработка изображений и видео (resize, конвертация, watermark)',
          'Генерация отчётов и экспорт данных (PDF, Excel, CSV)',
          'Интеграция с внешними API (CRM, платёжные системы, аналитика)',
          'ML inference — предсказания, рекомендации',
          'Периодические задачи: очистка данных, бэкапы, рассылки',
          'Веб-скрейпинг и индексация',
          'Любая операция дольше 200-500 мс, которую не нужно ждать'
        ]},
        { type: 'warning', value: 'Celery НЕ нужен для: простых запросов к БД, валидации форм, рендеринга шаблонов. Если операция занимает < 200 мс — просто выполни её синхронно. Не усложняй архитектуру без необходимости.' }
      ]
    },
    {
      id: 2,
      title: 'Архитектура Celery',
      type: 'theory',
      content: [
        { type: 'text', value: 'Celery работает по принципу producer-consumer через очередь сообщений. Это позволяет масштабировать обработку горизонтально — добавляя больше воркеров.' },
        { type: 'heading', value: '5 компонентов Celery' },
        { type: 'list', items: [
          'Producer (Django) — создаёт задачи и кладёт в очередь через .delay() или .apply_async()',
          'Broker (Redis/RabbitMQ) — очередь сообщений, хранит задачи до выполнения',
          'Worker — процесс, который забирает задачи из очереди и выполняет',
          'Result Backend (Redis/Django ORM/PostgreSQL) — хранит результаты выполненных задач',
          'Beat — планировщик периодических задач (cron на стероидах)'
        ]},
        { type: 'code', language: 'text', value: '┌──────────────┐     ┌─────────────┐     ┌──────────────┐\n│   Django     │────▶│   Redis     │────▶│   Worker 1   │\n│  (Producer)  │     │  (Broker)   │     │  (Consumer)  │\n│              │     │             │     └──────────────┘\n│  .delay()    │     │  Очередь    │     ┌──────────────┐\n│  задачи      │     │  задач      │────▶│   Worker 2   │\n└──────────────┘     │             │     │  (Consumer)  │\n                     │             │     └──────────────┘\n┌──────────────┐     │             │     ┌──────────────┐\n│  Celery Beat │────▶│             │────▶│   Worker N   │\n│ (Scheduler)  │     └─────────────┘     │  (Consumer)  │\n└──────────────┘            │            └──────────────┘\n                     ┌──────▼──────┐\n                     │   Redis     │\n                     │  (Backend)  │\n                     │  результаты │\n                     └─────────────┘' },
        { type: 'heading', value: 'Протокол AMQP' },
        { type: 'text', value: 'Celery использует протокол AMQP (Advanced Message Queuing Protocol). Основные понятия:' },
        { type: 'list', items: [
          'Message — сериализованная задача (JSON/pickle/msgpack)',
          'Queue — именованная очередь, из которой воркеры забирают задачи',
          'Exchange — маршрутизатор сообщений по очередям',
          'Routing key — ключ для маршрутизации задачи в нужную очередь',
          'Binding — привязка очереди к exchange по routing key'
        ]},
        { type: 'tip', value: 'Redis поддерживает AMQP-подобный протокол через Celery, но это эмуляция. Для сложных сценариев маршрутизации лучше RabbitMQ — он реализует AMQP нативно.' }
      ]
    },
    {
      id: 3,
      title: 'Redis vs RabbitMQ как брокер',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выбор брокера — одно из ключевых архитектурных решений. Redis и RabbitMQ покрывают 99% сценариев.' },
        { type: 'heading', value: 'Redis как брокер' },
        { type: 'list', items: [
          'Плюсы: простота, скорость, используется и для других целей (кеш, сессии)',
          'Плюсы: легко установить и настроить, минимум конфигурации',
          'Плюсы: можно использовать как broker + result backend одновременно',
          'Минус: нет гарантии доставки при крахе — сообщения в памяти',
          'Минус: нет встроенной маршрутизации (Exchange/Binding)',
          'Минус: при переполнении памяти Redis начинает удалять ключи'
        ]},
        { type: 'heading', value: 'RabbitMQ как брокер' },
        { type: 'list', items: [
          'Плюсы: полная реализация AMQP — надёжная доставка сообщений',
          'Плюсы: persistent messages — переживают перезапуск брокера',
          'Плюсы: сложная маршрутизация: topic, fanout, headers exchange',
          'Плюсы: встроенный менеджмент UI на порту 15672',
          'Минус: сложнее в настройке и мониторинге',
          'Минус: потребляет больше ресурсов',
          'Минус: отдельный сервис только для очереди'
        ]},
        { type: 'code', language: 'python', value: '# settings.py — Redis как брокер\nCELERY_BROKER_URL = "redis://localhost:6379/0"\nCELERY_RESULT_BACKEND = "redis://localhost:6379/1"\n\n# settings.py — RabbitMQ как брокер\nCELERY_BROKER_URL = "amqp://guest:guest@localhost:5672//"\nCELERY_RESULT_BACKEND = "redis://localhost:6379/1"  # backend можно оставить Redis\n\n# settings.py — Redis с паролем и SSL (продакшн)\nCELERY_BROKER_URL = "rediss://:strongpassword@redis-host:6380/0"\nCELERY_RESULT_BACKEND = "rediss://:strongpassword@redis-host:6380/1"\nCELERY_REDIS_BACKEND_USE_SSL = {"ssl_cert_reqs": "none"}' },
        { type: 'heading', value: 'Когда что выбрать' },
        { type: 'text', value: 'Redis — для 90% проектов. Если вы уже используете Redis для кеша/сессий, добавить его как брокер Celery — минимум усилий. RabbitMQ — когда критична гарантия доставки (платежи, финансы) или нужна сложная маршрутизация сообщений.' },
        { type: 'tip', value: 'На старте проекта всегда начинай с Redis. Миграция на RabbitMQ потом — замена одной строки в settings.py. Архитектура Celery абстрагирует брокер.' }
      ]
    },
    {
      id: 4,
      title: 'Установка и настройка Celery',
      type: 'theory',
      content: [
        { type: 'text', value: 'Полная настройка Celery в Django проекте: от pip install до первого запуска воркера.' },
        { type: 'heading', value: 'Шаг 1: Установка' },
        { type: 'code', language: 'bash', value: '# Celery + Redis клиент\npip install celery redis\n\n# Опционально:\npip install django-celery-beat      # периодические задачи через Admin\npip install django-celery-results   # результаты в Django ORM\npip install flower                   # мониторинг\n\n# Redis сервер (если ещё не установлен)\nsudo apt install redis-server\n# или через Docker:\ndocker run -d -p 6379:6379 --name redis redis:alpine' },
        { type: 'heading', value: 'Шаг 2: celery.py — точка входа' },
        { type: 'code', language: 'python', value: '# myproject/celery.py\nimport os\nfrom celery import Celery\n\n# Устанавливаем переменную окружения ДО создания экземпляра\nos.environ.setdefault("DJANGO_SETTINGS_MODULE", "myproject.settings")\n\n# Создаём экземпляр Celery\napp = Celery("myproject")\n\n# Загружаем конфиг из Django settings (все переменные с префиксом CELERY_)\napp.config_from_object("django.conf:settings", namespace="CELERY")\n\n# Автоматически находит tasks.py во всех INSTALLED_APPS\napp.autodiscover_tasks()\n\n\n# Отладочная задача для проверки\n@app.task(bind=True, ignore_result=True)\ndef debug_task(self):\n    print(f"Request: {self.request!r}")' },
        { type: 'heading', value: 'Шаг 3: __init__.py — автозагрузка' },
        { type: 'code', language: 'python', value: '# myproject/__init__.py\n# Гарантируем что Celery загружается при старте Django\nfrom .celery import app as celery_app\n\n__all__ = ("celery_app",)' },
        { type: 'heading', value: 'Шаг 4: settings.py — полная конфигурация' },
        { type: 'code', language: 'python', value: '# settings.py\n\n# === Celery Configuration ===\n\n# Брокер и бэкенд\nCELERY_BROKER_URL = os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0")\nCELERY_RESULT_BACKEND = os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/1")\n\n# Сериализация\nCELERY_ACCEPT_CONTENT = ["json"]          # принимаем только JSON\nCELERY_TASK_SERIALIZER = "json"            # задачи в JSON\nCELERY_RESULT_SERIALIZER = "json"          # результаты в JSON\n\n# Временная зона\nCELERY_TIMEZONE = "Asia/Almaty"\nCELERY_ENABLE_UTC = True\n\n# Результаты\nCELERY_RESULT_EXPIRES = 3600               # хранить результаты 1 час\nCELERY_TASK_TRACK_STARTED = True           # отслеживать статус STARTED\nCELERY_TASK_TIME_LIMIT = 300               # hard limit: 5 минут\nCELERY_TASK_SOFT_TIME_LIMIT = 240          # soft limit: 4 минуты\n\n# Воркер\nCELERY_WORKER_PREFETCH_MULTIPLIER = 1      # не жадничать с задачами\nCELERY_WORKER_MAX_TASKS_PER_CHILD = 1000   # перезапуск после 1000 задач (утечки памяти)\nCELERY_WORKER_CONCURRENCY = 4             # количество параллельных процессов' },
        { type: 'heading', value: 'Шаг 5: Запуск' },
        { type: 'code', language: 'bash', value: '# Терминал 1 — Django\npython manage.py runserver\n\n# Терминал 2 — Celery Worker\ncelery -A myproject worker -l info\n\n# Терминал 3 — Celery Beat (если нужны периодические задачи)\ncelery -A myproject beat -l info\n\n# Или воркер + beat в одном процессе (только для разработки!)\ncelery -A myproject worker -l info -B' },
        { type: 'warning', value: 'Никогда не запускай worker -B в продакшене! При нескольких воркерах Beat запустится в каждом — задачи будут дублироваться. Beat всегда должен быть отдельным процессом в единственном экземпляре.' }
      ]
    },
    {
      id: 5,
      title: '@shared_task — создание задач',
      type: 'theory',
      content: [
        { type: 'text', value: '@shared_task — рекомендуемый декоратор для Django приложений. Не привязан к конкретному экземпляру Celery — это позволяет переиспользовать приложение в разных проектах.' },
        { type: 'heading', value: 'Базовая задача' },
        { type: 'code', language: 'python', value: '# myapp/tasks.py\nfrom celery import shared_task\n\n@shared_task\ndef add(x, y):\n    return x + y\n\n# Вызов:\nresult = add.delay(4, 6)       # AsyncResult\nprint(result.id)                # UUID задачи\nprint(result.status)            # PENDING -> STARTED -> SUCCESS\nprint(result.get(timeout=10))   # 10 (блокирует до завершения)' },
        { type: 'heading', value: 'bind=True — доступ к self' },
        { type: 'code', language: 'python', value: '@shared_task(bind=True)\ndef process_file(self, file_id):\n    """bind=True добавляет self — ссылку на текущую задачу"""\n    print(f"Task ID: {self.request.id}")\n    print(f"Попытка: {self.request.retries}")\n    print(f"Очередь: {self.request.delivery_info.get(\'routing_key\')}")\n\n    # self.request содержит всю метаинформацию:\n    # .id — UUID задачи\n    # .retries — номер текущей попытки\n    # .eta — запланированное время выполнения\n    # .expires — время истечения задачи\n    # .delivery_info — информация о доставке (очередь, exchange)\n    # .called_directly — True если вызвана напрямую (не через .delay)\n\n    return f"Файл {file_id} обработан"' },
        { type: 'heading', value: 'Параметры @shared_task' },
        { type: 'code', language: 'python', value: '@shared_task(\n    bind=True,\n    name="myapp.send_notification",    # явное имя (по умолчанию: module.function)\n    max_retries=5,                      # максимум повторных попыток\n    default_retry_delay=60,             # задержка между retry (сек)\n    soft_time_limit=120,                # мягкий лимит времени\n    time_limit=180,                     # жёсткий лимит (убивает процесс)\n    rate_limit="10/m",                  # макс 10 вызовов в минуту\n    ignore_result=True,                 # не сохранять результат\n    acks_late=True,                     # подтверждение после выполнения\n    reject_on_worker_lost=True,         # повтор если воркер упал\n    autoretry_for=(ConnectionError,),   # автоматический retry для этих ошибок\n    retry_backoff=True,                 # экспоненциальная задержка retry\n    retry_backoff_max=600,              # макс задержка retry: 10 минут\n    retry_jitter=True,                  # случайный разброс retry (избежать thundering herd)\n)\ndef send_notification(self, user_id, message):\n    pass' },
        { type: 'heading', value: 'Правила создания задач' },
        { type: 'list', items: [
          'Передавай только простые типы: int, str, list, dict. Не передавай Django модели — они не сериализуются. Передавай ID и загружай в задаче',
          'Задача должна быть идемпотентной — повторный вызов с теми же аргументами должен давать тот же результат',
          'Не используй глобальное состояние — каждый вызов независим',
          'Ставь ignore_result=True если результат не нужен — экономит память в Redis',
          'Импорты моделей делай внутри функции (не на уровне модуля) — избегаешь circular imports'
        ]},
        { type: 'tip', value: 'Золотое правило: задача = чистая функция с простыми аргументами. Если задаче нужен User, передай user_id и сделай User.objects.get(id=user_id) внутри задачи.' }
      ]
    },
    {
      id: 6,
      title: 'Вызов задач: delay, apply_async, signature',
      type: 'theory',
      content: [
        { type: 'text', value: 'Celery предоставляет несколько способов вызова задач — от простого .delay() до мощных Signature для построения workflow.' },
        { type: 'heading', value: '.delay() — простой вызов' },
        { type: 'code', language: 'python', value: '# Самый частый способ — кладёт задачу в очередь немедленно\nresult = send_email.delay(user_id=42, subject="Привет")\n\n# .delay() — это сокращение для:\n# send_email.apply_async(args=[], kwargs={"user_id": 42, "subject": "Привет"})' },
        { type: 'heading', value: '.apply_async() — полный контроль' },
        { type: 'code', language: 'python', value: 'from datetime import datetime, timedelta\n\n# Выполнить через 60 секунд\nsend_email.apply_async(\n    args=[42],\n    countdown=60\n)\n\n# Выполнить в конкретное время\nsend_email.apply_async(\n    args=[42],\n    eta=datetime(2025, 1, 1, 9, 0, 0)  # 1 января 2025 в 9:00\n)\n\n# Истечение — если не выполнена за 1 час, отменить\nsend_email.apply_async(\n    args=[42],\n    expires=3600\n)\n\n# Отправить в конкретную очередь\nsend_email.apply_async(\n    args=[42],\n    queue="high_priority"\n)\n\n# Всё вместе\nsend_email.apply_async(\n    args=[42],\n    kwargs={"subject": "Срочно"},\n    countdown=30,\n    expires=3600,\n    queue="emails",\n    priority=9,        # 0-9, где 9 — высший приоритет\n    retry=True,\n    retry_policy={\n        "max_retries": 3,\n        "interval_start": 0,\n        "interval_step": 0.2,\n        "interval_max": 0.5,\n    }\n)' },
        { type: 'heading', value: 'AsyncResult — отслеживание результата' },
        { type: 'code', language: 'python', value: 'from celery.result import AsyncResult\n\n# Получаем AsyncResult при вызове\nresult = generate_report.delay("2024-01-01")\n\n# Или создаём по ID\nresult = AsyncResult("task-uuid-here")\n\n# Статусы задачи\nresult.status      # PENDING | STARTED | RETRY | SUCCESS | FAILURE | REVOKED\nresult.ready()     # True если завершена (SUCCESS или FAILURE)\nresult.successful() # True если SUCCESS\nresult.failed()    # True если FAILURE\n\n# Получить результат (блокирующий вызов)\ndata = result.get(timeout=30)      # ждём макс 30 сек\n\n# Получить ошибку если FAILURE\nif result.failed():\n    print(result.traceback)        # полный traceback\n    print(result.result)           # объект Exception\n\n# Отмена задачи\nresult.revoke()                    # мягкая отмена\nresult.revoke(terminate=True)      # жёсткая (SIGTERM)\nresult.revoke(terminate=True, signal="SIGKILL")  # убить немедленно' },
        { type: 'heading', value: 'Signature (s) — задача как объект' },
        { type: 'code', language: 'python', value: 'from celery import signature\n\n# Signature — это "заготовка" вызова задачи\nsig = send_email.s(42, subject="Привет")\n\n# Можно вызвать позже:\nresult = sig.delay()\n\n# Partial signature — частичное применение\npartial = send_email.s(subject="Привет\")  # user_id будет передан позже\nresult = partial.delay(42)                  # user_id=42\n\n# Immutable signature — игнорирует входящие данные из цепочки\nsig = send_email.si(42, subject="Привет\")  # .si() вместо .s()\n\n# Signature нужна для: chain, group, chord — см. следующие уроки' },
        { type: 'tip', value: 'В 95% случаев .delay() — это всё что нужно. apply_async и Signature нужны для: отложенных задач, приоритетов, маршрутизации по очередям, построения цепочек.' }
      ]
    },
    {
      id: 7,
      title: 'Обработка ошибок и retry',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задачи Celery работают с внешними системами (БД, API, email). Ошибки неизбежны. Правильная обработка ошибок — ключ к надёжной системе.' },
        { type: 'heading', value: 'Ручной retry' },
        { type: 'code', language: 'python', value: 'import requests\nfrom celery import shared_task\n\n@shared_task(bind=True, max_retries=5, default_retry_delay=60)\ndef call_external_api(self, url, payload):\n    try:\n        response = requests.post(url, json=payload, timeout=10)\n        response.raise_for_status()\n        return response.json()\n    except requests.ConnectionError as exc:\n        # Retry с кастомной задержкой\n        raise self.retry(exc=exc, countdown=60 * (self.request.retries + 1))\n    except requests.Timeout as exc:\n        # Retry с экспоненциальным backoff: 2, 4, 8, 16, 32 сек\n        raise self.retry(exc=exc, countdown=2 ** self.request.retries)\n    except requests.HTTPError as exc:\n        if exc.response.status_code == 429:  # Too Many Requests\n            retry_after = int(exc.response.headers.get("Retry-After", 60))\n            raise self.retry(exc=exc, countdown=retry_after)\n        elif exc.response.status_code >= 500:  # Server error — retry\n            raise self.retry(exc=exc)\n        else:  # 4xx — клиентская ошибка, retry бесполезен\n            raise' },
        { type: 'heading', value: 'Автоматический retry' },
        { type: 'code', language: 'python', value: '@shared_task(\n    autoretry_for=(ConnectionError, TimeoutError, requests.RequestException),\n    retry_backoff=True,          # экспоненциальный backoff\n    retry_backoff_max=600,       # максимум 10 минут между retry\n    retry_jitter=True,           # случайный разброс (±50%)\n    max_retries=5,\n)\ndef send_webhook(url, data):\n    """autoretry_for автоматически перехватывает указанные исключения\n    и вызывает retry — не нужен try/except"""\n    response = requests.post(url, json=data, timeout=10)\n    response.raise_for_status()\n    return response.json()\n\n# С retry_backoff=True задержки будут:\n# Попытка 1: ~1 сек\n# Попытка 2: ~2 сек\n# Попытка 3: ~4 сек\n# Попытка 4: ~8 сек\n# Попытка 5: ~16 сек\n# С jitter: ±50% от каждого значения' },
        { type: 'heading', value: 'Time limits' },
        { type: 'code', language: 'python', value: 'from celery.exceptions import SoftTimeLimitExceeded\n\n@shared_task(\n    bind=True,\n    soft_time_limit=120,   # через 120 сек — SoftTimeLimitExceeded\n    time_limit=180,        # через 180 сек — SIGKILL (убивает процесс)\n)\ndef process_video(self, video_id):\n    try:\n        # ... долгая обработка ...\n        convert_video(video_id)\n    except SoftTimeLimitExceeded:\n        # Мягкий лимит — можно корректно завершиться\n        mark_video_as_failed(video_id, reason="timeout")\n        cleanup_temp_files(video_id)\n        # НЕ делаем retry — это не ошибка сети, а слишком долгая задача' },
        { type: 'heading', value: 'Обработка MaxRetriesExceeded' },
        { type: 'code', language: 'python', value: 'from celery.exceptions import MaxRetriesExceededError\n\n@shared_task(bind=True, max_retries=3)\ndef send_critical_email(self, user_id, template):\n    try:\n        user = User.objects.get(id=user_id)\n        send_mail_via_smtp(user.email, template)\n    except SMTPError as exc:\n        try:\n            raise self.retry(exc=exc, countdown=30)\n        except MaxRetriesExceededError:\n            # Все попытки исчерпаны — записываем в лог, уведомляем админа\n            FailedEmail.objects.create(\n                user_id=user_id,\n                template=template,\n                error=str(exc)\n            )\n            notify_admin(f"Email для user {user_id} не отправлен после 3 попыток")' },
        { type: 'heading', value: 'Callbacks: on_success, on_failure' },
        { type: 'code', language: 'python', value: 'from celery import shared_task\nimport logging\n\nlogger = logging.getLogger(__name__)\n\nclass BaseTaskWithCallbacks(celery_app.Task):\n    """Базовый класс задачи с callback-ами"""\n\n    def on_success(self, retval, task_id, args, kwargs):\n        logger.info(f"Задача {task_id} завершена: {retval}")\n\n    def on_failure(self, exc, task_id, args, kwargs, einfo):\n        logger.error(f"Задача {task_id} провалена: {exc}", exc_info=einfo)\n\n    def on_retry(self, exc, task_id, args, kwargs, einfo):\n        logger.warning(f"Задача {task_id} retry #{self.request.retries}: {exc}")\n\n@shared_task(base=BaseTaskWithCallbacks, bind=True, max_retries=3)\ndef important_task(self, data):\n    # on_success/on_failure/on_retry вызываются автоматически\n    process(data)' },
        { type: 'warning', value: 'acks_late=True + reject_on_worker_lost=True — включай для критических задач. Без этого: если воркер упал посреди задачи, задача потеряна. С этим: задача вернётся в очередь и будет перевыполнена другим воркером.' }
      ]
    },
    {
      id: 8,
      title: 'Celery Beat — периодические задачи',
      type: 'theory',
      content: [
        { type: 'text', value: 'Celery Beat — встроенный планировщик, запускающий задачи по расписанию. Заменяет cron, но интегрирован с Celery и Django.' },
        { type: 'heading', value: 'Конфигурация в settings.py' },
        { type: 'code', language: 'python', value: '# settings.py\nfrom celery.schedules import crontab, solar\nfrom datetime import timedelta\n\nCELERY_BEAT_SCHEDULE = {\n    # === Интервал (каждые N секунд) ===\n    "check-pending-orders": {\n        "task": "orders.tasks.check_pending_orders",\n        "schedule": 300.0,  # каждые 5 минут\n    },\n\n    # === Crontab (как cron в Linux) ===\n    # crontab(minute, hour, day_of_week, day_of_month, month_of_year)\n\n    # Каждый день в 3:00\n    "nightly-cleanup": {\n        "task": "core.tasks.cleanup_expired_data",\n        "schedule": crontab(hour=3, minute=0),\n    },\n\n    # Каждый понедельник в 9:00\n    "weekly-report": {\n        "task": "analytics.tasks.weekly_report",\n        "schedule": crontab(hour=9, minute=0, day_of_week=1),\n    },\n\n    # 1-го числа каждого месяца в полночь\n    "monthly-invoice": {\n        "task": "billing.tasks.generate_monthly_invoice",\n        "schedule": crontab(day_of_month=1, hour=0, minute=0),\n    },\n\n    # Каждые 15 минут в рабочее время (9-18, Пн-Пт)\n    "sync-crm": {\n        "task": "crm.tasks.sync_contacts",\n        "schedule": crontab(minute="*/15", hour="9-18", day_of_week="1-5"),\n    },\n\n    # === timedelta (удобнее для мелких интервалов) ===\n    "heartbeat": {\n        "task": "monitoring.tasks.heartbeat",\n        "schedule": timedelta(seconds=30),\n    },\n\n    # === С аргументами ===\n    "cleanup-logs-30d": {\n        "task": "core.tasks.cleanup_logs",\n        "schedule": crontab(hour=4, minute=0),\n        "args": (30,),               # позиционные аргументы\n        "kwargs": {"dry_run": False}, # именованные аргументы\n    },\n\n    # === С маршрутизацией ===\n    "heavy-analytics": {\n        "task": "analytics.tasks.full_recalculation",\n        "schedule": crontab(hour=2, minute=0),\n        "options": {"queue": "heavy"},  # отправить в очередь heavy\n    },\n}' },
        { type: 'heading', value: 'Примеры crontab' },
        { type: 'code', language: 'python', value: 'from celery.schedules import crontab\n\ncrontab()                                    # каждую минуту\ncrontab(minute=0, hour=0)                    # полночь\ncrontab(minute=0, hour="*/3")                # каждые 3 часа\ncrontab(minute=0, hour=0, day_of_week="mon") # каждый понедельник\ncrontab(minute="*/10")                       # каждые 10 минут\ncrontab(hour="9-17", day_of_week="1-5")      # рабочие часы Пн-Пт\ncrontab(day_of_month="1,15")                 # 1 и 15 число месяца\ncrontab(month_of_year="1,7")                 # январь и июль\n\n# Запуск Beat\n# celery -A myproject beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler' },
        { type: 'tip', value: 'Beat должен работать в единственном экземпляре. Если запустить 2 процесса Beat — все задачи будут дублироваться. В Docker/Kubernetes: обеспечь один replica для Beat.' }
      ]
    },
    {
      id: 9,
      title: 'django-celery-beat — управление через Admin',
      type: 'theory',
      content: [
        { type: 'text', value: 'django-celery-beat хранит расписание в БД — можно создавать, изменять и отключать периодические задачи через Django Admin без перезапуска.' },
        { type: 'heading', value: 'Установка' },
        { type: 'code', language: 'bash', value: 'pip install django-celery-beat' },
        { type: 'code', language: 'python', value: '# settings.py\nINSTALLED_APPS = [\n    # ...\n    "django_celery_beat",\n]\n\n# Используем DatabaseScheduler вместо файлового\nCELERY_BEAT_SCHEDULER = "django_celery_beat.schedulers:DatabaseScheduler"' },
        { type: 'code', language: 'bash', value: 'python manage.py migrate  # создаёт таблицы для расписания' },
        { type: 'heading', value: 'Программное создание расписания' },
        { type: 'code', language: 'python', value: 'from django_celery_beat.models import (\n    PeriodicTask, CrontabSchedule, IntervalSchedule, SolarSchedule\n)\nimport json\n\n# === Crontab расписание ===\ncrontab, _ = CrontabSchedule.objects.get_or_create(\n    minute="0",\n    hour="8",\n    day_of_week="*",\n    day_of_month="*",\n    month_of_year="*",\n    timezone="Asia/Almaty",\n)\n\nPeriodicTask.objects.get_or_create(\n    name="Утренний отчёт",\n    defaults={\n        "task": "analytics.tasks.morning_report",\n        "crontab": crontab,\n        "args": json.dumps([]),\n        "kwargs": json.dumps({"format": "pdf"}),\n        "enabled": True,\n        "description": "Генерация утреннего отчёта для менеджеров",\n    }\n)\n\n# === Interval расписание ===\ninterval, _ = IntervalSchedule.objects.get_or_create(\n    every=10,\n    period=IntervalSchedule.MINUTES,\n)\n\nPeriodicTask.objects.get_or_create(\n    name="Проверка платежей",\n    defaults={\n        "task": "payments.tasks.check_pending",\n        "interval": interval,\n        "enabled": True,\n    }\n)' },
        { type: 'heading', value: 'Управление задачами' },
        { type: 'code', language: 'python', value: '# Отключить задачу\ntask = PeriodicTask.objects.get(name="Утренний отчёт")\ntask.enabled = False\ntask.save()\n\n# Одноразовая задача (выполнится 1 раз и отключится)\nfrom django.utils import timezone\nfrom datetime import timedelta\n\nclocked, _ = ClockedSchedule.objects.get_or_create(\n    clocked_time=timezone.now() + timedelta(hours=1)\n)\n\nPeriodicTask.objects.create(\n    name="Одноразовая рассылка",\n    task="notifications.tasks.send_campaign",\n    clocked=clocked,\n    one_off=True,  # выполнится 1 раз и отключится\n    args=json.dumps([campaign_id]),\n)\n\n# Список всех активных задач\nactive_tasks = PeriodicTask.objects.filter(enabled=True)\nfor task in active_tasks:\n    print(f"{task.name}: {task.schedule} — последний запуск: {task.last_run_at}")' },
        { type: 'tip', value: 'В Django Admin появятся разделы: Periodic Tasks, Intervals, Crontabs, Clocked, Solar. Менеджер может создавать и управлять задачами без участия разработчика.' }
      ]
    },
    {
      id: 10,
      title: 'Цепочки: chain, group, chord',
      type: 'theory',
      content: [
        { type: 'text', value: 'Celery Canvas — мощный API для построения сложных workflow из задач: последовательные цепочки, параллельные группы, и их комбинации.' },
        { type: 'heading', value: 'chain — последовательное выполнение' },
        { type: 'code', language: 'python', value: 'from celery import chain\n\n# Задачи\n@shared_task\ndef download_image(url):\n    path = download(url)\n    return path\n\n@shared_task\ndef resize_image(path, size=(800, 600)):\n    resized = resize(path, size)\n    return resized\n\n@shared_task\ndef upload_to_s3(path):\n    url = s3_upload(path)\n    return url\n\n# Chain: download -> resize -> upload\n# Результат каждой задачи передаётся как первый аргумент следующей\nworkflow = chain(\n    download_image.s("https://example.com/photo.jpg"),\n    resize_image.s(size=(800, 600)),\n    upload_to_s3.s()\n)\n\nresult = workflow.apply_async()\nfinal_url = result.get()  # URL загруженного в S3 изображения\n\n# Сокращённый синтаксис через |\nworkflow = (\n    download_image.s("https://example.com/photo.jpg") |\n    resize_image.s(size=(800, 600)) |\n    upload_to_s3.s()\n)' },
        { type: 'heading', value: 'group — параллельное выполнение' },
        { type: 'code', language: 'python', value: 'from celery import group\n\n@shared_task\ndef send_email(user_id):\n    # ... отправка email ...\n    return f"Email для {user_id} отправлен"\n\n# Group: все задачи выполняются параллельно\nuser_ids = [1, 2, 3, 4, 5]\njob = group(send_email.s(uid) for uid in user_ids)\nresult = job.apply_async()\n\n# Ждём все результаты\nresults = result.get()  # ["Email для 1 отправлен", "Email для 2 отправлен", ...]\n\n# Проверяем прогресс\nresult.ready()       # True когда все завершены\nresult.completed_count()  # сколько завершено\nresult.results       # список AsyncResult для каждой задачи' },
        { type: 'heading', value: 'chord — group + callback' },
        { type: 'code', language: 'python', value: 'from celery import chord\n\n@shared_task\ndef fetch_price(ticker):\n    """Получить цену акции"""\n    price = get_stock_price(ticker)\n    return {"ticker": ticker, "price": price}\n\n@shared_task\ndef aggregate_portfolio(results):\n    """Агрегировать результаты"""\n    total = sum(r["price"] for r in results)\n    return {"total": total, "stocks": results}\n\n# Chord: выполнить все fetch_price параллельно,\n# затем передать все результаты в aggregate_portfolio\ntickers = ["AAPL", "GOOGL", "MSFT", "AMZN"]\nworkflow = chord(\n    [fetch_price.s(t) for t in tickers],  # header (group)\n    aggregate_portfolio.s()                 # callback\n)\n\nresult = workflow.apply_async()\nportfolio = result.get()  # {"total": 1234.56, "stocks": [...]}' },
        { type: 'heading', value: 'Комбинирование — реальный пример' },
        { type: 'code', language: 'python', value: 'from celery import chain, group, chord\n\n# Пример: обработка заказа\n# 1. Валидация\n# 2. Параллельно: списание денег + резервирование товара\n# 3. После обоих: отправка уведомления\n\nworkflow = chain(\n    validate_order.s(order_id),\n    chord(\n        [\n            charge_payment.s(),      # параллельно\n            reserve_inventory.s(),   # параллельно\n        ],\n        send_confirmation.s()        # после обоих\n    )\n)\n\nresult = workflow.apply_async()' },
        { type: 'warning', value: 'chord требует result backend (Redis). Без backend Celery не может собрать результаты группы. Убедись что CELERY_RESULT_BACKEND настроен.' }
      ]
    },
    {
      id: 11,
      title: 'Очереди и приоритеты',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию все задачи идут в одну очередь "celery". В продакшене нужно разделять задачи по очередям — чтобы тяжёлые задачи не блокировали лёгкие.' },
        { type: 'heading', value: 'Настройка очередей' },
        { type: 'code', language: 'python', value: '# settings.py\nfrom kombu import Queue, Exchange\n\n# Определяем очереди\nCELERY_TASK_QUEUES = (\n    Queue("default", Exchange("default"), routing_key="default"),\n    Queue("emails", Exchange("emails"), routing_key="emails"),\n    Queue("heavy", Exchange("heavy"), routing_key="heavy"),\n    Queue("critical", Exchange("critical"), routing_key="critical"),\n)\n\n# Очередь по умолчанию\nCELERY_TASK_DEFAULT_QUEUE = "default"\nCELERY_TASK_DEFAULT_EXCHANGE = "default"\nCELERY_TASK_DEFAULT_ROUTING_KEY = "default"\n\n# Автоматическая маршрутизация задач по очередям\nCELERY_TASK_ROUTES = {\n    "myapp.tasks.send_*": {"queue": "emails"},\n    "myapp.tasks.generate_report": {"queue": "heavy"},\n    "myapp.tasks.process_payment": {"queue": "critical"},\n    "analytics.*": {"queue": "heavy"},\n}' },
        { type: 'heading', value: 'Запуск воркеров по очередям' },
        { type: 'code', language: 'bash', value: '# Воркер для email (2 процесса — email не требует много CPU)\ncelery -A myproject worker -Q emails -c 2 --hostname=email@%h -l info\n\n# Воркер для тяжёлых задач (1 процесс — максимум CPU на каждую задачу)\ncelery -A myproject worker -Q heavy -c 1 --hostname=heavy@%h -l info\n\n# Воркер для критических задач (4 процесса — быстрая обработка)\ncelery -A myproject worker -Q critical -c 4 --hostname=critical@%h -l info\n\n# Воркер для нескольких очередей\ncelery -A myproject worker -Q default,emails -c 4 -l info\n\n# Воркер для ВСЕХ очередей (для разработки)\ncelery -A myproject worker -Q default,emails,heavy,critical -c 4 -l info' },
        { type: 'heading', value: 'Приоритеты задач' },
        { type: 'code', language: 'python', value: '# Redis поддерживает 10 уровней приоритета (0-9)\n# 0 = высший приоритет, 9 = низший\n\n# settings.py — включаем приоритеты для Redis\nCELERY_BROKER_TRANSPORT_OPTIONS = {\n    "priority_steps": list(range(10)),  # 0-9\n    "sep": ":",\n    "queue_order_strategy": "priority",\n}\n\n# Вызов с приоритетом\nsend_critical_alert.apply_async(args=[msg], priority=0)   # высший\nsend_email.apply_async(args=[user_id], priority=5)         # средний\ngenerate_report.apply_async(args=[date], priority=9)       # низший\n\n# Или задать приоритет по умолчанию в декораторе\n@shared_task(priority=0)\ndef send_critical_alert(message):\n    pass' },
        { type: 'heading', value: 'Rate limiting' },
        { type: 'code', language: 'python', value: '# Ограничение частоты вызовов\n@shared_task(rate_limit="10/m")   # макс 10 в минуту\ndef send_sms(phone, text):\n    sms_gateway.send(phone, text)\n\n@shared_task(rate_limit="100/h")  # макс 100 в час\ndef call_external_api(data):\n    requests.post(API_URL, json=data)\n\n@shared_task(rate_limit="5/s")    # макс 5 в секунду\ndef index_document(doc_id):\n    elasticsearch.index(doc_id)\n\n# Форматы: "N/s" (в секунду), "N/m" (в минуту), "N/h" (в час)\n# Или None — без ограничений' },
        { type: 'tip', value: 'Типичная стратегия: 3 очереди. critical (платежи, уведомления) — быстро и надёжно. default (обычные задачи). heavy (отчёты, экспорт) — не блокирует остальных.' }
      ]
    },
    {
      id: 12,
      title: 'Мониторинг: Flower и логирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Без мониторинга Celery — чёрный ящик. Flower — веб-интерфейс для мониторинга в реальном времени. Правильное логирование — основа дебага.' },
        { type: 'heading', value: 'Flower — установка и запуск' },
        { type: 'code', language: 'bash', value: 'pip install flower\n\n# Запуск\ncelery -A myproject flower --port=5555\n\n# С аутентификацией (обязательно для продакшена!)\ncelery -A myproject flower \\\n    --port=5555 \\\n    --basic_auth=admin:strongpassword\n\n# С Prometheus метриками\ncelery -A myproject flower \\\n    --port=5555 \\\n    --broker_api=redis://localhost:6379/0\n\n# Откройте http://localhost:5555' },
        { type: 'text', value: 'Flower показывает:' },
        { type: 'list', items: [
          'Dashboard — активные/завершённые/проваленные задачи в реальном времени',
          'Workers — статус каждого воркера, CPU, память, количество задач',
          'Tasks — история всех задач с фильтрацией по статусу, имени, воркеру',
          'Broker — состояние очередей: размер, потребители',
          'Можно отменять задачи, перезапускать воркеры, изменять rate_limit через UI'
        ]},
        { type: 'heading', value: 'Логирование в задачах' },
        { type: 'code', language: 'python', value: 'import logging\nfrom celery import shared_task\nfrom celery.utils.log import get_task_logger\n\n# get_task_logger включает task_id в каждую строку лога\nlogger = get_task_logger(__name__)\n\n@shared_task(bind=True)\ndef process_order(self, order_id):\n    logger.info(f"Начинаем обработку заказа {order_id}")\n\n    try:\n        order = Order.objects.get(id=order_id)\n        logger.info(f"Заказ найден: {order.total} тг, {order.items.count()} товаров")\n\n        charge_payment(order)\n        logger.info(f"Оплата списана для заказа {order_id}")\n\n        send_confirmation(order)\n        logger.info(f"Подтверждение отправлено для заказа {order_id}")\n\n    except Order.DoesNotExist:\n        logger.error(f"Заказ {order_id} не найден!")\n        raise\n    except PaymentError as exc:\n        logger.warning(f"Ошибка оплаты для заказа {order_id}: {exc}")\n        raise self.retry(exc=exc, countdown=60)\n\n# В логах будет:\n# [2025-01-15 10:30:45: INFO/MainProcess]\n# [tasks.process_order[abc-123]] Начинаем обработку заказа 42' },
        { type: 'heading', value: 'Celery сигналы для мониторинга' },
        { type: 'code', language: 'python', value: 'from celery.signals import (\n    task_prerun, task_postrun, task_failure,\n    task_success, task_retry, worker_ready\n)\nimport time\n\ntask_start_times = {}\n\n@task_prerun.connect\ndef task_started(sender=None, task_id=None, **kwargs):\n    """Срабатывает перед каждой задачей"""\n    task_start_times[task_id] = time.time()\n\n@task_postrun.connect\ndef task_finished(sender=None, task_id=None, state=None, **kwargs):\n    """Срабатывает после каждой задачи"""\n    duration = time.time() - task_start_times.pop(task_id, time.time())\n    # Отправляем метрику в Prometheus/StatsD/DataDog\n    metrics.histogram("celery.task.duration", duration, tags=[\n        f"task:{sender.name}",\n        f"state:{state}",\n    ])\n\n@task_failure.connect\ndef task_failed(sender=None, task_id=None, exception=None, **kwargs):\n    """Срабатывает при провале задачи"""\n    # Отправляем алерт в Sentry/Slack\n    capture_exception(exception)\n\n@worker_ready.connect\ndef worker_started(sender=None, **kwargs):\n    """Срабатывает когда воркер готов к работе"""\n    print(f"Воркер {sender.hostname} запущен и готов")' },
        { type: 'tip', value: 'Для продакшена: Flower + Sentry + Prometheus. Flower для ручного мониторинга, Sentry для ошибок, Prometheus + Grafana для метрик и алертов.' }
      ]
    },
    {
      id: 13,
      title: 'Celery в Docker Compose',
      type: 'theory',
      content: [
        { type: 'text', value: 'В продакшене Celery запускается в Docker контейнерах: Django, Redis, Worker, Beat, Flower — каждый в своём контейнере.' },
        { type: 'code', language: 'yaml', value: '# docker-compose.yml\nversion: "3.8"\n\nservices:\n  # === Django (web) ===\n  web:\n    build: .\n    command: gunicorn myproject.wsgi:application --bind 0.0.0.0:8000 --workers 4\n    volumes:\n      - .:/app\n    ports:\n      - "8000:8000"\n    env_file:\n      - .env\n    depends_on:\n      - db\n      - redis\n\n  # === PostgreSQL ===\n  db:\n    image: postgres:16-alpine\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    environment:\n      POSTGRES_DB: myproject\n      POSTGRES_USER: myuser\n      POSTGRES_PASSWORD: mypassword\n\n  # === Redis (брокер + кеш + result backend) ===\n  redis:\n    image: redis:7-alpine\n    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru\n    ports:\n      - "6379:6379"\n    volumes:\n      - redis_data:/data\n\n  # === Celery Worker ===\n  celery-worker:\n    build: .\n    command: celery -A myproject worker -l info -c 4 -Q default,emails\n    volumes:\n      - .:/app\n    env_file:\n      - .env\n    depends_on:\n      - redis\n      - db\n    restart: unless-stopped\n    # Ограничение ресурсов\n    deploy:\n      resources:\n        limits:\n          memory: 1G\n          cpus: "2.0"\n\n  # === Celery Worker для тяжёлых задач ===\n  celery-heavy:\n    build: .\n    command: celery -A myproject worker -l info -c 1 -Q heavy --max-tasks-per-child=100\n    volumes:\n      - .:/app\n    env_file:\n      - .env\n    depends_on:\n      - redis\n      - db\n    restart: unless-stopped\n    deploy:\n      resources:\n        limits:\n          memory: 2G\n          cpus: "4.0"\n\n  # === Celery Beat (ОДИН экземпляр!) ===\n  celery-beat:\n    build: .\n    command: celery -A myproject beat -l info --scheduler django_celery_beat.schedulers:DatabaseScheduler\n    volumes:\n      - .:/app\n    env_file:\n      - .env\n    depends_on:\n      - redis\n      - db\n    restart: unless-stopped\n    deploy:\n      replicas: 1  # ВАЖНО: всегда 1 реплика\n\n  # === Flower (мониторинг) ===\n  flower:\n    build: .\n    command: celery -A myproject flower --port=5555 --basic_auth=admin:${FLOWER_PASSWORD}\n    ports:\n      - "5555:5555"\n    env_file:\n      - .env\n    depends_on:\n      - redis\n\nvolumes:\n  postgres_data:\n  redis_data:' },
        { type: 'heading', value: '.env файл' },
        { type: 'code', language: 'bash', value: '# .env\nDJANGO_SETTINGS_MODULE=myproject.settings\nCELERY_BROKER_URL=redis://redis:6379/0\nCELERY_RESULT_BACKEND=redis://redis:6379/1\nDATABASE_URL=postgres://myuser:mypassword@db:5432/myproject\nFLOWER_PASSWORD=supersecret' },
        { type: 'heading', value: 'Dockerfile' },
        { type: 'code', language: 'dockerfile', value: 'FROM python:3.12-slim\n\nWORKDIR /app\n\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\nCOPY . .\n\n# Один образ для Django, Worker, Beat, Flower\n# Команда переопределяется в docker-compose.yml' },
        { type: 'heading', value: 'Запуск' },
        { type: 'code', language: 'bash', value: '# Запуск всех сервисов\ndocker compose up -d\n\n# Масштабирование воркеров\ndocker compose up -d --scale celery-worker=3\n\n# Логи воркера\ndocker compose logs -f celery-worker\n\n# Перезапуск воркера (после изменения tasks.py)\ndocker compose restart celery-worker celery-heavy' },
        { type: 'warning', value: 'Celery воркеры НЕ перезагружаются автоматически при изменении кода! После изменения tasks.py нужно перезапустить воркеры. В dev можно использовать watchdog для auto-reload: celery -A myproject worker -l info --autoreload (deprecated) или watchmedo auto-restart.' }
      ]
    },
    {
      id: 14,
      title: 'Тестирование Celery задач',
      type: 'theory',
      content: [
        { type: 'text', value: 'Задачи Celery должны тестироваться как обычные функции. В тестах задачи выполняются синхронно — без Redis и воркеров.' },
        { type: 'heading', value: 'Настройка для тестов' },
        { type: 'code', language: 'python', value: '# settings/test.py или conftest.py\n\n# Вариант 1: CELERY_ALWAYS_EAGER — выполнять задачи синхронно\nCELERY_TASK_ALWAYS_EAGER = True\nCELERY_TASK_EAGER_PROPAGATES = True  # проброс исключений\n\n# Вариант 2: pytest conftest.py\nimport pytest\n\n@pytest.fixture(autouse=True)\ndef celery_eager(settings):\n    settings.CELERY_TASK_ALWAYS_EAGER = True\n    settings.CELERY_TASK_EAGER_PROPAGATES = True' },
        { type: 'heading', value: 'Тестирование задачи как функции' },
        { type: 'code', language: 'python', value: 'import pytest\nfrom unittest.mock import patch, MagicMock\nfrom myapp.tasks import send_welcome_email, generate_report\n\n\nclass TestSendWelcomeEmail:\n    @pytest.mark.django_db\n    def test_sends_email_to_user(self, user_factory):\n        user = user_factory(email="test@example.com")\n\n        # Вызываем задачу напрямую (не .delay)\n        result = send_welcome_email(user.id)\n\n        assert result == f"Email отправлен: {user.email}"\n        assert len(mail.outbox) == 1\n        assert mail.outbox[0].to == ["test@example.com"]\n\n    @pytest.mark.django_db\n    def test_retries_on_smtp_error(self):\n        user = UserFactory()\n\n        with patch("myapp.tasks.send_mail", side_effect=SMTPException("fail")):\n            with pytest.raises(SMTPException):\n                send_welcome_email(user.id)\n\n    def test_raises_on_missing_user(self):\n        with pytest.raises(User.DoesNotExist):\n            send_welcome_email(99999)' },
        { type: 'heading', value: 'Тестирование retry логики' },
        { type: 'code', language: 'python', value: 'from unittest.mock import patch\n\ndef test_webhook_retries_on_connection_error():\n    """Проверяем что задача retry-ит при ConnectionError"""\n    with patch("myapp.tasks.requests.post", side_effect=ConnectionError):\n        # В eager mode retry вызывает задачу снова сразу\n        # max_retries=3 -> после 3 попыток — MaxRetriesExceededError\n        with pytest.raises(ConnectionError):\n            call_external_api("https://api.example.com", {"key": "value"})\n\ndef test_webhook_success():\n    """Проверяем успешный вызов"""\n    mock_response = MagicMock()\n    mock_response.json.return_value = {"status": "ok"}\n    mock_response.raise_for_status.return_value = None\n\n    with patch("myapp.tasks.requests.post", return_value=mock_response):\n        result = call_external_api("https://api.example.com", {"key": "value"})\n        assert result == {"status": "ok"}' },
        { type: 'heading', value: 'Тестирование с реальным брокером (интеграция)' },
        { type: 'code', language: 'python', value: '# pytest-celery предоставляет фикстуры для интеграционных тестов\n# pip install pytest-celery\n\n@pytest.fixture\ndef celery_config():\n    return {\n        "broker_url": "redis://localhost:6379/15",  # отдельная БД для тестов\n        "result_backend": "redis://localhost:6379/15",\n    }\n\ndef test_task_with_real_broker(celery_worker):\n    """Запускает реальный воркер в фоне для теста"""\n    result = generate_report.delay("2024-01-01", "2024-12-31")\n    data = result.get(timeout=10)\n    assert "articles_count" in data' },
        { type: 'tip', value: 'Для unit тестов — CELERY_TASK_ALWAYS_EAGER (быстро, без Redis). Для интеграционных — pytest-celery с реальным Redis (медленно, но проверяет сериализацию и retry). В CI обычно достаточно eager.' }
      ]
    },
    {
      id: 15,
      title: 'Best practices Celery',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правила, выработанные опытом тысяч продакшн-проектов. Следуй им — и Celery будет надёжным фундаментом, а не источником проблем.' },
        { type: 'heading', value: '1. Идемпотентность' },
        { type: 'code', language: 'python', value: '# ПЛОХО — не идемпотентна: повторный вызов удвоит деньги\n@shared_task\ndef process_payment(order_id, amount):\n    user = Order.objects.get(id=order_id).user\n    user.balance -= amount\n    user.save()\n\n# ХОРОШО — идемпотентна: повторный вызов ничего не сломает\n@shared_task\ndef process_payment(order_id):\n    order = Order.objects.select_for_update().get(id=order_id)\n    if order.status != "pending":\n        return  # уже обработан — ничего не делаем\n    order.user.balance -= order.amount\n    order.user.save()\n    order.status = "paid"\n    order.save()' },
        { type: 'heading', value: '2. Передавай ID, не объекты' },
        { type: 'code', language: 'python', value: '# ПЛОХО — объект может измениться между постановкой в очередь и выполнением\nsend_email.delay(user)           # User не сериализуется в JSON!\nsend_email.delay(user.__dict__)  # данные уже устарели к моменту выполнения\n\n# ХОРОШО — всегда свежие данные\nsend_email.delay(user.id)        # в задаче: User.objects.get(id=user_id)' },
        { type: 'heading', value: '3. Гранулярность задач' },
        { type: 'code', language: 'python', value: '# ПЛОХО — одна мега-задача\n@shared_task\ndef process_all_orders():\n    for order in Order.objects.filter(status="pending"):\n        charge_payment(order)\n        send_email(order)\n        update_inventory(order)\n    # Если упадёт на 500-м заказе — первые 499 не откатятся,\n    # при retry — обработаются заново (не идемпотентно!)\n\n# ХОРОШО — маленькие задачи\n@shared_task\ndef dispatch_pending_orders():\n    order_ids = list(Order.objects.filter(status="pending").values_list("id", flat=True))\n    for order_id in order_ids:\n        process_single_order.delay(order_id)  # каждый заказ — отдельная задача\n\n@shared_task(bind=True, max_retries=3)\ndef process_single_order(self, order_id):\n    order = Order.objects.get(id=order_id)\n    if order.status != "pending":\n        return\n    # ... обработка одного заказа ...' },
        { type: 'heading', value: '4. transaction.on_commit' },
        { type: 'code', language: 'python', value: '# ПЛОХО — задача может выполниться ДО коммита транзакции\ndef create_order(request):\n    order = Order.objects.create(**data)\n    send_confirmation.delay(order.id)  # воркер может не найти order!\n    return Response({"id": order.id})\n\n# ХОРОШО — задача ставится в очередь после коммита\nfrom django.db import transaction\n\ndef create_order(request):\n    order = Order.objects.create(**data)\n    transaction.on_commit(lambda: send_confirmation.delay(order.id))\n    return Response({"id": order.id})' },
        { type: 'heading', value: '5. Продакшн чеклист' },
        { type: 'list', items: [
          'CELERY_TASK_ALWAYS_EAGER = False (True только в тестах!)',
          'CELERY_WORKER_PREFETCH_MULTIPLIER = 1 (для fair scheduling)',
          'CELERY_WORKER_MAX_TASKS_PER_CHILD = 1000 (защита от утечек памяти)',
          'CELERY_TASK_ACKS_LATE = True (подтверждение после выполнения)',
          'CELERY_TASK_REJECT_ON_WORKER_LOST = True (повтор если воркер упал)',
          'CELERY_TASK_TIME_LIMIT и SOFT_TIME_LIMIT для каждой задачи',
          'Beat — ровно 1 экземпляр',
          'Flower с аутентификацией',
          'Мониторинг очередей: алерт если очередь растёт',
          'Логирование через get_task_logger, не print()',
          'Sentry для отлова ошибок в задачах',
          'Healthcheck для воркеров: celery -A myproject inspect ping'
        ]},
        { type: 'warning', value: 'Самая частая ошибка в продакшене: задача отправляется до коммита транзакции. Воркер получает task_id, идёт в БД — а объекта ещё нет! Всегда используй transaction.on_commit().' }
      ]
    },
    {
      id: 16,
      title: 'Практика: Email с retry и логированием',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай Celery задачу для отправки email уведомлений при регистрации пользователя с полной обработкой ошибок.',
      requirements: [
        'Задача send_welcome_email(user_id) в tasks.py',
        '@shared_task с bind=True, max_retries=3, autoretry_for=(SMTPException,)',
        'Экспоненциальный backoff: retry_backoff=True',
        'Логирование через get_task_logger: начало, успех, ошибка',
        'Сигнал post_save на User с transaction.on_commit',
        'При исчерпании retry — запись в FailedNotification модель'
      ],
      expectedOutput: 'Создание User -> transaction commit -> задача в очереди -> воркер отправляет email\nВ логах: [task-id] Начинаем отправку для user 42\n[task-id] Email успешно отправлен на test@example.com',
      hint: 'Используй get_task_logger(__name__) для логирования с task_id. В on_failure callback записывай FailedNotification.',
      solution: '# models.py\nfrom django.db import models\n\nclass FailedNotification(models.Model):\n    user_id = models.IntegerField()\n    task_type = models.CharField(max_length=100)\n    error = models.TextField()\n    created_at = models.DateTimeField(auto_now_add=True)\n\n# tasks.py\nfrom celery import shared_task\nfrom celery.utils.log import get_task_logger\nfrom smtplib import SMTPException\nfrom django.core.mail import send_mail\n\nlogger = get_task_logger(__name__)\n\n@shared_task(\n    bind=True,\n    max_retries=3,\n    autoretry_for=(SMTPException, ConnectionError),\n    retry_backoff=True,\n    retry_backoff_max=300,\n    retry_jitter=True,\n)\ndef send_welcome_email(self, user_id):\n    from django.contrib.auth.models import User\n    logger.info(f"Начинаем отправку для user {user_id}")\n    try:\n        user = User.objects.get(id=user_id)\n        send_mail(\n            "Добро пожаловать!",\n            f"Привет, {user.username}!",\n            "noreply@example.com",\n            [user.email]\n        )\n        logger.info(f"Email успешно отправлен на {user.email}")\n    except User.DoesNotExist:\n        logger.error(f"User {user_id} не найден")\n    except Exception as exc:\n        if self.request.retries >= self.max_retries:\n            from .models import FailedNotification\n            FailedNotification.objects.create(\n                user_id=user_id,\n                task_type="welcome_email",\n                error=str(exc)\n            )\n            logger.error(f"Все попытки исчерпаны для user {user_id}: {exc}")\n        raise\n\n# signals.py\nfrom django.db import transaction\nfrom django.db.models.signals import post_save\nfrom django.dispatch import receiver\nfrom django.contrib.auth.models import User\nfrom .tasks import send_welcome_email\n\n@receiver(post_save, sender=User)\ndef on_user_created(sender, instance, created, **kwargs):\n    if created:\n        transaction.on_commit(lambda: send_welcome_email.delay(instance.id))',
      explanation: 'autoretry_for + retry_backoff автоматически обрабатывают retry без try/except. get_task_logger включает task_id в каждую строку. transaction.on_commit гарантирует что user сохранён в БД до отправки задачи. FailedNotification — fallback для критических уведомлений.'
    },
    {
      id: 17,
      title: 'Практика: Pipeline обработки изображений',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй pipeline обработки изображений через Celery chain: загрузка → resize → watermark → upload в S3.',
      requirements: [
        'Четыре задачи: download_image, resize_image, add_watermark, upload_to_storage',
        'chain: каждая задача передаёт путь к файлу следующей',
        'Каждая задача с bind=True и max_retries=2',
        'Общий time_limit=300 (5 минут на весь pipeline)',
        'Логирование каждого шага',
        'API view для запуска pipeline и получения статуса по task_id'
      ],
      expectedOutput: 'POST /api/images/process/ {"url": "..."}\n-> {"task_id": "abc-123", "status": "processing"}\n\nGET /api/images/status/abc-123/\n-> {"status": "SUCCESS", "result": "/media/processed/image_watermarked.jpg"}',
      hint: 'Используй chain(download.s(url), resize.s(800, 600), watermark.s(), upload.s()). Для API view используй AsyncResult(task_id).status.',
      solution: '# tasks.py\nimport os\nfrom celery import shared_task, chain\nfrom celery.utils.log import get_task_logger\nfrom PIL import Image\nfrom django.conf import settings\n\nlogger = get_task_logger(__name__)\n\n@shared_task(bind=True, max_retries=2, time_limit=120)\ndef download_image(self, url):\n    import requests\n    logger.info(f"Скачиваем: {url}")\n    response = requests.get(url, timeout=30)\n    response.raise_for_status()\n    path = os.path.join(settings.MEDIA_ROOT, "tmp", f"{self.request.id}.jpg")\n    os.makedirs(os.path.dirname(path), exist_ok=True)\n    with open(path, "wb") as f:\n        f.write(response.content)\n    logger.info(f"Скачано: {path}")\n    return path\n\n@shared_task(bind=True, max_retries=2, time_limit=60)\ndef resize_image(self, path, width=800, height=600):\n    logger.info(f"Resize: {path} -> {width}x{height}")\n    img = Image.open(path)\n    img = img.resize((width, height), Image.LANCZOS)\n    img.save(path)\n    logger.info(f"Resized: {path}")\n    return path\n\n@shared_task(bind=True, max_retries=2, time_limit=60)\ndef add_watermark(self, path):\n    logger.info(f"Watermark: {path}")\n    img = Image.open(path)\n    # ... наложение watermark ...\n    output = path.replace(".jpg", "_wm.jpg")\n    img.save(output)\n    os.remove(path)\n    logger.info(f"Watermarked: {output}")\n    return output\n\n@shared_task(bind=True, max_retries=2, time_limit=120)\ndef upload_to_storage(self, path):\n    logger.info(f"Upload: {path}")\n    final_path = os.path.join(settings.MEDIA_ROOT, "processed", os.path.basename(path))\n    os.makedirs(os.path.dirname(final_path), exist_ok=True)\n    os.rename(path, final_path)\n    logger.info(f"Uploaded: {final_path}")\n    return final_path\n\n# views.py\nfrom celery import chain\nfrom celery.result import AsyncResult\nfrom rest_framework.views import APIView\nfrom rest_framework.response import Response\nfrom .tasks import download_image, resize_image, add_watermark, upload_to_storage\n\nclass ProcessImageView(APIView):\n    def post(self, request):\n        url = request.data["url"]\n        workflow = chain(\n            download_image.s(url),\n            resize_image.s(800, 600),\n            add_watermark.s(),\n            upload_to_storage.s()\n        )\n        result = workflow.apply_async()\n        return Response({"task_id": result.id, "status": "processing"})\n\nclass ImageStatusView(APIView):\n    def get(self, request, task_id):\n        result = AsyncResult(task_id)\n        response = {"task_id": task_id, "status": result.status}\n        if result.ready():\n            response["result"] = result.get() if result.successful() else str(result.result)\n        return Response(response)',
      explanation: 'chain передаёт результат каждой задачи как первый аргумент следующей. Каждая задача изолирована — можно retry отдельно. AsyncResult позволяет клиенту проверять статус длинного pipeline. time_limit защищает от зависших задач.'
    }
  ]
}
