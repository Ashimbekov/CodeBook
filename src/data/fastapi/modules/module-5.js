export default {
  id: 5,
  title: 'Response модели и форматирование ответов',
  description: 'Управление форматом ответов API: response_model, статус коды, заголовки, кастомные ответы, пагинация и JSONResponse',
  lessons: [
    {
      id: 1,
      title: 'response_model: фильтрация ответа',
      type: 'theory',
      content: [
        { type: 'text', value: 'response_model указывает FastAPI какую Pydantic модель использовать для сериализации ответа. Это фильтрует лишние поля (например, пароль) и документирует формат ответа в Swagger.' },
        { type: 'heading', value: 'Использование response_model' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\nfrom typing import List\n\napp = FastAPI()\n\nclass UserDB(BaseModel):   # внутренняя модель\n    id: int\n    name: str\n    email: str\n    password_hash: str     # не должно попасть в ответ!\n\nclass UserResponse(BaseModel):  # модель ответа\n    id: int\n    name: str\n    email: str\n    # password_hash — отсутствует!\n\n@app.get("/users/{user_id}", response_model=UserResponse)\nasync def get_user(user_id: int):\n    # Возвращаем UserDB, но FastAPI применит UserResponse\n    return UserDB(id=user_id, name="Алибек",\n                  email="a@mail.ru", password_hash="$2b$hashed")\n    # В ответе: {"id": 1, "name": "Алибек", "email": "a@mail.ru"}\n    # password_hash — отфильтрован!\n\n# Список\n@app.get("/users", response_model=List[UserResponse])\nasync def list_users():\n    return [...]' }
      ]
    },
    {
      id: 2,
      title: 'response_model_exclude и response_model_include',
      type: 'theory',
      content: [
        { type: 'text', value: 'Иногда не нужно создавать отдельную модель — достаточно исключить несколько полей через response_model_exclude или включить только нужные через response_model_include.' },
        { type: 'heading', value: 'Динамическое исключение полей' },
        { type: 'code', language: 'python', value: 'class User(BaseModel):\n    id: int\n    name: str\n    email: str\n    password_hash: str\n    internal_notes: str\n\n# Исключить конкретные поля\n@app.get("/users/{user_id}",\n         response_model=User,\n         response_model_exclude={"password_hash", "internal_notes"})\nasync def get_user(user_id: int):\n    return user_db[user_id]\n\n# Включить только определённые поля\n@app.get("/users/{user_id}/brief",\n         response_model=User,\n         response_model_include={"id", "name"})\nasync def get_user_brief(user_id: int):\n    return user_db[user_id]\n    # Вернёт только: {"id": 1, "name": "Алибек"}\n\n# Исключить None значения из ответа\n@app.get("/users/{user_id}",\n         response_model=User,\n         response_model_exclude_none=True)\nasync def get_user_no_nulls(user_id: int):\n    return user_db[user_id]' }
      ]
    },
    {
      id: 3,
      title: 'Кастомный формат ответа: обёртка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Многие API оборачивают ответ в общий формат: { data: ..., meta: ..., error: null }. Это облегчает обработку ошибок на клиенте.' },
        { type: 'heading', value: 'Generic Response Wrapper' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel\nfrom typing import Generic, TypeVar, Optional, List\n\nT = TypeVar("T")\n\nclass ApiResponse(BaseModel, Generic[T]):\n    success: bool = True\n    data: Optional[T] = None\n    message: str = "OK"\n    errors: Optional[List[str]] = None\n\nclass PagedResponse(BaseModel, Generic[T]):\n    items: List[T]\n    total: int\n    page: int\n    size: int\n    pages: int\n\n    @classmethod\n    def create(cls, items: List[T], total: int, page: int, size: int):\n        return cls(\n            items=items,\n            total=total,\n            page=page,\n            size=size,\n            pages=(total + size - 1) // size  # округление вверх\n        )\n\n@app.get("/products", response_model=PagedResponse[ProductResponse])\nasync def list_products(page: int = 1, size: int = 20):\n    all_products = get_all_products()\n    total = len(all_products)\n    start = (page - 1) * size\n    items = all_products[start:start + size]\n    return PagedResponse.create(items, total, page, size)' }
      ]
    },
    {
      id: 4,
      title: 'JSONResponse и кастомные заголовки',
      type: 'theory',
      content: [
        { type: 'text', value: 'JSONResponse даёт полный контроль над ответом: статус код, заголовки, тело. Используй когда стандартного return недостаточно.' },
        { type: 'heading', value: 'JSONResponse и Response классы' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\nfrom fastapi.responses import JSONResponse, Response, HTMLResponse, FileResponse\nfrom datetime import datetime\n\napp = FastAPI()\n\n@app.post("/users")\nasync def create_user(name: str):\n    user = {"id": 1, "name": name}\n    return JSONResponse(\n        status_code=201,\n        content=user,\n        headers={\n            "Location": f"/users/1",\n            "X-Created-At": datetime.now().isoformat()\n        }\n    )\n\n# Ответ без тела\n@app.delete("/users/{user_id}")\nasync def delete_user(user_id: int):\n    return Response(status_code=204)\n\n# HTML ответ\n@app.get("/hello")\nasync def hello():\n    return HTMLResponse("<h1>Привет!</h1>")\n\n# Скачать файл\n@app.get("/report")\nasync def download_report():\n    return FileResponse("report.pdf", filename="отчёт.pdf")' }
      ]
    },
    {
      id: 5,
      title: 'Разные коды ответа в документации',
      type: 'theory',
      content: [
        { type: 'text', value: 'FastAPI позволяет документировать несколько возможных ответов с разными статус кодами через responses параметр декоратора.' },
        { type: 'heading', value: 'Документирование ответов' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass ErrorResponse(BaseModel):\n    detail: str\n    code: str\n\n@app.get(\n    "/users/{user_id}",\n    response_model=UserResponse,\n    responses={\n        200: {"description": "Пользователь найден", "model": UserResponse},\n        404: {"description": "Пользователь не найден", "model": ErrorResponse},\n        403: {"description": "Нет доступа"}\n    }\n)\nasync def get_user(user_id: int):\n    ...' }
      ]
    },
    {
      id: 6,
      title: 'Практика: стандартизированные ответы API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте API с единым форматом ответов: обёртка ApiResponse, пагинация PagedResponse, правильные HTTP статус коды.',
      requirements: [
        'Создай Generic ApiResponse[T] с полями: success, data, message',
        'Создай PagedResponse[T] с полями: items, total, page, size, pages',
        'GET /products — вернуть PagedResponse[ProductOut]',
        'GET /products/{id} — вернуть ApiResponse[ProductOut] или 404',
        'POST /products — создать, вернуть ApiResponse[ProductOut] со статусом 201 и заголовком Location',
        'DELETE /products/{id} — 204 без тела',
        'Кастомный exception handler возвращающий ApiResponse с success=False'
      ],
      hint: 'Generic[T] в Pydantic позволяет параметризовать модель. Location заголовок в JSONResponse: headers={"Location": f"/products/{new_id}"}.',
      solution: 'from pydantic import BaseModel\nfrom typing import Generic, TypeVar, Optional, List\nfrom fastapi.responses import JSONResponse\n\nT = TypeVar("T")\n\nclass ApiResponse(BaseModel, Generic[T]):\n    success: bool = True\n    data: Optional[T] = None\n    message: str = "OK"\n\nclass PagedResponse(BaseModel, Generic[T]):\n    items: List[T]\n    total: int\n    page: int\n    size: int\n    pages: int\n\nclass ProductOut(BaseModel):\n    id: int\n    name: str\n    price: float\n\nproducts_db = {}\ncounter = 0\n\n@app.get("/products", response_model=PagedResponse[ProductOut])\nasync def list_products(page: int = 1, size: int = 10):\n    items = list(products_db.values())\n    start = (page - 1) * size\n    return PagedResponse(items=items[start:start+size], total=len(items),\n        page=page, size=size, pages=(len(items)+size-1)//size)\n\n@app.post("/products", status_code=201)\nasync def create_product(name: str, price: float):\n    global counter; counter += 1\n    p = {"id": counter, "name": name, "price": price}\n    products_db[counter] = p\n    return JSONResponse(status_code=201, content={"success": True, "data": p},\n        headers={"Location": f"/products/{counter}"})',
      explanation: 'Generic[T] позволяет использовать одну обёртку для любого типа данных. Location заголовок — стандарт REST для указания URL созданного ресурса. PagedResponse.pages вычисляется через округление вверх.'
    }
  ]
}
