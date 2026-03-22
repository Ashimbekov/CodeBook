export default {
  id: 12,
  title: 'Dependency Injection с Depends',
  description: 'Система зависимостей FastAPI: Depends(), кеширование зависимостей, вложенные зависимости, зависимости с yield, тестирование с переопределением зависимостей',
  lessons: [
    {
      id: 1,
      title: 'Основы Depends()',
      type: 'theory',
      content: [
        { type: 'text', value: 'Dependency Injection (DI) — паттерн, где зависимости (БД, auth) передаются в функцию снаружи, а не создаются внутри. FastAPI реализует DI через Depends(). Это делает код тестируемым и переиспользуемым.' },
        { type: 'heading', value: 'Первые зависимости' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, Depends\nfrom typing import Optional\n\napp = FastAPI()\n\n# Простая зависимость\ndef get_query_params(q: Optional[str] = None, page: int = 1, size: int = 10):\n    return {"q": q, "page": page, "size": size}\n\n@app.get("/items")\nasync def list_items(params: dict = Depends(get_query_params)):\n    # params = {"q": ..., "page": ..., "size": ...}\n    return params\n\n@app.get("/products")\nasync def list_products(params: dict = Depends(get_query_params)):\n    # Та же зависимость — переиспользование!\n    return params\n\n# Зависимость с валидацией\nfrom fastapi import Query\n\ndef pagination(page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100)):\n    return {"skip": (page - 1) * size, "limit": size}\n\n@app.get("/posts")\nasync def list_posts(p = Depends(pagination)):\n    return p  # {"skip": 0, "limit": 20}' }
      ]
    },
    {
      id: 2,
      title: 'Зависимости с yield: управление ресурсами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Зависимости с yield работают как контекстные менеджеры: код до yield выполняется до endpoint, код после — после. Идеально для управления соединениями с БД.' },
        { type: 'heading', value: 'DB Session через yield' },
        { type: 'code', language: 'python', value: 'from sqlalchemy.ext.asyncio import AsyncSession\nfrom database import SessionLocal\n\nasync def get_db() -> AsyncSession:\n    """Зависимость: сессия БД с автоматическим commit/rollback"""\n    async with SessionLocal() as session:\n        try:\n            yield session          # endpoint использует session\n            await session.commit() # после endpoint — commit\n        except Exception:\n            await session.rollback() # при ошибке — rollback\n            raise\n\n# Использование\n@app.get("/users/{user_id}")\nasync def get_user(\n    user_id: int,\n    db: AsyncSession = Depends(get_db)  # автоматически commit/rollback\n):\n    user = await db.get(User, user_id)\n    return user\n\n# Зависимость с несколькими ресурсами\nasync def get_resources():\n    redis = await get_redis_connection()\n    db = await get_db_connection()\n    try:\n        yield {"redis": redis, "db": db}\n    finally:\n        await redis.close()\n        await db.close()' }
      ]
    },
    {
      id: 3,
      title: 'Вложенные зависимости',
      type: 'theory',
      content: [
        { type: 'text', value: 'Зависимости могут иметь собственные зависимости. FastAPI строит граф зависимостей и разрешает их в правильном порядке, кешируя результат.' },
        { type: 'heading', value: 'Цепочка зависимостей' },
        { type: 'code', language: 'python', value: 'from fastapi import Depends, HTTPException\nfrom fastapi.security import OAuth2PasswordBearer\n\noauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")\n\n# Уровень 1: получить токен\nasync def get_token(token: str = Depends(oauth2_scheme)):\n    return token\n\n# Уровень 2: декодировать токен\nasync def get_token_data(token: str = Depends(get_token)):\n    payload = decode_jwt(token)\n    if not payload:\n        raise HTTPException(401, "Недействительный токен")\n    return payload\n\n# Уровень 3: получить пользователя из БД\nasync def get_current_user(\n    payload: dict = Depends(get_token_data),\n    db: AsyncSession = Depends(get_db)\n):\n    user_id = payload.get("sub")\n    user = await db.get(User, int(user_id))\n    if not user:\n        raise HTTPException(401, "Пользователь не найден")\n    return user\n\n# Уровень 4: проверить активность\nasync def get_active_user(user = Depends(get_current_user)):\n    if not user.is_active:\n        raise HTTPException(400, "Аккаунт отключён")\n    return user\n\n# В endpoint — только последняя зависимость!\n@app.get("/profile")\nasync def get_profile(user = Depends(get_active_user)):\n    return user  # Зависимости автоматически разрешены!' }
      ]
    },
    {
      id: 4,
      title: 'Класс-зависимость',
      type: 'theory',
      content: [
        { type: 'text', value: 'Класс с методом __call__ может быть зависимостью. Это удобно для зависимостей с конфигурацией.' },
        { type: 'heading', value: 'Callable класс как зависимость' },
        { type: 'code', language: 'python', value: 'class RequireRole:\n    def __init__(self, role: str):\n        self.role = role\n\n    async def __call__(self, current_user = Depends(get_current_user)):\n        if current_user.role != self.role and current_user.role != "ADMIN":\n            raise HTTPException(\n                status_code=403,\n                detail=f"Требуется роль: {self.role}"\n            )\n        return current_user\n\n# Создать экземпляры для разных ролей\nrequire_admin = RequireRole("ADMIN")\nrequire_moderator = RequireRole("MODERATOR")\n\n@app.delete("/posts/{post_id}")\nasync def delete_post(\n    post_id: int,\n    admin = Depends(require_admin)  # только ADMIN\n):\n    return {"deleted": post_id}\n\n# Зависимость с параметрами через Annotated\nfrom typing import Annotated\n\nAdminUser = Annotated[User, Depends(require_admin)]\nModeratorUser = Annotated[User, Depends(require_moderator)]\n\n@app.get("/admin/stats")\nasync def admin_stats(admin: AdminUser):\n    return {"stats": "..."}' }
      ]
    },
    {
      id: 5,
      title: 'Кеширование зависимостей',
      type: 'theory',
      content: [
        { type: 'text', value: 'По умолчанию FastAPI кеширует зависимость в рамках одного запроса: если несколько зависимостей вызывают get_db(), создаётся только одна сессия. Можно отключить через use_cache=False.' },
        { type: 'heading', value: 'Кеш зависимостей' },
        { type: 'code', language: 'python', value: 'async def get_db():\n    async with SessionLocal() as session:\n        yield session\n\n# Оба эндпоинта получат ОДНУ и ту же сессию!\nasync def get_user(db = Depends(get_db)):\n    return await db.get(User, 1)\n\nasync def get_product(db = Depends(get_db)):\n    return await db.get(Product, 1)\n\n@app.get("/page")\nasync def page(\n    user = Depends(get_user),      # get_db() вызван ОДИН раз!\n    product = Depends(get_product) # та же сессия\n):\n    return {"user": user, "product": product}\n\n# Отключить кеш (новый объект на каждый Depends)\n@app.get("/no-cache")\nasync def no_cache(\n    db1: AsyncSession = Depends(get_db),\n    db2: AsyncSession = Depends(get_db, use_cache=False)  # разные сессии!\n):\n    return {}' }
      ]
    },
    {
      id: 6,
      title: 'Переопределение зависимостей в тестах',
      type: 'theory',
      content: [
        { type: 'text', value: 'app.dependency_overrides позволяет заменить реальные зависимости на тестовые — подставить тестовую БД вместо продакшн, мок вместо реального сервиса.' },
        { type: 'heading', value: 'Тестирование с заменой зависимостей' },
        { type: 'code', language: 'python', value: 'import pytest\nfrom httpx import AsyncClient\nfrom sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker\n\n# Тестовая БД (SQLite в памяти)\nTEST_DB_URL = "sqlite+aiosqlite:///:memory:"\ntest_engine = create_async_engine(TEST_DB_URL)\nTestSessionLocal = async_sessionmaker(test_engine)\n\nasync def override_get_db():\n    """Тестовая версия get_db"""\n    async with TestSessionLocal() as session:\n        yield session\n        await session.rollback()  # откатывать после каждого теста!\n\n@pytest.fixture\nasync def client():\n    # Создать таблицы\n    async with test_engine.begin() as conn:\n        await conn.run_sync(Base.metadata.create_all)\n\n    # Заменить зависимость!\n    app.dependency_overrides[get_db] = override_get_db\n\n    async with AsyncClient(app=app, base_url="http://test") as c:\n        yield c\n\n    # Очистить\n    app.dependency_overrides.clear()\n    async with test_engine.begin() as conn:\n        await conn.run_sync(Base.metadata.drop_all)\n\nasync def test_create_user(client: AsyncClient):\n    response = await client.post("/users", json={\n        "name": "Алибек", "email": "a@mail.ru", "password": "Secret123!"\n    })\n    assert response.status_code == 201\n    assert response.json()["email"] == "a@mail.ru"' }
      ]
    },
    {
      id: 7,
      title: 'Практика: переиспользуемые зависимости',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте систему переиспользуемых зависимостей для блог-приложения: пагинация, фильтрация, аутентификация и авторизация.',
      requirements: [
        'PaginationDep: page, size → offset, limit с дефолтами',
        'SearchDep: q (Optional), sort_by, sort_order (asc/desc)',
        'get_db(): AsyncSession через yield с commit/rollback',
        'get_current_user(): декодирует JWT → User из БД',
        'get_active_user(): вызывает get_current_user() + проверка is_active',
        'OwnerOrAdmin: проверяет post.user_id == current_user.id OR role == ADMIN',
        'Endpoint GET /posts использует PaginationDep и SearchDep',
        'Endpoint DELETE /posts/{id} использует OwnerOrAdmin'
      ],
      hint: 'Annotated[T, Depends(func)] позволяет создавать type aliases для зависимостей. OwnerOrAdmin — класс __call__ с параметрами.',
      solution: 'from typing import Annotated, Optional\nfrom fastapi import Depends, Query, HTTPException\nfrom dataclasses import dataclass\n\n@dataclass\nclass PaginationParams:\n    page: int = Query(1, ge=1)\n    size: int = Query(20, ge=1, le=100)\n\n    @property\n    def offset(self) -> int:\n        return (self.page - 1) * self.size\n\n@dataclass\nclass SearchParams:\n    q: Optional[str] = Query(default=None, min_length=2)\n    sort_by: str = Query(default="created_at", pattern="^(created_at|title|updated_at)$")\n    sort_order: str = Query(default="desc", pattern="^(asc|desc)$")\n\nPaginationDep = Annotated[PaginationParams, Depends()]\nSearchDep = Annotated[SearchParams, Depends()]\nDBDep = Annotated[AsyncSession, Depends(get_db)]\nCurrentUser = Annotated[User, Depends(get_active_user)]\n\nclass OwnerOrAdmin:\n    def __init__(self, model):\n        self.model = model\n    async def __call__(self, id: int, user: CurrentUser, db: DBDep):\n        obj = await db.get(self.model, id)\n        if not obj: raise HTTPException(404, "Не найдено")\n        if obj.user_id != user.id and user.role != "ADMIN":\n            raise HTTPException(403, "Нет прав")\n        return obj\n\n@router.get("/posts")\nasync def list_posts(p: PaginationDep, s: SearchDep, db: DBDep):\n    return await crud.search_posts(db, s.q, s.sort_by, s.sort_order, p.offset, p.size)\n\n@router.delete("/posts/{id}")\nasync def delete_post(\n    post = Depends(OwnerOrAdmin(Post)),\n    db: DBDep = None\n):\n    await db.delete(post)\n    return {"deleted": True}',
      explanation: 'Annotated type aliases делают сигнатуры функций читаемыми: CurrentUser вместо Annotated[User, Depends(get_active_user)]. OwnerOrAdmin класс конфигурируется на этапе создания — разные ресурсы, один код.'
    }
  ]
}
