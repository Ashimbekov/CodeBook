export default {
  id: 22,
  title: 'Кеширование',
  description: 'cache_page, low-level cache API, Redis кеш — ускоряем Django приложение в разы.',
  lessons: [
    {
      id: 1,
      title: 'Зачем кешировать и как работает кеш',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кеширование — сохранение результатов дорогостоящих операций для повторного использования. Вместо обращения к БД каждый раз, результат берётся из быстрого хранилища (Redis, Memcached, память).' },
        { type: 'tip', value: 'Кеш как стикер с ответом на столе: вместо того чтобы каждый раз лезть в книгу (БД), смотришь на стикер. Когда стикер устарел — выбрасываешь и снова лезешь в книгу.' },
        { type: 'heading', value: 'Настройка кеш бэкенда' },
        { type: 'code', language: 'python', value: '# settings.py\n# Redis (рекомендуется для продакшена)\nCACHES = {\n    "default": {\n        "BACKEND": "django.core.cache.backends.redis.RedisCache",\n        "LOCATION": "redis://127.0.0.1:6379/1",\n    }\n}\n\n# Memcached\nCACHES = {\n    "default": {\n        "BACKEND": "django.core.cache.backends.memcache.PyMemcacheCache",\n        "LOCATION": "127.0.0.1:11211",\n    }\n}\n\n# Файловый кеш (для разработки)\nCACHES = {\n    "default": {\n        "BACKEND": "django.core.cache.backends.filebased.FileBasedCache",\n        "LOCATION": "/var/tmp/django_cache",\n    }\n}' }
      ]
    },
    {
      id: 2,
      title: 'Low-level cache API',
      type: 'theory',
      content: [
        { type: 'text', value: 'Low-level API даёт полный контроль над кешем: можно кешировать любые данные с любым ключом и временем жизни.' },
        { type: 'code', language: 'python', value: 'from django.core.cache import cache\n\n# Установить значение (timeout в секундах, None = бесконечно)\ncache.set("my_key", "my_value", timeout=3600)  # 1 час\n\n# Получить значение (None если не найдено)\nvalue = cache.get("my_key")\n\n# Получить с дефолтным значением\nvalue = cache.get("my_key", default="default_value")\n\n# Удалить ключ\ncache.delete("my_key")\n\n# Проверить существование\ncache.has_key("my_key")\n\n# Установить много ключей сразу\ncache.set_many({"key1": "val1", "key2": "val2"}, timeout=600)\n\n# Получить много ключей\nvalues = cache.get_many(["key1", "key2"])\n\n# Очистить весь кеш\ncache.clear()' },
        { type: 'code', language: 'python', value: '# Типичный паттерн: cache-aside\ndef get_popular_articles():\n    cache_key = "popular_articles"\n    result = cache.get(cache_key)\n    if result is None:\n        # Кеш промах — идём в БД\n        result = list(Article.objects.order_by("-views_count")[:10])\n        cache.set(cache_key, result, timeout=3600)\n    return result' }
      ]
    },
    {
      id: 3,
      title: 'cache_page декоратор',
      type: 'theory',
      content: [
        { type: 'text', value: 'cache_page кеширует весь HTTP ответ view на заданное время. Самый простой способ ускорить медленные страницы.' },
        { type: 'code', language: 'python', value: 'from django.views.decorators.cache import cache_page\nfrom django.utils.decorators import method_decorator\n\n# Для function-based view\n@cache_page(60 * 15)  # 15 минут\ndef article_list(request):\n    articles = Article.objects.all()\n    return render(request, "articles/list.html", {"articles": articles})\n\n# Для class-based view\n@method_decorator(cache_page(60 * 15), name="dispatch")\nclass ArticleListView(ListView):\n    model = Article\n    template_name = "articles/list.html"\n\n# В URLs\nfrom django.views.decorators.cache import cache_page\nurlpatterns = [\n    path("articles/", cache_page(60 * 15)(ArticleListView.as_view())),\n]' },
        { type: 'warning', value: 'cache_page не подходит для персонализированных страниц (где содержимое зависит от пользователя) — все пользователи получат одинаковый кешированный ответ!' }
      ]
    },
    {
      id: 4,
      title: 'Кеширование в DRF',
      type: 'theory',
      content: [
        { type: 'text', value: 'В DRF кешировать можно на уровне view через cache_page или вручную через low-level API в ViewSet методах.' },
        { type: 'code', language: 'python', value: 'from django.core.cache import cache\nfrom rest_framework import viewsets\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    def list(self, request):\n        cache_key = f"articles_list_{request.query_params}"\n        cached = cache.get(cache_key)\n        if cached:\n            return Response(cached)\n\n        queryset = self.filter_queryset(self.get_queryset())\n        serializer = self.get_serializer(queryset, many=True)\n        cache.set(cache_key, serializer.data, timeout=300)\n        return Response(serializer.data)\n\n    def perform_create(self, serializer):\n        serializer.save()\n        # Инвалидируем кеш после создания\n        cache.delete_pattern("articles_list_*")  # django-redis' }
      ]
    },
    {
      id: 5,
      title: 'cache_control и Vary заголовки',
      type: 'theory',
      content: [
        { type: 'text', value: 'cache_control управляет HTTP-кешированием на уровне браузера и CDN. Vary указывает, какие заголовки влияют на кеш.' },
        { type: 'code', language: 'python', value: 'from django.views.decorators.cache import cache_page, never_cache\nfrom django.views.decorators.vary import vary_on_cookie, vary_on_headers\n\n# Запретить кеширование (для личных данных)\n@never_cache\ndef profile_view(request):\n    return render(request, "profile.html")\n\n# Кешировать по языку пользователя\n@vary_on_headers("Accept-Language")\n@cache_page(60 * 60)\ndef catalog_view(request):\n    return render(request, "catalog.html")\n\n# Кешировать по куки (для разных сессий)\n@vary_on_cookie\n@cache_page(60 * 5)\ndef cart_view(request):\n    return render(request, "cart.html")' },
        { type: 'tip', value: 'vary_on_cookie создаёт отдельный кеш для каждого пользователя — полезно когда контент персонализирован, но дорого в памяти. Используй только когда необходимо.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Кеширование популярных статей',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй кеширование для API эндпоинта популярных статей с инвалидацией кеша.',
      requirements: [
        'GET /api/articles/popular/ возвращает 10 самых просматриваемых статей',
        'Результат кешируется в Redis на 1 час',
        'Ключ кеша: "popular_articles"',
        'При создании/обновлении любой статьи кеш инвалидируется',
        'Добавь логирование: "Кеш попадание" или "Кеш промах"'
      ],
      expectedOutput: 'Первый запрос: "Кеш промах" -> запрос к БД -> кешируем\nВторой запрос: "Кеш попадание" -> ответ из кеша\nПосле создания статьи: кеш сброшен',
      hint: 'В ViewSet переопредели perform_create и perform_update для инвалидации. Или используй сигналы post_save.',
      solution: 'import logging\nfrom django.core.cache import cache\nfrom rest_framework import viewsets\nfrom rest_framework.decorators import action\nfrom rest_framework.response import Response\nfrom .models import Article\nfrom .serializers import ArticleSerializer\n\nlogger = logging.getLogger(__name__)\nCACHE_KEY = "popular_articles"\nCACHE_TIMEOUT = 3600\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n    @action(detail=False, methods=["get"])\n    def popular(self, request):\n        cached = cache.get(CACHE_KEY)\n        if cached is not None:\n            logger.info("Кеш попадание")\n            return Response(cached)\n        logger.info("Кеш промах")\n        qs = Article.objects.order_by("-views_count")[:10]\n        data = ArticleSerializer(qs, many=True).data\n        cache.set(CACHE_KEY, data, timeout=CACHE_TIMEOUT)\n        return Response(data)\n\n    def perform_create(self, serializer):\n        serializer.save()\n        cache.delete(CACHE_KEY)\n\n    def perform_update(self, serializer):\n        serializer.save()\n        cache.delete(CACHE_KEY)',
      explanation: 'cache.get возвращает None при промахе — это надёжнее чем has_key+get (два обращения). perform_create/perform_update — правильные хуки для пост-обработки в ViewSet. Инвалидация при записи гарантирует свежесть данных.'
    }
  ]
}
