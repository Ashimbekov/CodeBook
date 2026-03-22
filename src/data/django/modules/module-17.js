export default {
  id: 17,
  title: 'DRF: ViewSets и Routers',
  description: 'ViewSet, ModelViewSet, DefaultRouter — сокращаем код CRUD API до минимума.',
  lessons: [
    {
      id: 1,
      title: 'Что такое ViewSet',
      type: 'theory',
      content: [
        { type: 'text', value: 'ViewSet — это класс, который объединяет несколько связанных представлений в одном месте. Вместо нескольких APIView для list/create/retrieve/update/delete, ты пишешь один ViewSet.' },
        { type: 'tip', value: 'ViewSet как конструктор LEGO: берёшь нужные "кубики" (list, create, retrieve, update, destroy) и получаешь готовый CRUD. Не нужно писать каждый view отдельно.' },
        { type: 'code', language: 'python', value: 'from rest_framework import viewsets\nfrom rest_framework.response import Response\n\nclass ArticleViewSet(viewsets.ViewSet):\n    def list(self, request):\n        """GET /articles/"""\n        queryset = Article.objects.all()\n        serializer = ArticleSerializer(queryset, many=True)\n        return Response(serializer.data)\n\n    def retrieve(self, request, pk=None):\n        """GET /articles/{pk}/"""\n        article = get_object_or_404(Article, pk=pk)\n        serializer = ArticleSerializer(article)\n        return Response(serializer.data)' },
        { type: 'note', value: 'ViewSet использует имена методов (list, retrieve, create, update, destroy) вместо HTTP-методов (get, post, put, delete). Router автоматически связывает их с URL и HTTP-методами.' }
      ]
    },
    {
      id: 2,
      title: 'ModelViewSet — CRUD за 5 строк',
      type: 'theory',
      content: [
        { type: 'text', value: 'ModelViewSet автоматически реализует все CRUD операции на основе модели и сериализатора. Это самый мощный и компактный способ создания API.' },
        { type: 'code', language: 'python', value: 'from rest_framework import viewsets\nfrom .models import Article\nfrom .serializers import ArticleSerializer\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n# Это даёт автоматически:\n# GET    /articles/        -> list\n# POST   /articles/        -> create\n# GET    /articles/{pk}/   -> retrieve\n# PUT    /articles/{pk}/   -> update\n# PATCH  /articles/{pk}/   -> partial_update\n# DELETE /articles/{pk}/   -> destroy' },
        { type: 'heading', value: 'Ограниченные ViewSet' },
        { type: 'code', language: 'python', value: 'from rest_framework.mixins import ListModelMixin, CreateModelMixin\nfrom rest_framework.viewsets import GenericViewSet\n\n# Только чтение (list + retrieve)\nclass ArticleReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n# Только создание и список\nclass ArticleCreateListViewSet(CreateModelMixin, ListModelMixin, GenericViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer' }
      ]
    },
    {
      id: 3,
      title: 'DefaultRouter — автоматическая маршрутизация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Router автоматически генерирует URL patterns для ViewSet. Не нужно вручную прописывать каждый маршрут.' },
        { type: 'code', language: 'python', value: '# urls.py\nfrom django.urls import path, include\nfrom rest_framework.routers import DefaultRouter\nfrom .views import ArticleViewSet, CommentViewSet\n\nrouter = DefaultRouter()\nrouter.register("articles", ArticleViewSet, basename="article")\nrouter.register("comments", CommentViewSet, basename="comment")\n\nurlpatterns = [\n    path("api/", include(router.urls)),\n]\n\n# DefaultRouter создаёт:\n# /api/articles/\n# /api/articles/{pk}/\n# /api/comments/\n# /api/comments/{pk}/\n# /api/  (корневой URL со списком эндпоинтов)' },
        { type: 'tip', value: 'SimpleRouter делает то же самое, но без корневого URL /api/. DefaultRouter добавляет его для удобства документации.' }
      ]
    },
    {
      id: 4,
      title: 'Кастомизация ViewSet: get_queryset и get_serializer_class',
      type: 'theory',
      content: [
        { type: 'text', value: 'ViewSet можно гибко настраивать: использовать разные сериализаторы для разных действий, фильтровать queryset по пользователю и т.д.' },
        { type: 'code', language: 'python', value: 'class ArticleViewSet(viewsets.ModelViewSet):\n    serializer_class = ArticleSerializer\n\n    def get_queryset(self):\n        """Только опубликованные статьи для анонимов"""\n        qs = Article.objects.all()\n        if not self.request.user.is_authenticated:\n            qs = qs.filter(is_published=True)\n        return qs\n\n    def get_serializer_class(self):\n        """Разные сериализаторы для list и detail"""\n        if self.action == "list":\n            return ArticleListSerializer  # облегчённый\n        return ArticleDetailSerializer   # полный\n\n    def perform_create(self, serializer):\n        """Автоматически устанавливаем автора"""\n        serializer.save(author=self.request.user)' },
        { type: 'note', value: 'self.action в ViewSet содержит текущее действие: "list", "create", "retrieve", "update", "partial_update", "destroy" или имя кастомного action.' }
      ]
    },
    {
      id: 5,
      title: 'Кастомные actions с @action',
      type: 'theory',
      content: [
        { type: 'text', value: 'Декоратор @action позволяет добавить нестандартные эндпоинты к ViewSet, например опубликование статьи или лайк.' },
        { type: 'code', language: 'python', value: 'from rest_framework.decorators import action\nfrom rest_framework.response import Response\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n    @action(detail=True, methods=["post"])\n    def publish(self, request, pk=None):\n        """POST /articles/{pk}/publish/"""\n        article = self.get_object()\n        article.is_published = True\n        article.save()\n        return Response({"status": "опубликовано"})\n\n    @action(detail=False, methods=["get"])\n    def popular(self, request):\n        """GET /articles/popular/"""\n        popular = self.get_queryset().order_by("-views_count")[:10]\n        serializer = self.get_serializer(popular, many=True)\n        return Response(serializer.data)' },
        { type: 'tip', value: 'detail=True означает, что action применяется к конкретному объекту (URL содержит pk). detail=False — к коллекции.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: ModelViewSet для Task API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай полный CRUD API для задач (Task) с использованием ModelViewSet и DefaultRouter.',
      requirements: [
        'Модель Task: title, description, completed, created_at, owner (FK User)',
        'TaskSerializer с полями id, title, description, completed, owner_name, created_at',
        'TaskViewSet: ModelViewSet, get_queryset фильтрует по текущему пользователю',
        'perform_create устанавливает owner=request.user',
        'Кастомный action complete: POST /tasks/{pk}/complete/ устанавливает completed=True',
        'Router регистрирует ViewSet на /api/tasks/'
      ],
      expectedOutput: 'POST /api/tasks/ -> 201 Created\nPOST /api/tasks/1/complete/ -> {"status": "выполнено"}\nGET /api/tasks/ -> список только задач текущего пользователя',
      hint: 'В get_queryset используй self.request.user. Для action complete: detail=True, methods=["post"].',
      solution: 'from rest_framework import viewsets\nfrom rest_framework.decorators import action\nfrom rest_framework.response import Response\nfrom .models import Task\nfrom .serializers import TaskSerializer\n\nclass TaskViewSet(viewsets.ModelViewSet):\n    serializer_class = TaskSerializer\n\n    def get_queryset(self):\n        return Task.objects.filter(owner=self.request.user)\n\n    def perform_create(self, serializer):\n        serializer.save(owner=self.request.user)\n\n    @action(detail=True, methods=["post"])\n    def complete(self, request, pk=None):\n        task = self.get_object()\n        task.completed = True\n        task.save()\n        return Response({"status": "выполнено"})\n\n# urls.py\nfrom rest_framework.routers import DefaultRouter\nrouter = DefaultRouter()\nrouter.register("tasks", TaskViewSet, basename="task")',
      explanation: 'ModelViewSet + DefaultRouter дают полный CRUD за минимум кода. get_queryset изолирует данные пользователей. perform_create — хук для добавления данных из request при создании.'
    },
    {
      id: 7,
      title: 'Практика: ReadOnlyViewSet и вложенные роутеры',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай API для категорий (Category) только для чтения и кастомный action для статистики.',
      requirements: [
        'CategoryViewSet использует ReadOnlyModelViewSet',
        'Кастомный action stats возвращает количество статей в категории',
        'GET /categories/ -> список категорий',
        'GET /categories/{pk}/stats/ -> {"name": "Python", "articles_count": 42}',
        'Зарегистрировать в DefaultRouter'
      ],
      expectedOutput: 'GET /api/categories/ -> [{"id": 1, "name": "Python"}]\nGET /api/categories/1/stats/ -> {"name": "Python", "articles_count": 42}',
      hint: 'ReadOnlyModelViewSet автоматически предоставляет list и retrieve. Для stats используй @action(detail=True, methods=["get"]).',
      solution: 'from rest_framework import viewsets\nfrom rest_framework.decorators import action\nfrom rest_framework.response import Response\nfrom .models import Category\nfrom .serializers import CategorySerializer\n\nclass CategoryViewSet(viewsets.ReadOnlyModelViewSet):\n    queryset = Category.objects.all()\n    serializer_class = CategorySerializer\n\n    @action(detail=True, methods=["get"])\n    def stats(self, request, pk=None):\n        category = self.get_object()\n        count = category.articles.count()\n        return Response({"name": category.name, "articles_count": count})',
      explanation: 'ReadOnlyModelViewSet предоставляет только безопасные методы GET. Это идеально для справочных данных, которые нельзя изменять через API.'
    }
  ]
}
