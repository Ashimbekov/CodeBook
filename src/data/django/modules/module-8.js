export default {
  id: 8,
  title: 'QuerySet: filter, exclude, annotate, aggregate',
  description: 'Работа с QuerySet в Django: фильтрация, исключение, аннотации, агрегации, сложные запросы с Q объектами и F выражениями',
  lessons: [
    {
      id: 1,
      title: 'filter() и основные lookups',
      type: 'theory',
      content: [
        { type: 'text', value: 'filter() фильтрует QuerySet по условиям. Условия задаются через lookups — специальные суффиксы через двойное подчёркивание: __exact, __contains, __gt, __in и другие.' },
        { type: 'code', language: 'python', value: 'from .models import Article, Product\n\n# Точное совпадение\nArticle.objects.filter(is_published=True)          # =\nArticle.objects.filter(author__id=1)                # по FK\nArticle.objects.filter(author__username="admin")    # через FK\n\n# Строковые lookups\nArticle.objects.filter(title__contains="Django")    # LIKE \'%Django%\'\nArticle.objects.filter(title__icontains="django")   # регистронезависимо\nArticle.objects.filter(title__startswith="Как")     # начинается с\nArticle.objects.filter(title__endswith="!")         # заканчивается\nArticle.objects.filter(slug__regex=r"^[a-z-]+$")   # регулярное выражение\n\n# Числовые lookups\nProduct.objects.filter(price__gt=1000)     # > 1000\nProduct.objects.filter(price__gte=1000)    # >= 1000\nProduct.objects.filter(price__lt=50000)    # < 50000\nProduct.objects.filter(price__lte=50000)   # <= 50000\nProduct.objects.filter(price__range=(100, 5000))  # BETWEEN\n\n# Списки\nProduct.objects.filter(id__in=[1, 2, 3])     # IN (1, 2, 3)\nProduct.objects.filter(status__in=["active", "featured"])\n\n# Проверки на NULL\nArticle.objects.filter(category__isnull=True)   # IS NULL\nArticle.objects.filter(category__isnull=False)  # IS NOT NULL\n\n# Дата/время\nfrom django.utils import timezone\ntoday = timezone.now().date()\nArticle.objects.filter(created_at__date=today)\nArticle.objects.filter(created_at__year=2024)\nArticle.objects.filter(created_at__month=1)' },
        { type: 'heading', value: 'Цепочка фильтров и get()' },
        { type: 'code', language: 'python', value: '# Цепочка фильтров — каждый добавляет условие AND\nresult = (\n    Article.objects\n    .filter(is_published=True)\n    .filter(created_at__year=2024)\n    .filter(author__is_active=True)\n)\n# Эквивалентно одному filter с тремя условиями\n\n# get() — получить ровно один объект\ntry:\n    article = Article.objects.get(pk=5)\nexcept Article.DoesNotExist:\n    article = None\nexcept Article.MultipleObjectsReturned:\n    # Этого не должно быть для pk, но возможно для других полей\n    article = Article.objects.filter(title="Заголовок").first()\n\n# Безопаснее через get_object_or_404 (в view):\nfrom django.shortcuts import get_object_or_404\narticle = get_object_or_404(Article, pk=5, is_published=True)\n# Автоматически возвращает 404 если не найдено\n\n# filter().first() — безопаснее чем get() если не уверен в уникальности\narticle = Article.objects.filter(slug="my-article").first()  # None если нет' },
        { type: 'tip', value: 'get() бросает исключение при отсутствии или дублировании записи. В view-функциях используй get_object_or_404() — он автоматически возвращает HTTP 404 вместо бросания исключения.' }
      ]
    },
    {
      id: 2,
      title: 'exclude(), order_by(), distinct()',
      type: 'theory',
      content: [
        { type: 'text', value: 'exclude() — обратный filter() (NOT). order_by() сортирует результаты. distinct() убирает дублирующиеся записи.' },
        { type: 'code', language: 'python', value: 'from .models import Article, Product\n\n# exclude() — исключить записи\nArticle.objects.exclude(is_published=False)  # = filter(is_published=True)\nProduct.objects.exclude(stock=0)              # только товары в наличии\nArticle.objects.exclude(author__is_staff=True)  # исключить статьи сотрудников\n\n# order_by() — сортировка\nArticle.objects.order_by("title")           # ASC\nArticle.objects.order_by("-created_at")     # DESC (минус = обратный)\nArticle.objects.order_by("category__name", "-created_at")  # по двум полям\nArticle.objects.order_by("?")              # СЛУЧАЙНЫЙ порядок\n\n# values() и values_list()\narticles = Article.objects.values("id", "title")  # только нужные поля\n# [{"id": 1, "title": "..."}, ...]\n\narticles = Article.objects.values_list("id", "title")  # кортежи\n# [(1, "..."), (2, "..."), ...]\n\ntitles = Article.objects.values_list("title", flat=True)  # плоский список\n# ["Заголовок 1", "Заголовок 2", ...]\n\n# distinct() — уникальные значения\ncategories = Article.objects.values("category__name").distinct()\n\n# Цепочка методов\nresult = (\n    Article.objects\n    .filter(is_published=True)\n    .exclude(author__username="banned")\n    .order_by("-created_at")\n    .distinct()\n)' },
        { type: 'heading', value: 'only() и defer() — частичная загрузка полей' },
        { type: 'code', language: 'python', value: '# only() — загрузить только указанные поля (остальные загружаются по требованию)\narticles = Article.objects.only("id", "title", "created_at")\nfor a in articles:\n    print(a.title)      # OK, поле загружено\n    print(a.content)    # OK, но вызывает дополнительный SQL запрос!\n\n# defer() — загрузить всё КРОМЕ указанных\narticles = Article.objects.defer("content", "body")  # пропустить тяжёлые поля\nfor a in articles:\n    print(a.title)      # OK, поле загружено\n    # a.content вызовет дополнительный SQL если обратиться\n\n# none() — пустой QuerySet\nempty = Article.objects.none()\nprint(empty.count())   # 0, без SQL запроса\nprint(bool(empty))     # False\n\n# Удаление сортировки\nunsorted = Article.objects.order_by()  # убирает Meta.ordering\n# Полезно перед aggregate() для корректных результатов' },
        { type: 'note', value: 'order_by("?") (случайный порядок) очень медленный на больших таблицах — PostgreSQL делает ORDER BY RANDOM() что требует полного сканирования. Для случайных записей лучше использовать .filter(id__in=random_ids).' }
      ]
    },
    {
      id: 3,
      title: 'Q объекты: сложные условия',
      type: 'theory',
      content: [
        { type: 'text', value: 'Q объекты позволяют строить сложные условия с операторами OR, AND, NOT. filter() с несколькими аргументами — это всегда AND.' },
        { type: 'code', language: 'python', value: 'from django.db.models import Q\nfrom .models import Article, Product\n\n# Обычный filter = AND\nArticle.objects.filter(is_published=True, author=user)  # AND\n\n# Q объекты: OR (|), AND (&), NOT (~)\nArticle.objects.filter(\n    Q(title__icontains="django") | Q(content__icontains="django")\n)\n\n# NOT\nArticle.objects.filter(~Q(is_published=False))\n\n# Сложные комбинации\nProduct.objects.filter(\n    Q(price__lt=1000) | Q(price__gt=50000),  # дешёвые или дорогие\n    is_active=True  # обязательно активные (AND)\n)\n\n# Динамическое построение условий\ndef search_products(query=None, min_price=None, max_price=None, in_stock=None):\n    filters = Q(is_active=True)  # базовое условие\n\n    if query:\n        filters &= Q(name__icontains=query) | Q(description__icontains=query)\n    if min_price is not None:\n        filters &= Q(price__gte=min_price)\n    if max_price is not None:\n        filters &= Q(price__lte=max_price)\n    if in_stock:\n        filters &= Q(stock__gt=0)\n\n    return Product.objects.filter(filters)' },
        { type: 'tip', value: 'Q(condition) & Q(condition) = AND. Q(condition) | Q(condition) = OR. ~Q(condition) = NOT. Можно динамически собирать условия: q = Q(); q &= Q(field=value).' }
      ]
    },
    {
      id: 4,
      title: 'aggregate(): агрегации',
      type: 'theory',
      content: [
        { type: 'text', value: 'aggregate() вычисляет агрегатные значения для всего QuerySet: сумму, среднее, минимум, максимум, количество. Возвращает словарь.' },
        { type: 'code', language: 'python', value: 'from django.db.models import Sum, Avg, Min, Max, Count\nfrom .models import Order, Product\n\n# Простые агрегации по всему queryset\nresult = Order.objects.aggregate(\n    total_revenue=Sum("total_price"),\n    avg_order=Avg("total_price"),\n    min_order=Min("total_price"),\n    max_order=Max("total_price"),\n    order_count=Count("id")\n)\nprint(result)\n# {"total_revenue": 1250000.0, "avg_order": 12500.0, ...}\n\n# Агрегация с фильтром\nfrom django.utils import timezone\nfrom datetime import timedelta\n\ntoday = timezone.now().date()\nyesterday = today - timedelta(days=1)\n\ntoday_stats = Order.objects.filter(\n    created_at__date=today\n).aggregate(\n    count=Count("id"),\n    revenue=Sum("total_price")\n)\n\n# Count с distinct\nunique_customers = Order.objects.aggregate(\n    unique_users=Count("user", distinct=True)\n)\n\n# Агрегация по связанным данным\nfrom .models import Article\narticle_stats = Article.objects.aggregate(\n    total_comments=Count("comments"),\n    avg_comments=Avg("comments"),\n)' },
        { type: 'heading', value: 'Условная агрегация с Case/When' },
        { type: 'code', language: 'python', value: 'from django.db.models import Count, Sum, Case, When, IntegerField, Value\nfrom .models import Order\n\n# Подсчёт по статусам в одном запросе\nstats = Order.objects.aggregate(\n    total=Count("id"),\n    pending=Count(Case(When(status="pending", then=Value(1)), output_field=IntegerField())),\n    completed=Count(Case(When(status="completed", then=Value(1)), output_field=IntegerField())),\n    cancelled=Count(Case(When(status="cancelled", then=Value(1)), output_field=IntegerField())),\n)\nprint(stats)\n# {"total": 100, "pending": 15, "completed": 75, "cancelled": 10}\n\n# Сумма только для определённых записей\nrevenue = Order.objects.aggregate(\n    total=Sum("total_price"),\n    completed_revenue=Sum(\n        Case(\n            When(status="completed", then="total_price"),\n            output_field=DecimalField()\n        )\n    )\n)' },
        { type: 'tip', value: 'aggregate() возвращает словарь Python, не QuerySet. Если нет записей, Sum() вернёт None, а не 0. Защищайся: result["total_revenue"] or 0.' }
      ]
    },
    {
      id: 5,
      title: 'annotate(): аннотации',
      type: 'theory',
      content: [
        { type: 'text', value: 'annotate() добавляет вычисляемое поле к каждому объекту QuerySet. В отличие от aggregate() — не схлопывает в одно значение, а добавляет к каждой записи.' },
        { type: 'code', language: 'python', value: 'from django.db.models import Count, Avg, Sum, F, ExpressionWrapper, DecimalField\nfrom .models import Category, Article, Product\n\n# Добавить количество статей к каждой категории\ncategories = Category.objects.annotate(\n    article_count=Count("articles")\n).order_by("-article_count")\n\nfor cat in categories:\n    print(f"{cat.name}: {cat.article_count} статей")\n\n# Несколько аннотаций\nproducts = Product.objects.annotate(\n    order_count=Count("orderitems"),\n    total_sold=Sum("orderitems__quantity"),\n).filter(order_count__gt=0).order_by("-total_sold")\n\n# F выражения — ссылка на другое поле\n# Товары где цена выросла (price > original_price)\nproducts = Product.objects.filter(price__gt=F("original_price"))\n\n# Вычисляемое поле через F\nproducts = Product.objects.annotate(\n    profit=ExpressionWrapper(\n        F("price") - F("cost_price"),\n        output_field=DecimalField()\n    )\n).filter(profit__gt=0).order_by("-profit")' },
        { type: 'note', value: 'annotate() + order_by() на аннотированном поле работает корректно. filter() ПОСЛЕ annotate() фильтрует по аннотированному значению. filter() ДО annotate() фильтрует исходные данные перед агрегацией.' }
      ]
    },
    {
      id: 6,
      title: 'Оптимизация QuerySet',
      type: 'theory',
      content: [
        { type: 'text', value: 'QuerySet ленивый — запрос выполняется только при обращении к данным. Понимание этого помогает оптимизировать код.' },
        { type: 'code', language: 'python', value: 'from .models import Article\n\n# QuerySet ЛЕНИВЫЙ — SQL ещё не выполнен!\nqs = Article.objects.filter(is_published=True)\nqs = qs.order_by("-created_at")\nqs = qs.select_related("author")\n# SQL выполнится ТОЛЬКО здесь:\nfor article in qs:  # итерация\n    ...\n\n# Полезные методы БЕЗ загрузки данных:\nexists = qs.exists()  # быстрее чем .count() > 0\ncount = qs.count()    # SELECT COUNT(*)\n\n# Получение первого/последнего\nfirst = qs.first()    # + ORDER BY + LIMIT 1\nlast = qs.last()      # + ORDER BY DESC + LIMIT 1\n\n# Слайсинг = LIMIT/OFFSET\nfive = qs[:5]         # LIMIT 5\npage2 = qs[10:20]     # OFFSET 10 LIMIT 10\n\n# КЭШИРОВАНИЕ QuerySet\narticles = list(qs)   # выполняет запрос и кэширует\ncount1 = len(articles)  # без запроса!\ncount2 = len(articles)  # без запроса!\n\n# Наоборот — двойной запрос:\nif qs.exists():         # первый запрос\n    for a in qs:        # второй запрос\n        ...\n# Лучше:\narticles = list(qs)     # один запрос\nif articles:\n    for a in articles: ...' },
        { type: 'tip', value: 'exists() намного быстрее чем count() > 0 или bool(queryset). Django генерирует SELECT 1 WHERE ... LIMIT 1 — прекращает поиск при первом совпадении.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Аналитика магазина',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши функции аналитики для интернет-магазина используя filter, annotate и aggregate.',
      requirements: [
        'get_revenue_by_category() — выручка по каждой категории',
        'get_top_products(limit=10) — топ продаж по количеству заказов',
        'get_customer_stats() — статистика по пользователям: кол-во заказов, сумма трат',
        'get_low_stock_products() — товары с остатком <= 5',
        'get_daily_revenue(days=30) — выручка по дням за N дней',
        'search_orders(query=None, min_total=None, status=None) — поиск через Q'
      ],
      expectedOutput: 'get_revenue_by_category() -> [{"category__name": "Электроника", "total": 500000}, ...]\nget_top_products(5) -> 5 товаров отсортированных по sold_count\nget_daily_revenue(7) -> 7 записей с date и revenue',
      hint: 'annotate(total=Sum("orderitems__price")) для категорий. values("category__name").annotate() группирует по категории. TruncDay из django.db.models.functions для группировки по дням.',
      solution: 'from django.db.models import Sum, Count, Avg, F, Q\nfrom django.db.models.functions import TruncDay\nfrom django.utils import timezone\nfrom datetime import timedelta\nfrom .models import Product, Order, Category\n\ndef get_revenue_by_category():\n    return (\n        Product.objects\n        .values("category__name")\n        .annotate(total=Sum(F("order_items__price") * F("order_items__quantity")))\n        .filter(total__isnull=False)\n        .order_by("-total")\n    )\n\ndef get_top_products(limit=10):\n    return (\n        Product.objects\n        .annotate(\n            sold_count=Count("order_items"),\n            total_revenue=Sum(F("order_items__price") * F("order_items__quantity"))\n        )\n        .filter(sold_count__gt=0)\n        .order_by("-sold_count")[:limit]\n    )\n\ndef get_customer_stats():\n    return (\n        Order.objects\n        .values("user__username", "user__email")\n        .annotate(\n            order_count=Count("id"),\n            total_spent=Sum("total_price"),\n            avg_order=Avg("total_price")\n        )\n        .order_by("-total_spent")\n    )\n\ndef get_low_stock_products(threshold=5):\n    return Product.objects.filter(\n        stock__lte=threshold,\n        is_active=True\n    ).order_by("stock")\n\ndef get_daily_revenue(days=30):\n    start_date = timezone.now() - timedelta(days=days)\n    return (\n        Order.objects\n        .filter(created_at__gte=start_date)\n        .annotate(day=TruncDay("created_at"))\n        .values("day")\n        .annotate(revenue=Sum("total_price"), count=Count("id"))\n        .order_by("day")\n    )\n\ndef search_orders(query=None, min_total=None, status=None):\n    filters = Q()\n    if query:\n        filters &= (\n            Q(user__username__icontains=query) |\n            Q(user__email__icontains=query)\n        )\n    if min_total is not None:\n        filters &= Q(total_price__gte=min_total)\n    if status:\n        filters &= Q(status=status)\n    return Order.objects.filter(filters).select_related("user").order_by("-created_at")',
      explanation: 'values().annotate() группирует как SQL GROUP BY. TruncDay() усекает datetime до дня — группировка по дням. F() выражения в annotate позволяют вычислять revenue = price * quantity прямо в SQL. Динамический Q объект: начинаем с пустым Q() и добавляем условия через &=. select_related("user") в search_orders оптимизирует запросы к связанным пользователям.'
    },
    {
      id: 8,
      title: 'Практика: Сложные запросы',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй сложные запросы с subquery, условными аннотациями и оптимизацией.',
      requirements: [
        'Найди пользователей у которых нет ни одного заказа (left outer join через ~Q)',
        'Продукты купленные вместе с данным (часто покупают вместе)',
        'Средняя оценка продуктов с количеством отзывов (annotate)',
        'Пользователи с самой большой тратой за последний месяц',
        'Категории с товарами стоимостью выше средней по категории'
      ],
      expectedOutput: 'users_without_orders.count() == кол-во пользователей без заказов\nfrequently_bought_together(product_id=1) -> список продуктов',
      hint: 'Для пользователей без заказов: User.objects.filter(orders__isnull=True). Для "часто вместе": OrderItem фильтруй по заказам где есть данный продукт. Avg() с filter() параметром для условной агрегации.',
      solution: 'from django.contrib.auth.models import User\nfrom django.db.models import Avg, Count, Sum, Q, Subquery, OuterRef\nfrom django.utils import timezone\nfrom datetime import timedelta\nfrom .models import Product, Order, OrderItem, Review\n\n# 1. Пользователи без заказов\ndef get_users_without_orders():\n    return User.objects.filter(orders__isnull=True)\n\n# 2. Продукты, которые часто покупают вместе\ndef frequently_bought_together(product_id, limit=5):\n    # Находим все заказы с этим продуктом\n    orders_with_product = OrderItem.objects.filter(\n        product_id=product_id\n    ).values_list("order_id", flat=True)\n\n    # Находим другие продукты в тех же заказах\n    return (\n        Product.objects\n        .filter(order_items__order_id__in=orders_with_product)\n        .exclude(id=product_id)\n        .annotate(co_purchase_count=Count("order_items__order", distinct=True))\n        .order_by("-co_purchase_count")[:limit]\n    )\n\n# 3. Средняя оценка продуктов\ndef products_with_ratings():\n    return (\n        Product.objects\n        .annotate(\n            avg_rating=Avg("reviews__rating"),\n            review_count=Count("reviews")\n        )\n        .filter(review_count__gt=0)\n        .order_by("-avg_rating")\n    )\n\n# 4. Лучшие покупатели за месяц\ndef top_customers_this_month(limit=10):\n    month_ago = timezone.now() - timedelta(days=30)\n    return (\n        User.objects\n        .filter(orders__created_at__gte=month_ago)\n        .annotate(monthly_spend=Sum("orders__total_price"))\n        .order_by("-monthly_spend")[:limit]\n    )',
      explanation: 'filter(orders__isnull=True) — LEFT JOIN с проверкой на NULL — находит пользователей без связанных заказов. Для "часто вместе" сначала находим ID заказов с нужным товаром, потом ищем другие товары в этих заказах. distinct=True в Count нужен при JOIN-ах чтобы не считать дубликаты. Цепочка filter().annotate().order_by() позволяет строить сложную аналитику.'
    }
  ]
}
