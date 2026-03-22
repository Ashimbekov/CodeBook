export default {
  id: 21,
  title: 'Best Practices',
  description: 'Лучшие практики FastAPI: структура проекта, обработка конфигурации, логирование, безопасность, версионирование API и принципы чистого кода',
  lessons: [
    {
      id: 1,
      title: 'Структура проекта',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая структура проекта облегчает масштабирование и командную разработку. Разделяй код по функциональным областям, используй APIRouter для модульности.' },
        { type: 'code', language: 'python', value: '# Рекомендуемая структура проекта:\n#\n# myapp/\n# |-- app/\n# |   |-- __init__.py\n# |   |-- main.py          # точка входа, создание app\n# |   |-- config.py        # настройки приложения\n# |   |-- database.py      # подключение к БД\n# |   |-- dependencies.py  # общие зависимости\n# |   |-- models/          # SQLAlchemy модели\n# |   |   |-- __init__.py\n# |   |   |-- user.py\n# |   |   |-- item.py\n# |   |-- schemas/         # Pydantic схемы\n# |   |   |-- user.py\n# |   |   |-- item.py\n# |   |-- routers/         # APIRouter по доменам\n# |   |   |-- users.py\n# |   |   |-- items.py\n# |   |   |-- auth.py\n# |   |-- services/        # бизнес-логика\n# |   |   |-- user_service.py\n# |   |   |-- item_service.py\n# |   |-- utils/           # вспомогательные функции\n# |-- tests/\n# |   |-- conftest.py\n# |   |-- test_users.py\n# |-- .env\n# |-- requirements.txt\n# |-- Dockerfile\n\nprint("Разделяй код по слоям: routers -> services -> models")' },
        { type: 'tip', value: 'Разделение на routers/services/models следует принципу Single Responsibility. Router принимает HTTP-запрос, Service содержит бизнес-логику, Model описывает данные. Это облегчает тестирование каждого слоя отдельно.' }
      ]
    },
    {
      id: 2,
      title: 'Паттерн Repository',
      type: 'theory',
      content: [
        { type: 'text', value: 'Repository паттерн изолирует логику доступа к данным от бизнес-логики. Роутер вызывает service, service вызывает repository, repository работает с БД.' },
        { type: 'code', language: 'python', value: 'from sqlalchemy.orm import Session\nfrom typing import List, Optional\nfrom models.item import Item\nfrom schemas.item import ItemCreate, ItemUpdate\n\n# repository/item_repository.py\nclass ItemRepository:\n    def __init__(self, db: Session):\n        self.db = db\n\n    def get(self, item_id: int) -> Optional[Item]:\n        return self.db.query(Item).filter(Item.id == item_id).first()\n\n    def get_all(self, skip: int = 0, limit: int = 100) -> List[Item]:\n        return self.db.query(Item).offset(skip).limit(limit).all()\n\n    def create(self, item_data: ItemCreate) -> Item:\n        item = Item(**item_data.dict())\n        self.db.add(item)\n        self.db.commit()\n        self.db.refresh(item)\n        return item\n\n    def update(self, item: Item, update_data: ItemUpdate) -> Item:\n        for field, value in update_data.dict(exclude_unset=True).items():\n            setattr(item, field, value)\n        self.db.commit()\n        self.db.refresh(item)\n        return item\n\n    def delete(self, item: Item) -> None:\n        self.db.delete(item)\n        self.db.commit()\n\n# services/item_service.py\nclass ItemService:\n    def __init__(self, repo: ItemRepository):\n        self.repo = repo\n\n    def get_item_or_404(self, item_id: int) -> Item:\n        item = self.repo.get(item_id)\n        if not item:\n            raise HTTPException(404, f"Товар {item_id} не найден")\n        return item' },
        { type: 'heading', value: 'Dependency Injection для Repository' },
        { type: 'code', language: 'python', value: '# Внедрение зависимостей (Dependency Injection) в FastAPI\nfrom fastapi import Depends\nfrom sqlalchemy.orm import Session\nfrom database import get_db\n\n# Функция-фабрика для создания репозитория\ndef get_item_repo(db: Session = Depends(get_db)) -> ItemRepository:\n    return ItemRepository(db)\n\n# Функция-фабрика для создания сервиса\ndef get_item_service(repo: ItemRepository = Depends(get_item_repo)) -> ItemService:\n    return ItemService(repo)\n\n# routers/items.py\nfrom fastapi import APIRouter, Depends\n\nrouter = APIRouter(prefix="/items", tags=["Товары"])\n\n@router.get("/{item_id}")\ndef get_item(\n    item_id: int,\n    service: ItemService = Depends(get_item_service)\n):\n    return service.get_item_or_404(item_id)\n\n@router.post("/", status_code=201)\ndef create_item(\n    data: ItemCreate,\n    service: ItemService = Depends(get_item_service)\n):\n    return service.create(data)' },
        { type: 'heading', value: 'Структура проекта с Repository паттерном' },
        { type: 'code', language: 'python', value: '# Рекомендуемая структура:\n# app/\n# |-- main.py            # Создание app, подключение роутеров\n# |-- database.py        # Движок БД и сессия\n# |-- models/            # SQLAlchemy модели\n# |   |-- item.py\n# |   |-- user.py\n# |-- schemas/           # Pydantic схемы (DTO)\n# |   |-- item.py        # ItemCreate, ItemUpdate, ItemResponse\n# |   |-- user.py\n# |-- repositories/      # Доступ к данным\n# |   |-- item_repo.py\n# |   |-- user_repo.py\n# |-- services/          # Бизнес-логика\n# |   |-- item_service.py\n# |-- routers/           # HTTP роутеры\n# |   |-- items.py\n# |   |-- users.py\n\n# Преимущества:\n# 1. Можно заменить БД без изменения бизнес-логики\n# 2. Репозиторий легко мокировать в тестах\n# 3. Чёткое разделение ответственности' },
        { type: 'tip', value: 'Для тестирования сервисов создавай mock-репозиторий: просто класс с теми же методами но возвращающий фиктивные данные без обращения к БД. Это делает юнит-тесты быстрыми и изолированными.' }
      ]
    },
    {
      id: 3,
      title: 'Версионирование API',
      type: 'theory',
      content: [
        { type: 'text', value: 'Версионирование API позволяет вносить breaking changes не ломая существующих клиентов. Распространённый подход — версия в URL: /api/v1/users, /api/v2/users.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, APIRouter\n\n# routers/v1/users.py\nv1_router = APIRouter()\n\n@v1_router.get("/users/{user_id}")\ndef get_user_v1(user_id: int):\n    return {"id": user_id, "name": "Анна"}  # старый формат\n\n# routers/v2/users.py\nv2_router = APIRouter()\n\n@v2_router.get("/users/{user_id}")\ndef get_user_v2(user_id: int):\n    return {  # новый расширенный формат\n        "id": user_id,\n        "name": "Анна",\n        "profile": {"avatar": "url", "bio": "..."},\n        "metadata": {"created_at": "2024-01-01"}\n    }\n\n# main.py\napp = FastAPI(\n    title="My API",\n    docs_url=None  # отключаем дефолтную документацию\n)\n\napi_v1 = FastAPI(title="API v1")\napi_v2 = FastAPI(title="API v2")\n\napi_v1.include_router(v1_router)\napi_v2.include_router(v2_router)\n\napp.mount("/api/v1", api_v1)\napp.mount("/api/v2", api_v2)' },
        { type: 'note', value: 'Не удаляй старые версии сразу — дай клиентам время на миграцию. Документируй в changelog что изменилось между версиями. Устаревшую версию помечай как deprecated в документации.' }
      ]
    },
    {
      id: 4,
      title: 'Логирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошее логирование незаменимо для отладки продакшн-проблем. Используй структурированное логирование в JSON-формате для удобного поиска в системах мониторинга.' },
        { type: 'code', language: 'python', value: 'import logging\nimport json\nimport sys\nfrom datetime import datetime\nfrom fastapi import FastAPI, Request\n\n# Настройка логирования\nclass JSONFormatter(logging.Formatter):\n    def format(self, record):\n        return json.dumps({\n            "timestamp": datetime.utcnow().isoformat(),\n            "level": record.levelname,\n            "message": record.getMessage(),\n            "module": record.module,\n            "function": record.funcName\n        })\n\nhandler = logging.StreamHandler(sys.stdout)\nhandler.setFormatter(JSONFormatter())\n\nlogger = logging.getLogger("myapp")\nlogger.addHandler(handler)\nlogger.setLevel(logging.INFO)\n\napp = FastAPI()\n\n@app.middleware("http")\nasync def log_requests(request: Request, call_next):\n    logger.info(f"Request: {request.method} {request.url.path}")\n    response = await call_next(request)\n    logger.info(f"Response: {response.status_code}")\n    return response\n\n@app.get("/items/{item_id}")\ndef get_item(item_id: int):\n    logger.info(f"Fetching item {item_id}")\n    if item_id == 0:\n        logger.warning(f"Invalid item_id: {item_id}")\n        raise HTTPException(400, "Invalid ID")\n    return {"id": item_id}' },
        { type: 'tip', value: 'В продакшне используй уровень INFO или WARNING. DEBUG генерирует слишком много данных. Структурированный JSON в логах позволяет быстро искать по полям в ELK Stack, Datadog или Grafana Loki.' }
      ]
    },
    {
      id: 5,
      title: 'Безопасность: основные практики',
      type: 'theory',
      content: [
        { type: 'text', value: 'Безопасность должна быть встроена в приложение с самого начала. Основные аспекты: CORS, rate limiting, валидация входных данных, HTTPS.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom slowapi import Limiter, _rate_limit_exceeded_handler\nfrom slowapi.util import get_remote_address\nfrom slowapi.errors import RateLimitExceeded\n\napp = FastAPI()\n\n# CORS — только разрешённые домены\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=["https://myfrontend.com"],  # НЕ "*" в продакшне!\n    allow_credentials=True,\n    allow_methods=["GET", "POST", "PUT", "DELETE"],\n    allow_headers=["Authorization", "Content-Type"]\n)\n\n# Rate limiting\nlimiter = Limiter(key_func=get_remote_address)\napp.state.limiter = limiter\napp.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)\n\nfrom slowapi.extension import Limiter\nfrom fastapi import Request\n\n@app.get("/api/search")\n@limiter.limit("10/minute")  # максимум 10 запросов в минуту\nasync def search(request: Request, query: str):\n    return {"results": []}\n\n# Никогда не логируй пароли и токены!\ndef login(username: str, password: str):\n    logger.info(f"Login attempt: {username}")  # OK\n    # logger.info(f"Password: {password}")  # НИКОГДА!' },
        { type: 'warning', value: 'allow_origins=["*"] в продакшне — это дыра в безопасности. Всегда указывай конкретные домены. HTTPS обязателен в продакшне — никогда не передавай токены по незащищённому HTTP.' }
      ]
    },
    {
      id: 6,
      title: 'Обработка жизненного цикла приложения',
      type: 'theory',
      content: [
        { type: 'text', value: 'lifespan контекстный менеджер позволяет выполнять код при запуске и остановке приложения: инициализация пула соединений, прогрев кэша, освобождение ресурсов.' },
        { type: 'code', language: 'python', value: 'from contextlib import asynccontextmanager\nfrom fastapi import FastAPI\nimport redis.asyncio as aioredis\n\n# Глобальные ресурсы\nredis_client = None\ndb_engine = None\n\n@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    # Startup: инициализация ресурсов\n    global redis_client, db_engine\n    print("Запуск приложения...")\n\n    redis_client = aioredis.from_url("redis://localhost:6379")\n    await redis_client.ping()\n    print("Redis подключён")\n\n    # Здесь можно создать engine, запустить миграции...\n    print("Приложение готово к работе")\n\n    yield  # Приложение работает\n\n    # Shutdown: освобождение ресурсов\n    print("Остановка приложения...")\n    await redis_client.close()\n    print("Redis отключён")\n\napp = FastAPI(lifespan=lifespan)\n\n@app.get("/cache/{key}")\nasync def get_from_cache(key: str):\n    value = await redis_client.get(key)\n    return {"key": key, "value": value}' },
        { type: 'tip', value: 'lifespan заменяет устаревшие @app.on_event("startup") и @app.on_event("shutdown"). Используй его для всего что нужно инициализировать один раз: DB connections, HTTP clients, ML-модели.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Рефакторинг API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Рефакторинг плохо организованного FastAPI-приложения с применением лучших практик.',
      requirements: [
        'Разбить монолитный main.py на роутеры (users, items), сервисы и схемы',
        'Реализовать Repository для users с методами get, get_all, create, delete',
        'Settings на базе BaseSettings с env-переменными',
        'Структурированное логирование каждого запроса с уровнями INFO/WARNING',
        'CORS с конкретным origin (не *)',
        'Versioned API: /api/v1/users/ и /api/v1/items/'
      ],
      expectedOutput: 'Структура: app/routers/, app/schemas/, app/services/, app/config.py\nGET /api/v1/users/ -> [{"id": 1, "name": "Анна", ...}]\nLogs: {"timestamp": "...", "level": "INFO", "message": "GET /api/v1/users/"}',
      hint: 'Создай отдельные файлы: config.py (Settings), database.py (get_db), routers/users.py (APIRouter). В main.py только создавай app и подключай роутеры через include_router.',
      solution: '# config.py\nfrom pydantic_settings import BaseSettings\nfrom functools import lru_cache\n\nclass Settings(BaseSettings):\n    app_name: str = "Shop API"\n    version: str = "1.0.0"\n    allowed_origins: list = ["http://localhost:3000"]\n    class Config:\n        env_file = ".env"\n\n@lru_cache()\ndef get_settings(): return Settings()\n\n# schemas/user.py\nfrom pydantic import BaseModel\nfrom typing import Optional\n\nclass UserCreate(BaseModel):\n    name: str\n    email: str\n\nclass UserResponse(BaseModel):\n    id: int\n    name: str\n    email: str\n\n# services/user_repository.py\nfrom typing import Dict, Optional, List\n\nclass UserRepository:\n    def __init__(self):\n        self._db: Dict[int, dict] = {}\n        self._next_id = 1\n\n    def get(self, user_id: int) -> Optional[dict]:\n        return self._db.get(user_id)\n\n    def get_all(self) -> List[dict]:\n        return list(self._db.values())\n\n    def create(self, name: str, email: str) -> dict:\n        user = {"id": self._next_id, "name": name, "email": email}\n        self._db[self._next_id] = user\n        self._next_id += 1\n        return user\n\nuser_repo = UserRepository()\n\n# routers/v1/users.py\nfrom fastapi import APIRouter, HTTPException\nrouter = APIRouter()\n\n@router.get("/", response_model=list)\ndef list_users():\n    return user_repo.get_all()\n\n@router.post("/", status_code=201)\ndef create_user(name: str, email: str):\n    return user_repo.create(name, email)\n\n# main.py\nimport logging, json, sys\nfrom fastapi import FastAPI, Request\nfrom fastapi.middleware.cors import CORSMiddleware\n\nlogger = logging.getLogger("app")\nlogger.addHandler(logging.StreamHandler(sys.stdout))\nlogger.setLevel(logging.INFO)\n\napp = FastAPI(title="Shop API")\napp.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3000"], allow_methods=["*"], allow_headers=["*"])\n\n@app.middleware("http")\nasync def log_requests(request: Request, call_next):\n    logger.info(f"GET {request.url.path}")\n    return await call_next(request)\n\napi_v1 = FastAPI()\napi_v1.include_router(router, prefix="/users")\napp.mount("/api/v1", api_v1)',
      explanation: 'Каждый слой имеет свою ответственность. config.py хранит настройки, Repository инкапсулирует работу с данными, Router обрабатывает HTTP. CORS ограничен конкретным origin. Версионирование через mount позволяет добавить /api/v2 без ломания существующего API. Логирование в middleware покрывает все запросы автоматически.'
    }
  ]
}
