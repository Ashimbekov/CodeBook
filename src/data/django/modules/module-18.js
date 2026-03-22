export default {
  id: 18,
  title: 'DRF: Аутентификация и разрешения',
  description: 'TokenAuthentication, SessionAuthentication, permissions IsAuthenticated/IsOwner — защищаем API правильно.',
  lessons: [
    {
      id: 1,
      title: 'Аутентификация в DRF',
      type: 'theory',
      content: [
        { type: 'text', value: 'DRF поддерживает несколько схем аутентификации. Аутентификация определяет кто делает запрос (request.user). Авторизация (разрешения) — что им разрешено делать.' },
        { type: 'heading', value: 'Встроенные схемы аутентификации' },
        { type: 'list', items: [
          'SessionAuthentication — через Django сессии (для браузеров)',
          'BasicAuthentication — логин:пароль в заголовке (только для разработки)',
          'TokenAuthentication — токен в заголовке Authorization',
          'RemoteUserAuthentication — через внешний сервер'
        ]},
        { type: 'code', language: 'python', value: '# settings.py\nINSTALLED_APPS = [\n    ...\n    "rest_framework",\n    "rest_framework.authtoken",  # для TokenAuthentication\n]\n\nREST_FRAMEWORK = {\n    "DEFAULT_AUTHENTICATION_CLASSES": [\n        "rest_framework.authentication.TokenAuthentication",\n        "rest_framework.authentication.SessionAuthentication",\n    ],\n}' }
      ]
    },
    {
      id: 2,
      title: 'TokenAuthentication',
      type: 'theory',
      content: [
        { type: 'text', value: 'TokenAuthentication — самый популярный метод для мобильных приложений и SPA. Каждый пользователь получает уникальный токен, который отправляет в заголовке каждого запроса.' },
        { type: 'code', language: 'python', value: '# Создание токена при входе\nfrom rest_framework.authtoken.models import Token\nfrom rest_framework.authtoken.views import obtain_auth_token\nfrom django.contrib.auth import authenticate\n\nclass LoginView(APIView):\n    def post(self, request):\n        username = request.data.get("username")\n        password = request.data.get("password")\n        user = authenticate(username=username, password=password)\n        if user:\n            token, created = Token.objects.get_or_create(user=user)\n            return Response({"token": token.key})\n        return Response({"error": "Неверные данные"}, status=400)\n\n# urls.py\npath("api/auth/login/", obtain_auth_token),  # встроенный view' },
        { type: 'code', language: 'python', value: '# Клиент отправляет токен в заголовке:\n# Authorization: Token 9944b09199c62bcf9418ad846dd0e4bbdfc6ee4\n\n# В view доступен через:\n# request.user     -> пользователь\n# request.auth     -> объект токена' },
        { type: 'tip', value: 'После получения токена клиент хранит его и добавляет в каждый запрос: Authorization: Token <token_value>. Токен живёт до тех пор, пока его не удалят из БД.' }
      ]
    },
    {
      id: 3,
      title: 'Permissions — система разрешений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Permissions определяют, имеет ли пользователь право выполнить данный запрос. DRF проверяет разрешения после аутентификации.' },
        { type: 'code', language: 'python', value: '# settings.py — глобальные разрешения\nREST_FRAMEWORK = {\n    "DEFAULT_PERMISSION_CLASSES": [\n        "rest_framework.permissions.IsAuthenticated",\n    ],\n}\n\n# Встроенные разрешения:\n# AllowAny — любой, включая анонимов\n# IsAuthenticated — только авторизованные\n# IsAdminUser — только staff пользователи\n# IsAuthenticatedOrReadOnly — чтение всем, запись только авторизованным' },
        { type: 'code', language: 'python', value: 'from rest_framework.permissions import IsAuthenticated, AllowAny\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n\n    def get_permissions(self):\n        """Разные разрешения для разных действий"""\n        if self.action in ["list", "retrieve"]:\n            permission_classes = [AllowAny]\n        else:\n            permission_classes = [IsAuthenticated]\n        return [permission() for permission in permission_classes]' }
      ]
    },
    {
      id: 4,
      title: 'Кастомные разрешения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Часто нужна специфичная логика: только автор может редактировать свою статью, только модератор может удалять и т.д. Для этого создаём кастомные permission классы.' },
        { type: 'code', language: 'python', value: 'from rest_framework.permissions import BasePermission, SAFE_METHODS\n\nclass IsOwnerOrReadOnly(BasePermission):\n    """Редактировать может только автор. Читать — все."""\n\n    def has_object_permission(self, request, view, obj):\n        # SAFE_METHODS = ("GET", "HEAD", "OPTIONS")\n        if request.method in SAFE_METHODS:\n            return True\n        # Проверяем, что пользователь — автор объекта\n        return obj.author == request.user\n\nclass IsOwner(BasePermission):\n    """Доступ только к своим объектам."""\n    message = "Вы не являетесь владельцем этого объекта"\n\n    def has_object_permission(self, request, view, obj):\n        return obj.owner == request.user' },
        { type: 'note', value: 'has_permission проверяется на уровне view (до получения объекта). has_object_permission — на уровне конкретного объекта. Первое проверяется всегда, второе — только в detail views.' }
      ]
    },
    {
      id: 5,
      title: 'JWT аутентификация с djangorestframework-simplejwt',
      type: 'theory',
      content: [
        { type: 'text', value: 'JWT (JSON Web Token) — современная альтернатива Token Auth. Токен содержит данные пользователя и не требует запроса к БД при каждом запросе.' },
        { type: 'code', language: 'python', value: '# pip install djangorestframework-simplejwt\n\n# settings.py\nREST_FRAMEWORK = {\n    "DEFAULT_AUTHENTICATION_CLASSES": [\n        "rest_framework_simplejwt.authentication.JWTAuthentication",\n    ],\n}\n\nfrom datetime import timedelta\nSIMPLE_JWT = {\n    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),\n    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),\n}' },
        { type: 'code', language: 'python', value: '# urls.py\nfrom rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView\n\nurlpatterns = [\n    path("api/token/", TokenObtainPairView.as_view()),      # получить access+refresh\n    path("api/token/refresh/", TokenRefreshView.as_view()), # обновить access token\n]\n\n# Клиент:\n# POST /api/token/ -> {"access": "...", "refresh": "..."}\n# Authorization: Bearer <access_token>' },
        { type: 'tip', value: 'JWT удобен для микросервисов — токен верифицируется локально без обращения к БД. Но нельзя отозвать конкретный токен без blacklist (есть в simplejwt).' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Регистрация и вход с Token',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй эндпоинты регистрации и входа с выдачей токена DRF.',
      requirements: [
        'POST /api/register/ создаёт пользователя и возвращает токен',
        'POST /api/login/ проверяет учётные данные и возвращает токен',
        'POST /api/logout/ удаляет токен текущего пользователя (требует аутентификации)',
        'Защити logout через IsAuthenticated permission'
      ],
      expectedOutput: 'POST /api/register/ {"username": "user", "password": "pass"} -> {"token": "abc123"}\nPOST /api/login/ {"username": "user", "password": "pass"} -> {"token": "abc123"}\nPOST /api/logout/ (с токеном) -> {"message": "Выход выполнен"}',
      hint: 'Используй User.objects.create_user() для безопасного создания пользователя. Token.objects.get_or_create(user=user) для токена.',
      solution: 'from rest_framework.views import APIView\nfrom rest_framework.response import Response\nfrom rest_framework.permissions import IsAuthenticated\nfrom rest_framework.authtoken.models import Token\nfrom rest_framework import status\nfrom django.contrib.auth import authenticate\nfrom django.contrib.auth.models import User\n\nclass RegisterView(APIView):\n    def post(self, request):\n        username = request.data.get("username")\n        password = request.data.get("password")\n        if not username or not password:\n            return Response({"error": "Укажите username и password"}, status=400)\n        user = User.objects.create_user(username=username, password=password)\n        token = Token.objects.create(user=user)\n        return Response({"token": token.key}, status=201)\n\nclass LoginView(APIView):\n    def post(self, request):\n        user = authenticate(**request.data)\n        if user:\n            token, _ = Token.objects.get_or_create(user=user)\n            return Response({"token": token.key})\n        return Response({"error": "Неверные данные"}, status=400)\n\nclass LogoutView(APIView):\n    permission_classes = [IsAuthenticated]\n    def post(self, request):\n        request.user.auth_token.delete()\n        return Response({"message": "Выход выполнен"})',
      explanation: 'create_user хеширует пароль автоматически. get_or_create возвращает существующий токен или создаёт новый. Logout удаляет токен из БД — при следующем запросе с ним вернётся 401.'
    },
    {
      id: 7,
      title: 'Практика: IsOwnerOrReadOnly для статей',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай кастомное разрешение и примени его к ArticleViewSet.',
      requirements: [
        'Кастомный класс IsAuthorOrReadOnly наследуется от BasePermission',
        'GET/HEAD/OPTIONS разрешены всем',
        'PUT/PATCH/DELETE только для автора статьи (article.author == request.user)',
        'Применить к ArticleViewSet через permission_classes',
        'Неаутентифицированный пользователь может читать, но не создавать'
      ],
      expectedOutput: 'GET /api/articles/ -> 200 (для всех)\nPOST /api/articles/ -> 401 (для анонима)\nDELETE /api/articles/1/ -> 403 (для не-автора)\nDELETE /api/articles/1/ -> 204 (для автора)',
      hint: 'Комбинируй IsAuthenticatedOrReadOnly и IsAuthorOrReadOnly в списке permission_classes.',
      solution: 'from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticatedOrReadOnly\n\nclass IsAuthorOrReadOnly(BasePermission):\n    def has_object_permission(self, request, view, obj):\n        if request.method in SAFE_METHODS:\n            return True\n        return obj.author == request.user\n\nclass ArticleViewSet(viewsets.ModelViewSet):\n    queryset = Article.objects.all()\n    serializer_class = ArticleSerializer\n    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]\n\n    def perform_create(self, serializer):\n        serializer.save(author=self.request.user)',
      explanation: 'IsAuthenticatedOrReadOnly блокирует создание для анонимов (has_permission). IsAuthorOrReadOnly блокирует редактирование чужих объектов (has_object_permission). Оба permission проверяются — нужно пройти оба.'
    }
  ]
}
