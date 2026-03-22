export default {
  id: 20,
  title: 'Async и производительность',
  description: 'Асинхронное программирование в FastAPI: async/await, asyncio, конкурентность, кэширование Redis, профилирование и оптимизация производительности',
  lessons: [
    {
      id: 1,
      title: 'Async/await в FastAPI: как это работает',
      type: 'theory',
      content: [
        { type: 'text', value: 'FastAPI построен на Starlette и работает поверх asyncio. Async-эндпоинты выполняются в event loop без блокировки. Sync-эндпоинты автоматически выполняются в пуле потоков.' },
        { type: 'code', language: 'python', value: 'import asyncio\nimport httpx\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n# ПРАВИЛЬНО: async для I/O операций\n@app.get("/users/{user_id}")\nasync def get_user(user_id: int):\n    # Асинхронный HTTP запрос — не блокирует event loop\n    async with httpx.AsyncClient() as client:\n        response = await client.get(f"https://api.example.com/users/{user_id}")\n    return response.json()\n\n# ПРАВИЛЬНО: sync для CPU-операций или legacy-кода\n@app.get("/compute/{n}")\ndef heavy_compute(n: int):\n    # Блокирующая операция — FastAPI запустит в thread pool\n    result = sum(i * i for i in range(n))\n    return {"result": result}\n\n# НЕПРАВИЛЬНО: не используй синхронный sleep в async\n@app.get("/bad-example")\nasync def bad_example():\n    import time\n    time.sleep(1)  # БЛОКИРУЕТ event loop! Вся программа зависает\n    return {"status": "done"}' },
        { type: 'tip', value: 'Правило: если используешь async def — внутри используй только async-библиотеки (httpx, asyncpg, aiofiles). Если используешь синхронные блокирующие вызовы — используй def (без async), и FastAPI поместит его в thread pool.' }
      ]
    },
    {
      id: 2,
      title: 'Конкурентные запросы с asyncio.gather',
      type: 'theory',
      content: [
        { type: 'text', value: 'asyncio.gather() позволяет выполнять несколько async-операций параллельно. Вместо последовательного ожидания — все запросы идут одновременно.' },
        { type: 'code', language: 'python', value: 'import asyncio\nimport httpx\nimport time\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\nasync def fetch_user(client: httpx.AsyncClient, user_id: int):\n    response = await client.get(f"https://jsonplaceholder.typicode.com/users/{user_id}")\n    return response.json()\n\nasync def fetch_post(client: httpx.AsyncClient, post_id: int):\n    response = await client.get(f"https://jsonplaceholder.typicode.com/posts/{post_id}")\n    return response.json()\n\n@app.get("/dashboard/{user_id}")\nasync def get_dashboard(user_id: int):\n    start = time.time()\n\n    async with httpx.AsyncClient() as client:\n        # Параллельные запросы — займёт время одного запроса, не трёх\n        user, post1, post2 = await asyncio.gather(\n            fetch_user(client, user_id),\n            fetch_post(client, 1),\n            fetch_post(client, 2)\n        )\n\n    elapsed = time.time() - start\n    return {\n        "user": user,\n        "recent_posts": [post1, post2],\n        "fetch_time": f"{elapsed:.2f}s"\n    }' },
        { type: 'note', value: 'asyncio.gather() возвращает список результатов в том же порядке что и задачи. Если одна задача упадёт с ошибкой, gather() также поднимет исключение. Для более гибкой обработки ошибок используй return_exceptions=True.' }
      ]
    },
    {
      id: 3,
      title: 'Async база данных: asyncpg и SQLAlchemy async',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для максимальной производительности используй асинхронные драйверы баз данных. SQLAlchemy 2.0 поддерживает async через asyncpg (PostgreSQL) и aiosqlite (SQLite).' },
        { type: 'code', language: 'python', value: 'from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession\nfrom sqlalchemy.ext.asyncio import async_sessionmaker\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column\nfrom sqlalchemy import select\nfrom fastapi import FastAPI, Depends\nfrom typing import AsyncGenerator\n\nDATABASE_URL = "postgresql+asyncpg://user:pass@localhost/mydb"\n\nengine = create_async_engine(DATABASE_URL, echo=True)\nAsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)\n\nclass Base(DeclarativeBase):\n    pass\n\nclass User(Base):\n    __tablename__ = "users"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str]\n\nasync def get_db() -> AsyncGenerator[AsyncSession, None]:\n    async with AsyncSessionLocal() as session:\n        yield session\n\napp = FastAPI()\n\n@app.get("/users/")\nasync def get_users(db: AsyncSession = Depends(get_db)):\n    result = await db.execute(select(User))\n    users = result.scalars().all()\n    return users\n\n@app.post("/users/")\nasync def create_user(name: str, db: AsyncSession = Depends(get_db)):\n    user = User(name=name)\n    db.add(user)\n    await db.commit()\n    await db.refresh(user)\n    return user' },
        { type: 'tip', value: 'expire_on_commit=False важно для async — после commit() объекты не должны делать дополнительные запросы к БД (lazy loading не работает в async контексте). Используй eager loading через joinedload().' }
      ]
    },
    {
      id: 4,
      title: 'Кэширование с Redis',
      type: 'theory',
      content: [
        { type: 'text', value: 'Redis кэширует дорогостоящие запросы к базе данных или вычисления. С aioredis кэш работает асинхронно и не блокирует event loop.' },
        { type: 'code', language: 'python', value: 'import json\nimport redis.asyncio as aioredis\nfrom fastapi import FastAPI, Depends\nfrom typing import Optional\n\napp = FastAPI()\n\nasync def get_redis():\n    client = aioredis.from_url("redis://localhost:6379")\n    try:\n        yield client\n    finally:\n        await client.close()\n\nasync def get_cached_or_fetch(\n    key: str,\n    fetch_func,\n    redis: aioredis.Redis,\n    ttl: int = 300  # 5 минут\n):\n    """Универсальная функция кэширования"""\n    # Пробуем получить из кэша\n    cached = await redis.get(key)\n    if cached:\n        return json.loads(cached)\n\n    # Получаем из источника\n    data = await fetch_func()\n\n    # Сохраняем в кэш\n    await redis.setex(key, ttl, json.dumps(data))\n    return data\n\n@app.get("/products/{product_id}")\nasync def get_product(\n    product_id: int,\n    redis: aioredis.Redis = Depends(get_redis)\n):\n    async def fetch():\n        # Имитация запроса к БД\n        return {"id": product_id, "name": "Ноутбук", "price": 50000}\n\n    return await get_cached_or_fetch(\n        f"product:{product_id}",\n        fetch,\n        redis,\n        ttl=600\n    )' },
        { type: 'note', value: 'TTL (time-to-live) определяет как долго данные хранятся в кэше. Для часто меняющихся данных — короткий TTL (30-60 сек). Для редко меняющихся (каталог товаров) — длинный (1-24 часа). При обновлении данных явно инвалидируй кэш: redis.delete(key).' }
      ]
    },
    {
      id: 5,
      title: 'Профилирование и мониторинг',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для оптимизации нужно знать что именно медленно. Middleware для замера времени запросов и интеграция с Prometheus для метрик.' },
        { type: 'code', language: 'python', value: 'import time\nfrom fastapi import FastAPI, Request\nfrom starlette.middleware.base import BaseHTTPMiddleware\n\napp = FastAPI()\n\nclass TimingMiddleware(BaseHTTPMiddleware):\n    async def dispatch(self, request: Request, call_next):\n        start = time.time()\n        response = await call_next(request)\n        process_time = time.time() - start\n\n        # Добавляем заголовок с временем обработки\n        response.headers["X-Process-Time"] = f"{process_time:.4f}"\n\n        # Логируем медленные запросы\n        if process_time > 1.0:\n            print(f"SLOW: {request.method} {request.url.path} {process_time:.2f}s")\n\n        return response\n\napp.add_middleware(TimingMiddleware)\n\n# Метрики для Prometheus (через prometheus-fastapi-instrumentator)\n# pip install prometheus-fastapi-instrumentator\nfrom prometheus_fastapi_instrumentator import Instrumentator\n\n# Instrumentator().instrument(app).expose(app)\n# Метрики доступны на /metrics\n\n@app.get("/slow-endpoint")\nasync def slow_endpoint():\n    await asyncio.sleep(2)  # Имитация медленной операции\n    return {"data": "result"}' },
        { type: 'tip', value: 'X-Process-Time заголовок удобен в разработке — видишь время прямо в браузере/Postman. В продакшне используй Prometheus + Grafana для визуализации метрик и настройки алертов на медленные запросы.' }
      ]
    },
    {
      id: 6,
      title: 'Connection Pool и оптимизация запросов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Connection pool переиспользует соединения с базой данных, избегая дорогостоящего создания нового соединения при каждом запросе.' },
        { type: 'code', language: 'python', value: 'from sqlalchemy.ext.asyncio import create_async_engine\nfrom sqlalchemy.pool import NullPool\n\n# Настройка connection pool\nengine = create_async_engine(\n    "postgresql+asyncpg://user:pass@localhost/mydb",\n    pool_size=20,          # максимум соединений в пуле\n    max_overflow=10,       # дополнительные при пиковой нагрузке\n    pool_timeout=30,       # ожидание свободного соединения (сек)\n    pool_recycle=1800,     # переиспользование соединений каждые 30 мин\n    echo=False             # отключить SQL-логирование в продакшне\n)\n\n# Оптимизация N+1 проблемы через joinedload\nfrom sqlalchemy.orm import selectinload\nfrom sqlalchemy import select\n\nasync def get_orders_with_items(db):\n    # ПЛОХО: N+1 запросов\n    # orders = await db.execute(select(Order))\n    # for order in orders: order.items  # каждый раз запрос!\n\n    # ХОРОШО: один запрос с JOIN\n    result = await db.execute(\n        select(Order).options(selectinload(Order.items))\n    )\n    return result.scalars().all()' },
        { type: 'note', value: 'N+1 проблема: 1 запрос на список заказов + N запросов для товаров каждого заказа. При 100 заказах — 101 запрос вместо одного. selectinload() и joinedload() решают эту проблему.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Оптимизированный API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай высокопроизводительный API с кэшированием, конкурентными запросами и замером производительности.',
      requirements: [
        'TimingMiddleware добавляет заголовок X-Process-Time к каждому ответу',
        'GET /products/ — список товаров с кэшированием в Redis на 60 секунд',
        'GET /dashboard/{user_id} — агрегирует данные из 3 источников параллельно с asyncio.gather',
        'POST /cache/clear/{key} — инвалидация кэша по ключу',
        'GET /stats — статистика: количество запросов, среднее время ответа',
        'Медленные запросы (> 0.5s) логируются в файл slow.log'
      ],
      expectedOutput: 'GET /products/ (первый раз) -> 250ms, X-Process-Time: 0.2500\nGET /products/ (второй раз, кэш) -> 5ms, X-Process-Time: 0.0050\nGET /dashboard/1 -> три источника данных параллельно, 300ms',
      hint: 'Используй словарь stats_data = {"requests": 0, "total_time": 0.0} для хранения статистики. asyncio.gather() запускает корутины параллельно. json.dumps/loads для сериализации кэша.',
      solution: 'import asyncio\nimport json\nimport time\nfrom collections import defaultdict\nfrom fastapi import FastAPI, Request\nfrom starlette.middleware.base import BaseHTTPMiddleware\n\napp = FastAPI()\n\n# In-memory кэш (в реальности — Redis)\ncache = {}\ncache_ttl = {}\n\n# Статистика\nstats = {"requests": 0, "total_time": 0.0}\n\nclass TimingMiddleware(BaseHTTPMiddleware):\n    async def dispatch(self, request: Request, call_next):\n        start = time.time()\n        response = await call_next(request)\n        elapsed = time.time() - start\n        stats["requests"] += 1\n        stats["total_time"] += elapsed\n        response.headers["X-Process-Time"] = f"{elapsed:.4f}"\n        if elapsed > 0.5:\n            with open("slow.log", "a") as f:\n                f.write(f"{request.method} {request.url.path} {elapsed:.2f}s\\n")\n        return response\n\napp.add_middleware(TimingMiddleware)\n\ndef get_from_cache(key: str):\n    if key in cache and time.time() < cache_ttl.get(key, 0):\n        return cache[key]\n    return None\n\ndef set_cache(key: str, value, ttl: int = 60):\n    cache[key] = value\n    cache_ttl[key] = time.time() + ttl\n\n@app.get("/products/")\nasync def get_products():\n    cached = get_from_cache("products_list")\n    if cached:\n        return {"data": cached, "from_cache": True}\n    await asyncio.sleep(0.2)  # имитация запроса к БД\n    products = [{"id": i, "name": f"Товар {i}", "price": i * 100} for i in range(1, 6)]\n    set_cache("products_list", products, ttl=60)\n    return {"data": products, "from_cache": False}\n\nasync def fetch_user(uid: int):\n    await asyncio.sleep(0.15)\n    return {"id": uid, "name": "Анна"}\n\nasync def fetch_orders(uid: int):\n    await asyncio.sleep(0.2)\n    return [{"id": 1, "total": 5000}]\n\nasync def fetch_recommendations():\n    await asyncio.sleep(0.1)\n    return [{"id": 3, "name": "Рекомендация"}]\n\n@app.get("/dashboard/{user_id}")\nasync def get_dashboard(user_id: int):\n    user, orders, recs = await asyncio.gather(\n        fetch_user(user_id),\n        fetch_orders(user_id),\n        fetch_recommendations()\n    )\n    return {"user": user, "orders": orders, "recommendations": recs}\n\n@app.post("/cache/clear/{key}")\ndef clear_cache(key: str):\n    cache.pop(key, None)\n    cache_ttl.pop(key, None)\n    return {"cleared": key}\n\n@app.get("/stats")\ndef get_stats():\n    avg = stats["total_time"] / stats["requests"] if stats["requests"] else 0\n    return {"requests": stats["requests"], "avg_time": f"{avg:.4f}s"}',
      explanation: 'TimingMiddleware перехватывает все запросы и добавляет заголовок X-Process-Time. In-memory кэш использует два словаря: данные и время истечения TTL. asyncio.gather() запускает три fetch-функции параллельно — общее время равно максимальному из трёх (0.2s), а не сумме (0.45s). Статистика обновляется атомарно в middleware.'
    }
  ]
}
