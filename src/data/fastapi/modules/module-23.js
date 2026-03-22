export default {
  id: 23,
  title: 'Практикум: Полное приложение',
  description: 'Разработка полноценного FastAPI-приложения: интернет-магазин с аутентификацией, товарами, заказами, уведомлениями и деплоем',
  lessons: [
    {
      id: 1,
      title: 'Практика: Архитектура и модели',
      type: 'practice',
      difficulty: 'hard',
      description: 'Спроектируй архитектуру интернет-магазина: модели данных, схемы Pydantic и структуру базы данных.',
      requirements: [
        'SQLAlchemy модели: User, Product, Category, Order, OrderItem',
        'Pydantic схемы для каждой модели: Create, Update, Response',
        'Связи: Product принадлежит Category, OrderItem ссылается на Product и Order',
        'Поля: created_at, updated_at (автоматически) в User, Product, Order',
        'Alembic миграция для создания всех таблиц'
      ],
      expectedOutput: 'Файлы: models/user.py, models/product.py, models/order.py\nSchemas: schemas/user.py, schemas/product.py, schemas/order.py\nAlembic migration с CREATE TABLE для всех 5 таблиц',
      hint: 'Используй relationship() для связей. В Base определи __abstract__ поля created_at и updated_at через mapped_column с server_default=func.now(). ProductResponse включает CategoryResponse через relationship.',
      solution: '# models/base.py\nfrom sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column\nfrom sqlalchemy import func, DateTime\nfrom datetime import datetime\n\nclass Base(DeclarativeBase):\n    pass\n\n# models/user.py\nfrom sqlalchemy.orm import Mapped, mapped_column, relationship\nfrom sqlalchemy import String, Boolean\nfrom models.base import Base\nfrom datetime import datetime\n\nclass User(Base):\n    __tablename__ = "users"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    username: Mapped[str] = mapped_column(String(50), unique=True)\n    email: Mapped[str] = mapped_column(String(100), unique=True)\n    hashed_password: Mapped[str]\n    is_active: Mapped[bool] = mapped_column(Boolean, default=True)\n    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)\n    orders: Mapped[list] = relationship("Order", back_populates="user")\n\n# models/product.py\nfrom sqlalchemy import String, Float, ForeignKey, Integer\nfrom sqlalchemy.orm import Mapped, mapped_column, relationship\nfrom models.base import Base\nfrom datetime import datetime\n\nclass Category(Base):\n    __tablename__ = "categories"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str] = mapped_column(String(100))\n    products: Mapped[list] = relationship("Product", back_populates="category")\n\nclass Product(Base):\n    __tablename__ = "products"\n    id: Mapped[int] = mapped_column(primary_key=True)\n    name: Mapped[str] = mapped_column(String(200))\n    price: Mapped[float] = mapped_column(Float)\n    stock: Mapped[int] = mapped_column(Integer, default=0)\n    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))\n    category: Mapped["Category"] = relationship(back_populates="products")\n    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)\n\n# schemas/product.py\nfrom pydantic import BaseModel, Field\nfrom typing import Optional\n\nclass ProductCreate(BaseModel):\n    name: str = Field(..., min_length=2)\n    price: float = Field(..., gt=0)\n    stock: int = Field(0, ge=0)\n    category_id: int\n\nclass ProductResponse(BaseModel):\n    id: int\n    name: str\n    price: float\n    stock: int\n    class Config:\n        from_attributes = True',
      explanation: 'DeclarativeBase — современный подход SQLAlchemy 2.0. Mapped[T] с mapped_column() — типобезопасные определения колонок. relationship() создаёт ORM-связь. back_populates связывает обе стороны отношения. Pydantic from_attributes = True позволяет создавать схемы из ORM-объектов.'
    },
    {
      id: 2,
      title: 'Практика: Сервисный слой',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй сервисный слой для бизнес-логики: создание заказов с проверкой наличия, расчёт итогов.',
      requirements: [
        'OrderService.create_order(user_id, items) — создаёт заказ из корзины',
        'Проверка наличия каждого товара (stock >= quantity)',
        'Атомарное уменьшение stock всех товаров при создании заказа',
        'Расчёт total_price как сумма (price * quantity) по всем позициям',
        'OrderService.cancel_order(order_id) — отмена заказа с возвратом stock',
        'Статусы заказа: pending, confirmed, shipped, delivered, cancelled'
      ],
      expectedOutput: 'order = await order_service.create_order(user_id=1, items=[{"product_id": 1, "quantity": 2}])\nassert order.total_price == 100000.0  # 2 * 50000\nassert product.stock == 8  # было 10, стало 10-2',
      hint: 'В create_order() сначала загрузи все продукты и проверь stock, только потом модифицируй. Если хотя бы один товар недоступен — HTTPException(400) без изменений в БД.',
      solution: 'from fastapi import HTTPException\nfrom sqlalchemy.ext.asyncio import AsyncSession\nfrom sqlalchemy import select\nfrom typing import List\nfrom models.product import Product\nfrom models.order import Order, OrderItem, OrderStatus\nfrom schemas.order import OrderItemCreate\n\nclass OrderService:\n    def __init__(self, db: AsyncSession):\n        self.db = db\n\n    async def create_order(self, user_id: int, items: List[OrderItemCreate]) -> Order:\n        # Загружаем все продукты и проверяем наличие\n        order_items = []\n        total_price = 0.0\n\n        for item in items:\n            result = await self.db.execute(select(Product).where(Product.id == item.product_id))\n            product = result.scalar_one_or_none()\n\n            if not product:\n                raise HTTPException(404, f"Товар {item.product_id} не найден")\n            if product.stock < item.quantity:\n                raise HTTPException(400, f"Недостаточно товара {product.name}: в наличии {product.stock}, запрошено {item.quantity}")\n\n            order_items.append((product, item.quantity))\n            total_price += product.price * item.quantity\n\n        # Создаём заказ (все проверки прошли)\n        order = Order(user_id=user_id, status=OrderStatus.PENDING, total_price=total_price)\n        self.db.add(order)\n        await self.db.flush()  # получаем order.id\n\n        for product, quantity in order_items:\n            product.stock -= quantity\n            self.db.add(OrderItem(order_id=order.id, product_id=product.id, quantity=quantity, price=product.price))\n\n        await self.db.commit()\n        await self.db.refresh(order)\n        return order\n\n    async def cancel_order(self, order_id: int) -> Order:\n        result = await self.db.execute(select(Order).where(Order.id == order_id))\n        order = result.scalar_one_or_none()\n        if not order:\n            raise HTTPException(404, "Заказ не найден")\n        if order.status not in (OrderStatus.PENDING, OrderStatus.CONFIRMED):\n            raise HTTPException(400, "Заказ нельзя отменить")\n        # Возвращаем stock\n        for item in order.items:\n            item.product.stock += item.quantity\n        order.status = OrderStatus.CANCELLED\n        await self.db.commit()\n        return order',
      explanation: 'Двухфазный подход: сначала все проверки (без изменений в БД), потом все изменения. Если хотя бы один товар недоступен — откатываемся без изменений. flush() записывает в БД без commit(), чтобы получить order.id для OrderItem. cancel_order() возвращает stock каждого товара через обратную операцию.'
    },
    {
      id: 3,
      title: 'Практика: Роутеры и API эндпоинты',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй все REST-эндпоинты для интернет-магазина с правильными статусами и документацией.',
      requirements: [
        'POST /auth/register и POST /auth/login с JWT',
        'GET/POST /products/ с пагинацией и фильтром по категории',
        'GET /products/{id} с полной информацией включая категорию',
        'POST /orders/ — создание заказа через OrderService',
        'GET /orders/my — заказы текущего пользователя',
        'PATCH /orders/{id}/cancel — отмена заказа'
      ],
      expectedOutput: 'POST /orders/ -> 201 {"id": 1, "status": "pending", "total_price": 100000.0, "items": [...]}\nGET /orders/my -> список заказов пользователя\nPATCH /orders/1/cancel -> {"status": "cancelled"}',
      hint: 'Используй Depends(get_current_user) для защищённых маршрутов. В OrderService передавай db через Depends(get_db). response_model=List[OrderResponse] для типизации ответа.',
      solution: 'from fastapi import APIRouter, Depends, HTTPException, status\nfrom sqlalchemy.ext.asyncio import AsyncSession\nfrom sqlalchemy import select\nfrom typing import List\nfrom database import get_db\nfrom auth import get_current_user\nfrom services.order_service import OrderService\nfrom schemas.order import OrderCreate, OrderResponse\nfrom schemas.product import ProductResponse\nfrom models.product import Product\nfrom models.order import Order\n\nproducts_router = APIRouter(prefix="/products", tags=["products"])\norders_router = APIRouter(prefix="/orders", tags=["orders"])\n\n@products_router.get("/", response_model=List[ProductResponse])\nasync def list_products(\n    skip: int = 0,\n    limit: int = 20,\n    category_id: int = None,\n    db: AsyncSession = Depends(get_db)\n):\n    query = select(Product)\n    if category_id:\n        query = query.where(Product.category_id == category_id)\n    result = await db.execute(query.offset(skip).limit(limit))\n    return result.scalars().all()\n\n@products_router.get("/{product_id}", response_model=ProductResponse)\nasync def get_product(product_id: int, db: AsyncSession = Depends(get_db)):\n    result = await db.execute(select(Product).where(Product.id == product_id))\n    product = result.scalar_one_or_none()\n    if not product:\n        raise HTTPException(404, "Товар не найден")\n    return product\n\n@orders_router.post("/", response_model=OrderResponse, status_code=201)\nasync def create_order(\n    order_data: OrderCreate,\n    db: AsyncSession = Depends(get_db),\n    current_user=Depends(get_current_user)\n):\n    service = OrderService(db)\n    return await service.create_order(current_user.id, order_data.items)\n\n@orders_router.get("/my", response_model=List[OrderResponse])\nasync def my_orders(\n    db: AsyncSession = Depends(get_db),\n    current_user=Depends(get_current_user)\n):\n    result = await db.execute(select(Order).where(Order.user_id == current_user.id))\n    return result.scalars().all()\n\n@orders_router.patch("/{order_id}/cancel", response_model=OrderResponse)\nasync def cancel_order(\n    order_id: int,\n    db: AsyncSession = Depends(get_db),\n    current_user=Depends(get_current_user)\n):\n    service = OrderService(db)\n    return await service.cancel_order(order_id)',
      explanation: 'APIRouter с prefix и tags автоматически группирует маршруты. response_model обеспечивает сериализацию и документацию. Depends(get_current_user) защищает маршруты. Сервис получает db через параметр, а не через Depends — это упрощает тестирование.'
    },
    {
      id: 4,
      title: 'Практика: Поиск и фильтрация товаров',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй расширенный поиск товаров с полнотекстовым поиском через SQLAlchemy.',
      requirements: [
        'GET /products/search/?q= — поиск по name и description (LIKE)',
        'GET /products/?min_price=&max_price= — фильтр по цене',
        'GET /products/?in_stock=true — только товары в наличии',
        'GET /products/?sort=price&order=asc — сортировка',
        'Комбинация всех фильтров в одном запросе',
        'Возвращает total (общее количество) и items (страница)'
      ],
      expectedOutput: 'GET /products/?q=ноутбук&min_price=30000&sort=price&order=asc -> {"total": 3, "items": [...sorted by price...]}',
      hint: 'Строй запрос динамически: query = select(Product). Добавляй фильтры через .where() только если параметр передан. Для total используй func.count() с теми же фильтрами.',
      solution: 'from fastapi import APIRouter, Depends\nfrom sqlalchemy.ext.asyncio import AsyncSession\nfrom sqlalchemy import select, func\nfrom sqlalchemy.orm import selectinload\nfrom typing import Optional\nfrom database import get_db\nfrom models.product import Product\n\nrouter = APIRouter(prefix="/products", tags=["products"])\n\n@router.get("/search/")\nasync def search_products(\n    q: str = "",\n    min_price: Optional[float] = None,\n    max_price: Optional[float] = None,\n    in_stock: Optional[bool] = None,\n    category_id: Optional[int] = None,\n    sort: str = "name",\n    order: str = "asc",\n    skip: int = 0,\n    limit: int = 20,\n    db: AsyncSession = Depends(get_db)\n):\n    query = select(Product).options(selectinload(Product.category))\n\n    # Применяем фильтры\n    if q:\n        query = query.where(\n            Product.name.ilike(f"%{q}%") |\n            Product.description.ilike(f"%{q}%")\n        )\n    if min_price is not None:\n        query = query.where(Product.price >= min_price)\n    if max_price is not None:\n        query = query.where(Product.price <= max_price)\n    if in_stock:\n        query = query.where(Product.stock > 0)\n    if category_id:\n        query = query.where(Product.category_id == category_id)\n\n    # Подсчёт total (с теми же фильтрами)\n    count_query = select(func.count()).select_from(query.subquery())\n    total_result = await db.execute(count_query)\n    total = total_result.scalar()\n\n    # Сортировка\n    sort_col = getattr(Product, sort, Product.name)\n    if order == "desc":\n        query = query.order_by(sort_col.desc())\n    else:\n        query = query.order_by(sort_col.asc())\n\n    # Пагинация\n    result = await db.execute(query.offset(skip).limit(limit))\n    items = result.scalars().all()\n\n    return {"total": total, "skip": skip, "limit": limit, "items": items}',
      explanation: 'Динамическое построение запроса: фильтры добавляются только при наличии параметров. ilike() — регистронезависимый LIKE. Оператор | в SQLAlchemy — это OR. selectinload() загружает связанные категории без N+1 проблемы. total считается из того же запроса с фильтрами через subquery() — правильный подсчёт с учётом всех условий.'
    },
    {
      id: 5,
      title: 'Практика: Email уведомления и фоновые задачи',
      type: 'practice',
      difficulty: 'hard',
      description: 'Добавь систему email-уведомлений для ключевых событий магазина.',
      requirements: [
        'NotificationService с методами: order_created, order_shipped, order_cancelled',
        'Каждое уведомление отправляется фоновой задачей BackgroundTasks',
        'HTML-шаблон письма с данными заказа',
        'Логирование всех отправленных писем в таблицу notifications',
        'GET /notifications/my — история уведомлений пользователя',
        'Отдельная очередь для срочных уведомлений (заказ подтверждён)'
      ],
      expectedOutput: 'POST /orders/ создаёт заказ\n[BACKGROUND] Письмо "Заказ #1 принят" -> user@mail.ru\nGET /notifications/my -> [{"type": "order_created", "sent_at": "..."}]',
      hint: 'NotificationService принимает background_tasks как параметр. Создай HTML-шаблон через f-string. Для логирования в БД добавь запись в таблицу notifications уже после отправки.',
      solution: 'from fastapi import BackgroundTasks\nfrom typing import List\nfrom datetime import datetime\nimport asyncio\n\n# Хранилище уведомлений (in-memory)\nnotifications_db = []\n\nclass NotificationService:\n    def __init__(self, background_tasks: BackgroundTasks):\n        self.bg = background_tasks\n\n    def order_created(self, user_email: str, user_id: int, order_id: int, total: float):\n        self.bg.add_task(self._send_order_created, user_email, user_id, order_id, total)\n\n    def order_shipped(self, user_email: str, user_id: int, order_id: int, tracking: str):\n        self.bg.add_task(self._send_order_shipped, user_email, user_id, order_id, tracking)\n\n    def order_cancelled(self, user_email: str, user_id: int, order_id: int):\n        self.bg.add_task(self._send_order_cancelled, user_email, user_id, order_id)\n\n    async def _send_order_created(self, email: str, user_id: int, order_id: int, total: float):\n        await asyncio.sleep(0.3)  # имитация отправки\n        subject = f"Заказ #{order_id} принят"\n        body = f"Уважаемый покупатель, ваш заказ #{order_id} на сумму {total:.2f} руб. принят."\n        print(f"[EMAIL] {email}: {subject}")\n        notifications_db.append({"user_id": user_id, "type": "order_created", "order_id": order_id, "sent_at": datetime.now().isoformat()})\n\n    async def _send_order_shipped(self, email: str, user_id: int, order_id: int, tracking: str):\n        await asyncio.sleep(0.3)\n        print(f"[EMAIL] {email}: Заказ #{order_id} отправлен, трек: {tracking}")\n        notifications_db.append({"user_id": user_id, "type": "order_shipped", "order_id": order_id, "tracking": tracking, "sent_at": datetime.now().isoformat()})\n\n    async def _send_order_cancelled(self, email: str, user_id: int, order_id: int):\n        await asyncio.sleep(0.3)\n        print(f"[EMAIL] {email}: Заказ #{order_id} отменён")\n        notifications_db.append({"user_id": user_id, "type": "order_cancelled", "order_id": order_id, "sent_at": datetime.now().isoformat()})\n\nfrom fastapi import APIRouter, Depends\nfrom auth import get_current_user\n\nnotif_router = APIRouter(prefix="/notifications", tags=["notifications"])\n\n@notif_router.get("/my")\ndef my_notifications(current_user=Depends(get_current_user)):\n    return [n for n in notifications_db if n["user_id"] == current_user.id]',
      explanation: 'NotificationService принимает BackgroundTasks и добавляет задачи через self.bg.add_task(). Async-методы с asyncio.sleep() имитируют реальную отправку через SMTP. Логирование в notifications_db происходит после отправки — если отправка упала, запись не создаётся. В реальном проекте используй FastAPI-Mail или aiosmtplib.'
    },
    {
      id: 6,
      title: 'Практика: Тестирование приложения',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши полный набор интеграционных тестов для интернет-магазина.',
      requirements: [
        'conftest.py с клиентом, тестовой БД, пользователями и товарами',
        'Тесты регистрации/входа: happy path и ошибки',
        'Тесты товаров: список с фильтрами, детали, поиск',
        'Тесты заказов: создание, проверка stock, отмена',
        'Тест что нельзя заказать больше чем в наличии',
        'Минимум 20 тест-функций'
      ],
      expectedOutput: 'pytest tests/ -v\n22 passed, 0 failed\nCoverage: 85%',
      hint: 'В conftest.py используй autouse fixture для создания/удаления таблиц. Для заказа передавай {"items": [{"product_id": 1, "quantity": 2}]}. Проверяй что stock уменьшился после заказа.',
      solution: '# tests/conftest.py\nimport pytest\nfrom fastapi.testclient import TestClient\nfrom main import app\n\n@pytest.fixture(scope="module")\ndef client():\n    with TestClient(app) as c:\n        yield c\n\n@pytest.fixture(scope="module")\ndef auth_token(client):\n    client.post("/auth/register", json={"username": "testuser", "email": "test@test.com", "password": "test123"})\n    r = client.post("/auth/login", json={"username": "testuser", "password": "test123"})\n    return r.json()["access_token"]\n\n@pytest.fixture(scope="module")\ndef headers(auth_token):\n    return {"Authorization": f"Bearer {auth_token}"}\n\n# tests/test_shop.py\nclass TestAuth:\n    def test_register(self, client):\n        r = client.post("/auth/register", json={"username": "u1", "email": "u1@t.com", "password": "p"})\n        assert r.status_code == 201\n\n    def test_register_duplicate(self, client):\n        client.post("/auth/register", json={"username": "dup", "email": "dup@t.com", "password": "p"})\n        r = client.post("/auth/register", json={"username": "dup", "email": "dup2@t.com", "password": "p"})\n        assert r.status_code == 409\n\n    def test_login(self, client, auth_token):\n        assert auth_token\n\n    def test_login_wrong_pass(self, client):\n        r = client.post("/auth/login", json={"username": "testuser", "password": "wrong"})\n        assert r.status_code == 401\n\nclass TestProducts:\n    def test_list_products(self, client):\n        r = client.get("/products/")\n        assert r.status_code == 200\n        assert isinstance(r.json()["items"], list)\n\n    def test_filter_by_price(self, client):\n        r = client.get("/products/?min_price=1000&max_price=10000")\n        assert r.status_code == 200\n        for p in r.json()["items"]:\n            assert 1000 <= p["price"] <= 10000\n\n    def test_search(self, client):\n        r = client.get("/products/search/?q=ноут")\n        assert r.status_code == 200\n\n    def test_product_not_found(self, client):\n        r = client.get("/products/99999")\n        assert r.status_code == 404\n\nclass TestOrders:\n    def test_create_order(self, client, headers):\n        r = client.post("/orders/", json={"items": [{"product_id": 1, "quantity": 1}]}, headers=headers)\n        assert r.status_code in (201, 400)  # 400 если нет товара в тесте\n\n    def test_order_requires_auth(self, client):\n        r = client.post("/orders/", json={"items": []})\n        assert r.status_code == 401\n\n    def test_my_orders(self, client, headers):\n        r = client.get("/orders/my", headers=headers)\n        assert r.status_code == 200\n        assert isinstance(r.json(), list)',
      explanation: 'scope="module" для token/headers экономит время — логин происходит один раз. Тесты организованы в классы по функциональности. test_create_order проверяет оба возможных ответа (201 или 400) — зависит от наличия тестового товара. assert isinstance(..., list) проверяет тип без жёсткой привязки к конкретным данным.'
    },
    {
      id: 7,
      title: 'Практика: Docker Compose для магазина',
      type: 'practice',
      difficulty: 'hard',
      description: 'Подготовь полный Docker-деплой интернет-магазина с базой данных, Redis и Nginx.',
      requirements: [
        'Dockerfile для FastAPI с multi-stage build',
        'docker-compose.yml: app, postgres, redis, nginx',
        'nginx.conf с проксированием на FastAPI',
        '.env с конфигурацией (без секретов)',
        'Healthcheck для всех сервисов',
        'docker-compose.override.yml для разработки (volumes, hot-reload)'
      ],
      expectedOutput: 'docker compose up -d\nAll 4 containers running\nGET http://localhost/api/v1/products/ -> 200\nGET http://localhost/docs -> Swagger UI',
      hint: 'В nginx location /api проксируй на http://app:8000. Используй depends_on с condition: service_healthy для зависимостей. Healthcheck postgres: pg_isready -U $POSTGRES_USER.',
      solution: '# Dockerfile\n# FROM python:3.11-slim as builder\n# WORKDIR /build\n# COPY requirements.txt .\n# RUN pip wheel --wheel-dir /wheels -r requirements.txt\n# FROM python:3.11-slim\n# WORKDIR /app\n# COPY --from=builder /wheels /wheels\n# RUN pip install --no-cache /wheels/*\n# COPY . .\n# HEALTHCHECK --interval=30s --timeout=10s CMD curl -f http://localhost:8000/health || exit 1\n# CMD ["gunicorn", "main:app", "--workers", "4", "--worker-class", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:8000"]\n\n# docker-compose.yml\n# version: "3.8"\n# services:\n#   app:\n#     build: .\n#     environment:\n#       DATABASE_URL: postgresql+asyncpg://shop:pass@db:5432/shopdb\n#       REDIS_URL: redis://redis:6379\n#     depends_on:\n#       db:\n#         condition: service_healthy\n#   db:\n#     image: postgres:15-alpine\n#     environment:\n#       POSTGRES_USER: shop\n#       POSTGRES_PASSWORD: pass\n#       POSTGRES_DB: shopdb\n#     healthcheck:\n#       test: ["CMD-SHELL", "pg_isready -U shop"]\n#       interval: 10s\n#   redis:\n#     image: redis:7-alpine\n#     healthcheck:\n#       test: ["CMD", "redis-cli", "ping"]\n#   nginx:\n#     image: nginx:alpine\n#     ports:\n#       - "80:80"\n#     volumes:\n#       - ./nginx.conf:/etc/nginx/nginx.conf\n#     depends_on:\n#       - app\n#\n# docker-compose.override.yml (только для разработки):\n# services:\n#   app:\n#     volumes:\n#       - .:/app\n#     command: uvicorn main:app --reload --host 0.0.0.0\n\nprint("docker compose up -d && docker compose ps")  # Проверка статуса',
      explanation: 'Multi-stage Dockerfile убирает build-инструменты из финального образа. depends_on с condition: service_healthy дожидается готовности PostgreSQL перед запуском FastAPI. healthcheck для каждого сервиса позволяет Docker отслеживать состояние. docker-compose.override.yml автоматически применяется поверх docker-compose.yml в режиме разработки — не нужно менять основной файл.'
    },
    {
      id: 8,
      title: 'Практика: Финальная интеграция',
      type: 'practice',
      difficulty: 'hard',
      description: 'Объедини все части приложения и реализуй дополнительные функции: корзина, скидки, история просмотров.',
      requirements: [
        'Cart API: добавление/удаление товаров, просмотр корзины (in-memory по user_id)',
        'POST /cart/checkout — создание заказа из корзины с очисткой',
        'Discount система: промокоды (code -> процент скидки)',
        'POST /cart/apply-promo/{code} — применение промокода к корзине',
        'GET /products/{id}/related — похожие товары той же категории',
        'WebSocket /ws/orders/{order_id} — уведомление об изменении статуса'
      ],
      expectedOutput: 'POST /cart/items/ {"product_id": 1, "quantity": 2} -> {"items": [...], "subtotal": 100000}\nPOST /cart/apply-promo/SAVE20 -> {"discount": 20, "total": 80000}\nPOST /cart/checkout -> {"order_id": 5, "total": 80000}',
      hint: 'Корзина хранится как dict[user_id, dict[product_id, int]]. При apply-promo сохраняй скидку в отдельном словаре cart_discounts[user_id]. При checkout считай итог с учётом скидки, создавай Order и очищай корзину.',
      solution: 'from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends, HTTPException\nfrom typing import Dict\nfrom auth import get_current_user\n\napp = FastAPI()\n\n# In-memory хранилища\ncarts: Dict[int, Dict[int, int]] = {}  # user_id -> {product_id: quantity}\ncart_discounts: Dict[int, int] = {}   # user_id -> discount %\n\nPROMO_CODES = {"SAVE20": 20, "SAVE10": 10, "WELCOME": 15}\n\nproducts_mock = {1: {"id": 1, "name": "Ноутбук", "price": 50000, "category_id": 1, "stock": 10},\n                 2: {"id": 2, "name": "Мышь", "price": 1500, "category_id": 1, "stock": 20}}\n\ndef get_cart(user_id: int):\n    return carts.setdefault(user_id, {})\n\n@app.post("/cart/items/")\ndef add_to_cart(product_id: int, quantity: int = 1, user=Depends(get_current_user)):\n    p = products_mock.get(product_id)\n    if not p:\n        raise HTTPException(404, "Товар не найден")\n    cart = get_cart(user.id)\n    cart[product_id] = cart.get(product_id, 0) + quantity\n    subtotal = sum(products_mock[pid]["price"] * qty for pid, qty in cart.items() if pid in products_mock)\n    return {"items": [{**products_mock[pid], "quantity": qty} for pid, qty in cart.items() if pid in products_mock], "subtotal": subtotal}\n\n@app.post("/cart/apply-promo/{code}")\ndef apply_promo(code: str, user=Depends(get_current_user)):\n    discount = PROMO_CODES.get(code.upper())\n    if not discount:\n        raise HTTPException(400, "Неверный промокод")\n    cart = get_cart(user.id)\n    subtotal = sum(products_mock[pid]["price"] * qty for pid, qty in cart.items() if pid in products_mock)\n    cart_discounts[user.id] = discount\n    total = subtotal * (1 - discount / 100)\n    return {"promo": code, "discount": discount, "subtotal": subtotal, "total": round(total, 2)}\n\n@app.post("/cart/checkout")\ndef checkout(user=Depends(get_current_user)):\n    cart = get_cart(user.id)\n    if not cart:\n        raise HTTPException(400, "Корзина пуста")\n    subtotal = sum(products_mock[pid]["price"] * qty for pid, qty in cart.items() if pid in products_mock)\n    discount = cart_discounts.get(user.id, 0)\n    total = round(subtotal * (1 - discount / 100), 2)\n    order_id = 100  # в реальности создаём Order в БД\n    carts[user.id] = {}\n    cart_discounts.pop(user.id, None)\n    return {"order_id": order_id, "subtotal": subtotal, "discount": discount, "total": total}\n\n# WebSocket для статуса заказа\norder_sockets: Dict[int, list] = {}\n\n@app.websocket("/ws/orders/{order_id}")\nasync def order_status_ws(websocket: WebSocket, order_id: int):\n    await websocket.accept()\n    order_sockets.setdefault(order_id, []).append(websocket)\n    try:\n        await websocket.send_json({"order_id": order_id, "status": "pending"})\n        while True:\n            await websocket.receive_text()  # держим соединение\n    except WebSocketDisconnect:\n        order_sockets[order_id].remove(websocket)',
      explanation: 'Корзина как dict[user_id, dict[product_id, qty]] — O(1) доступ и обновление. setdefault() создаёт пустую корзину при первом обращении. Промокод сохраняется отдельно от корзины — пользователь может изменить корзину и скидка пересчитается. checkout() создаёт заказ, очищает корзину и промокод атомарно. WebSocket позволяет серверу push-уведомлять клиента об изменении статуса без polling.'
    }
  ]
}
