export default {
  id: 1,
  title: 'Введение в Django',
  description: 'Что такое Django, философия фреймворка, установка, создание первого проекта и обзор архитектуры',
  lessons: [
    {
      id: 1,
      title: 'Что такое Django',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django — высокоуровневый веб-фреймворк на Python, следующий принципу "батарейки в комплекте". Он предоставляет всё необходимое для разработки: ORM, шаблонизатор, аутентификацию, административную панель и многое другое.' },
        { type: 'tip', value: 'Django создан в 2005 году командой газеты Lawrence Journal-World. Название дано в честь джазового гитариста Джанго Рейнхардта. Используется Instagram, Pinterest, Mozilla, Disqus, NASA.' },
        { type: 'heading', value: 'Принципы Django' },
        { type: 'code', language: 'python', value: '# Основные принципы Django:\n# 1. DRY (Don\'t Repeat Yourself) — не повторяй себя\n# 2. Явное лучше неявного (Zen of Python)\n# 3. Loose coupling — слабое связывание компонентов\n# 4. Быстрая разработка — много готового из коробки\n\n# Django "из коробки" предоставляет:\n# - ORM для работы с базой данных\n# - Система шаблонов\n# - Форм-обработка\n# - Аутентификация и права доступа\n# - Admin-панель\n# - Middleware система\n# - URL-маршрутизация\n# - Кэширование\n# - Интернационализация' },
        { type: 'note', value: 'Django подходит для разработки сайтов, REST API (с Django REST Framework), CMS, социальных сетей, e-commerce. Для небольших микросервисов чаще используют FastAPI или Flask.' }
      ]
    },
    {
      id: 2,
      title: 'Установка Django',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django устанавливается через pip. Рекомендуется использовать виртуальное окружение для изоляции зависимостей проекта.' },
        { type: 'code', language: 'python', value: '# Создание виртуального окружения\n# python -m venv venv\n\n# Активация (Linux/Mac):\n# source venv/bin/activate\n\n# Активация (Windows):\n# venv\\Scripts\\activate\n\n# Установка Django\n# pip install django\n\n# Проверка версии\nimport django\nprint(django.get_version())  # 5.0.x\n\n# Установка конкретной версии\n# pip install django==5.0\n\n# Создание файла зависимостей\n# pip freeze > requirements.txt\n\n# Установка из requirements.txt\n# pip install -r requirements.txt' },
        { type: 'tip', value: 'Всегда используй виртуальное окружение! Это изолирует зависимости проекта от системного Python и других проектов. Команды venv/bin/activate и venv\\Scripts\\activate зависят от ОС.' }
      ]
    },
    {
      id: 3,
      title: 'Создание проекта и структура',
      type: 'theory',
      content: [
        { type: 'text', value: 'django-admin startproject создаёт базовую структуру проекта. Понимание этой структуры — основа работы с Django.' },
        { type: 'code', language: 'python', value: '# Создание проекта:\n# django-admin startproject mysite\n\n# Структура созданного проекта:\n# mysite/          <-- корневая директория\n# |-- manage.py    <-- утилита управления\n# |-- mysite/      <-- пакет проекта\n#     |-- __init__.py\n#     |-- settings.py   <-- настройки\n#     |-- urls.py       <-- URL маршруты\n#     |-- asgi.py       <-- ASGI конфигурация\n#     |-- wsgi.py       <-- WSGI конфигурация\n\n# Запуск сервера разработки:\n# python manage.py runserver\n# python manage.py runserver 8080  # другой порт' },
        { type: 'note', value: 'manage.py — это обёртка над django-admin с настроенной переменной DJANGO_SETTINGS_MODULE. Всегда запускай Django-команды через manage.py, находясь в директории проекта.' }
      ]
    },
    {
      id: 4,
      title: 'settings.py: основные настройки',
      type: 'theory',
      content: [
        { type: 'text', value: 'settings.py содержит всю конфигурацию Django-проекта: базы данных, установленные приложения, шаблоны, статические файлы и многое другое.' },
        { type: 'code', language: 'python', value: '# mysite/settings.py (основные настройки)\n\nDEBUG = True  # Выключить в продакшне!\nALLOWED_HOSTS = []  # Домены, которым разрешено обращаться\n\nINSTALLED_APPS = [\n    "django.contrib.admin",       # Административная панель\n    "django.contrib.auth",        # Аутентификация\n    "django.contrib.contenttypes",\n    "django.contrib.sessions",\n    "django.contrib.messages",\n    "django.contrib.staticfiles",\n    # Наши приложения добавляются сюда:\n    # "myapp",\n]\n\nDATABASES = {\n    "default": {\n        "ENGINE": "django.db.backends.sqlite3",\n        "NAME": BASE_DIR / "db.sqlite3",  # SQLite по умолчанию\n    }\n}\n\nLANGUAGE_CODE = "ru-ru"\nTIME_ZONE = "Europe/Moscow"\nUSE_I18N = True\nUSE_TZ = True' },
        { type: 'warning', value: 'DEBUG=True в продакшне — опасно! Показывает полные трейсбэки ошибок всем пользователям. Всегда устанавливай DEBUG=False на сервере и настраивай ALLOWED_HOSTS.' }
      ]
    },
    {
      id: 5,
      title: 'Создание приложения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django-проект состоит из приложений (apps). Каждое приложение отвечает за определённую функциональность. Это позволяет переиспользовать код между проектами.' },
        { type: 'code', language: 'python', value: '# Создание приложения:\n# python manage.py startapp blog\n\n# Структура приложения:\n# blog/\n# |-- __init__.py\n# |-- admin.py      <-- регистрация моделей в admin\n# |-- apps.py       <-- конфигурация приложения\n# |-- models.py     <-- модели (таблицы БД)\n# |-- tests.py      <-- тесты\n# |-- views.py      <-- обработчики запросов\n# |-- migrations/   <-- миграции базы данных\n#     |-- __init__.py\n\n# Регистрация приложения в settings.py:\n# INSTALLED_APPS = [\n#     ...\n#     "blog",  # или "blog.apps.BlogConfig"\n# ]' },
        { type: 'tip', value: 'Каждое приложение должно делать одну вещь хорошо. Не создавай монолитное приложение для всего. Например: users, blog, shop, payments — отдельные приложения.' }
      ]
    },
    {
      id: 6,
      title: 'MTV архитектура: обзор',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django использует паттерн MTV (Model-Template-View), аналог MVC. Model — данные, Template — представление, View — бизнес-логика.' },
        { type: 'code', language: 'python', value: '# Поток запроса в Django:\n# 1. Браузер -> HTTP запрос\n# 2. URL маршрутизатор (urls.py) -> находит нужный View\n# 3. View (views.py) -> обрабатывает логику, обращается к Model\n# 4. Model (models.py) -> данные из базы\n# 5. Template (*.html) -> формирует HTML ответ\n# 6. HTTP ответ -> браузер\n\n# Пример минимального приложения:\n\n# views.py\nfrom django.http import HttpResponse\n\ndef hello(request):\n    return HttpResponse("Привет, Django!")\n\n# urls.py\nfrom django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path("hello/", views.hello, name="hello"),\n]' },
        { type: 'heading', value: 'Роли каждого компонента MTV' },
        { type: 'code', language: 'python', value: '# Model (models.py) — описывает структуру данных и работает с БД\nfrom django.db import models\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    content = models.TextField()\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    def __str__(self):\n        return self.title\n\n# View (views.py) — принимает запрос, выполняет логику, возвращает ответ\nfrom django.shortcuts import render\nfrom .models import Article\n\ndef article_list(request):\n    articles = Article.objects.all()  # запрос к Model\n    return render(request, "articles/list.html", {"articles": articles})\n\n# Template (articles/list.html) — HTML с данными\n# {% for article in articles %}\n#   <h2>{{ article.title }}</h2>\n#   <p>{{ article.content }}</p>\n# {% endfor %}' },
        { type: 'tip', value: 'В Django View — это не то же самое, что View в MVC. Django View ближе к Controller в MVC (содержит логику), а Template — это View (отображение). Это часто вызывает путаницу у разработчиков, пришедших из других фреймворков.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Первое Django-приложение',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай Django-проект с приложением, которое выводит приветствие и текущее время.',
      requirements: [
        'Создай проект mysite и приложение core',
        'Зарегистрируй приложение в INSTALLED_APPS',
        'View hello() возвращает HTML с приветствием',
        'View current_time() возвращает текущее время сервера',
        'Настрой URL: / -> hello, /time/ -> current_time'
      ],
      expectedOutput: 'GET / -> "Привет от Django! Версия 5.x"\nGET /time/ -> "Текущее время: 2024-01-15 14:30:25"',
      hint: 'Используй HttpResponse для простого HTML. datetime.now() для текущего времени. В основном urls.py подключи маршруты приложения через include().',
      solution: '# core/views.py\nfrom django.http import HttpResponse\nfrom datetime import datetime\nimport django\n\ndef hello(request):\n    version = django.get_version()\n    return HttpResponse(f"Привет от Django! Версия {version}")\n\ndef current_time(request):\n    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")\n    return HttpResponse(f"Текущее время: {now}")\n\n# core/urls.py\nfrom django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path("", views.hello, name="hello"),\n    path("time/", views.current_time, name="current_time"),\n]\n\n# mysite/urls.py\nfrom django.contrib import admin\nfrom django.urls import path, include\n\nurlpatterns = [\n    path("admin/", admin.site.urls),\n    path("", include("core.urls")),\n]',
      explanation: 'HttpResponse принимает строку и возвращает HTTP 200. datetime.now() возвращает объект, strftime() форматирует в строку. include() подключает URL-конфигурацию приложения в основной urls.py. Такой подход позволяет каждому приложению иметь свои URL.'
    }
  ]
}
