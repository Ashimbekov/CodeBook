export default {
  id: 3,
  title: 'MTV архитектура',
  description: 'Model-Template-View в Django: как данные, представление и логика работают вместе, поток запроса и ответа, роль каждого компонента',
  lessons: [
    {
      id: 1,
      title: 'Поток запроса в Django',
      type: 'theory',
      content: [
        { type: 'text', value: 'Понимание потока запроса критически важно для Django-разработчика. От момента нажатия кнопки в браузере до получения HTML-страницы проходит цепочка компонентов.' },
        { type: 'code', language: 'python', value: '# Поток запроса (Request/Response Cycle):\n#\n# 1. Браузер: GET /articles/5/\n# 2. Django WSGI/ASGI сервер\n# 3. Middleware (до обработки):\n#    - SecurityMiddleware\n#    - SessionMiddleware\n#    - AuthenticationMiddleware\n# 4. URL Dispatcher (urls.py):\n#    - path("articles/<int:id>/", views.article_detail)\n# 5. View (views.py):\n#    - Получает request объект\n#    - Обращается к Model\n# 6. Model (models.py):\n#    - Article.objects.get(id=5)\n#    - SELECT * FROM articles WHERE id=5\n# 7. Template (article_detail.html):\n#    - Рендеринг HTML с данными\n# 8. Middleware (после обработки)\n# 9. HTTP Response -> Браузер\n\nprint("Django обрабатывает запрос за миллисекунды")' },
        { type: 'tip', value: 'Middleware — это слой обработки, который может модифицировать запрос до View и ответ после View. Аутентификация, CSRF-защита, сессии — всё это middleware.' }
      ]
    },
    {
      id: 2,
      title: 'Model: данные приложения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Model описывает структуру данных и обеспечивает интерфейс к базе данных через ORM. Каждый класс модели — это таблица в БД.' },
        { type: 'code', language: 'python', value: '# models.py\nfrom django.db import models\nfrom django.contrib.auth.models import User\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    content = models.TextField()\n    author = models.ForeignKey(User, on_delete=models.CASCADE)\n    created_at = models.DateTimeField(auto_now_add=True)\n    updated_at = models.DateTimeField(auto_now=True)\n    is_published = models.BooleanField(default=False)\n\n    class Meta:\n        ordering = ["-created_at"]  # новые сначала\n        verbose_name = "Статья"\n        verbose_name_plural = "Статьи"\n\n    def __str__(self):\n        return self.title\n\n# Django автоматически создаёт SQL:\n# CREATE TABLE blog_article (\n#   id INTEGER PRIMARY KEY,\n#   title VARCHAR(200),\n#   content TEXT,\n#   author_id INTEGER REFERENCES auth_user(id),\n#   created_at DATETIME,\n#   updated_at DATETIME,\n#   is_published BOOLEAN\n# );' },
        { type: 'note', value: 'Model — это не просто описание таблицы. Это Python-объект с методами. Можно добавлять методы get_absolute_url(), clean(), save() и другие для бизнес-логики.' }
      ]
    },
    {
      id: 3,
      title: 'View: логика обработки',
      type: 'theory',
      content: [
        { type: 'text', value: 'View — функция или класс, который принимает HTTP-запрос и возвращает HTTP-ответ. View содержит бизнес-логику: получение данных, их обработку и передачу в шаблон.' },
        { type: 'code', language: 'python', value: '# views.py\nfrom django.shortcuts import render, get_object_or_404\nfrom django.http import HttpResponse, HttpResponseRedirect\nfrom .models import Article\n\n# Function-based view (FBV)\ndef article_list(request):\n    articles = Article.objects.filter(is_published=True)\n    context = {"articles": articles, "title": "Все статьи"}\n    return render(request, "blog/article_list.html", context)\n\ndef article_detail(request, pk):\n    # get_object_or_404 — возвращает 404 если не найдено\n    article = get_object_or_404(Article, pk=pk, is_published=True)\n    return render(request, "blog/article_detail.html", {"article": article})\n\ndef create_article(request):\n    if request.method == "POST":\n        # Обработка формы\n        title = request.POST.get("title")\n        content = request.POST.get("content")\n        Article.objects.create(title=title, content=content, author=request.user)\n        return HttpResponseRedirect("/articles/")\n    return render(request, "blog/create_article.html")' },
        { type: 'tip', value: 'get_object_or_404() — это Django-helper который автоматически возвращает 404 если объект не найден. Намного удобнее чем Article.objects.get() с try/except.' }
      ]
    },
    {
      id: 4,
      title: 'Template: HTML с данными',
      type: 'theory',
      content: [
        { type: 'text', value: 'Template — HTML-файл с тегами шаблонизатора Django (DTL). Получает контекст из View и формирует финальный HTML.' },
        { type: 'code', language: 'python', value: '# templates/blog/article_list.html\n# (содержимое файла как строка)\ntemplate_content = """\n<!DOCTYPE html>\n<html>\n<head><title>{{ title }}</title></head>\n<body>\n  <h1>{{ title }}</h1>\n\n  {% for article in articles %}\n    <article>\n      <h2>{{ article.title }}</h2>\n      <p>Автор: {{ article.author.username }}</p>\n      <p>{{ article.content|truncatechars:100 }}</p>\n      <p>{{ article.created_at|date:"d.m.Y" }}</p>\n      <a href="/articles/{{ article.pk }}/">Читать</a>\n    </article>\n  {% empty %}\n    <p>Статей пока нет.</p>\n  {% endfor %}\n</body>\n</html>\n"""\n\n# Синтаксис шаблонов:\n# {{ variable }}     -- вывод переменной\n# {% tag %}          -- теги (for, if, block)\n# {{ value|filter }} -- фильтры (truncatechars, date, upper)\n# {# comment #}      -- комментарий' },
        { type: 'note', value: 'Django Template Language (DTL) намеренно ограничен. Нельзя выполнять произвольный Python-код — это защищает от ошибок в шаблонах. Сложную логику делай в View, не в шаблоне.' }
      ]
    },
    {
      id: 5,
      title: 'Конфигурация шаблонов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django ищет шаблоны в директориях, указанных в TEMPLATES настройке. Стандартный вариант — директория templates в каждом приложении.' },
        { type: 'code', language: 'python', value: '# settings.py\nTEMPLATES = [\n    {\n        "BACKEND": "django.template.backends.django.DjangoTemplates",\n        "DIRS": [BASE_DIR / "templates"],  # глобальные шаблоны\n        "APP_DIRS": True,  # ищет templates/ в каждом приложении\n        "OPTIONS": {\n            "context_processors": [\n                "django.template.context_processors.debug",\n                "django.template.context_processors.request",\n                "django.contrib.auth.context_processors.auth",\n                "django.contrib.messages.context_processors.messages",\n            ],\n        },\n    },\n]\n\n# Структура директорий:\n# mysite/\n# |-- templates/          <-- глобальные шаблоны (DIRS)\n# |   |-- base.html\n# |-- blog/\n# |   |-- templates/      <-- APP_DIRS\n# |       |-- blog/       <-- пространство имён\n# |           |-- article_list.html' },
        { type: 'tip', value: 'Всегда создавай поддиректорию с именем приложения внутри templates/: blog/templates/blog/article_list.html. Это предотвращает конфликты имён между приложениями.' }
      ]
    },
    {
      id: 6,
      title: 'request объект: что знает Django о запросе',
      type: 'theory',
      content: [
        { type: 'text', value: 'Объект request содержит всю информацию о HTTP-запросе: метод, данные, пользователь, заголовки, сессия. View всегда получает его первым аргументом.' },
        { type: 'code', language: 'python', value: 'from django.http import JsonResponse\n\ndef request_info(request):\n    info = {\n        "method": request.method,          # GET, POST, PUT...\n        "path": request.path,              # /articles/5/\n        "user": str(request.user),         # AnonymousUser или username\n        "is_authenticated": request.user.is_authenticated,\n        "get_params": dict(request.GET),   # ?page=1&q=django\n        "post_data": dict(request.POST),   # данные формы\n        "ip": request.META.get("REMOTE_ADDR"),\n        "user_agent": request.META.get("HTTP_USER_AGENT", ""),\n    }\n    return JsonResponse(info)\n\n# request.FILES — загруженные файлы\n# request.COOKIES — куки\n# request.session — данные сессии\n# request.headers — HTTP заголовки (Django 2.2+)' },
        { type: 'heading', value: 'Чтение данных из запроса' },
        { type: 'code', language: 'python', value: 'from django.views.decorators.http import require_http_methods\nfrom django.http import JsonResponse, HttpResponseBadRequest\nimport json\n\n@require_http_methods(["GET", "POST"])\ndef handle_request(request):\n    # GET параметры: /search/?q=django&page=2\n    query = request.GET.get("q", "")        # "django"\n    page = request.GET.get("page", "1")     # "2" (строка!)\n\n    if request.method == "POST":\n        # Данные формы (Content-Type: application/x-www-form-urlencoded)\n        name = request.POST.get("name", "")\n\n        # JSON тело (Content-Type: application/json)\n        if request.content_type == "application/json":\n            try:\n                data = json.loads(request.body)\n                name = data.get("name", "")\n            except json.JSONDecodeError:\n                return HttpResponseBadRequest("Неверный JSON")\n\n        return JsonResponse({"received": name})\n\n    return JsonResponse({"query": query, "page": page})' },
        { type: 'tip', value: 'request.GET и request.POST — это QueryDict, не обычный dict. Они поддерживают getlist("tags") для получения нескольких значений одного параметра (например, ?tags=python&tags=django возвращает ["python", "django"]).' }
      ]
    },
    {
      id: 7,
      title: 'Практика: MTV в действии',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай полноценный блог с моделью, view и шаблоном.',
      requirements: [
        'Модель Post: title, content, author (ForeignKey User), created_at, is_published',
        'View post_list — список опубликованных постов',
        'View post_detail — детали поста по pk, 404 если не найден',
        'Шаблоны: templates/blog/post_list.html и post_detail.html',
        'URL: /posts/ -> list, /posts/{pk}/ -> detail',
        'В list.html цикл {% for post in posts %} с заголовком и датой'
      ],
      expectedOutput: 'GET /posts/ -> HTML список постов\nGET /posts/1/ -> HTML детали поста\nGET /posts/999/ -> 404',
      hint: 'Создай шаблон в blog/templates/blog/ (не просто templates/). В settings.py убедись что APP_DIRS=True. get_object_or_404(Post, pk=pk, is_published=True) вернёт 404 если пост не найден или не опубликован.',
      solution: '# blog/models.py\nfrom django.db import models\nfrom django.contrib.auth.models import User\n\nclass Post(models.Model):\n    title = models.CharField(max_length=200)\n    content = models.TextField()\n    author = models.ForeignKey(User, on_delete=models.CASCADE)\n    created_at = models.DateTimeField(auto_now_add=True)\n    is_published = models.BooleanField(default=False)\n\n    class Meta:\n        ordering = ["-created_at"]\n\n    def __str__(self):\n        return self.title\n\n# blog/views.py\nfrom django.shortcuts import render, get_object_or_404\nfrom .models import Post\n\ndef post_list(request):\n    posts = Post.objects.filter(is_published=True)\n    return render(request, "blog/post_list.html", {"posts": posts})\n\ndef post_detail(request, pk):\n    post = get_object_or_404(Post, pk=pk, is_published=True)\n    return render(request, "blog/post_detail.html", {"post": post})\n\n# blog/urls.py\nfrom django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path("posts/", views.post_list, name="post-list"),\n    path("posts/<int:pk>/", views.post_detail, name="post-detail"),\n]',
      explanation: 'Модель с ForeignKey на User связывает пост с автором. auto_now_add=True автоматически ставит дату при создании. filter(is_published=True) выбирает только опубликованные посты. get_object_or_404 с is_published=True защищает черновики — их нельзя посмотреть по прямой ссылке.'
    }
  ]
}
