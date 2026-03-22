export default {
  id: 23,
  title: 'Тестирование',
  description: 'TestCase, APITestCase, фикстуры, мокирование — пишем надёжные тесты для Django и DRF.',
  lessons: [
    {
      id: 1,
      title: 'Основы тестирования в Django',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django включает мощный фреймворк тестирования на основе Python unittest. Каждый тест изолирован — БД очищается между тестами, изменения не сохраняются.' },
        { type: 'tip', value: 'Тесты — страховка при рефакторинге. Изменил код — запустил тесты — убедился, что ничего не сломал. Без тестов каждое изменение — риск.' },
        { type: 'code', language: 'python', value: '# myapp/tests.py\nfrom django.test import TestCase\nfrom django.contrib.auth.models import User\nfrom .models import Article\n\nclass ArticleModelTest(TestCase):\n    def setUp(self):\n        """Выполняется перед каждым тестом"""\n        self.user = User.objects.create_user(\n            username="testuser",\n            password="testpass123"\n        )\n        self.article = Article.objects.create(\n            title="Тестовая статья",\n            content="Тестовый контент",\n            author=self.user\n        )\n\n    def test_article_creation(self):\n        """Статья создаётся корректно"""\n        self.assertEqual(self.article.title, "Тестовая статья")\n        self.assertEqual(self.article.author, self.user)\n\n    def test_article_str(self):\n        """Строковое представление модели"""\n        self.assertEqual(str(self.article), "Тестовая статья")' },
        { type: 'code', language: 'python', value: '# Запуск тестов\npython manage.py test                     # все тесты\npython manage.py test myapp               # тесты приложения\npython manage.py test myapp.tests.ArticleModelTest  # конкретный класс\npython manage.py test myapp.tests.ArticleModelTest.test_article_creation  # один тест' }
      ]
    },
    {
      id: 2,
      title: 'TestClient — тестирование views',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django TestClient имитирует браузер для тестирования HTTP представлений без реального сетевого запроса.' },
        { type: 'code', language: 'python', value: 'from django.test import TestCase, Client\nfrom django.urls import reverse\nfrom django.contrib.auth.models import User\n\nclass ArticleViewTest(TestCase):\n    def setUp(self):\n        self.client = Client()\n        self.user = User.objects.create_user("user", password="pass")\n\n    def test_article_list_anonymous(self):\n        """Анонимный пользователь видит список статей"""\n        response = self.client.get(reverse("article-list"))\n        self.assertEqual(response.status_code, 200)\n\n    def test_article_create_requires_login(self):\n        """Создание статьи требует аутентификации"""\n        response = self.client.post(reverse("article-create"), {"title": "Новая"})\n        self.assertEqual(response.status_code, 302)  # редирект на login\n\n    def test_article_create_authenticated(self):\n        """Аутентифицированный пользователь создаёт статью"""\n        self.client.login(username="user", password="pass")\n        response = self.client.post(\n            reverse("article-create"),\n            {"title": "Новая статья", "content": "Контент"}\n        )\n        self.assertEqual(response.status_code, 302)\n        self.assertTrue(Article.objects.filter(title="Новая статья").exists())' },
        { type: 'heading', value: 'Проверка шаблонов и контекста ответа' },
        { type: 'code', language: 'python', value: '# TestClient позволяет проверять контекст шаблона:\nfrom django.test import TestCase\nfrom django.urls import reverse\nfrom .models import Article\nfrom django.contrib.auth.models import User\n\nclass ArticleViewTest(TestCase):\n    @classmethod\n    def setUpTestData(cls):\n        cls.user = User.objects.create_user("user", password="pass")\n        cls.article = Article.objects.create(\n            title="Тест", content="...", author=cls.user, is_published=True\n        )\n\n    def test_list_uses_correct_template(self):\n        response = self.client.get(reverse("article-list"))\n        self.assertTemplateUsed(response, "blog/article_list.html")\n\n    def test_list_context_has_articles(self):\n        response = self.client.get(reverse("article-list"))\n        self.assertIn("articles", response.context)\n        self.assertEqual(len(response.context["articles"]), 1)\n\n    def test_detail_shows_article(self):\n        url = reverse("article-detail", kwargs={"pk": self.article.pk})\n        response = self.client.get(url)\n        self.assertContains(response, "Тест")  # текст в HTML\n        self.assertContains(response, self.article.title)\n\n    def test_404_for_missing_article(self):\n        response = self.client.get(reverse("article-detail", kwargs={"pk": 9999}))\n        self.assertEqual(response.status_code, 404)\n\n    def test_form_errors_displayed(self):\n        self.client.login(username="user", password="pass")\n        response = self.client.post(reverse("article-create"), {"title": ""})  # пустой заголовок\n        self.assertFormError(response, "form", "title", "This field is required.")' },
        { type: 'tip', value: 'assertContains/assertNotContains проверяют наличие строки в HTML ответе. assertTemplateUsed проверяет какой шаблон использован. assertFormError проверяет ошибки конкретного поля формы.' }
      ]
    },
    {
      id: 3,
      title: 'APITestCase — тестирование DRF',
      type: 'theory',
      content: [
        { type: 'text', value: 'APITestCase — расширение TestCase для тестирования DRF API. APIClient поддерживает аутентификацию токенами и JSON запросы.' },
        { type: 'code', language: 'python', value: 'from rest_framework.test import APITestCase, APIClient\nfrom rest_framework.authtoken.models import Token\nfrom django.contrib.auth.models import User\nfrom .models import Article\n\nclass ArticleAPITest(APITestCase):\n    def setUp(self):\n        self.user = User.objects.create_user("testuser", password="pass")\n        self.token = Token.objects.create(user=self.user)\n        self.client = APIClient()\n        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")\n\n    def test_create_article(self):\n        data = {"title": "API статья", "content": "Контент"}\n        response = self.client.post("/api/articles/", data, format="json")\n        self.assertEqual(response.status_code, 201)\n        self.assertEqual(response.data["title"], "API статья")\n\n    def test_list_articles(self):\n        Article.objects.create(title="Статья 1", author=self.user)\n        Article.objects.create(title="Статья 2", author=self.user)\n        response = self.client.get("/api/articles/")\n        self.assertEqual(response.status_code, 200)\n        self.assertEqual(len(response.data["results"]), 2)' },
        { type: 'heading', value: 'Тестирование JWT аутентификации и разных ролей' },
        { type: 'code', language: 'python', value: '# Тестирование с JWT:\nfrom rest_framework.test import APITestCase, APIClient\nfrom rest_framework_simplejwt.tokens import RefreshToken\nfrom django.contrib.auth.models import User\n\nclass ArticleAPITest(APITestCase):\n    @classmethod\n    def setUpTestData(cls):\n        cls.user = User.objects.create_user("user", password="pass")\n        cls.admin = User.objects.create_user("admin", password="pass", is_staff=True)\n        cls.article = Article.objects.create(title="Тест", author=cls.user)\n\n    def get_token_headers(self, user):\n        """Возвращает заголовки с JWT токеном для пользователя"""\n        refresh = RefreshToken.for_user(user)\n        return {"HTTP_AUTHORIZATION": f"Bearer {str(refresh.access_token)}"}\n\n    def test_update_own_article(self):\n        """Автор может редактировать свою статью"""\n        headers = self.get_token_headers(self.user)\n        response = self.client.patch(\n            f"/api/articles/{self.article.pk}/",\n            {"title": "Новый заголовок"},\n            format="json",\n            **headers\n        )\n        self.assertEqual(response.status_code, 200)\n\n    def test_update_other_article_forbidden(self):\n        """Другой пользователь не может редактировать чужую статью"""\n        other = User.objects.create_user("other", password="pass")\n        headers = self.get_token_headers(other)\n        response = self.client.patch(\n            f"/api/articles/{self.article.pk}/",\n            {"title": "Взлом"},\n            format="json",\n            **headers\n        )\n        self.assertIn(response.status_code, [403, 404])  # зависит от реализации' },
        { type: 'note', value: 'force_authenticate() — более простой способ авторизации в тестах без реальных токенов: self.client.force_authenticate(user=self.user). Используй его когда тестируешь логику API, а не сам механизм аутентификации.' }
      ]
    },
    {
      id: 4,
      title: 'Фикстуры и setUpTestData',
      type: 'theory',
      content: [
        { type: 'text', value: 'setUpTestData создаёт данные один раз для всего класса тестов (быстрее setUp). Фикстуры — JSON файлы с начальными данными.' },
        { type: 'code', language: 'python', value: 'class ArticleAPITest(APITestCase):\n    @classmethod\n    def setUpTestData(cls):\n        """Выполняется ОДИН РАЗ для всего класса — быстрее setUp"""\n        cls.user = User.objects.create_user("testuser", password="pass")\n        cls.articles = [\n            Article.objects.create(title=f"Статья {i}", author=cls.user)\n            for i in range(10)\n        ]\n\n    def test_pagination(self):\n        response = self.client.get("/api/articles/")\n        self.assertEqual(response.data["count"], 10)' },
        { type: 'code', language: 'python', value: '# Создание фикстуры\npython manage.py dumpdata myapp.Article --indent 2 > fixtures/articles.json\n\n# Загрузка фикстуры\npython manage.py loaddata fixtures/articles.json\n\n# В тесте\nclass ArticleTest(TestCase):\n    fixtures = ["articles.json", "users.json"]' }
      ]
    },
    {
      id: 5,
      title: 'Мокирование с unittest.mock',
      type: 'theory',
      content: [
        { type: 'text', value: 'Мокирование заменяет реальные зависимости (внешние API, email, Celery) на имитации для изолированного тестирования.' },
        { type: 'code', language: 'python', value: 'from unittest.mock import patch, MagicMock\nfrom django.test import TestCase\nfrom .tasks import send_welcome_email\n\nclass EmailTaskTest(TestCase):\n    @patch("myapp.tasks.send_mail")  # мокируем send_mail\n    def test_send_welcome_email(self, mock_send_mail):\n        user = User.objects.create_user("user", email="u@test.com", password="pass")\n        send_welcome_email(user.id)\n        # Проверяем, что send_mail был вызван\n        mock_send_mail.assert_called_once()\n        # Проверяем аргументы вызова\n        call_args = mock_send_mail.call_args\n        self.assertIn("u@test.com", call_args[0][3])  # получатель\n\n    @patch("myapp.views.requests.get")\n    def test_external_api_call(self, mock_get):\n        mock_get.return_value.json.return_value = {"data": "test"}\n        response = self.client.get("/api/weather/")\n        self.assertEqual(response.status_code, 200)\n        mock_get.assert_called_once()  # убеждаемся, что API вызван ровно раз' },
        { type: 'tip', value: '@patch принимает путь к объекту там, где он используется, а не где определён. Если views.py импортирует requests, то мокировать нужно "myapp.views.requests".' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Тесты для Task API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши полный набор тестов для API задач (Task) с аутентификацией.',
      requirements: [
        'Тест: создание задачи возвращает 201 и правильные данные',
        'Тест: неаутентифицированный запрос возвращает 401',
        'Тест: пользователь видит только свои задачи (не чужие)',
        'Тест: action complete устанавливает completed=True',
        'Тест: удаление чужой задачи возвращает 403 или 404',
        'setUpTestData для создания пользователей и задач'
      ],
      expectedOutput: 'python manage.py test myapp.tests.TaskAPITest\n.......\nOK (7 tests)',
      hint: 'Создай двух пользователей: self.user и self.other_user. Задачи self.user не должны быть видны self.other_user.',
      solution: 'from rest_framework.test import APITestCase, APIClient\nfrom rest_framework.authtoken.models import Token\nfrom django.contrib.auth.models import User\nfrom .models import Task\n\nclass TaskAPITest(APITestCase):\n    @classmethod\n    def setUpTestData(cls):\n        cls.user = User.objects.create_user("user1", password="pass")\n        cls.other = User.objects.create_user("user2", password="pass")\n        cls.token = Token.objects.create(user=cls.user)\n        cls.other_token = Token.objects.create(user=cls.other)\n\n    def setUp(self):\n        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.token.key}")\n        self.task = Task.objects.create(title="Моя задача", owner=self.user)\n        Task.objects.create(title="Чужая задача", owner=self.other)\n\n    def test_create_task(self):\n        r = self.client.post("/api/tasks/", {"title": "Новая"}, format="json")\n        self.assertEqual(r.status_code, 201)\n        self.assertEqual(r.data["title"], "Новая")\n\n    def test_unauthorized(self):\n        self.client.credentials()\n        r = self.client.get("/api/tasks/")\n        self.assertEqual(r.status_code, 401)\n\n    def test_only_own_tasks(self):\n        r = self.client.get("/api/tasks/")\n        self.assertEqual(len(r.data["results"]), 1)\n        self.assertEqual(r.data["results"][0]["title"], "Моя задача")\n\n    def test_complete_action(self):\n        r = self.client.post(f"/api/tasks/{self.task.id}/complete/")\n        self.assertEqual(r.status_code, 200)\n        self.task.refresh_from_db()\n        self.assertTrue(self.task.completed)',
      explanation: 'refresh_from_db() перечитывает объект из БД — нужно проверить, что изменения реально сохранились. setUpTestData создаёт пользователей один раз, setUp создаёт задачи заново для каждого теста (они удаляются в транзакции).'
    },
    {
      id: 7,
      title: 'Практика: Тест с мокированием Celery',
      type: 'practice',
      difficulty: 'hard',
      description: 'Протестируй регистрацию пользователя с мокированием Celery задачи отправки email.',
      requirements: [
        'POST /api/register/ создаёт пользователя и запускает задачу send_welcome_email',
        'В тесте мокировать send_welcome_email.delay',
        'Проверить, что пользователь создан в БД',
        'Проверить, что delay() вызван ровно один раз с правильным user_id',
        'Проверить, что токен возвращается в ответе'
      ],
      expectedOutput: 'test_register_creates_user: OK\ntest_register_calls_celery_task: OK\ntest_register_returns_token: OK',
      hint: 'Мокируй "myapp.views.send_welcome_email.delay". После вызова view проверяй mock.assert_called_once_with(user.id).',
      solution: 'from unittest.mock import patch\nfrom rest_framework.test import APITestCase\nfrom django.contrib.auth.models import User\n\nclass RegisterAPITest(APITestCase):\n    @patch("myapp.views.send_welcome_email.delay")\n    def test_register_creates_user(self, mock_task):\n        r = self.client.post("/api/register/", {"username": "new", "password": "pass123"}, format="json")\n        self.assertEqual(r.status_code, 201)\n        self.assertTrue(User.objects.filter(username="new").exists())\n\n    @patch("myapp.views.send_welcome_email.delay")\n    def test_register_calls_celery_task(self, mock_task):\n        self.client.post("/api/register/", {"username": "new2", "password": "pass123"}, format="json")\n        user = User.objects.get(username="new2")\n        mock_task.assert_called_once_with(user.id)\n\n    @patch("myapp.views.send_welcome_email.delay")\n    def test_register_returns_token(self, mock_task):\n        r = self.client.post("/api/register/", {"username": "new3", "password": "pass123"}, format="json")\n        self.assertIn("token", r.data)',
      explanation: 'Мокирование .delay() предотвращает реальную постановку задачи в очередь Redis во время тестов. assert_called_once_with проверяет не только факт вызова, но и аргументы — это важно для корректности.'
    }
  ]
}
