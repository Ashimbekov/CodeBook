export default {
  id: 13,
  title: 'Обработка ошибок',
  description: 'HTTPException, кастомные обработчики ошибок, валидационные ошибки и структурированные ответы об ошибках в FastAPI',
  lessons: [
    {
      id: 1,
      title: 'HTTPException: базовое использование',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTTPException — основной способ возвращать HTTP-ошибки в FastAPI. Он принимает код статуса, детальное сообщение и опциональные заголовки. При возбуждении исключения FastAPI автоматически формирует JSON-ответ.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, HTTPException\n\napp = FastAPI()\n\nfake_items = {"foo": "Foo Item", "bar": "Bar Item"}\n\n@app.get("/items/{item_id}")\ndef read_item(item_id: str):\n    if item_id not in fake_items:\n        raise HTTPException(\n            status_code=404,\n            detail=f"Товар \'{item_id}\' не найден"\n        )\n    return {"item": fake_items[item_id]}' },
        { type: 'tip', value: 'HTTPException наследуется от Exception, поэтому используется raise, а не return. FastAPI перехватывает это исключение и превращает его в корректный HTTP-ответ с нужным статус-кодом.' },
        { type: 'heading', value: 'Добавление заголовков к ошибке' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, HTTPException\n\napp = FastAPI()\n\n@app.get("/protected/{item_id}")\ndef read_protected(item_id: str, token: str = ""):\n    if token != "secret":\n        raise HTTPException(\n            status_code=401,\n            detail="Неверный токен",\n            headers={"WWW-Authenticate": "Bearer"}\n        )\n    return {"item_id": item_id}' },
        { type: 'note', value: 'Поле detail может быть не только строкой, но и любым JSON-сериализуемым объектом: словарём, списком и т.д. Это позволяет возвращать структурированные сообщения об ошибках.' }
      ]
    },
    {
      id: 2,
      title: 'Стандартные HTTP коды ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'FastAPI предоставляет модуль status с именованными константами для всех HTTP-кодов. Использование констант делает код более читаемым и защищает от опечаток в числах.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, HTTPException, status\n\napp = FastAPI()\n\nusers = {1: {"name": "Анна"}, 2: {"name": "Борис"}}\n\n@app.get("/users/{user_id}")\ndef get_user(user_id: int):\n    if user_id not in users:\n        raise HTTPException(\n            status_code=status.HTTP_404_NOT_FOUND,\n            detail=f"Пользователь {user_id} не найден"\n        )\n    return users[user_id]\n\n@app.post("/users/")\ndef create_user(name: str):\n    if not name.strip():\n        raise HTTPException(\n            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,\n            detail="Имя не может быть пустым"\n        )\n    new_id = max(users.keys()) + 1\n    users[new_id] = {"name": name}\n    return {"id": new_id, "name": name}' },
        { type: 'heading', value: 'Часто используемые коды' },
        { type: 'code', language: 'python', value: '# 400 — Bad Request: некорректный запрос клиента\n# 401 — Unauthorized: не авторизован\n# 403 — Forbidden: доступ запрещён\n# 404 — Not Found: ресурс не найден\n# 409 — Conflict: конфликт (например, дубликат)\n# 422 — Unprocessable Entity: ошибка валидации\n# 500 — Internal Server Error: внутренняя ошибка\n\nfrom fastapi import status\n\nprint(status.HTTP_404_NOT_FOUND)    # 404\nprint(status.HTTP_201_CREATED)      # 201\nprint(status.HTTP_204_NO_CONTENT)   # 204' },
        { type: 'tip', value: 'Код 422 FastAPI возвращает автоматически при ошибке валидации Pydantic. Не нужно его возбуждать вручную для неверных типов данных — FastAPI сделает это сам.' }
      ]
    },
    {
      id: 3,
      title: 'Кастомные обработчики исключений',
      type: 'theory',
      content: [
        { type: 'text', value: 'С помощью @app.exception_handler() можно перехватывать любые типы исключений и формировать собственные ответы. Это позволяет централизованно обрабатывать ошибки.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, Request\nfrom fastapi.responses import JSONResponse\n\napp = FastAPI()\n\n# Кастомное исключение\nclass UnicornException(Exception):\n    def __init__(self, name: str):\n        self.name = name\n\n# Регистрация обработчика\n@app.exception_handler(UnicornException)\nasync def unicorn_exception_handler(request: Request, exc: UnicornException):\n    return JSONResponse(\n        status_code=418,\n        content={\n            "message": f"Ой! Ошибка единорога: {exc.name}",\n            "path": str(request.url)\n        }\n    )\n\n@app.get("/unicorns/{name}")\nasync def read_unicorn(name: str):\n    if name == "yolo":\n        raise UnicornException(name=name)\n    return {"unicorn_name": name}' },
        { type: 'heading', value: 'Переопределение обработчика HTTPException' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, HTTPException, Request\nfrom fastapi.responses import JSONResponse\nimport time\n\napp = FastAPI()\n\n@app.exception_handler(HTTPException)\nasync def http_exception_handler(request: Request, exc: HTTPException):\n    return JSONResponse(\n        status_code=exc.status_code,\n        content={\n            "error": True,\n            "code": exc.status_code,\n            "message": exc.detail,\n            "timestamp": time.time(),\n            "path": str(request.url.path)\n        }\n    )' },
        { type: 'note', value: 'Кастомный обработчик HTTPException полностью заменяет стандартный. Если нужно лишь добавить логирование, можно вызвать оригинальный обработчик через from fastapi.exception_handlers import http_exception_handler.' }
      ]
    },
    {
      id: 4,
      title: 'Обработка ошибок валидации',
      type: 'theory',
      content: [
        { type: 'text', value: 'RequestValidationError возникает когда данные запроса не проходят валидацию Pydantic. По умолчанию FastAPI возвращает 422 с подробным описанием ошибок. Можно переопределить этот обработчик.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, Request, status\nfrom fastapi.exceptions import RequestValidationError\nfrom fastapi.responses import JSONResponse\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\n@app.exception_handler(RequestValidationError)\nasync def validation_exception_handler(request: Request, exc: RequestValidationError):\n    errors = []\n    for error in exc.errors():\n        errors.append({\n            "field": " -> ".join(str(loc) for loc in error["loc"]),\n            "message": error["msg"],\n            "type": error["type"]\n        })\n    return JSONResponse(\n        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,\n        content={\n            "success": False,\n            "errors": errors,\n            "body": exc.body\n        }\n    )\n\nclass Item(BaseModel):\n    name: str\n    price: float\n    count: int\n\n@app.post("/items/")\ndef create_item(item: Item):\n    return item' },
        { type: 'tip', value: 'exc.errors() возвращает список словарей с полями loc (путь до поля), msg (описание ошибки) и type (тип ошибки). exc.body содержит исходное тело запроса — удобно для отладки.' }
      ]
    },
    {
      id: 5,
      title: 'Структурированные ответы об ошибках',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая практика — использовать единый формат ответа об ошибке по всему приложению. Это облегчает работу клиентов API и упрощает отладку.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, HTTPException, Request\nfrom fastapi.responses import JSONResponse\nfrom pydantic import BaseModel\nfrom typing import Optional, Any\nimport time\n\napp = FastAPI()\n\nclass ErrorResponse(BaseModel):\n    success: bool = False\n    error_code: str\n    message: str\n    details: Optional[Any] = None\n    timestamp: float\n\ndef make_error(error_code: str, message: str, details=None) -> dict:\n    return {\n        "success": False,\n        "error_code": error_code,\n        "message": message,\n        "details": details,\n        "timestamp": time.time()\n    }\n\n@app.get("/orders/{order_id}")\ndef get_order(order_id: int):\n    if order_id <= 0:\n        raise HTTPException(\n            status_code=400,\n            detail=make_error(\n                "INVALID_ID",\n                "ID заказа должен быть положительным числом",\n                {"received": order_id}\n            )\n        )\n    if order_id > 1000:\n        raise HTTPException(\n            status_code=404,\n            detail=make_error(\n                "ORDER_NOT_FOUND",\n                f"Заказ #{order_id} не найден"\n            )\n        )\n    return {"order_id": order_id, "status": "active"}' },
        { type: 'heading', value: 'Документирование ответов об ошибках' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass ItemResponse(BaseModel):\n    id: int\n    name: str\n\nclass ErrorDetail(BaseModel):\n    code: str\n    message: str\n\n@app.get(\n    "/items/{item_id}",\n    response_model=ItemResponse,\n    responses={\n        404: {"model": ErrorDetail, "description": "Товар не найден"},\n        403: {"model": ErrorDetail, "description": "Нет доступа"}\n    }\n)\ndef get_item(item_id: int):\n    return {"id": item_id, "name": "Пример товара"}' },
        { type: 'note', value: 'Параметр responses в декораторе позволяет задокументировать все возможные коды ответов в Swagger UI. Это улучшает API-документацию и помогает клиентам понять, какие ошибки ожидать.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Система обработки ошибок',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай FastAPI-приложение с полноценной системой обработки ошибок для управления товарами.',
      requirements: [
        'Определи кастомное исключение ItemNotFoundException',
        'Зарегистрируй обработчик для ItemNotFoundException, возвращающий 404',
        'Переопредели обработчик RequestValidationError с читаемым форматом ошибок',
        'Эндпоинт GET /items/{item_id} — возбуждает ItemNotFoundException если не найден',
        'Эндпоинт POST /items/ с Pydantic-валидацией (name: str, price: float > 0)',
        'Все ошибки возвращают поля: success, error_code, message, timestamp'
      ],
      expectedOutput: 'GET /items/999 -> {"success": false, "error_code": "ITEM_NOT_FOUND", ...}\nPOST /items/ с price=-1 -> {"success": false, "errors": [...], ...}',
      hint: 'Используй @app.exception_handler(ItemNotFoundException) для регистрации обработчика. В Pydantic-модели для валидации цены используй Field(gt=0).',
      solution: 'from fastapi import FastAPI, Request, status\nfrom fastapi.exceptions import RequestValidationError\nfrom fastapi.responses import JSONResponse\nfrom pydantic import BaseModel, Field\nfrom typing import Optional\nimport time\n\napp = FastAPI()\n\n# Кастомное исключение\nclass ItemNotFoundException(Exception):\n    def __init__(self, item_id: int):\n        self.item_id = item_id\n\n@app.exception_handler(ItemNotFoundException)\nasync def item_not_found_handler(request: Request, exc: ItemNotFoundException):\n    return JSONResponse(\n        status_code=404,\n        content={\n            "success": False,\n            "error_code": "ITEM_NOT_FOUND",\n            "message": f"Товар #{exc.item_id} не найден",\n            "timestamp": time.time()\n        }\n    )\n\n@app.exception_handler(RequestValidationError)\nasync def validation_handler(request: Request, exc: RequestValidationError):\n    errors = [{"field": error["loc"][-1], "message": error["msg"]} for error in exc.errors()]\n    return JSONResponse(\n        status_code=422,\n        content={\n            "success": False,\n            "error_code": "VALIDATION_ERROR",\n            "errors": errors,\n            "timestamp": time.time()\n        }\n    )\n\nclass ItemCreate(BaseModel):\n    name: str\n    price: float = Field(gt=0, description="Цена должна быть больше нуля")\n\nitems = {1: {"name": "Ноутбук", "price": 50000.0}}\n\n@app.get("/items/{item_id}")\ndef get_item(item_id: int):\n    if item_id not in items:\n        raise ItemNotFoundException(item_id=item_id)\n    return {"success": True, "data": items[item_id]}\n\n@app.post("/items/", status_code=201)\ndef create_item(item: ItemCreate):\n    new_id = max(items.keys()) + 1\n    items[new_id] = item.dict()\n    return {"success": True, "id": new_id, "data": item}',
      explanation: 'Кастомное исключение ItemNotFoundException хранит item_id и обрабатывается централизованно. RequestValidationError перехватывается для единого формата. Field(gt=0) в Pydantic автоматически проверяет что цена > 0. Все ответы об ошибках имеют единую структуру с success, error_code и timestamp.'
    }
  ]
}
