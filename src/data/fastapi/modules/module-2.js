export default {
  id: 2,
  title: 'Первое полноценное приложение',
  description: 'Построение полноценного FastAPI приложения: роутеры, обработка ошибок, статус коды, CORS и структура проекта',
  lessons: [
    {
      id: 1,
      title: 'APIRouter: разделение маршрутов',
      type: 'theory',
      content: [
        { type: 'text', value: 'APIRouter позволяет разделить маршруты по файлам и группировать их по функциональности. Это основа масштабируемой архитектуры FastAPI приложения.' },
        { type: 'heading', value: 'Создание Router' },
        { type: 'code', language: 'python', value: '# routers/products.py\nfrom fastapi import APIRouter\n\nrouter = APIRouter(\n    prefix="/api/products",  # добавляется к каждому пути\n    tags=["Продукты"],       # группировка в Swagger\n    responses={404: {"description": "Продукт не найден"}}  # общие ответы\n)\n\n@router.get("/")             # GET /api/products\nasync def list_products():\n    return []\n\n@router.get("/{product_id}") # GET /api/products/{product_id}\nasync def get_product(product_id: int):\n    return {"id": product_id}\n\n# main.py\nfrom fastapi import FastAPI\nfrom routers import products, users, orders\n\napp = FastAPI(title="Shop API")\n\napp.include_router(products.router)\napp.include_router(users.router)\napp.include_router(orders.router, prefix="/api/v1")  # добавить дополнительный префикс' }
      ]
    },
    {
      id: 2,
      title: 'HTTP статус коды',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильные статус коды — признак хорошего API. FastAPI позволяет указывать статус код по умолчанию через status_code и возвращать разные коды через Response.' },
        { type: 'heading', value: 'Статус коды в FastAPI' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, status\nfrom fastapi.responses import JSONResponse, Response\n\napp = FastAPI()\n\n# status_code=201 — код по умолчанию для этого эндпоинта\n@app.post("/users", status_code=status.HTTP_201_CREATED)\nasync def create_user(name: str):\n    return {"id": 1, "name": name}\n\n# Возвращать разные коды в зависимости от ситуации\n@app.get("/users/{user_id}")\nasync def get_user(user_id: int):\n    if user_id == 0:\n        return JSONResponse(\n            status_code=status.HTTP_400_BAD_REQUEST,\n            content={"detail": "ID не может быть 0"}\n        )\n    if user_id > 1000:\n        return JSONResponse(\n            status_code=status.HTTP_404_NOT_FOUND,\n            content={"detail": "Пользователь не найден"}\n        )\n    return {"id": user_id}\n\n# 204 No Content для удаления\n@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)\nasync def delete_user(user_id: int):\n    # удалить пользователя\n    return Response(status_code=204)  # нет тела ответа' }
      ]
    },
    {
      id: 3,
      title: 'HTTPException и обработка ошибок',
      type: 'theory',
      content: [
        { type: 'text', value: 'HTTPException — стандартный способ вернуть HTTP ошибку в FastAPI. Для кастомных ошибок используй Exception handlers.' },
        { type: 'heading', value: 'HTTPException' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, HTTPException\n\napp = FastAPI()\n\nfake_db = {1: "Алибек", 2: "Дана"}\n\n@app.get("/users/{user_id}")\nasync def get_user(user_id: int):\n    if user_id not in fake_db:\n        raise HTTPException(\n            status_code=404,\n            detail=f"Пользователь с ID {user_id} не найден",\n            headers={"X-Error": "UserNotFound"}  # дополнительные заголовки\n        )\n    return {"id": user_id, "name": fake_db[user_id]}' },
        { type: 'heading', value: 'Кастомные Exception Handlers' },
        { type: 'code', language: 'python', value: 'from fastapi import Request\nfrom fastapi.responses import JSONResponse\n\nclass UserNotFoundException(Exception):\n    def __init__(self, user_id: int):\n        self.user_id = user_id\n\n@app.exception_handler(UserNotFoundException)\nasync def user_not_found_handler(request: Request, exc: UserNotFoundException):\n    return JSONResponse(\n        status_code=404,\n        content={\n            "error": "UserNotFound",\n            "message": f"Пользователь {exc.user_id} не найден",\n            "path": str(request.url)\n        }\n    )\n\n@app.get("/users/{user_id}")\nasync def get_user(user_id: int):\n    if user_id not in fake_db:\n        raise UserNotFoundException(user_id)  # красиво и чисто!' }
      ]
    },
    {
      id: 4,
      title: 'CORS настройка',
      type: 'theory',
      content: [
        { type: 'text', value: 'CORS (Cross-Origin Resource Sharing) — браузерная защита, запрещающая запросы к API с другого домена. FastAPI предоставляет CORSMiddleware для настройки.' },
        { type: 'heading', value: 'Настройка CORS' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\n\napp = FastAPI()\n\n# Разрешить запросы только с указанных доменов\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=[\n        "http://localhost:3000",      # React dev server\n        "https://myapp.kz",           # production frontend\n    ],\n    allow_credentials=True,\n    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],\n    allow_headers=["*"],\n)\n\n# Для разработки — разрешить все (небезопасно в продакшене!)\n# allow_origins=["*"]' },
        { type: 'warning', value: 'allow_origins=["*"] с allow_credentials=True не работает — браузер запрещает такую комбинацию. В продакшене перечисляй конкретные домены.' }
      ]
    },
    {
      id: 5,
      title: 'Middleware',
      type: 'theory',
      content: [
        { type: 'text', value: 'Middleware — функции, которые выполняются до и после каждого запроса. Используются для: логирования, измерения времени, добавления заголовков.' },
        { type: 'heading', value: 'Кастомный Middleware' },
        { type: 'code', language: 'python', value: 'import time\nimport logging\nfrom fastapi import FastAPI, Request\n\napp = FastAPI()\n\nlogger = logging.getLogger(__name__)\n\n@app.middleware("http")\nasync def log_requests(request: Request, call_next):\n    start = time.time()\n\n    # Код ПЕРЕД запросом\n    logger.info(f"→ {request.method} {request.url}")\n\n    response = await call_next(request)\n\n    # Код ПОСЛЕ запроса\n    duration = time.time() - start\n    response.headers["X-Process-Time"] = str(duration)\n    logger.info(f"← {response.status_code} ({duration:.3f}s)")\n\n    return response' }
      ]
    },
    {
      id: 6,
      title: 'Lifespan: startup и shutdown события',
      type: 'theory',
      content: [
        { type: 'text', value: 'Lifespan позволяет выполнить код при старте и остановке приложения: подключить к БД, загрузить ML модель, закрыть соединения.' },
        { type: 'heading', value: 'Lifespan контекстный менеджер' },
        { type: 'code', language: 'python', value: 'from contextlib import asynccontextmanager\nfrom fastapi import FastAPI\n\n@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    # Startup: выполняется при старте\n    print("Запуск приложения...")\n    # Подключить к БД, кешу и тд\n    await database.connect()\n    print("Приложение готово")\n\n    yield  # Здесь приложение работает\n\n    # Shutdown: выполняется при остановке\n    print("Остановка приложения...")\n    await database.disconnect()\n    print("Приложение остановлено")\n\napp = FastAPI(lifespan=lifespan)' },
        { type: 'tip', value: 'Lifespan — современный способ (FastAPI 0.93+). Старый способ через @app.on_event("startup") ещё работает, но устарел.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: API для библиотеки книг',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте API для библиотеки книг с роутерами, правильными статус кодами и обработкой ошибок.',
      requirements: [
        'Раздели код на файлы: main.py, routers/books.py, routers/authors.py',
        'GET /api/books — список книг',
        'GET /api/books/{book_id} — книга или 404',
        'POST /api/books — создать книгу (201)',
        'DELETE /api/books/{book_id} — удалить (204) или 404',
        'Кастомный exception handler для BookNotFoundException',
        'Настрой CORS для http://localhost:3000',
        'Middleware для логирования времени запросов'
      ],
      hint: 'Используй глобальный dict для хранения книг. include_router в main.py для подключения роутеров.',
      expectedOutput: 'GET /api/books → 200 OK, body: []\nPOST /api/books?title=Мастер+и+Маргарита&author=Булгаков → 201 Created, body: {"id": 1, "title": "Мастер и Маргарита", "author": "Булгаков"}\nGET /api/books/1 → 200 OK, body: {"id": 1, "title": "Мастер и Маргарита", "author": "Булгаков"}\nGET /api/books/99 → 404 Not Found, body: {"detail": "Книга не найдена"}\nDELETE /api/books/1 → 204 No Content\nHeaders: X-Time: 0.001 (middleware добавляет время обработки)',
      solution: '# main.py\nfrom fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom routers import books\nimport time\n\napp = FastAPI(title="Библиотека API")\n\napp.add_middleware(CORSMiddleware,\n    allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])\n\n@app.middleware("http")\nasync def timing(request, call_next):\n    start = time.time()\n    response = await call_next(request)\n    response.headers["X-Time"] = f"{time.time()-start:.3f}"\n    return response\n\napp.include_router(books.router)\n\n# routers/books.py\nfrom fastapi import APIRouter, HTTPException\n\nrouter = APIRouter(prefix="/api/books", tags=["Книги"])\nbooks_db = {}\ncounter = 0\n\n@router.get("/")\nasync def list_books(): return list(books_db.values())\n\n@router.get("/{book_id}")\nasync def get_book(book_id: int):\n    if book_id not in books_db: raise HTTPException(404, "Книга не найдена")\n    return books_db[book_id]\n\n@router.post("/", status_code=201)\nasync def create_book(title: str, author: str):\n    global counter; counter += 1\n    book = {"id": counter, "title": title, "author": author}\n    books_db[counter] = book; return book\n\n@router.delete("/{book_id}", status_code=204)\nasync def delete_book(book_id: int):\n    if book_id not in books_db: raise HTTPException(404, "Книга не найдена")\n    del books_db[book_id]',
      explanation: 'APIRouter с prefix и tags организует код. CORSMiddleware должна быть зарегистрирована до include_router. Кастомный Middleware добавляет заголовок времени обработки.'
    }
  ]
}
