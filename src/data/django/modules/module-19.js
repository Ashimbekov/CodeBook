export default {
  id: 19,
  title: 'DRF: Фильтрация и пагинация',
  description: 'django-filter, SearchFilter, OrderingFilter, PageNumberPagination — делаем API гибким и масштабируемым.',
  lessons: [
    {
      id: 1,
      title: 'Фильтрация через FilterBackend',
      type: 'theory',
      content: [
        { type: 'text', value: 'DRF поддерживает несколько бэкендов фильтрации. Самый мощный — django-filter, который автоматически создаёт фильтры на основе полей модели.' },
        { type: 'code', language: 'python', value: '# pip install django-filter\n\n# settings.py\nINSTALLED_APPS = ["django_filters"]\n\nREST_FRAMEWORK = {\n    "DEFAULT_FILTER_BACKENDS": [\n        "django_filters.rest_framework.DjangoFilterBackend",\n        "rest_framework.filters.SearchFilter",\n        "rest_framework.filters.OrderingFilter",\n    ],\n}' },
        { type: 'code', language: 'python', value: 'from django_filters.rest_framework import DjangoFilterBackend\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n    filter_backends = [DjangoFilterBackend]\n    filterset_fields = ["category", "is_published", "author"]\n\n# Теперь работают запросы:\n# GET /articles/?category=1\n# GET /articles/?is_published=true\n# GET /articles/?author=5&is_published=true' },
        { type: 'tip', value: 'filterset_fields — простой способ добавить точную фильтрацию. Для более сложных фильтров (диапазоны, icontains) используй FilterSet класс.' }
      ]
    },
    {
      id: 2,
      title: 'SearchFilter и OrderingFilter',
      type: 'theory',
      content: [
        { type: 'text', value: 'SearchFilter добавляет полнотекстовый поиск через параметр ?search=. OrderingFilter позволяет сортировать результаты.' },
        { type: 'code', language: 'python', value: 'from rest_framework.filters import SearchFilter, OrderingFilter\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n    filter_backends = [SearchFilter, OrderingFilter]\n\n    # Поля для поиска (поддерживает related fields)\n    search_fields = ["title", "content", "author__username"]\n\n    # Поля для сортировки\n    ordering_fields = ["created_at", "title", "views_count"]\n    ordering = ["-created_at"]  # сортировка по умолчанию\n\n# Запросы:\n# GET /articles/?search=python\n# GET /articles/?ordering=-created_at\n# GET /articles/?ordering=title,-views_count' },
        { type: 'note', value: 'Перед полем в search_fields можно добавить префикс: ^ — startswith, = — точное совпадение, @ — полнотекстовый поиск (только PostgreSQL), $ — regex.' }
      ]
    },
    {
      id: 3,
      title: 'Кастомный FilterSet',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для сложной фильтрации (диапазоны дат, icontains, кастомные методы) используй класс FilterSet из django-filter.' },
        { type: 'code', language: 'python', value: 'import django_filters\nfrom .models import Article\n\nclass ArticleFilter(django_filters.FilterSet):\n    # Фильтр по диапазону дат\n    created_after = django_filters.DateFilter(field_name="created_at", lookup_expr="gte")\n    created_before = django_filters.DateFilter(field_name="created_at", lookup_expr="lte")\n    # Поиск по части заголовка\n    title_contains = django_filters.CharFilter(field_name="title", lookup_expr="icontains")\n    # Фильтр по минимальному числу просмотров\n    min_views = django_filters.NumberFilter(field_name="views_count", lookup_expr="gte")\n\n    class Meta:\n        model = Article\n        fields = ["category", "is_published"]\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    filterset_class = ArticleFilter\n\n# GET /articles/?created_after=2024-01-01&min_views=100' }
      ]
    },
    {
      id: 4,
      title: 'PageNumberPagination',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пагинация разбивает большие списки на страницы. DRF включает несколько схем пагинации.' },
        { type: 'code', language: 'python', value: '# settings.py — глобальная пагинация\nREST_FRAMEWORK = {\n    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",\n    "PAGE_SIZE": 10,\n}\n\n# Или кастомный класс:\nfrom rest_framework.pagination import PageNumberPagination\n\nclass StandardPagination(PageNumberPagination):\n    page_size = 10\n    page_size_query_param = "page_size"  # ?page_size=20\n    max_page_size = 100\n    page_query_param = "page"  # ?page=2\n\n# Ответ с пагинацией:\n# {\n#   "count": 150,\n#   "next": "http://api.com/articles/?page=3",\n#   "previous": "http://api.com/articles/?page=1",\n#   "results": [...]\n# }' },
        { type: 'tip', value: 'LimitOffsetPagination использует ?limit=10&offset=20 — удобно для бесконечной прокрутки. CursorPagination — самая быстрая для больших таблиц, но нельзя прыгать на произвольную страницу.' }
      ]
    },
    {
      id: 5,
      title: 'Кастомная пагинация для ViewSet',
      type: 'theory',
      content: [
        { type: 'text', value: 'Можно установить разную пагинацию для разных ViewSet, переопределив атрибут pagination_class.' },
        { type: 'code', language: 'python', value: 'from rest_framework.pagination import LimitOffsetPagination, CursorPagination\n\nclass SmallResultsSetPagination(PageNumberPagination):\n    page_size = 5\n    max_page_size = 50\n\nclass LargeResultsSetPagination(PageNumberPagination):\n    page_size = 100\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n    pagination_class = SmallResultsSetPagination  # только для этого ViewSet\n\nclass CategoryViewSet(viewsets.ReadOnlyModelViewSet):\n    queryset = Category.objects.all()\n    serializer_class = CategorySerializer\n    pagination_class = None  # отключить пагинацию' }
      ]
    },
    {
      id: 6,
      title: 'Практика: API с фильтрацией и пагинацией',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай ViewSet для статей с полной поддержкой фильтрации, поиска и пагинации.',
      requirements: [
        'ArticleViewSet с фильтрацией по category и is_published',
        'Поиск по title и content через SearchFilter (?search=)',
        'Сортировка по created_at и views_count через OrderingFilter',
        'Пагинация: 5 статей на страницу, максимум 50',
        'Кастомный FilterSet с фильтром min_views (views_count__gte)'
      ],
      expectedOutput: 'GET /articles/?search=django&ordering=-views_count&page=1 -> {"count": 25, "next": "...?page=2", "results": [...5 статей...]}',
      hint: 'Используй filterset_class для кастомного FilterSet. Добавь все три filter_backends в ViewSet.',
      solution: 'import django_filters\nfrom rest_framework import viewsets, filters\nfrom rest_framework.pagination import PageNumberPagination\nfrom django_filters.rest_framework import DjangoFilterBackend\nfrom .models import Article\nfrom .serializers import ArticleSerializer\n\nclass ArticlePagination(PageNumberPagination):\n    page_size = 5\n    max_page_size = 50\n    page_size_query_param = "page_size"\n\nclass ArticleFilter(django_filters.FilterSet):\n    min_views = django_filters.NumberFilter(field_name="views_count", lookup_expr="gte")\n    class Meta:\n        model = Article\n        fields = ["category", "is_published"]\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n    pagination_class = ArticlePagination\n    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]\n    filterset_class = ArticleFilter\n    search_fields = ["title", "content"]\n    ordering_fields = ["created_at", "views_count"]\n    ordering = ["-created_at"]',
      explanation: 'Все три filter_backends работают одновременно. DjangoFilterBackend обрабатывает ?category=, SearchFilter — ?search=, OrderingFilter — ?ordering=. Пагинация применяется последней к уже отфильтрованному queryset.'
    }
  ]
}
