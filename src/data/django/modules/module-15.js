export default {
  id: 15,
  title: 'Django REST Framework: основы',
  description: 'Установка DRF, APIView, Response, статус-коды — строим первый REST API на Django.',
  lessons: [
    {
      id: 1,
      title: 'Что такое Django REST Framework',
      type: 'theory',
      content: [
        { type: 'text', value: 'Django REST Framework (DRF) — мощная библиотека для построения Web API поверх Django. Она предоставляет удобные инструменты для сериализации данных, аутентификации, разрешений и маршрутизации.' },
        { type: 'tip', value: 'DRF — это как Django, но для API. Если Django возвращает HTML-страницы, то DRF возвращает JSON/XML данные, которые потребляют мобильные приложения и фронтенд.' },
        { type: 'heading', value: 'Зачем нужен DRF?' },
        { type: 'list', items: [
          'Сериализация моделей Django в JSON/XML',
          'Готовая аутентификация: Token, Session, JWT',
          'Система разрешений (permissions)',
          'Просмотр API в браузере (Browsable API)',
          'Поддержка фильтрации, пагинации, поиска'
        ]},
        { type: 'code', language: 'python', value: '# Установка\npip install djangorestframework\n\n# settings.py\nINSTALLED_APPS = [\n    ...\n    "rest_framework",\n]' },
        { type: 'note', value: 'DRF имеет отличную документацию на www.django-rest-framework.org. Это один из самых популярных пакетов Django с миллионами загрузок.' }
      ]
    },
    {
      id: 2,
      title: 'Первый APIView',
      type: 'theory',
      content: [
        { type: 'text', value: 'APIView — базовый класс для создания представлений в DRF. Он похож на Django View, но добавляет поддержку контент-переговоров, аутентификации и разрешений.' },
        { type: 'heading', value: 'Создаём простой APIView' },
        { type: 'code', language: 'python', value: 'from rest_framework.views import APIView\nfrom rest_framework.response import Response\nfrom rest_framework import status\n\nclass HelloView(APIView):\n    def get(self, request):\n        data = {"message": "Привет от DRF!"}\n        return Response(data)\n\n    def post(self, request):\n        name = request.data.get("name", "Мир")\n        return Response({"message": f"Привет, {name}!"},' ),
        { type: 'code', language: 'python', value: '# urls.py\nfrom django.urls import path\nfrom .views import HelloView\n\nurlpatterns = [\n    path("hello/", HelloView.as_view(), name="hello"),\n]' },
        { type: 'tip', value: 'В DRF request.data содержит распарсенные данные запроса (JSON, form data). Это аналог request.POST в Django, но работает с любым форматом.' }
      ]
    },
    {
      id: 3,
      title: 'Response и статус-коды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Response в DRF — это умный объект ответа. Он автоматически сериализует данные в нужный формат (JSON, XML) в зависимости от заголовка Accept запроса.' },
        { type: 'heading', value: 'Статус-коды HTTP' },
        { type: 'code', language: 'python', value: 'from rest_framework import status\nfrom rest_framework.response import Response\n\n# Успешные ответы\nResponse(data, status=status.HTTP_200_OK)          # 200\nResponse(data, status=status.HTTP_201_CREATED)     # 201\nResponse(status=status.HTTP_204_NO_CONTENT)        # 204\n\n# Ошибки клиента\nResponse(data, status=status.HTTP_400_BAD_REQUEST) # 400\nResponse(data, status=status.HTTP_401_UNAUTHORIZED)# 401\nResponse(data, status=status.HTTP_403_FORBIDDEN)   # 403\nResponse(data, status=status.HTTP_404_NOT_FOUND)   # 404\n\n# Ошибки сервера\nResponse(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)' },
        { type: 'note', value: 'Всегда используй константы из rest_framework.status, а не числа напрямую. Это делает код читаемее: status.HTTP_201_CREATED понятнее чем просто 201.' }
      ]
    },
    {
      id: 4,
      title: 'request.data и request.query_params',
      type: 'theory',
      content: [
        { type: 'text', value: 'DRF расширяет стандартный Django request дополнительными атрибутами для работы с API.' },
        { type: 'code', language: 'python', value: 'class ArticleView(APIView):\n    def get(self, request):\n        # Параметры строки запроса: /articles/?category=tech&page=2\n        category = request.query_params.get("category")\n        page = request.query_params.get("page", 1)\n        return Response({"category": category, "page": page})\n\n    def post(self, request):\n        # Тело запроса (JSON/form-data)\n        title = request.data.get("title")\n        content = request.data.get("content")\n        if not title:\n            return Response(\n                {"error": "Заголовок обязателен"},\n                status=status.HTTP_400_BAD_REQUEST\n            )\n        return Response({"title": title}, status=status.HTTP_201_CREATED)' },
        { type: 'tip', value: 'request.user содержит аутентифицированного пользователя (или AnonymousUser). request.auth — токен аутентификации. Они доступны в любом APIView.' }
      ]
    },
    {
      id: 5,
      title: 'Function-based views с @api_view',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для простых случаев DRF предоставляет декоратор @api_view, который превращает обычную функцию в API-представление.' },
        { type: 'code', language: 'python', value: 'from rest_framework.decorators import api_view\nfrom rest_framework.response import Response\nfrom rest_framework import status\n\n@api_view(["GET", "POST"])\ndef article_list(request):\n    if request.method == "GET":\n        articles = Article.objects.all()\n        # Пока без сериализатора — простой список\n        data = [{"id": a.id, "title": a.title} for a in articles]\n        return Response(data)\n\n    elif request.method == "POST":\n        # Создание статьи\n        title = request.data.get("title")\n        Article.objects.create(title=title)\n        return Response({"status": "создано"}, status=status.HTTP_201_CREATED)' },
        { type: 'note', value: '@api_view принимает список разрешённых HTTP-методов. Если запрос приходит с методом не из списка, DRF автоматически вернёт 405 Method Not Allowed.' }
      ]
    },
    {
      id: 6,
      title: 'Browsable API и формат ответов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Одна из уникальных возможностей DRF — Browsable API. При открытии URL API в браузере вместо сырого JSON ты видишь красивый веб-интерфейс для тестирования.' },
        { type: 'heading', value: 'Настройка рендереров' },
        { type: 'code', language: 'python', value: '# settings.py\nREST_FRAMEWORK = {\n    "DEFAULT_RENDERER_CLASSES": [\n        "rest_framework.renderers.JSONRenderer",\n        "rest_framework.renderers.BrowsableAPIRenderer",  # для браузера\n    ],\n    "DEFAULT_PARSER_CLASSES": [\n        "rest_framework.parsers.JSONParser",\n        "rest_framework.parsers.FormParser",\n        "rest_framework.parsers.MultiPartParser",\n    ],\n}' },
        { type: 'tip', value: 'В продакшене можно убрать BrowsableAPIRenderer и оставить только JSONRenderer — это немного ускорит ответы и скроет документацию API от пользователей.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Простой CRUD APIView',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай APIView для модели Task (задача) с полями title и completed. Реализуй GET (список) и POST (создание).',
      requirements: [
        'Модель Task с полями title (CharField) и completed (BooleanField, default=False)',
        'GET /tasks/ возвращает список всех задач в виде JSON',
        'POST /tasks/ создаёт новую задачу из request.data',
        'При отсутствии title возвращать 400 с сообщением об ошибке',
        'При успешном создании возвращать 201'
      ],
      expectedOutput: 'GET /tasks/ -> [{"id": 1, "title": "Купить молоко", "completed": false}]\nPOST /tasks/ {"title": "Учить DRF"} -> {"id": 2, "title": "Учить DRF", "completed": false}',
      hint: 'Используй APIView с методами get() и post(). Для ручной сериализации используй list comprehension.',
      solution: 'from rest_framework.views import APIView\nfrom rest_framework.response import Response\nfrom rest_framework import status\nfrom .models import Task\n\nclass TaskListView(APIView):\n    def get(self, request):\n        tasks = Task.objects.all()\n        data = [{"id": t.id, "title": t.title, "completed": t.completed} for t in tasks]\n        return Response(data)\n\n    def post(self, request):\n        title = request.data.get("title")\n        if not title:\n            return Response({"error": "title обязателен"}, status=status.HTTP_400_BAD_REQUEST)\n        task = Task.objects.create(title=title)\n        return Response({"id": task.id, "title": task.title, "completed": task.completed}, status=status.HTTP_201_CREATED)',
      explanation: 'APIView разделяет логику по HTTP-методам. Без сериализатора данные собираем вручную через list comprehension. В следующем модуле заменим это на ModelSerializer.'
    },
    {
      id: 8,
      title: 'Практика: Detail APIView с GET/PUT/DELETE',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай APIView для работы с отдельной задачей по ID: получение, обновление и удаление.',
      requirements: [
        'GET /tasks/<id>/ возвращает задачу или 404',
        'PUT /tasks/<id>/ обновляет поля задачи',
        'DELETE /tasks/<id>/ удаляет задачу и возвращает 204',
        'При несуществующем ID возвращать 404 с сообщением'
      ],
      expectedOutput: 'GET /tasks/1/ -> {"id": 1, "title": "Купить молоко", "completed": false}\nDELETE /tasks/1/ -> 204 No Content',
      hint: 'Создай вспомогательный метод get_object(pk) который поднимает Http404 если объект не найден.',
      solution: 'from rest_framework.views import APIView\nfrom rest_framework.response import Response\nfrom rest_framework import status\nfrom django.shortcuts import get_object_or_404\nfrom .models import Task\n\nclass TaskDetailView(APIView):\n    def get_object(self, pk):\n        return get_object_or_404(Task, pk=pk)\n\n    def get(self, request, pk):\n        task = self.get_object(pk)\n        return Response({"id": task.id, "title": task.title, "completed": task.completed})\n\n    def put(self, request, pk):\n        task = self.get_object(pk)\n        task.title = request.data.get("title", task.title)\n        task.completed = request.data.get("completed", task.completed)\n        task.save()\n        return Response({"id": task.id, "title": task.title, "completed": task.completed})\n\n    def delete(self, request, pk):\n        task = self.get_object(pk)\n        task.delete()\n        return Response(status=status.HTTP_204_NO_CONTENT)',
      explanation: 'get_object_or_404 из Django автоматически возвращает 404 если объект не найден. DELETE возвращает 204 No Content — успех без тела ответа.'
    }
  ]
}
