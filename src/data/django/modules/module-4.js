export default {
  id: 4,
  title: 'URL маршрутизация',
  description: 'urlpatterns, path(), re_path(), include() в Django: маршрутизация запросов, именованные URL, пространства имён и конвертеры путей',
  lessons: [
    {
      id: 1,
      title: 'path(): базовая маршрутизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'path() — основная функция для определения URL-маршрутов. Принимает шаблон URL, view-функцию и необязательное имя маршрута.' },
        { type: 'code', language: 'python', value: '# urls.py\nfrom django.urls import path\nfrom . import views\n\nurlpatterns = [\n    # Простые маршруты\n    path("", views.index, name="index"),\n    path("about/", views.about, name="about"),\n    path("contact/", views.contact, name="contact"),\n\n    # Маршруты с параметрами\n    path("articles/<int:pk>/", views.article_detail, name="article-detail"),\n    path("users/<str:username>/", views.user_profile, name="user-profile"),\n    path("categories/<slug:slug>/", views.category, name="category"),\n]\n\n# Встроенные конвертеры типов:\n# <int:name>   -- целое положительное число\n# <str:name>   -- строка (без /)\n# <slug:name>  -- строка только из букв, цифр, дефисов и подчёркиваний\n# <uuid:name>  -- UUID формат\n# <path:name>  -- строка, может содержать /\n\n# View получает параметры:\n# def article_detail(request, pk):\n#     article = Article.objects.get(pk=pk)' }
      ]
    },
    {
      id: 2,
      title: 'include(): подключение URL приложений',
      type: 'theory',
      content: [
        { type: 'text', value: 'include() позволяет подключать URL-конфигурации приложений в основной urls.py. Это обеспечивает модульность — каждое приложение управляет своими URL.' },
        { type: 'code', language: 'python', value: '# mysite/urls.py (главный)\nfrom django.contrib import admin\nfrom django.urls import path, include\n\nurlpatterns = [\n    path("admin/", admin.site.urls),\n    path("blog/", include("blog.urls")),      # /blog/ -> blog.urls\n    path("shop/", include("shop.urls")),      # /shop/ -> shop.urls\n    path("api/", include("api.urls")),        # /api/ -> api.urls\n    path("", include("pages.urls")),          # / -> pages.urls\n]\n\n# blog/urls.py\nfrom django.urls import path\nfrom . import views\n\nurlpatterns = [\n    path("", views.post_list, name="post-list"),         # /blog/\n    path("<int:pk>/", views.post_detail, name="post-detail"),  # /blog/5/\n    path("new/", views.create_post, name="post-create"),  # /blog/new/\n    path("<int:pk>/edit/", views.edit_post, name="post-edit"),  # /blog/5/edit/\n]' },
        { type: 'tip', value: 'Ставь трейлинг слэш (/) в конце URL в Django — это стандартная практика. Django автоматически перенаправляет /blog на /blog/ если APPEND_SLASH=True (по умолчанию).' }
      ]
    },
    {
      id: 3,
      title: 'Именованные URL и reverse()',
      type: 'theory',
      content: [
        { type: 'text', value: 'name параметр в path() даёт URL имя. Функция reverse() генерирует URL по имени. Это позволяет менять URL-шаблоны без изменения кода View и шаблонов.' },
        { type: 'code', language: 'python', value: 'from django.urls import reverse\nfrom django.shortcuts import redirect\n\n# urls.py\n# path("articles/<int:pk>/", views.detail, name="article-detail")\n\n# В view:\ndef create_article(request):\n    article = Article.objects.create(title="Test")\n    # Генерация URL по имени\n    url = reverse("article-detail", kwargs={"pk": article.pk})\n    # url = "/articles/42/"\n    return redirect(url)\n\n# Короче через redirect с именем:\ndef create_article_v2(request):\n    article = Article.objects.create(title="Test")\n    return redirect("article-detail", pk=article.pk)\n\n# В шаблонах через тег {% url %}:\n# <a href="{% url \'article-detail\' pk=article.pk %}">Читать</a>\n# <a href="{% url \'post-list\' %}">Все посты</a>' },
        { type: 'note', value: 'Никогда не хардкодь URL в шаблонах и view! Всегда используй {% url %} в шаблонах и reverse() в Python-коде. Если поменяешь URL-шаблон, всё обновится автоматически.' }
      ]
    },
    {
      id: 4,
      title: 'Пространства имён (namespaces)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Namespaces решают конфликты имён между приложениями. Если в blog и shop есть маршруты с именем "detail", namespace позволяет отличить их: blog:detail и shop:detail.' },
        { type: 'code', language: 'python', value: '# mysite/urls.py\nurlpatterns = [\n    path("blog/", include("blog.urls", namespace="blog")),\n    path("shop/", include("shop.urls", namespace="shop")),\n]\n\n# blog/urls.py\napp_name = "blog"  # обязательно для namespace!\n\nurlpatterns = [\n    path("", views.list, name="list"),\n    path("<int:pk>/", views.detail, name="detail"),\n]\n\n# shop/urls.py\napp_name = "shop"\n\nurlpatterns = [\n    path("", views.list, name="list"),\n    path("<int:pk>/", views.detail, name="detail"),\n]\n\n# В шаблоне:\n# <a href="{% url \'blog:detail\' pk=post.pk %}">Пост</a>\n# <a href="{% url \'shop:detail\' pk=product.pk %}">Товар</a>\n\n# В Python:\n# reverse("blog:detail", kwargs={"pk": 5})   # /blog/5/\n# reverse("shop:detail", kwargs={"pk": 5})   # /shop/5/' }
      ]
    },
    {
      id: 5,
      title: 're_path(): регулярные выражения',
      type: 'theory',
      content: [
        { type: 'text', value: 're_path() позволяет использовать регулярные выражения для сложных URL-паттернов. Используй его только когда path() недостаточно.' },
        { type: 'code', language: 'python', value: 'from django.urls import re_path, path\nfrom . import views\n\nurlpatterns = [\n    # Год/месяц/день в URL\n    re_path(\n        r"^articles/(?P<year>[0-9]{4})/(?P<month>[0-9]{2})/$",\n        views.archive,\n        name="archive"\n    ),\n\n    # Версионирование API\n    re_path(\n        r"^api/v(?P<version>[12])/users/$",\n        views.users,\n        name="api-users"\n    ),\n\n    # То же самое через path (проще):\n    path("api/v<int:version>/users/", views.users, name="api-users"),\n]\n\n# Именованные группы (?P<name>pattern) передаются в view\ndef archive(request, year, month):\n    return HttpResponse(f"Архив за {year}/{month}")' },
        { type: 'tip', value: 'Предпочитай path() вместо re_path() — он читабельнее и безопаснее. re_path нужен для сложных паттернов: опциональные сегменты, сложные форматы данных, миграция со старых URL.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: URL маршрутизация',
      type: 'practice',
      difficulty: 'medium',
      description: 'Настрой полную URL-маршрутизацию для приложения блог с пространствами имён.',
      requirements: [
        'Основной urls.py подключает blog через include с namespace="blog"',
        'В blog/urls.py: app_name = "blog" и маршруты list, detail, create, edit, delete',
        'View для каждого маршрута (пустые, возвращают HttpResponse с именем)',
        'Шаблон base.html с навигацией используя {% url "blog:list" %}',
        'View create_post делает redirect на detail после создания через reverse()',
        'URL: /blog/, /blog/5/, /blog/new/, /blog/5/edit/, /blog/5/delete/'
      ],
      expectedOutput: 'GET /blog/ -> "Список постов"\nGET /blog/5/ -> "Детали поста 5"\nGET /blog/new/ -> "Создание поста"\nreverse("blog:detail", kwargs={"pk": 5}) == "/blog/5/"',
      hint: 'app_name в urls.py приложения обязателен для namespace. В main urls.py: include("blog.urls", namespace="blog"). reverse() принимает строку "blog:detail" и kwargs словарь.',
      solution: '# mysite/urls.py\nfrom django.contrib import admin\nfrom django.urls import path, include\n\nurlpatterns = [\n    path("admin/", admin.site.urls),\n    path("blog/", include("blog.urls", namespace="blog")),\n]\n\n# blog/urls.py\nfrom django.urls import path\nfrom . import views\n\napp_name = "blog"\n\nurlpatterns = [\n    path("", views.post_list, name="list"),\n    path("<int:pk>/", views.post_detail, name="detail"),\n    path("new/", views.create_post, name="create"),\n    path("<int:pk>/edit/", views.edit_post, name="edit"),\n    path("<int:pk>/delete/", views.delete_post, name="delete"),\n]\n\n# blog/views.py\nfrom django.http import HttpResponse\nfrom django.shortcuts import redirect\nfrom django.urls import reverse\n\ndef post_list(request):\n    return HttpResponse("Список постов")\n\ndef post_detail(request, pk):\n    return HttpResponse(f"Детали поста {pk}")\n\ndef create_post(request):\n    if request.method == "POST":\n        url = reverse("blog:detail", kwargs={"pk": 1})\n        return redirect(url)\n    return HttpResponse("Создание поста")\n\ndef edit_post(request, pk):\n    return HttpResponse(f"Редактирование поста {pk}")\n\ndef delete_post(request, pk):\n    return HttpResponse(f"Удаление поста {pk}")',
      explanation: 'app_name в urls.py приложения и namespace в include() работают вместе. reverse("blog:detail", kwargs={"pk": 1}) генерирует "/blog/1/". В шаблоне это будет {% url "blog:detail" pk=post.pk %}. Namespaces предотвращают конфликты если несколько приложений имеют маршруты с одинаковыми именами.'
    }
  ]
}
