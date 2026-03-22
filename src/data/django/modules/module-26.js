export default {
  id: 26,
  title: 'Практикум: Блог',
  description: 'Практические задачи по созданию полноценного блога на Django: модели, views, шаблоны, admin.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Модели блога',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай модели для блога: Category, Tag, Post с полными метаданными и связями.',
      requirements: [
        'Category: name (CharField), slug (SlugField), description (TextField, blank=True)',
        'Tag: name (CharField), slug (SlugField)',
        'Post: title, slug, content, excerpt, author (FK User), category (FK Category), tags (M2M Tag), created_at (auto_now_add), updated_at (auto_now), is_published, views_count (default=0)',
        'Post.Meta: ordering = ["-created_at"]',
        'Строковое представление каждой модели возвращает название'
      ],
      expectedOutput: 'str(post) -> "Как изучить Django за 30 дней"\nPost.objects.filter(is_published=True).count() -> целое число',
      hint: 'SlugField автоматически хранит slug. auto_now_add=True устанавливает время при создании, auto_now=True — при каждом сохранении.',
      solution: 'from django.db import models\nfrom django.contrib.auth.models import User\n\nclass Category(models.Model):\n    name = models.CharField(max_length=100)\n    slug = models.SlugField(unique=True)\n    description = models.TextField(blank=True)\n    def __str__(self): return self.name\n\nclass Tag(models.Model):\n    name = models.CharField(max_length=50)\n    slug = models.SlugField(unique=True)\n    def __str__(self): return self.name\n\nclass Post(models.Model):\n    title = models.CharField(max_length=200)\n    slug = models.SlugField(unique=True)\n    content = models.TextField()\n    excerpt = models.TextField(blank=True)\n    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")\n    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="posts")\n    tags = models.ManyToManyField(Tag, blank=True, related_name="posts")\n    created_at = models.DateTimeField(auto_now_add=True)\n    updated_at = models.DateTimeField(auto_now=True)\n    is_published = models.BooleanField(default=False)\n    views_count = models.PositiveIntegerField(default=0)\n    class Meta:\n        ordering = ["-created_at"]\n    def __str__(self): return self.title',
      explanation: 'related_name позволяет обращаться к постам через category.posts.all(). SET_NULL сохраняет пост при удалении категории (вместо каскадного удаления).'
    },
    {
      id: 2,
      title: 'Задача: Admin для блога',
      type: 'practice',
      difficulty: 'easy',
      description: 'Настрой Django Admin для моделей блога с удобным интерфейсом.',
      requirements: [
        'PostAdmin: list_display = [title, author, category, is_published, created_at, views_count]',
        'list_filter = [is_published, category, created_at]',
        'search_fields = [title, content, author__username]',
        'prepopulated_fields = {"slug": ("title",)}',
        'date_hierarchy = "created_at"',
        'TagAdmin и CategoryAdmin с prepopulated_fields для slug'
      ],
      expectedOutput: 'Admin панель показывает список постов с фильтрами\nПри вводе заголовка slug заполняется автоматически',
      hint: 'prepopulated_fields работает через JavaScript — автоматически транслитерирует и заполняет slug из title при вводе.',
      solution: 'from django.contrib import admin\nfrom .models import Post, Category, Tag\n\n@admin.register(Category)\nclass CategoryAdmin(admin.ModelAdmin):\n    prepopulated_fields = {"slug": ("name",)}\n    list_display = ["name", "slug"]\n\n@admin.register(Tag)\nclass TagAdmin(admin.ModelAdmin):\n    prepopulated_fields = {"slug": ("name",)}\n\n@admin.register(Post)\nclass PostAdmin(admin.ModelAdmin):\n    list_display = ["title", "author", "category", "is_published", "created_at", "views_count"]\n    list_filter = ["is_published", "category", "created_at"]\n    search_fields = ["title", "content", "author__username"]\n    prepopulated_fields = {"slug": ("title",)}\n    date_hierarchy = "created_at"\n    list_editable = ["is_published"]\n    raw_id_fields = ["author"]',
      explanation: 'list_editable позволяет редактировать is_published прямо из списка. raw_id_fields для author — когда пользователей много, выпадающий список неудобен, лучше поиск по ID.'
    },
    {
      id: 3,
      title: 'Задача: Class-Based Views для блога',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай views для публичного блога используя Class-Based Views.',
      requirements: [
        'PostListView (ListView): только опубликованные, 10 на страницу, context добавляет categories',
        'PostDetailView (DetailView): увеличивает views_count при каждом просмотре',
        'CategoryPostListView (ListView): посты конкретной категории по slug',
        'Маршруты: /blog/, /blog/<slug:slug>/, /blog/category/<slug:category_slug>/'
      ],
      expectedOutput: 'GET /blog/ -> список опубликованных постов\nGET /blog/kak-izuchit-django/ -> детальная страница, views_count+1\nGET /blog/category/python/ -> посты категории Python',
      hint: 'В PostDetailView переопредели get() или get_object() чтобы вызвать F("views_count") + 1 через update().',
      solution: 'from django.views.generic import ListView, DetailView\nfrom django.db.models import F\nfrom django.shortcuts import get_object_or_404\nfrom .models import Post, Category\n\nclass PostListView(ListView):\n    queryset = Post.objects.filter(is_published=True).select_related("author","category")\n    template_name = "blog/post_list.html"\n    context_object_name = "posts"\n    paginate_by = 10\n    def get_context_data(self, **kwargs):\n        ctx = super().get_context_data(**kwargs)\n        ctx["categories"] = Category.objects.all()\n        return ctx\n\nclass PostDetailView(DetailView):\n    model = Post\n    template_name = "blog/post_detail.html"\n    def get_object(self):\n        obj = super().get_object()\n        Post.objects.filter(pk=obj.pk).update(views_count=F("views_count") + 1)\n        return obj\n\nclass CategoryPostListView(ListView):\n    template_name = "blog/category_posts.html"\n    context_object_name = "posts"\n    paginate_by = 10\n    def get_queryset(self):\n        self.category = get_object_or_404(Category, slug=self.kwargs["category_slug"])\n        return Post.objects.filter(category=self.category, is_published=True)',
      explanation: 'F("views_count") + 1 через update() — атомарная операция на уровне БД, безопасно при параллельных запросах. get_object_or_404 автоматически возвращает 404 если категория не найдена.'
    },
    {
      id: 4,
      title: 'Задача: Форма комментария',
      type: 'practice',
      difficulty: 'medium',
      description: 'Добавь систему комментариев к постам с формой и сохранением.',
      requirements: [
        'Модель Comment: post (FK Post), author (FK User), text (TextField), created_at, is_approved (default=False)',
        'CommentForm с полем text (Textarea)',
        'В PostDetailView обрабатывай POST запрос для сохранения комментария',
        'Показывай только одобренные комментарии',
        'После сохранения редирект на ту же страницу (PRG паттерн)'
      ],
      expectedOutput: 'GET /blog/<slug>/ -> страница с формой комментария и одобренными комментариями\nPOST /blog/<slug>/ -> сохранение комментария, редирект',
      hint: 'В PostDetailView переопредели get() и post() или используй FormMixin. Устанавливай comment.author = request.user перед сохранением.',
      solution: 'from django.views.generic import DetailView\nfrom django.contrib.auth.decorators import login_required\nfrom django.utils.decorators import method_decorator\nfrom django.shortcuts import redirect\nfrom .models import Post, Comment\nfrom .forms import CommentForm\n\nclass PostDetailView(DetailView):\n    model = Post\n    template_name = "blog/post_detail.html"\n\n    def get_context_data(self, **kwargs):\n        ctx = super().get_context_data(**kwargs)\n        ctx["comments"] = self.object.comments.filter(is_approved=True).select_related("author")\n        ctx["form"] = CommentForm()\n        return ctx\n\n    def post(self, request, *args, **kwargs):\n        if not request.user.is_authenticated:\n            return redirect("login")\n        post = self.get_object()\n        form = CommentForm(request.POST)\n        if form.is_valid():\n            comment = form.save(commit=False)\n            comment.post = post\n            comment.author = request.user\n            comment.save()\n        return redirect(post.get_absolute_url())',
      explanation: 'PRG (Post/Redirect/Get) паттерн: после POST делаем редирект, чтобы обновление страницы не отправило форму повторно. commit=False позволяет добавить поля перед сохранением.'
    },
    {
      id: 5,
      title: 'Задача: Поиск по блогу',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй поиск по постам блога с подсветкой результатов.',
      requirements: [
        'SearchView (View): обрабатывает GET запрос с параметром q',
        'Поиск по title и content через Q объекты (icontains)',
        'Если q пустой — показывать все посты',
        'Контекст включает: posts (результаты), query (поисковый запрос), count',
        'URL: /blog/search/?q=django'
      ],
      expectedOutput: 'GET /blog/search/?q=python -> {"query": "python", "count": 5, posts: [...]}\nGET /blog/search/?q= -> все опубликованные посты',
      hint: 'Используй Q(title__icontains=q) | Q(content__icontains=q). Обязательно фильтруй только опубликованные is_published=True.',
      solution: 'from django.views import View\nfrom django.shortcuts import render\nfrom django.db.models import Q\nfrom .models import Post\n\nclass SearchView(View):\n    def get(self, request):\n        query = request.GET.get("q", "").strip()\n        if query:\n            posts = Post.objects.filter(\n                Q(title__icontains=query) | Q(content__icontains=query),\n                is_published=True\n            ).select_related("author", "category")\n        else:\n            posts = Post.objects.filter(is_published=True).select_related("author","category")\n        return render(request, "blog/search.html", {\n            "posts": posts,\n            "query": query,\n            "count": posts.count()\n        })',
      explanation: 'Q объекты позволяют строить сложные OR условия. Фильтрация is_published=True в том же filter() — это AND с поисковым условием. Если разбить на два filter() — получится другая семантика.'
    },
    {
      id: 6,
      title: 'Задача: RSS фид для блога',
      type: 'practice',
      difficulty: 'medium',
      description: 'Добавь RSS фид для последних постов блога используя Django syndication framework.',
      requirements: [
        'LatestPostsFeed наследуется от Feed',
        'title = "Мой блог", link = "/blog/", description = "Последние посты"',
        'items() возвращает последние 10 опубликованных постов',
        'item_title, item_description, item_link, item_pubdate методы',
        'URL: /blog/feed/'
      ],
      expectedOutput: 'GET /blog/feed/ -> XML RSS фид\n<?xml version="1.0"?><rss version="2.0">...</rss>',
      hint: 'from django.contrib.syndication.views import Feed. item_description возвращает post.excerpt или post.content[:200].',
      solution: 'from django.contrib.syndication.views import Feed\nfrom django.urls import reverse\nfrom .models import Post\n\nclass LatestPostsFeed(Feed):\n    title = "Мой блог"\n    link = "/blog/"\n    description = "Последние посты блога"\n\n    def items(self):\n        return Post.objects.filter(is_published=True)[:10]\n\n    def item_title(self, item):\n        return item.title\n\n    def item_description(self, item):\n        return item.excerpt or item.content[:200]\n\n    def item_pubdate(self, item):\n        return item.created_at\n\n    def item_link(self, item):\n        return reverse("blog:post-detail", kwargs={"slug": item.slug})',
      explanation: 'Django syndication framework автоматически генерирует XML по методам Feed класса. item_link вызывается для каждого поста. Работает также для Atom фидов через AtomFeed.'
    },
    {
      id: 7,
      title: 'Задача: Избранные посты для пользователя',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй функцию добавления постов в избранное через AJAX.',
      requirements: [
        'Модель Favorite: user (FK User), post (FK Post), Meta unique_together = [user, post]',
        'View toggle_favorite принимает POST запрос с post_id',
        'Если уже в избранном — удаляет, иначе добавляет',
        'Возвращает JSON: {"is_favorite": true/false, "count": int}',
        'Требует аутентификации (login_required)'
      ],
      expectedOutput: 'POST /blog/favorite/ {"post_id": 1} -> {"is_favorite": true, "count": 42}\nПовторный запрос -> {"is_favorite": false, "count": 41}',
      hint: 'Используй get_or_create для проверки: если уже есть — удали и верни false, если создано — верни true.',
      solution: 'from django.http import JsonResponse\nfrom django.contrib.auth.decorators import login_required\nfrom django.views.decorators.http import require_POST\nfrom .models import Favorite, Post\n\n@login_required\n@require_POST\ndef toggle_favorite(request):\n    post_id = request.POST.get("post_id")\n    post = Post.objects.get(id=post_id)\n    favorite, created = Favorite.objects.get_or_create(\n        user=request.user, post=post\n    )\n    if not created:\n        favorite.delete()\n        is_favorite = False\n    else:\n        is_favorite = True\n    count = Favorite.objects.filter(post=post).count()\n    return JsonResponse({"is_favorite": is_favorite, "count": count})',
      explanation: 'get_or_create атомарно проверяет существование и создаёт запись — безопасно при параллельных запросах. unique_together гарантирует один фаворит на пару user-post на уровне БД.'
    },
    {
      id: 8,
      title: 'Задача: Sitemap для блога',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай XML sitemap для блога чтобы помочь поисковым роботам.',
      requirements: [
        'PostSitemap наследуется от Sitemap',
        'items() возвращает все опубликованные посты',
        'location(item) возвращает URL поста',
        'lastmod(item) возвращает updated_at',
        'changefreq = "weekly", priority = 0.7',
        'Подключить в urls.py как /sitemap.xml'
      ],
      expectedOutput: 'GET /sitemap.xml -> XML sitemap\n<url><loc>https://example.com/blog/post-slug/</loc><lastmod>2024-01-15</lastmod></url>',
      hint: 'from django.contrib.sitemaps import Sitemap. Добавь "django.contrib.sitemaps" в INSTALLED_APPS.',
      solution: 'from django.contrib.sitemaps import Sitemap\nfrom django.urls import reverse\nfrom .models import Post\n\nclass PostSitemap(Sitemap):\n    changefreq = "weekly"\n    priority = 0.7\n\n    def items(self):\n        return Post.objects.filter(is_published=True)\n\n    def lastmod(self, obj):\n        return obj.updated_at\n\n    def location(self, obj):\n        return reverse("blog:post-detail", kwargs={"slug": obj.slug})\n\n# urls.py (project level)\nfrom django.contrib.sitemaps.views import sitemap\nfrom blog.sitemaps import PostSitemap\nsitemaps = {"posts": PostSitemap}\nurlpatterns += [path("sitemap.xml", sitemap, {"sitemaps": sitemaps})]',
      explanation: 'Sitemap — стандарт для SEO. Django генерирует XML автоматически из метода items(). Каждый элемент превращается в <url> блок с loc, lastmod, changefreq, priority.'
    },
    {
      id: 9,
      title: 'Задача: Кеширование страниц блога',
      type: 'practice',
      difficulty: 'medium',
      description: 'Добавь кеширование к наиболее посещаемым страницам блога.',
      requirements: [
        'PostListView кешируется на 15 минут через cache_page',
        'PostDetailView НЕ кешируется (vary_on_cookie или never_cache)',
        'Популярные теги кешируются через low-level API на 1 час',
        'Метод get_popular_tags() в отдельной функции с паттерном cache-aside',
        'Инвалидация кеша списка при создании нового поста (сигнал post_save)'
      ],
      expectedOutput: 'Первый GET /blog/ -> "Кеш промах", запрос к БД\nВторой GET /blog/ -> ответ из кеша за <1ms\nПосле создания поста -> кеш сброшен',
      hint: 'В сигнале post_save на Post вызывай cache.delete("post_list_cache") или cache.delete_many.',
      solution: 'from django.views.decorators.cache import cache_page, never_cache\nfrom django.utils.decorators import method_decorator\nfrom django.core.cache import cache\nfrom django.db.models.signals import post_save\nfrom django.dispatch import receiver\n\ndef get_popular_tags():\n    cached = cache.get("popular_tags")\n    if cached is None:\n        from .models import Tag\n        from django.db.models import Count\n        cached = list(Tag.objects.annotate(posts_count=Count("posts")).order_by("-posts_count")[:10])\n        cache.set("popular_tags", cached, timeout=3600)\n    return cached\n\n@method_decorator(cache_page(60 * 15), name="dispatch")\nclass PostListView(ListView):\n    pass  # остальная логика из предыдущих задач\n\n@method_decorator(never_cache, name="dispatch")\nclass PostDetailView(DetailView):\n    pass\n\n@receiver(post_save, sender=Post)\ndef invalidate_list_cache(sender, instance, **kwargs):\n    cache.delete("popular_tags")',
      explanation: 'never_cache на DetailView — потому что views_count обновляется при каждом просмотре, кешированная страница показывала бы устаревший счётчик. cache_page на ListVIew безопасен — список одинаков для всех.'
    },
    {
      id: 10,
      title: 'Задача: Полный деплой блога',
      type: 'practice',
      difficulty: 'hard',
      description: 'Подготовь Django блог к продакшен деплою: настройки, Docker, статика, email.',
      requirements: [
        'Создай production.py settings с DEBUG=False, PostgreSQL, Redis, EMAIL настройками',
        'Dockerfile с многоэтапной сборкой',
        'docker-compose.prod.yml: web (gunicorn), db, redis, nginx',
        'Nginx конфиг: статика через alias, проксирование на gunicorn',
        '.env.prod с переменными DJANGO_SECRET_KEY, DATABASE_URL, EMAIL_HOST_PASSWORD',
        'Скрипт entrypoint.sh: migrate, collectstatic, запуск gunicorn'
      ],
      expectedOutput: 'docker-compose -f docker-compose.prod.yml up -d\nБлог доступен на http://localhost:80\nСтатика отдаётся через nginx, API через gunicorn',
      hint: 'entrypoint.sh: python manage.py migrate --noinput && python manage.py collectstatic --noinput && exec gunicorn ...',
      solution: '# entrypoint.sh\n#!/bin/sh\nset -e\npython manage.py migrate --noinput\npython manage.py collectstatic --noinput\nexec gunicorn myproject.wsgi:application --bind 0.0.0.0:8000 --workers 4\n\n# Dockerfile (финальный)\nFROM python:3.12-slim\nRUN apt-get update && apt-get install -y libpq-dev gcc && rm -rf /var/lib/apt/lists/*\nWORKDIR /app\nCOPY requirements/production.txt requirements.txt\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nRUN chmod +x entrypoint.sh\nENTRYPOINT ["./entrypoint.sh"]',
      explanation: 'exec gunicorn в entrypoint.sh — важно: exec заменяет shell процесс, gunicorn получает PID 1 и корректно обрабатывает SIGTERM при остановке контейнера. Без exec Django будет дочерним процессом shell и сигналы не дойдут.'
    }
  ]
}
