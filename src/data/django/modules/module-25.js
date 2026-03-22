export default {
  id: 25,
  title: 'Best Practices',
  description: 'Структура проекта, безопасность, оптимизация запросов, select_related/prefetch_related — пишем профессиональный Django код.',
  lessons: [
    {
      id: 1,
      title: 'Структура Django проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая структура проекта — основа поддерживаемого кода. Разделяй приложения по бизнес-логике, не создавай монолитные apps.' },
        { type: 'code', language: 'python', value: 'myproject/\n    config/                  # настройки и конфигурация\n        settings/\n            base.py          # общие настройки\n            development.py   # dev настройки\n            production.py    # prod настройки\n        urls.py\n        wsgi.py\n        asgi.py\n    apps/\n        users/               # пользователи и аутентификация\n            models.py\n            serializers.py\n            views.py\n            urls.py\n            tests/\n                test_models.py\n                test_views.py\n        articles/            # статьи\n        notifications/       # уведомления\n    requirements/\n        base.txt             # общие зависимости\n        development.txt      # dev зависимости\n        production.txt       # prod зависимости\n    manage.py\n    docker-compose.yml' },
        { type: 'tip', value: 'Разделяй settings по окружениям: base.py содержит общее, development.py переопределяет DEBUG=True и использует SQLite, production.py — PostgreSQL и все продакшен настройки.' }
      ]
    },
    {
      id: 2,
      title: 'Оптимизация запросов: select_related и prefetch_related',
      type: 'theory',
      content: [
        { type: 'text', value: 'Проблема N+1: при обходе queryset Django делает отдельный запрос для каждого связанного объекта. select_related и prefetch_related решают это.' },
        { type: 'code', language: 'python', value: '# ПЛОХО — N+1 запросов\narticles = Article.objects.all()\nfor article in articles:\n    print(article.author.username)  # каждый раз запрос к БД!\n\n# ХОРОШО — select_related для ForeignKey/OneToOne (JOIN)\narticles = Article.objects.select_related("author", "category").all()\nfor article in articles:\n    print(article.author.username)  # из кеша, без запроса\n\n# ХОРОШО — prefetch_related для ManyToMany/обратный FK (отдельный запрос)\narticles = Article.objects.prefetch_related("tags", "comments").all()\nfor article in articles:\n    print(article.tags.all())  # из кеша prefetch' },
        { type: 'code', language: 'python', value: '# Prefetch с Prefetch объектом для фильтрации\nfrom django.db.models import Prefetch\n\narticles = Article.objects.prefetch_related(\n    Prefetch(\n        "comments",\n        queryset=Comment.objects.filter(is_approved=True).select_related("author"),\n        to_attr="approved_comments"  # сохранить в отдельный атрибут\n    )\n)\nfor article in articles:\n    print(article.approved_comments)  # только одобренные' }
      ]
    },
    {
      id: 3,
      title: 'Аннотации и агрегации',
      type: 'theory',
      content: [
        { type: 'text', value: 'annotate добавляет вычисляемые поля к queryset (выполняется на уровне БД). aggregate вычисляет итоговые значения.' },
        { type: 'code', language: 'python', value: 'from django.db.models import Count, Avg, Sum, Max, F, Q\n\n# Количество комментариев к каждой статье\narticles = Article.objects.annotate(\n    comments_count=Count("comments"),\n    avg_rating=Avg("ratings__value")\n)\nfor a in articles:\n    print(f"{a.title}: {a.comments_count} комментариев")\n\n# Агрегация по всему queryset\nstats = Article.objects.aggregate(\n    total=Count("id"),\n    avg_views=Avg("views_count"),\n    max_views=Max("views_count")\n)\nprint(stats)  # {"total": 100, "avg_views": 523.4, "max_views": 10000}\n\n# F объекты для операций на уровне БД\nArticle.objects.update(views_count=F("views_count") + 1)\n\n# Q объекты для сложных запросов\nArticle.objects.filter(Q(title__icontains="python") | Q(title__icontains="django"))' }
      ]
    },
    {
      id: 4,
      title: 'Безопасность Django',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django имеет встроенную защиту от множества атак. Важно знать что включить в продакшене.' },
        { type: 'code', language: 'python', value: '# settings.py — продакшен настройки безопасности\n\nSECRET_KEY = config("SECRET_KEY")  # никогда не хардкодить!\nDEBUG = False\nALLOWED_HOSTS = ["example.com"]\n\n# HTTPS\nSECURE_SSL_REDIRECT = True\nSESSION_COOKIE_SECURE = True\nCSRF_COOKIE_SECURE = True\nSECURE_HSTS_SECONDS = 31536000\nSECURE_HSTS_INCLUDE_SUBDOMAINS = True\n\n# Защита от Clickjacking\nX_FRAME_OPTIONS = "DENY"\n\n# Content Security Policy\nSECURE_CONTENT_TYPE_NOSNIFF = True\nSECURE_BROWSER_XSS_FILTER = True' },
        { type: 'list', items: [
          'CSRF защита — встроена в Django, не отключай',
          'XSS защита — автоэкранирование в шаблонах',
          'SQL Injection — ORM защищает автоматически',
          'Clickjacking — X-FRAME-OPTIONS заголовок',
          'HTTPS — всегда в продакшене',
          'Секреты — только в переменных окружения'
        ]}
      ]
    },
    {
      id: 5,
      title: 'Кастомные менеджеры и QuerySet методы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кастомные менеджеры и QuerySet методы позволяют инкапсулировать бизнес-логику работы с данными прямо в модели.' },
        { type: 'code', language: 'python', value: 'from django.db import models\n\nclass ArticleQuerySet(models.QuerySet):\n    def published(self):\n        return self.filter(is_published=True)\n\n    def recent(self):\n        from django.utils import timezone\n        from datetime import timedelta\n        week_ago = timezone.now() - timedelta(days=7)\n        return self.filter(created_at__gte=week_ago)\n\n    def with_stats(self):\n        from django.db.models import Count\n        return self.annotate(comments_count=Count("comments"))\n\nclass ArticleManager(models.Manager):\n    def get_queryset(self):\n        return ArticleQuerySet(self.model, using=self._db)\n\n    def published(self):\n        return self.get_queryset().published()\n\nclass Article(models.Model):\n    objects = ArticleManager()\n\n# Использование с цепочкой методов\nArticle.objects.published().recent().with_stats().order_by("-created_at")' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Оптимизация API запросов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Оптимизируй ViewSet для статей используя select_related, prefetch_related и annotate.',
      requirements: [
        'ArticleViewSet.get_queryset() использует select_related("author", "category")',
        'prefetch_related("tags") для тегов статьи',
        'annotate добавляет comments_count к каждой статье',
        'ArticleSerializer включает author_name, category_name, tags (список), comments_count',
        'Убедись, что список из 100 статей генерирует не более 4 SQL запросов'
      ],
      expectedOutput: 'GET /api/articles/ -> 100 статей за 3-4 SQL запроса вместо 200+\n{"id": 1, "title": "...", "author_name": "admin", "comments_count": 5, "tags": ["python", "django"]}',
      hint: 'Используй django-debug-toolbar или connection.queries для подсчёта SQL запросов в тестах.',
      solution: 'from django.db.models import Count, Prefetch\nfrom rest_framework import viewsets, serializers\nfrom .models import Article, Tag\n\nclass ArticleSerializer(serializers.ModelSerializer):\n    author_name = serializers.CharField(source="author.username", read_only=True)\n    category_name = serializers.CharField(source="category.name", read_only=True)\n    tags = serializers.SerializerMethodField()\n    comments_count = serializers.IntegerField(read_only=True)\n\n    def get_tags(self, obj):\n        return [t.name for t in obj.tags.all()]\n\n    class Meta:\n        model = Article\n        fields = ["id", "title", "author_name", "category_name", "tags", "comments_count"]\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    serializer_class = ArticleSerializer\n\n    def get_queryset(self):\n        return Article.objects.select_related(\n            "author", "category"\n        ).prefetch_related(\n            "tags"\n        ).annotate(\n            comments_count=Count("comments")\n        )',
      explanation: 'select_related делает JOIN для ForeignKey — один SQL запрос вместо N. prefetch_related делает отдельный IN запрос для ManyToMany — 1 дополнительный запрос вместо N. annotate вычисляет агрегаты на уровне БД — не нужно считать в Python.'
    },
    {
      id: 7,
      title: 'Практика: Кастомный QuerySet для бизнес-логики',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай кастомный QuerySet для модели Order (заказ) с бизнес-методами.',
      requirements: [
        'Модель Order: status (choices: pending/paid/shipped/delivered), total, user, created_at',
        'OrderQuerySet с методами: pending(), paid(), for_user(user), last_30_days()',
        'OrderManager использует OrderQuerySet',
        'Метод total_revenue() на QuerySet через aggregate',
        'Использование в views: Order.objects.paid().for_user(request.user).last_30_days()'
      ],
      expectedOutput: 'Order.objects.paid().last_30_days().total_revenue() -> {"revenue": 125000.50}\nOrder.objects.for_user(user).pending().count() -> 3',
      hint: 'total_revenue() это метод QuerySet возвращающий aggregate(revenue=Sum("total"))["revenue"]. Можно цепочкой: .paid().last_30_days().',
      solution: 'from django.db import models\nfrom django.db.models import Sum\nfrom django.utils import timezone\nfrom datetime import timedelta\n\nclass OrderQuerySet(models.QuerySet):\n    def pending(self):\n        return self.filter(status="pending")\n\n    def paid(self):\n        return self.filter(status="paid")\n\n    def for_user(self, user):\n        return self.filter(user=user)\n\n    def last_30_days(self):\n        threshold = timezone.now() - timedelta(days=30)\n        return self.filter(created_at__gte=threshold)\n\n    def total_revenue(self):\n        result = self.aggregate(revenue=Sum("total"))\n        return result["revenue"] or 0\n\nclass OrderManager(models.Manager):\n    def get_queryset(self):\n        return OrderQuerySet(self.model, using=self._db)\n\nclass Order(models.Model):\n    STATUS_CHOICES = [("pending","Ожидает"),("paid","Оплачен"),("shipped","Отправлен"),("delivered","Доставлен")]\n    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")\n    total = models.DecimalField(max_digits=10, decimal_places=2)\n    user = models.ForeignKey("auth.User", on_delete=models.CASCADE)\n    created_at = models.DateTimeField(auto_now_add=True)\n    objects = OrderManager()',
      explanation: 'Инкапсуляция бизнес-логики в QuerySet: вместо дублирования filter(status="paid") по всему коду — один метод paid(). Методы можно цепочкой. total_revenue() — вычисление на уровне БД через SQL SUM.'
    }
  ]
}
