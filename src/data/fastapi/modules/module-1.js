export default {
  id: 1,
  title: 'Введение в FastAPI',
  description: 'Знакомство с FastAPI: что это такое, почему это быстро, сравнение с Flask и Django, установка и первые шаги',
  lessons: [
    {
      id: 1,
      title: 'Что такое FastAPI?',
      type: 'theory',
      content: [
        { type: 'text', value: 'FastAPI — современный веб-фреймворк для создания API на Python. Основан на Python 3.9+ type hints, использует Starlette для веб-части и Pydantic для валидации данных. Один из самых быстрых Python фреймворков — сравним по скорости с Node.js и Go.' },
        { type: 'tip', value: 'FastAPI делает три вещи одновременно: маршрутизирует запросы, автоматически валидирует данные и генерирует документацию. Это большое преимущество перед Flask.' },
        { type: 'heading', value: 'Ключевые преимущества FastAPI' },
        { type: 'code', language: 'python', value: '# 1. Автоматическая документация Swagger и ReDoc\n# 2. Валидация данных через Pydantic (type hints)\n# 3. Поддержка async/await из коробки\n# 4. Автоматическая сериализация/десериализация JSON\n# 5. Dependency Injection\n# 6. Поддержка WebSocket\n# 7. Очень быстрый (ASGI, Starlette)' },
        { type: 'heading', value: 'FastAPI vs Flask vs Django' },
        { type: 'code', language: 'python', value: '# Flask: минималистичный, нет встроенной валидации\n# Django: полный стек, ORM, Admin — тяжелый для API\n# FastAPI: идеален для REST API, async, автодокументация\n\n# Тот же endpoint в Flask:\n# @app.route("/users/<int:user_id>", methods=["GET"])\n# def get_user(user_id):\n#     # нет валидации типов, нет автодокументации!\n#     return jsonify({"id": user_id})\n\n# В FastAPI:\n@app.get("/users/{user_id}")\nasync def get_user(user_id: int):  # type hint = автоматическая валидация!\n    return {"id": user_id}' }
      ]
    },
    {
      id: 2,
      title: 'Установка и настройка окружения',
      type: 'theory',
      content: [
        { type: 'text', value: 'FastAPI требует Python 3.9+. Рекомендуется использовать виртуальное окружение для изоляции зависимостей проекта.' },
        { type: 'heading', value: 'Установка через pip' },
        { type: 'code', language: 'python', value: '# Создать виртуальное окружение\npython -m venv venv\n\n# Активировать (Linux/Mac)\nsource venv/bin/activate\n\n# Активировать (Windows)\nvenv\\Scripts\\activate\n\n# Установить FastAPI и ASGI сервер\npip install fastapi\npip install "uvicorn[standard]"\n\n# Или одной командой\npip install "fastapi[all]"  # включает uvicorn, pydantic, email-validator и другое' },
        { type: 'heading', value: 'requirements.txt' },
        { type: 'code', language: 'python', value: '# requirements.txt\nfastapi>=0.110.0\nuvicorn[standard]>=0.27.0\npydantic>=2.6.0\npython-dotenv>=1.0.0' },
        { type: 'tip', value: 'Uvicorn — ASGI сервер для запуска FastAPI приложений. Для разработки используй --reload флаг — автоматически перезапускает при изменении кода.' }
      ]
    },
    {
      id: 3,
      title: 'Первое FastAPI приложение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Создадим минимальное FastAPI приложение и разберём каждую строку.' },
        { type: 'heading', value: 'main.py — Hello World' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\n\n# Создать приложение\napp = FastAPI(\n    title="Мой первый API",\n    description="Учебный пример FastAPI",\n    version="1.0.0"\n)\n\n# Декоратор @app.get — маршрут для GET запросов\n@app.get("/")\nasync def root():\n    return {"message": "Привет, мир!"}  # автоматически → JSON\n\n@app.get("/items/{item_id}")\nasync def get_item(item_id: int):  # int — автоматическая валидация!\n    return {"item_id": item_id, "name": f"Товар {item_id}"}' },
        { type: 'heading', value: 'Запуск сервера' },
        { type: 'code', language: 'python', value: '# В терминале:\nuvicorn main:app --reload\n\n# main — имя файла (main.py)\n# app — имя переменной FastAPI()\n# --reload — перезапускать при изменениях\n\n# Сервер запустится на: http://127.0.0.1:8000\n# Swagger UI: http://127.0.0.1:8000/docs\n# ReDoc: http://127.0.0.1:8000/redoc\n# OpenAPI JSON: http://127.0.0.1:8000/openapi.json' }
      ]
    },
    {
      id: 4,
      title: 'HTTP методы и маршруты',
      type: 'theory',
      content: [
        { type: 'text', value: 'FastAPI поддерживает все HTTP методы через декораторы. Каждый метод имеет своё семантическое значение.' },
        { type: 'heading', value: 'Все HTTP методы' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get("/items")\nasync def list_items():\n    """Получить список товаров"""\n    return [{"id": 1}, {"id": 2}]\n\n@app.post("/items")\nasync def create_item():\n    """Создать новый товар"""\n    return {"message": "Товар создан"}\n\n@app.put("/items/{item_id}")\nasync def update_item(item_id: int):\n    """Полное обновление товара"""\n    return {"id": item_id, "updated": True}\n\n@app.patch("/items/{item_id}")\nasync def partial_update(item_id: int):\n    """Частичное обновление"""\n    return {"id": item_id, "patched": True}\n\n@app.delete("/items/{item_id}")\nasync def delete_item(item_id: int):\n    """Удалить товар"""\n    return {"message": f"Товар {item_id} удалён"}' }
      ]
    },
    {
      id: 5,
      title: 'Автоматическая документация',
      type: 'theory',
      content: [
        { type: 'text', value: 'FastAPI автоматически генерирует интерактивную документацию из кода. Не нужно писать документацию отдельно — она генерируется из type hints и docstrings.' },
        { type: 'heading', value: 'Документирование эндпоинтов' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\nfrom typing import Optional\n\napp = FastAPI(\n    title="Магазин API",\n    description="API для управления интернет-магазином",\n    version="2.0.0",\n    contact={"name": "Команда разработки", "email": "dev@myshop.kz"},\n    docs_url="/docs",       # URL для Swagger UI\n    redoc_url="/redoc"      # URL для ReDoc\n)\n\n@app.get(\n    "/products/{product_id}",\n    summary="Получить продукт",\n    description="Возвращает детальную информацию о продукте по его ID",\n    response_description="Данные продукта",\n    tags=["Продукты"]\n)\nasync def get_product(product_id: int):\n    """\n    Получить продукт по ID:\n\n    - **product_id**: уникальный идентификатор продукта\n    """\n    return {"id": product_id, "name": "Ноутбук"}' },
        { type: 'tip', value: 'tags=["Продукты"] группирует эндпоинты в Swagger UI. Docstring с Markdown форматированием отображается как описание.' }
      ]
    },
    {
      id: 6,
      title: 'Структура FastAPI проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для больших проектов важна правильная структура файлов. FastAPI поддерживает разделение на роутеры (APIRouter).' },
        { type: 'heading', value: 'Рекомендуемая структура' },
        { type: 'code', language: 'python', value: 'app/\n├── main.py           # Точка входа\n├── config.py         # Настройки\n├── database.py       # Подключение к БД\n├── models/\n│   ├── __init__.py\n│   ├── user.py       # SQLAlchemy модели\n│   └── product.py\n├── schemas/\n│   ├── __init__.py\n│   ├── user.py       # Pydantic схемы (DTO)\n│   └── product.py\n├── routers/\n│   ├── __init__.py\n│   ├── users.py      # Роутер для /users\n│   └── products.py   # Роутер для /products\n└── services/\n    ├── user_service.py\n    └── product_service.py' },
        { type: 'code', language: 'python', value: '# routers/users.py\nfrom fastapi import APIRouter\n\nrouter = APIRouter(\n    prefix="/users",\n    tags=["Пользователи"]\n)\n\n@router.get("/")  # GET /users\nasync def get_users():\n    return []\n\n# main.py\nfrom fastapi import FastAPI\nfrom routers import users, products\n\napp = FastAPI()\napp.include_router(users.router)\napp.include_router(products.router)' }
      ]
    },
    {
      id: 7,
      title: 'Практика: первый API сервис',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте FastAPI приложение для управления списком задач (Todo List) с базовыми CRUD операциями на основе данных в памяти.',
      requirements: [
        'Создай FastAPI приложение с title "Todo API"',
        'Хранить задачи в dict todos = {} (in-memory)',
        'GET /todos — вернуть все задачи',
        'GET /todos/{todo_id} — вернуть одну задачу',
        'POST /todos — создать задачу с полями id, title, completed=False',
        'DELETE /todos/{todo_id} — удалить задачу',
        'Запустить через uvicorn main:app --reload'
      ],
      hint: 'Для хранения в памяти используй глобальный словарь. todo_id можно генерировать через len(todos) + 1. В реальных приложениях — используй БД.',
      solution: 'from fastapi import FastAPI, HTTPException\n\napp = FastAPI(title="Todo API")\n\ntodos = {}  # {id: {id, title, completed}}\ncounter = 0\n\n@app.get("/todos")\nasync def get_todos():\n    return list(todos.values())\n\n@app.get("/todos/{todo_id}")\nasync def get_todo(todo_id: int):\n    if todo_id not in todos:\n        raise HTTPException(status_code=404, detail="Задача не найдена")\n    return todos[todo_id]\n\n@app.post("/todos", status_code=201)\nasync def create_todo(title: str):\n    global counter\n    counter += 1\n    todo = {"id": counter, "title": title, "completed": False}\n    todos[counter] = todo\n    return todo\n\n@app.delete("/todos/{todo_id}", status_code=204)\nasync def delete_todo(todo_id: int):\n    if todo_id not in todos:\n        raise HTTPException(status_code=404, detail="Задача не найдена")\n    del todos[todo_id]',
      explanation: 'HTTPException с status_code=404 возвращает JSON ошибку. status_code=201 для создания, 204 для удаления — стандарты REST. global counter — простой способ генерировать ID в памяти.'
    }
  ]
}
