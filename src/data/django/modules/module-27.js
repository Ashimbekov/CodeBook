export default {
  id: 27,
  title: 'Практикум: REST API',
  description: 'Практические задачи по построению полноценного REST API с DRF: сериализаторы, аутентификация, тесты.',
  lessons: [
    {
      id: 1,
      title: 'Задача: Модели для Task Manager API',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай модели для API менеджера задач с проектами, задачами и исполнителями.',
      requirements: [
        'Project: name, description, owner (FK User), members (M2M User, related_name="projects"), created_at',
        'Task: title, description, project (FK Project), assignee (FK User, null=True), status (choices: todo/in_progress/done), priority (choices: low/medium/high), due_date (DateField, null=True), created_at',
        'Comment: task (FK Task), author (FK User), text, created_at',
        'Все модели с __str__ и Meta ordering'
      ],
      expectedOutput: 'Task.objects.filter(project=project, status="in_progress").count()\nProject.objects.filter(members=user)',
      hint: 'status и priority используй через choices. Task.Meta: ordering = ["-priority", "due_date"].',
      solution: 'from django.db import models\nfrom django.contrib.auth.models import User\n\nclass Project(models.Model):\n    name = models.CharField(max_length=200)\n    description = models.TextField(blank=True)\n    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name="owned_projects")\n    members = models.ManyToManyField(User, blank=True, related_name="projects")\n    created_at = models.DateTimeField(auto_now_add=True)\n    def __str__(self): return self.name\n\nclass Task(models.Model):\n    STATUS = [("todo","К выполнению"),("in_progress","В работе"),("done","Выполнено")]\n    PRIORITY = [("low","Низкий"),("medium","Средний"),("high","Высокий")]\n    title = models.CharField(max_length=200)\n    description = models.TextField(blank=True)\n    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="tasks")\n    assignee = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="tasks")\n    status = models.CharField(max_length=20, choices=STATUS, default="todo")\n    priority = models.CharField(max_length=20, choices=PRIORITY, default="medium")\n    due_date = models.DateField(null=True, blank=True)\n    created_at = models.DateTimeField(auto_now_add=True)\n    class Meta:\n        ordering = ["-created_at"]\n    def __str__(self): return self.title',
      explanation: 'owner — один владелец проекта. members — участники могут добавляться/удаляться. SET_NULL на assignee: при удалении пользователя задача не удаляется, просто assignee становится null.'
    },
    {
      id: 2,
      title: 'Задача: Сериализаторы для Task Manager',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай полный набор сериализаторов: list и detail версии для Project и Task.',
      requirements: [
        'ProjectListSerializer: id, name, owner_name, members_count, tasks_count',
        'ProjectDetailSerializer: все поля + members (вложенный UserSerializer)',
        'TaskSerializer: все поля + assignee_name, project_name, is_overdue (SerializerMethodField)',
        'is_overdue: True если due_date прошёл и статус не "done"',
        'TaskCreateSerializer для создания (только title, description, project, assignee, priority, due_date)'
      ],
      expectedOutput: '{"id": 1, "name": "Мой проект", "owner_name": "admin", "members_count": 3, "tasks_count": 10}\n{"id": 1, "title": "Задача", "is_overdue": true, "assignee_name": "user1"}',
      hint: 'tasks_count через SerializerMethodField: obj.tasks.count(). is_overdue: from django.utils import timezone; return obj.due_date and obj.due_date < timezone.now().date() and obj.status != "done".',
      solution: 'from rest_framework import serializers\nfrom django.utils import timezone\nfrom .models import Project, Task\nfrom django.contrib.auth.models import User\n\nclass UserSerializer(serializers.ModelSerializer):\n    class Meta:\n        model = User\n        fields = ["id", "username"]\n\nclass ProjectListSerializer(serializers.ModelSerializer):\n    owner_name = serializers.CharField(source="owner.username", read_only=True)\n    members_count = serializers.SerializerMethodField()\n    tasks_count = serializers.SerializerMethodField()\n    class Meta:\n        model = Project\n        fields = ["id", "name", "owner_name", "members_count", "tasks_count"]\n    def get_members_count(self, obj): return obj.members.count()\n    def get_tasks_count(self, obj): return obj.tasks.count()\n\nclass TaskSerializer(serializers.ModelSerializer):\n    assignee_name = serializers.CharField(source="assignee.username", read_only=True, allow_null=True)\n    project_name = serializers.CharField(source="project.name", read_only=True)\n    is_overdue = serializers.SerializerMethodField()\n    class Meta:\n        model = Task\n        fields = ["id","title","status","priority","due_date","assignee_name","project_name","is_overdue"]\n    def get_is_overdue(self, obj):\n        return bool(obj.due_date and obj.due_date < timezone.now().date() and obj.status != "done")',
      explanation: 'Разделение на List и Detail сериализаторы — лучшая практика: list легче (меньше данных), detail полный. allow_null=True нужен для nullable полей чтобы сериализатор не выдавал ошибку при None.'
    },
    {
      id: 3,
      title: 'Задача: ViewSets с кастомными permissions',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай ViewSets для Project и Task с разграничением прав доступа.',
      requirements: [
        'ProjectViewSet: пользователь видит только свои проекты (owner) и проекты где участник (members)',
        'IsProjectOwner permission: только owner может редактировать/удалять проект',
        'TaskViewSet: задачи только проектов пользователя',
        'perform_create для Project устанавливает owner=request.user и добавляет в members',
        'Кастомный action add_member: POST /projects/{pk}/add_member/ с user_id в теле'
      ],
      expectedOutput: 'GET /api/projects/ -> только проекты текущего пользователя\nPOST /api/projects/1/add_member/ {"user_id": 5} -> добавляет пользователя в участники',
      hint: 'get_queryset: Project.objects.filter(Q(owner=request.user) | Q(members=request.user)).distinct(). distinct() важен чтобы не дублировать.',
      solution: 'from rest_framework import viewsets\nfrom rest_framework.decorators import action\nfrom rest_framework.permissions import IsAuthenticated, BasePermission\nfrom rest_framework.response import Response\nfrom django.db.models import Q\nfrom django.contrib.auth.models import User\nfrom .models import Project, Task\nfrom .serializers import ProjectListSerializer, TaskSerializer\n\nclass IsProjectOwner(BasePermission):\n    def has_object_permission(self, request, view, obj):\n        return obj.owner == request.user\n\nclass ProjectViewSet(viewsets.ModelViewSet):\n    serializer_class = ProjectListSerializer\n    permission_classes = [IsAuthenticated]\n\n    def get_queryset(self):\n        return Project.objects.filter(\n            Q(owner=self.request.user) | Q(members=self.request.user)\n        ).distinct()\n\n    def get_permissions(self):\n        if self.action in ["update","partial_update","destroy"]:\n            return [IsAuthenticated(), IsProjectOwner()]\n        return [IsAuthenticated()]\n\n    def perform_create(self, serializer):\n        project = serializer.save(owner=self.request.user)\n        project.members.add(self.request.user)\n\n    @action(detail=True, methods=["post"])\n    def add_member(self, request, pk=None):\n        project = self.get_object()\n        user = User.objects.get(id=request.data["user_id"])\n        project.members.add(user)\n        return Response({"status": "участник добавлен"})',
      explanation: 'Q(owner=user) | Q(members=user) возвращает проекты где пользователь владелец ИЛИ участник. distinct() убирает дубли — если пользователь и owner и member, проект появится дважды без distinct().'
    },
    {
      id: 4,
      title: 'Задача: Фильтрация и поиск задач',
      type: 'practice',
      difficulty: 'medium',
      description: 'Добавь мощную фильтрацию к TaskViewSet: по статусу, приоритету, исполнителю, просроченным.',
      requirements: [
        'FilterSet с фильтрами: status, priority, assignee (PK), is_overdue (кастомный метод)',
        'is_overdue=true фильтрует задачи где due_date < today и status != done',
        'SearchFilter по title и description',
        'OrderingFilter по created_at, due_date, priority',
        'Пагинация 20 задач на страницу'
      ],
      expectedOutput: 'GET /api/tasks/?status=in_progress&priority=high -> высокоприоритетные задачи в работе\nGET /api/tasks/?is_overdue=true -> просроченные задачи\nGET /api/tasks/?search=баг -> поиск по названию',
      hint: 'Для кастомного фильтра is_overdue используй django_filters.BooleanFilter с method="filter_overdue".',
      solution: 'import django_filters\nfrom django.utils import timezone\nfrom .models import Task\n\nclass TaskFilter(django_filters.FilterSet):\n    is_overdue = django_filters.BooleanFilter(method="filter_overdue")\n\n    def filter_overdue(self, queryset, name, value):\n        today = timezone.now().date()\n        if value:\n            return queryset.filter(due_date__lt=today).exclude(status="done")\n        return queryset\n\n    class Meta:\n        model = Task\n        fields = ["status", "priority", "assignee"]\n\n# В ViewSet:\nfrom rest_framework.pagination import PageNumberPagination\nfrom rest_framework.filters import SearchFilter, OrderingFilter\nfrom django_filters.rest_framework import DjangoFilterBackend\n\nclass TaskPagination(PageNumberPagination):\n    page_size = 20\n\nclass TaskViewSet(viewsets.ModelViewSet):\n    serializer_class = TaskSerializer\n    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]\n    filterset_class = TaskFilter\n    search_fields = ["title", "description"]\n    ordering_fields = ["created_at", "due_date", "priority"]\n    pagination_class = TaskPagination',
      explanation: 'Кастомный метод фильтра принимает queryset, name (имя поля), value (значение). exclude(status="done") эффективнее чем filter(status__in=["todo","in_progress"]) — не зависит от количества статусов.'
    },
    {
      id: 5,
      title: 'Задача: Статистика API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай эндпоинт статистики проекта: количество задач по статусам, overdue, прогресс.',
      requirements: [
        'GET /api/projects/{pk}/stats/ возвращает статистику задач проекта',
        'todo_count, in_progress_count, done_count — через annotate или фильтрацию',
        'overdue_count — просроченные задачи',
        'completion_rate — процент выполненных задач (done/total * 100)',
        'Доступно только участникам проекта'
      ],
      expectedOutput: '{"todo": 5, "in_progress": 3, "done": 10, "overdue": 2, "completion_rate": 55.6, "total": 18}',
      hint: 'Используй aggregate с Count и фильтрами: Task.objects.filter(project=project).aggregate(todo=Count("id", filter=Q(status="todo")), ...)',
      solution: 'from django.db.models import Count, Q\nfrom django.utils import timezone\nfrom rest_framework.decorators import action\nfrom rest_framework.response import Response\n\n# В ProjectViewSet:\n@action(detail=True, methods=["get"])\ndef stats(self, request, pk=None):\n    project = self.get_object()\n    today = timezone.now().date()\n    stats = project.tasks.aggregate(\n        todo=Count("id", filter=Q(status="todo")),\n        in_progress=Count("id", filter=Q(status="in_progress")),\n        done=Count("id", filter=Q(status="done")),\n        total=Count("id"),\n        overdue=Count("id", filter=Q(due_date__lt=today) & ~Q(status="done"))\n    )\n    total = stats["total"] or 1\n    stats["completion_rate"] = round(stats["done"] / total * 100, 1)\n    return Response(stats)',
      explanation: 'Count("id", filter=Q(...)) — условная агрегация, добавлена в Django 2.0. Один SQL запрос считает все статистики одновременно. ~Q(status="done") — NOT условие в Q объекте.'
    },
    {
      id: 6,
      title: 'Задача: Версионирование API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Добавь версионирование API через URL (v1/v2) с разными сериализаторами.',
      requirements: [
        'URLPathVersioning: /api/v1/tasks/ и /api/v2/tasks/',
        'v1 TaskSerializer: только id, title, status',
        'v2 TaskSerializer: все поля включая is_overdue и assignee_name',
        'ViewSet определяет версию через self.request.version',
        'Настроить DEFAULT_VERSIONING_CLASS в settings'
      ],
      expectedOutput: 'GET /api/v1/tasks/ -> [{"id": 1, "title": "Задача", "status": "todo"}]\nGET /api/v2/tasks/ -> [{"id": 1, "title": "Задача", "status": "todo", "is_overdue": false, "assignee_name": "user1"}]',
      hint: 'REST_FRAMEWORK = {"DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning", "ALLOWED_VERSIONS": ["v1","v2"]}',
      solution: '# settings.py\nREST_FRAMEWORK = {\n    "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning",\n    "ALLOWED_VERSIONS": ["v1", "v2"],\n    "DEFAULT_VERSION": "v1",\n}\n\n# serializers.py\nclass TaskSerializerV1(serializers.ModelSerializer):\n    class Meta:\n        model = Task\n        fields = ["id", "title", "status"]\n\nclass TaskSerializerV2(TaskSerializer):  # наследуем полный\n    pass\n\n# views.py\nclass TaskViewSet(viewsets.ModelViewSet):\n    def get_serializer_class(self):\n        if self.request.version == "v2":\n            return TaskSerializerV2\n        return TaskSerializerV1\n\n# urls.py\nurlpatterns = [\n    path("api/<version>/", include(router.urls)),\n]',
      explanation: 'URLPathVersioning берёт версию из URL. ALLOWED_VERSIONS ограничивает допустимые версии — запрос к /api/v3/ вернёт 404. get_serializer_class переключает сериализатор по версии.'
    },
    {
      id: 7,
      title: 'Задача: Полные тесты Task Manager API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши полный набор интеграционных тестов для Task Manager API.',
      requirements: [
        'Тест: пользователь видит только свои проекты',
        'Тест: создание задачи только в своём проекте',
        'Тест: stats эндпоинт возвращает правильные числа',
        'Тест: фильтрация по is_overdue=true',
        'Тест: add_member добавляет пользователя',
        'Использовать setUpTestData, минимум 5 тестов'
      ],
      expectedOutput: 'python manage.py test myapp.tests.TaskManagerAPITest\n.....\nOK (5 tests)',
      hint: 'Создай просроченную задачу: due_date=date.today() - timedelta(days=1), status="in_progress". Проверь через GET /api/tasks/?is_overdue=true.',
      solution: 'from rest_framework.test import APITestCase, APIClient\nfrom rest_framework.authtoken.models import Token\nfrom django.contrib.auth.models import User\nfrom datetime import date, timedelta\nfrom .models import Project, Task\n\nclass TaskManagerAPITest(APITestCase):\n    @classmethod\n    def setUpTestData(cls):\n        cls.user = User.objects.create_user("user1", password="pass")\n        cls.other = User.objects.create_user("user2", password="pass")\n        cls.token = Token.objects.create(user=cls.user)\n\n    def setUp(self):\n        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")\n        self.project = Project.objects.create(name="Мой проект", owner=self.user)\n        self.project.members.add(self.user)\n        self.other_project = Project.objects.create(name="Чужой", owner=self.other)\n\n    def test_only_own_projects(self):\n        r = self.client.get("/api/projects/")\n        self.assertEqual(len(r.data["results"]), 1)\n        self.assertEqual(r.data["results"][0]["name"], "Мой проект")\n\n    def test_overdue_filter(self):\n        Task.objects.create(title="Просроченная", project=self.project, due_date=date.today()-timedelta(days=1), status="in_progress")\n        Task.objects.create(title="Нормальная", project=self.project, due_date=date.today()+timedelta(days=1), status="in_progress")\n        r = self.client.get("/api/tasks/?is_overdue=true")\n        self.assertEqual(r.data["count"], 1)\n        self.assertEqual(r.data["results"][0]["title"], "Просроченная")',
      explanation: 'setUp создаёт проекты заново для каждого теста чтобы тесты были независимы. Тест на overdue создаёт две задачи и проверяет что фильтр вернул только одну — это проверяет и позитивный и негативный случай.'
    },
    {
      id: 8,
      title: 'Задача: Документация API со Swagger',
      type: 'practice',
      difficulty: 'medium',
      description: 'Добавь автоматическую документацию API с drf-spectacular (OpenAPI 3.0).',
      requirements: [
        'pip install drf-spectacular',
        'Настроить DEFAULT_SCHEMA_CLASS в settings',
        'Добавить @extend_schema декоратор к stats action с описанием ответа',
        'URL /api/schema/ для JSON схемы, /api/docs/ для Swagger UI',
        'SPECTACULAR_SETTINGS с title, version, description'
      ],
      expectedOutput: 'GET /api/docs/ -> Swagger UI с документацией всех эндпоинтов\nGET /api/schema/ -> OpenAPI 3.0 JSON схема',
      hint: 'from drf_spectacular.utils import extend_schema, OpenApiResponse. Добавь в urlpatterns: path("api/schema/", SpectacularAPIView.as_view()), path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")).',
      solution: '# pip install drf-spectacular\n# settings.py\nREST_FRAMEWORK = {\n    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",\n}\nSPECTACULAR_SETTINGS = {\n    "TITLE": "Task Manager API",\n    "VERSION": "1.0.0",\n    "DESCRIPTION": "API для управления задачами и проектами",\n}\n\n# urls.py\nfrom drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView\nurlpatterns += [\n    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),\n    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),\n]\n\n# В ViewSet:\nfrom drf_spectacular.utils import extend_schema\n@extend_schema(description="Статистика задач проекта", responses={200: {"type": "object", "properties": {"total": {"type": "integer"}}}})\n@action(detail=True, methods=["get"])\ndef stats(self, request, pk=None):\n    pass',
      explanation: 'drf-spectacular автоматически генерирует OpenAPI схему из ViewSets и сериализаторов. extend_schema позволяет добавить кастомные описания и типы ответов для сложных эндпоинтов вроде кастомных actions.'
    },
    {
      id: 9,
      title: 'Задача: Websocket уведомления (Django Channels)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Добавь real-time уведомления через Django Channels когда задача назначается пользователю.',
      requirements: [
        'pip install channels channels_redis',
        'TaskConsumer с WebSocket соединением',
        'При назначении задачи через сигнал отправлять уведомление через channel_layer',
        'Клиент подключается к ws://localhost:8000/ws/tasks/',
        'Сообщение: {"type": "task_assigned", "task_title": "Задача", "project": "Проект"}'
      ],
      expectedOutput: 'WebSocket ws://localhost:8000/ws/tasks/ подключён\nPUT /api/tasks/1/ {"assignee": 5} -> WebSocket уведомление пользователю 5',
      hint: 'Используй channel_layer.group_send. В сигнале или perform_update вызывай async_to_sync(channel_layer.group_send)("user_{user_id}", {...})',
      solution: '# consumers.py\nfrom channels.generic.websocket import AsyncJsonWebsocketConsumer\n\nclass TaskConsumer(AsyncJsonWebsocketConsumer):\n    async def connect(self):\n        user_id = self.scope["user"].id\n        self.group_name = f"user_{user_id}"\n        await self.channel_layer.group_add(self.group_name, self.channel_name)\n        await self.accept()\n\n    async def disconnect(self, code):\n        await self.channel_layer.group_discard(self.group_name, self.channel_name)\n\n    async def task_assigned(self, event):\n        await self.send_json(event)\n\n# signals.py\nfrom channels.layers import get_channel_layer\nfrom asgiref.sync import async_to_sync\nfrom django.db.models.signals import post_save\nfrom django.dispatch import receiver\nfrom .models import Task\n\n@receiver(post_save, sender=Task)\ndef on_task_assigned(sender, instance, **kwargs):\n    if instance.assignee:\n        layer = get_channel_layer()\n        async_to_sync(layer.group_send)(\n            f"user_{instance.assignee.id}",\n            {"type": "task_assigned", "task_title": instance.title}\n        )',
      explanation: 'AsyncJsonWebsocketConsumer — базовый класс для JSON WebSocket. group_name привязывает пользователя к персональной группе. async_to_sync позволяет вызывать async код из sync Django сигнала.'
    },
    {
      id: 10,
      title: 'Задача: Rate Limiting для API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Добавь ограничение частоты запросов (rate limiting) к Task Manager API.',
      requirements: [
        'Анонимные пользователи: 20 запросов в час',
        'Аутентифицированные: 1000 запросов в час',
        'Для эндпоинта stats: кастомный throttle 10 запросов в минуту',
        'Настроить DEFAULT_THROTTLE_CLASSES и DEFAULT_THROTTLE_RATES в settings',
        'При превышении лимита: 429 Too Many Requests с сообщением об ожидании'
      ],
      expectedOutput: 'Превышение лимита -> 429 {"detail": "Request was throttled. Expected available in 45 seconds."}\nАутентифицированный пользователь: 1000 req/hour',
      hint: 'class StatsThrottle(UserRateThrottle): rate = "10/min". Применять через throttle_classes = [StatsThrottle] на action.',
      solution: '# settings.py\nREST_FRAMEWORK = {\n    "DEFAULT_THROTTLE_CLASSES": [\n        "rest_framework.throttling.AnonRateThrottle",\n        "rest_framework.throttling.UserRateThrottle",\n    ],\n    "DEFAULT_THROTTLE_RATES": {\n        "anon": "20/hour",\n        "user": "1000/hour",\n        "stats": "10/min",\n    }\n}\n\n# throttles.py\nfrom rest_framework.throttling import UserRateThrottle\n\nclass StatsThrottle(UserRateThrottle):\n    scope = "stats"\n\n# В ViewSet:\n@action(detail=True, methods=["get"], throttle_classes=[StatsThrottle])\ndef stats(self, request, pk=None):\n    pass',
      explanation: 'scope связывает Throttle класс с настройкой в DEFAULT_THROTTLE_RATES. AnonRateThrottle использует IP для анонимов, UserRateThrottle — user.id. Лимиты хранятся в кеше (Redis рекомендуется).'
    }
  ]
}
