export default {
  id: 3,
  title: 'Path и Query параметры',
  description: 'Работа с параметрами URL: path параметры, query параметры, обязательные и необязательные, валидация значений через Path() и Query()',
  lessons: [
    {
      id: 1,
      title: 'Path параметры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Path параметры — часть URL пути, обозначаются фигурными скобками {param}. FastAPI автоматически конвертирует их в указанный тип и валидирует.' },
        { type: 'heading', value: 'Базовые path параметры' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\n\napp = FastAPI()\n\n# Простой строковый параметр\n@app.get("/users/{username}")\nasync def get_user(username: str):\n    return {"username": username}\n\n# Числовой параметр (автоматическая конвертация и валидация)\n@app.get("/items/{item_id}")\nasync def get_item(item_id: int):  # "abc" → 422 ошибка, "5" → 5\n    return {"item_id": item_id}\n\n# Несколько параметров\n@app.get("/users/{user_id}/posts/{post_id}")\nasync def get_user_post(user_id: int, post_id: int):\n    return {"user_id": user_id, "post_id": post_id}' },
        { type: 'heading', value: 'Enum для ограниченных значений' },
        { type: 'code', language: 'python', value: 'from enum import Enum\n\nclass ModelName(str, Enum):\n    alexnet = "alexnet"\n    resnet = "resnet"\n    lenet = "lenet"\n\n@app.get("/models/{model_name}")\nasync def get_model(model_name: ModelName):\n    if model_name == ModelName.alexnet:\n        return {"model": model_name, "message": "Отличная модель!"}\n    return {"model": model_name}\n\n# GET /models/alexnet → OK\n# GET /models/unknown → 422 Validation Error' }
      ]
    },
    {
      id: 2,
      title: 'Path() с валидацией',
      type: 'theory',
      content: [
        { type: 'text', value: 'Path() позволяет добавить дополнительные ограничения на path параметры: минимальное/максимальное значение, регулярные выражения, описание.' },
        { type: 'heading', value: 'Валидация через Path()' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, Path\n\napp = FastAPI()\n\n@app.get("/items/{item_id}")\nasync def get_item(\n    item_id: int = Path(\n        title="ID товара",\n        description="Уникальный идентификатор товара в базе данных",\n        gt=0,       # greater than 0 (строго больше)\n        le=1000,    # less or equal 1000 (меньше или равно)\n        example=42  # пример для документации\n    )\n):\n    return {"item_id": item_id}\n\n# Строковые ограничения\n@app.get("/users/{username}")\nasync def get_user(\n    username: str = Path(\n        min_length=3,\n        max_length=50,\n        pattern="^[a-zA-Z0-9_]+$"  # только буквы, цифры, подчёркивание\n    )\n):\n    return {"username": username}' },
        { type: 'tip', value: 'Ограничения для чисел: gt (>), ge (>=), lt (<), le (<=). Для строк: min_length, max_length, pattern (regex).' }
      ]
    },
    {
      id: 3,
      title: 'Query параметры',
      type: 'theory',
      content: [
        { type: 'text', value: 'Query параметры — параметры после ? в URL. Если имя параметра не в {}, FastAPI считает его query параметром.' },
        { type: 'heading', value: 'Обязательные и необязательные query параметры' },
        { type: 'code', language: 'python', value: 'from typing import Optional\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n# Обязательный query параметр (нет значения по умолчанию)\n@app.get("/search")\nasync def search(q: str):  # GET /search?q=python → OK\n    return {"query": q}  # GET /search → 422 ошибка\n\n# Необязательный с значением по умолчанию\n@app.get("/items")\nasync def list_items(\n    skip: int = 0,         # пагинация: пропустить N\n    limit: int = 10,       # максимум N элементов\n    category: Optional[str] = None  # фильтр по категории\n):\n    # GET /items → skip=0, limit=10, category=None\n    # GET /items?skip=20&limit=5&category=books\n    return {\n        "skip": skip,\n        "limit": limit,\n        "category": category\n    }' }
      ]
    },
    {
      id: 4,
      title: 'Query() с валидацией',
      type: 'theory',
      content: [
        { type: 'text', value: 'Query() даёт те же возможности валидации что и Path(), но для query параметров. Также позволяет принимать список значений.' },
        { type: 'heading', value: 'Расширенная валидация query' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, Query\nfrom typing import Optional, List\n\napp = FastAPI()\n\n@app.get("/products")\nasync def list_products(\n    q: Optional[str] = Query(\n        default=None,\n        min_length=3,\n        max_length=50,\n        title="Поисковый запрос",\n        description="Строка для поиска по названию продукта"\n    ),\n    page: int = Query(default=1, ge=1),\n    size: int = Query(default=20, ge=1, le=100),\n    sort: str = Query(default="name", pattern="^(name|price|date)$")\n):\n    return {"q": q, "page": page, "size": size, "sort": sort}' },
        { type: 'heading', value: 'Список значений' },
        { type: 'code', language: 'python', value: '# GET /items?tag=python&tag=fastapi&tag=web\n@app.get("/items")\nasync def get_items(\n    tag: List[str] = Query(default=[])\n):\n    # tag = ["python", "fastapi", "web"]\n    return {"tags": tag}' }
      ]
    },
    {
      id: 5,
      title: 'Смешивание параметров',
      type: 'theory',
      content: [
        { type: 'text', value: 'Path и query параметры можно смешивать. FastAPI определяет тип автоматически по положению: в {} — path, без {} — query.' },
        { type: 'heading', value: 'Комбинация параметров' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, Path, Query\nfrom typing import Optional\n\napp = FastAPI()\n\n@app.get("/users/{user_id}/orders")\nasync def get_user_orders(\n    user_id: int = Path(gt=0, title="ID пользователя"),\n    status: Optional[str] = Query(default=None, pattern="^(pending|paid|shipped)$"),\n    page: int = Query(default=1, ge=1),\n    size: int = Query(default=10, ge=1, le=50)\n):\n    """\n    GET /users/5/orders               → user_id=5, status=None, page=1\n    GET /users/5/orders?status=paid   → user_id=5, status="paid"\n    GET /users/5/orders?page=2&size=5 → user_id=5, page=2, size=5\n    """\n    return {\n        "user_id": user_id,\n        "status": status,\n        "page": page,\n        "size": size\n    }' }
      ]
    },
    {
      id: 6,
      title: 'Зависимости как параметры пагинации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда одни и те же параметры повторяются во многих эндпоинтах (пагинация, фильтры), их можно вынести в общую функцию — зависимость.' },
        { type: 'heading', value: 'Переиспользование параметров' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, Query, Depends\nfrom dataclasses import dataclass\n\napp = FastAPI()\n\n@dataclass\nclass PaginationParams:\n    page: int = Query(default=1, ge=1, description="Номер страницы")\n    size: int = Query(default=20, ge=1, le=100, description="Размер страницы")\n\n    @property\n    def offset(self) -> int:\n        return (self.page - 1) * self.size\n\n# Использовать в нескольких эндпоинтах\n@app.get("/products")\nasync def list_products(pagination: PaginationParams = Depends()):\n    # pagination.page, pagination.size, pagination.offset\n    return {"page": pagination.page, "size": pagination.size}\n\n@app.get("/orders")\nasync def list_orders(pagination: PaginationParams = Depends()):\n    return {"page": pagination.page, "offset": pagination.offset}' },
        { type: 'tip', value: 'Depends() с dataclass — удобный способ группировать связанные параметры. Подробнее о зависимостях в модуле 12.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: API поиска и фильтрации',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте API для поиска и фильтрации продуктов с полной валидацией параметров.',
      requirements: [
        'GET /products — список с пагинацией (page, size)',
        'GET /products/{product_id} — с валидацией: id > 0',
        'GET /products/search?q=ноутбук&min_price=10000&max_price=100000&sort=price',
        'Параметр sort принимает только: name, price, date',
        'q — минимум 2 символа, если передан',
        'min_price и max_price — положительные числа',
        'GET /products?tags=tech&tags=sale — фильтр по нескольким тегам'
      ],
      hint: 'Используй pattern в Query() для sort. List[str] для tags. Optional[float] для min_price.',
      solution: 'from fastapi import FastAPI, Path, Query\nfrom typing import Optional, List\n\napp = FastAPI()\n\nproducts = [\n    {"id": 1, "name": "Ноутбук", "price": 150000, "tags": ["tech"]},\n    {"id": 2, "name": "Телефон", "price": 80000, "tags": ["tech", "sale"]},\n]\n\n@app.get("/products")\nasync def list_products(\n    page: int = Query(1, ge=1),\n    size: int = Query(10, ge=1, le=100),\n    tags: List[str] = Query(default=[])\n):\n    result = products\n    if tags:\n        result = [p for p in result if any(t in p["tags"] for t in tags)]\n    start = (page - 1) * size\n    return {"items": result[start:start+size], "total": len(result)}\n\n@app.get("/products/{product_id}")\nasync def get_product(product_id: int = Path(gt=0)):\n    p = next((p for p in products if p["id"] == product_id), None)\n    if not p: raise HTTPException(404, "Продукт не найден")\n    return p\n\n@app.get("/products/search")\nasync def search_products(\n    q: Optional[str] = Query(default=None, min_length=2),\n    min_price: Optional[float] = Query(default=None, ge=0),\n    max_price: Optional[float] = Query(default=None, ge=0),\n    sort: str = Query(default="name", pattern="^(name|price|date)$")\n):\n    result = products\n    if q: result = [p for p in result if q.lower() in p["name"].lower()]\n    if min_price: result = [p for p in result if p["price"] >= min_price]\n    if max_price: result = [p for p in result if p["price"] <= max_price]\n    return sorted(result, key=lambda p: p.get(sort, ""))',
      explanation: 'Query(pattern=...) валидирует по regex без дополнительного кода. List[str] автоматически принимает несколько значений одного параметра. Path(gt=0) гарантирует положительный ID.'
    }
  ]
}
