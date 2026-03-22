export default {
  id: 7,
  title: 'Связи между моделями',
  description: 'ForeignKey, ManyToManyField и OneToOneField в Django: типы связей, on_delete, related_name, select_related и prefetch_related',
  lessons: [
    {
      id: 1,
      title: 'ForeignKey: один ко многим',
      type: 'theory',
      content: [
        { type: 'text', value: 'ForeignKey создаёт связь "один ко многим": один автор — много статей, одна категория — много товаров. В базе данных создаётся внешний ключ.' },
        { type: 'code', language: 'python', value: 'from django.db import models\nfrom django.contrib.auth.models import User\n\nclass Category(models.Model):\n    name = models.CharField(max_length=100)\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    # ForeignKey: у статьи ОДИН автор, у автора МНОГО статей\n    author = models.ForeignKey(\n        User,\n        on_delete=models.CASCADE,    # удалить статьи при удалении автора\n        related_name="articles"      # user.articles.all()\n    )\n    category = models.ForeignKey(\n        Category,\n        on_delete=models.SET_NULL,   # обнулить при удалении категории\n        null=True,\n        blank=True,\n        related_name="articles"\n    )\n\n# Варианты on_delete:\n# CASCADE    -- удалить связанные объекты\n# SET_NULL   -- установить NULL (нужен null=True)\n# SET_DEFAULT -- установить default\n# PROTECT    -- запретить удаление если есть связанные\n# RESTRICT   -- похоже на PROTECT, но умнее\n# DO_NOTHING -- ничего не делать (ОПАСНО!)\n\n# Использование:\narticle = Article.objects.get(pk=1)\nprint(article.author.username)  # доступ к автору\n\nuser = User.objects.get(pk=1)\nprint(user.articles.count())  # все статьи автора (related_name)' },
        { type: 'tip', value: 'related_name задаёт имя обратной связи. По умолчанию Django генерирует имя как model_set (article_set), но лучше задавать явно — так код более читаем.' }
      ]
    },
    {
      id: 2,
      title: 'ManyToManyField: многие ко многим',
      type: 'theory',
      content: [
        { type: 'text', value: 'ManyToManyField создаёт связь "многие ко многим": статья может иметь много тегов, тег — много статей. Django автоматически создаёт промежуточную таблицу.' },
        { type: 'code', language: 'python', value: 'from django.db import models\n\nclass Tag(models.Model):\n    name = models.CharField(max_length=50, unique=True)\n    slug = models.SlugField(unique=True)\n\n    def __str__(self):\n        return self.name\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    # ManyToMany: статья МНОГО тегов, тег МНОГО статей\n    tags = models.ManyToManyField(\n        Tag,\n        blank=True,              # статья может быть без тегов\n        related_name="articles"  # tag.articles.all()\n    )\n\n# Операции с M2M:\narticle = Article.objects.get(pk=1)\ntag_django = Tag.objects.get(name="Django")\ntag_python = Tag.objects.get(name="Python")\n\n# Добавление\narticle.tags.add(tag_django, tag_python)\n\n# Установка (заменяет все)\narticle.tags.set([tag_django])\n\n# Удаление\narticle.tags.remove(tag_python)\n\n# Очистка всех\narticle.tags.clear()\n\n# Запрос\nprint(article.tags.all())  # все теги статьи\nprint(tag_django.articles.all())  # все статьи с тегом Django' },
        { type: 'heading', value: 'Фильтрация через M2M связи' },
        { type: 'code', language: 'python', value: '# Найти все статьи с тегом "django"\narticles = Article.objects.filter(tags__name="django")\n\n# Найти статьи с ХОТЯ БЫ ОДНИМ из тегов (OR)\narticles = Article.objects.filter(tags__name__in=["django", "python"]).distinct()\n# distinct() важен! Без него статья с двумя тегами появится дважды\n\n# Найти статьи у которых есть тег "django" И "python" (AND)\narticles = Article.objects.filter(\n    tags__name="django"\n).filter(\n    tags__name="python"\n)\n# Каждый .filter() — отдельный JOIN\n\n# Найти статьи БЕЗ тегов\narticles_no_tags = Article.objects.filter(tags__isnull=True)\n\n# Считать количество тегов у каждой статьи\nfrom django.db.models import Count\narticles = Article.objects.annotate(tag_count=Count("tags"))\nfor a in articles:\n    print(f"{a.title}: {a.tag_count} тегов")' },
        { type: 'tip', value: 'При фильтрации по M2M полям добавляй .distinct() если может быть несколько совпадений — иначе получишь дублирующиеся результаты.' }
      ]
    },
    {
      id: 3,
      title: 'ManyToMany через промежуточную модель',
      type: 'theory',
      content: [
        { type: 'text', value: 'Если M2M связи нужны дополнительные поля (дата подписки, роль в команде), используй промежуточную модель через through.' },
        { type: 'code', language: 'python', value: 'from django.db import models\nfrom django.contrib.auth.models import User\n\nclass Team(models.Model):\n    name = models.CharField(max_length=100)\n    # M2M через промежуточную модель\n    members = models.ManyToManyField(\n        User,\n        through="TeamMembership",\n        related_name="teams"\n    )\n\nclass TeamMembership(models.Model):\n    """Промежуточная модель с дополнительными полями"""\n    ROLE_CHOICES = [\n        ("member", "Участник"),\n        ("admin", "Администратор"),\n        ("owner", "Владелец"),\n    ]\n    user = models.ForeignKey(User, on_delete=models.CASCADE)\n    team = models.ForeignKey(Team, on_delete=models.CASCADE)\n    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="member")\n    joined_at = models.DateTimeField(auto_now_add=True)\n\n    class Meta:\n        unique_together = ("user", "team")  # пользователь в команде 1 раз\n\n# Работа с промежуточной моделью:\nteam = Team.objects.get(pk=1)\nuser = User.objects.get(pk=1)\n\n# Нельзя team.members.add() — нужно создавать TeamMembership\nTeamMembership.objects.create(user=user, team=team, role="admin")\n\n# Читать через обратную связь\nmemberships = team.teammembership_set.filter(role="admin")' },
        { type: 'heading', value: 'Запросы через промежуточную модель' },
        { type: 'code', language: 'python', value: '# Найти все команды пользователя с его ролью\nuser = User.objects.get(pk=1)\nmemberships = TeamMembership.objects.filter(\n    user=user\n).select_related("team")\n\nfor m in memberships:\n    print(f"Команда: {m.team.name}, Роль: {m.get_role_display()}, С {m.joined_at.date()}")\n\n# Найти всех администраторов команды\nteam = Team.objects.get(pk=1)\nadmins = TeamMembership.objects.filter(\n    team=team,\n    role="admin"\n).select_related("user")\nprint([m.user.username for m in admins])\n\n# Фильтрация через промежуточную модель:\n# Найти пользователей которые вступили в команду после определённой даты\nfrom django.utils import timezone\nrecent_members = User.objects.filter(\n    teammembership__team=team,\n    teammembership__joined_at__gte=timezone.now() - timezone.timedelta(days=30)\n)' },
        { type: 'note', value: 'При использовании through модели нельзя использовать team.members.add(user) — Django выдаст ошибку, так как не знает какие дополнительные поля установить. Нужно явно создавать экземпляр промежуточной модели через TeamMembership.objects.create().' }
      ]
    },
    {
      id: 4,
      title: 'OneToOneField: один к одному',
      type: 'theory',
      content: [
        { type: 'text', value: 'OneToOneField — связь "один к одному". Используется для расширения существующих моделей без изменения их кода. Классический пример — профиль пользователя.' },
        { type: 'code', language: 'python', value: 'from django.db import models\nfrom django.contrib.auth.models import User\nfrom django.db.models.signals import post_save\nfrom django.dispatch import receiver\n\nclass UserProfile(models.Model):\n    """Расширение встроенной модели User"""\n    user = models.OneToOneField(\n        User,\n        on_delete=models.CASCADE,\n        related_name="profile"\n    )\n    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)\n    bio = models.TextField(blank=True)\n    phone = models.CharField(max_length=20, blank=True)\n    city = models.CharField(max_length=100, blank=True)\n    birth_date = models.DateField(null=True, blank=True)\n\n    def __str__(self):\n        return f"Профиль {self.user.username}"\n\n# Автоматическое создание профиля при создании пользователя\n@receiver(post_save, sender=User)\ndef create_user_profile(sender, instance, created, **kwargs):\n    if created:\n        UserProfile.objects.create(user=instance)\n\n# Доступ:\nuser = User.objects.get(pk=1)\nprint(user.profile.bio)       # через related_name\nprint(user.profile.city)\n\nprofile = UserProfile.objects.get(user=user)\nprint(profile.user.username)  # обратно к пользователю' },
        { type: 'note', value: 'Сигнал post_save автоматически создаёт профиль при каждом новом User. Это удобно, но не злоупотребляй сигналами — они делают код трудно отслеживаемым.' }
      ]
    },
    {
      id: 5,
      title: 'select_related и prefetch_related',
      type: 'theory',
      content: [
        { type: 'text', value: 'select_related и prefetch_related решают проблему N+1 запросов. N+1 — это когда для 10 статей делается 10 отдельных запросов для авторов.' },
        { type: 'code', language: 'python', value: 'from .models import Article\n\n# ПРОБЛЕМА N+1:\narticles = Article.objects.all()  # 1 запрос\nfor article in articles:\n    print(article.author.username)  # N запросов! (по одному для каждой статьи)\n\n# РЕШЕНИЕ 1: select_related (JOIN)\n# Для ForeignKey и OneToOne (один связанный объект)\narticles = Article.objects.select_related("author", "category").all()\n# Один запрос с JOIN:\n# SELECT * FROM article JOIN user ON ... JOIN category ON ...\nfor article in articles:\n    print(article.author.username)  # БЕЗ дополнительных запросов!\n\n# РЕШЕНИЕ 2: prefetch_related\n# Для ManyToMany и обратных ForeignKey (много объектов)\narticles = Article.objects.prefetch_related("tags").all()\n# Два запроса: один для статей, один для всех тегов\nfor article in articles:\n    print(article.tags.all())  # БЕЗ дополнительных запросов!\n\n# Комбинация:\narticles = Article.objects.select_related("author").prefetch_related("tags", "comments").all()' },
        { type: 'tip', value: 'select_related — для FK/O2O (один объект, JOIN). prefetch_related — для M2M и обратных FK (много объектов, отдельный запрос). Всегда проверяй количество запросов через Django Debug Toolbar.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Связи в блоге',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай модели для блога со всеми типами связей.',
      requirements: [
        'Category (ForeignKey в Article)',
        'Article с ForeignKey на User и Category, ManyToMany с Tag',
        'Comment с ForeignKey на Article и User',
        'UserProfile с OneToOneField на User',
        'View article_list использует select_related("author", "category")',
        'View article_detail использует prefetch_related("tags", "comments")'
      ],
      expectedOutput: 'Article.objects.select_related("author", "category") -- 1 запрос вместо N\nArticle.objects.prefetch_related("tags") -- 2 запроса вместо N+1',
      hint: 'В article_list используй queryset.select_related() для полей FK. В article_detail prefetch_related для M2M. Для комментариев с авторами: prefetch_related(Prefetch("comments", queryset=Comment.objects.select_related("author"))).',
      solution: '# blog/models.py\nfrom django.db import models\nfrom django.contrib.auth.models import User\n\nclass Category(models.Model):\n    name = models.CharField(max_length=100)\n    slug = models.SlugField(unique=True)\n    def __str__(self): return self.name\n\nclass Tag(models.Model):\n    name = models.CharField(max_length=50, unique=True)\n    def __str__(self): return self.name\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    content = models.TextField()\n    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="articles")\n    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="articles")\n    tags = models.ManyToManyField(Tag, blank=True, related_name="articles")\n    created_at = models.DateTimeField(auto_now_add=True)\n    class Meta: ordering = ["-created_at"]\n\nclass Comment(models.Model):\n    article = models.ForeignKey(Article, on_delete=models.CASCADE, related_name="comments")\n    author = models.ForeignKey(User, on_delete=models.CASCADE)\n    text = models.TextField()\n    created_at = models.DateTimeField(auto_now_add=True)\n\nclass UserProfile(models.Model):\n    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")\n    bio = models.TextField(blank=True)\n    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)\n\n# blog/views.py\nfrom django.shortcuts import render, get_object_or_404\nfrom .models import Article\n\ndef article_list(request):\n    articles = Article.objects.select_related("author", "category").all()\n    return render(request, "blog/list.html", {"articles": articles})\n\ndef article_detail(request, pk):\n    article = get_object_or_404(\n        Article.objects.select_related("author", "category")\n                       .prefetch_related("tags", "comments__author"),\n        pk=pk\n    )\n    return render(request, "blog/detail.html", {"article": article})',
      explanation: 'select_related("author", "category") делает JOIN в одном запросе. prefetch_related("tags") делает два запроса: один для статей, один для всех тегов сразу (без N+1). comments__author использует двойное подчёркивание для вложенного prefetch — загружает авторов комментариев тоже. get_object_or_404 с цепочкой queryset методов — можно передавать сложный queryset.'
    },
    {
      id: 7,
      title: 'Практика: Система тегов',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай систему тегов для статей с подсчётом использования и поиском похожих статей.',
      requirements: [
        'Модели Article и Tag с ManyToMany',
        'View add_tags(article_id, tag_names) добавляет/создаёт теги',
        'View get_related_articles(article_id) — статьи с общими тегами (не включая текущую)',
        'Аннотация Tag с количеством статей через Count',
        'TOP-5 самых популярных тегов',
        'Статьи сортируются по количеству общих тегов с текущей'
      ],
      expectedOutput: 'related = get_related_articles(article_id=1)\n# Статьи отсортированы: больше общих тегов = выше\nTag.objects.annotate(Count("articles")).order_by("-articles__count")[:5]',
      hint: 'get_or_create для создания тегов по имени. Для похожих статей: фильтруй Article.objects.filter(tags__in=current_article.tags.all()).exclude(pk=article.pk). annotate(Count("id")) для подсчёта.',
      solution: 'from django.db import models\nfrom django.db.models import Count, Q\nfrom django.shortcuts import get_object_or_404\n\nclass Tag(models.Model):\n    name = models.CharField(max_length=50, unique=True)\n    slug = models.SlugField(unique=True)\n    def __str__(self): return self.name\n\nclass Article(models.Model):\n    title = models.CharField(max_length=200)\n    content = models.TextField()\n    tags = models.ManyToManyField(Tag, blank=True, related_name="articles")\n    published = models.BooleanField(default=True)\n\n# Функции для работы с тегами:\ndef add_tags_to_article(article, tag_names):\n    """Добавляет теги к статье, создавая новые если нужно"""\n    tags = []\n    for name in tag_names:\n        tag, _ = Tag.objects.get_or_create(\n            name=name.strip().lower(),\n            defaults={"slug": name.strip().lower().replace(" ", "-")}\n        )\n        tags.append(tag)\n    article.tags.add(*tags)\n    return tags\n\ndef get_related_articles(article, limit=5):\n    """Похожие статьи по тегам, отсортированные по количеству совпадений"""\n    article_tags = article.tags.all()\n    return (\n        Article.objects\n        .filter(tags__in=article_tags, published=True)\n        .exclude(pk=article.pk)\n        .annotate(common_tags=Count("tags"))\n        .order_by("-common_tags")[:limit]\n    )\n\ndef get_popular_tags(limit=5):\n    """Топ тегов по количеству статей"""\n    return (\n        Tag.objects\n        .annotate(article_count=Count("articles"))\n        .filter(article_count__gt=0)\n        .order_by("-article_count")[:limit]\n    )',
      explanation: 'get_or_create() создаёт тег только если его нет — идемпотентная операция. article.tags.add(*tags) добавляет несколько тегов одним вызовом. filter(tags__in=article_tags) находит статьи хотя бы с одним общим тегом. annotate(common_tags=Count("tags")) считает сколько тегов совпало. exclude(pk=article.pk) убирает текущую статью из результатов.'
    }
  ]
}
