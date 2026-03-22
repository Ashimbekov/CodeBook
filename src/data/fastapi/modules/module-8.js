export default {
  id: 8,
  title: 'SQLAlchemy: работа с базой данных',
  description: 'Интеграция FastAPI с базой данных через SQLAlchemy ORM: настройка подключения, создание моделей, асинхронные сессии и CRUD операции с PostgreSQL',
  lessons: [
    {
      id: 1,
      title: 'Настройка SQLAlchemy и подключение к БД',
      type: 'theory',
      content: [
        { type: 'text', value: 'SQLAlchemy — самая популярная Python ORM. В FastAPI рекомендуется использовать асинхронный вариант (asyncpg + async SQLAlchemy) для максимальной производительности.' },
        { type: 'heading', value: 'Установка зависимостей' },
        { type: 'code', language: 'python', value: 'pip install sqlalchemy[asyncio] asyncpg\n# Или для PostgreSQL:\npip install "sqlalchemy[asyncio]" asyncpg\n# Для SQLite в разработке:\npip install aiosqlite' },
        { type: 'heading', value: 'database.py — конфигурация' },
        { type: 'code', language: 'python', value: 'from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker\nfrom sqlalchemy.orm import DeclarativeBase\nimport os\n\nDATABASE_URL = os.getenv(\n    "DATABASE_URL",\n    "postgresql+asyncpg://user:password@localhost:5432/mydb"\n)\n\n# Для SQLite в разработке:\n# DATABASE_URL = "sqlite+aiosqlite:///./app.db"\n\nengine = create_async_engine(\n    DATABASE_URL,\n    echo=True,           # логировать SQL запросы (только для разработки!)\n    pool_size=10,        # размер пула соединений\n    max_overflow=20\n)\n\nSessionLocal = async_sessionmaker(\n    engine,\n    class_=AsyncSession,\n    expire_on_commit=False  # не сбрасывать атрибуты после commit\n)\n\nclass Base(DeclarativeBase):\n    pass\n\n# Dependency для FastAPI\nasync def get_db() -> AsyncSession:\n    async with SessionLocal() as session:\n        try:\n            yield session\n            await session.commit()\n        except Exception:\n            await session.rollback()\n            raise' }
      ]
    },
    {
      id: 2,
      title: 'Модели SQLAlchemy',
      type: 'theory',
      content: [
        { type: 'text', value: 'SQLAlchemy модели описывают таблицы в БД. Каждый класс — таблица, каждый Column — столбец. Поддерживаются все типы отношений: One-to-Many, Many-to-Many.' },
        { type: 'heading', value: 'Создание моделей' },
        { type: 'code', language: 'python', value: 'from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text\nfrom sqlalchemy.orm import relationship\nfrom sqlalchemy.sql import func\nfrom database import Base\n\nclass User(Base):\n    __tablename__ = "users"\n\n    id = Column(Integer, primary_key=True, index=True)\n    name = Column(String(100), nullable=False)\n    email = Column(String(255), unique=True, index=True, nullable=False)\n    password_hash = Column(String(255), nullable=False)\n    is_active = Column(Boolean, default=True)\n    created_at = Column(DateTime(timezone=True), server_default=func.now())\n    updated_at = Column(DateTime(timezone=True), onupdate=func.now())\n\n    # Отношение One-to-Many: один пользователь — много постов\n    posts = relationship("Post", back_populates="author", lazy="selectin")\n\nclass Post(Base):\n    __tablename__ = "posts"\n\n    id = Column(Integer, primary_key=True, index=True)\n    title = Column(String(255), nullable=False)\n    content = Column(Text, nullable=False)\n    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)\n\n    # Обратная ссылка\n    author = relationship("User", back_populates="posts", lazy="selectin")' }
      ]
    },
    {
      id: 3,
      title: 'Создание таблиц и Alembic',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для создания таблиц в разработке используй create_all. В продакшене — Alembic для миграций (следующий модуль). Lifespan в FastAPI — правильное место для инициализации БД.' },
        { type: 'heading', value: 'Создание таблиц через lifespan' },
        { type: 'code', language: 'python', value: 'from contextlib import asynccontextmanager\nfrom fastapi import FastAPI\nfrom database import engine, Base\n\n@asynccontextmanager\nasync def lifespan(app: FastAPI):\n    # Создать все таблицы при старте\n    async with engine.begin() as conn:\n        await conn.run_sync(Base.metadata.create_all)\n    print("База данных инициализирована")\n\n    yield\n\n    # Закрыть соединения при остановке\n    await engine.dispose()\n    print("Соединение с БД закрыто")\n\napp = FastAPI(lifespan=lifespan)' }
      ]
    },
    {
      id: 4,
      title: 'CRUD операции с SQLAlchemy',
      type: 'theory',
      content: [
        { type: 'text', value: 'Асинхронные CRUD операции с SQLAlchemy: выборка, создание, обновление, удаление.' },
        { type: 'heading', value: 'Async CRUD функции' },
        { type: 'code', language: 'python', value: 'from sqlalchemy.ext.asyncio import AsyncSession\nfrom sqlalchemy import select, update, delete\nfrom models import User\nfrom schemas import UserCreate\n\nasync def get_user(db: AsyncSession, user_id: int) -> User | None:\n    result = await db.execute(select(User).where(User.id == user_id))\n    return result.scalar_one_or_none()\n\nasync def get_user_by_email(db: AsyncSession, email: str) -> User | None:\n    result = await db.execute(select(User).where(User.email == email))\n    return result.scalar_one_or_none()\n\nasync def get_users(db: AsyncSession, skip: int = 0, limit: int = 10) -> list[User]:\n    result = await db.execute(select(User).offset(skip).limit(limit))\n    return list(result.scalars().all())\n\nasync def create_user(db: AsyncSession, user_data: UserCreate) -> User:\n    db_user = User(\n        name=user_data.name,\n        email=user_data.email,\n        password_hash=hash_password(user_data.password)\n    )\n    db.add(db_user)\n    await db.flush()  # получить id без commit\n    await db.refresh(db_user)  # обновить из БД\n    return db_user\n\nasync def update_user(db: AsyncSession, user_id: int, update_data: dict) -> User | None:\n    user = await get_user(db, user_id)\n    if not user:\n        return None\n    for key, value in update_data.items():\n        setattr(user, key, value)\n    await db.flush()\n    return user\n\nasync def delete_user(db: AsyncSession, user_id: int) -> bool:\n    user = await get_user(db, user_id)\n    if not user:\n        return False\n    await db.delete(user)\n    return True' }
      ]
    },
    {
      id: 5,
      title: 'Интеграция с FastAPI роутером',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сессия базы данных передаётся в endpoint через Depends(get_db). FastAPI автоматически управляет жизненным циклом сессии.' },
        { type: 'heading', value: 'Роутер с зависимостью БД' },
        { type: 'code', language: 'python', value: 'from fastapi import APIRouter, Depends, HTTPException\nfrom sqlalchemy.ext.asyncio import AsyncSession\nfrom database import get_db\nimport crud\nfrom schemas import UserCreate, UserResponse\n\nrouter = APIRouter(prefix="/users", tags=["Пользователи"])\n\n@router.post("/", response_model=UserResponse, status_code=201)\nasync def create_user(\n    user_data: UserCreate,\n    db: AsyncSession = Depends(get_db)\n):\n    # Проверить уникальность email\n    existing = await crud.get_user_by_email(db, user_data.email)\n    if existing:\n        raise HTTPException(409, "Email уже используется")\n    return await crud.create_user(db, user_data)\n\n@router.get("/{user_id}", response_model=UserResponse)\nasync def get_user(\n    user_id: int,\n    db: AsyncSession = Depends(get_db)\n):\n    user = await crud.get_user(db, user_id)\n    if not user:\n        raise HTTPException(404, "Пользователь не найден")\n    return user' }
      ]
    },
    {
      id: 6,
      title: 'Отношения и JOIN запросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'SQLAlchemy поддерживает lazy и eager loading для связанных объектов. joinedload и selectinload загружают связанные данные в одном запросе.' },
        { type: 'heading', value: 'Загрузка связанных данных' },
        { type: 'code', language: 'python', value: 'from sqlalchemy.orm import selectinload, joinedload\nfrom sqlalchemy import select\n\n# selectinload — отдельный SELECT для связанных объектов (рекомендуется)\nasync def get_user_with_posts(db: AsyncSession, user_id: int):\n    result = await db.execute(\n        select(User)\n        .where(User.id == user_id)\n        .options(selectinload(User.posts))\n    )\n    return result.scalar_one_or_none()\n\n# joinedload — JOIN запрос (эффективнее для один-к-одному)\nasync def get_post_with_author(db: AsyncSession, post_id: int):\n    result = await db.execute(\n        select(Post)\n        .where(Post.id == post_id)\n        .options(joinedload(Post.author))\n    )\n    return result.scalar_one_or_none()\n\n# Фильтрация с JOIN\nasync def get_posts_by_author_email(db: AsyncSession, email: str):\n    result = await db.execute(\n        select(Post)\n        .join(Post.author)\n        .where(User.email == email)\n    )\n    return list(result.scalars().all())' }
      ]
    },
    {
      id: 7,
      title: 'Конфигурация через Pydantic Settings',
      type: 'theory',
      content: [
        { type: 'text', value: 'Настройки приложения лучше хранить в Pydantic Settings — они читаются из переменных окружения и .env файла, с типизацией и валидацией.' },
        { type: 'heading', value: 'Settings с pydantic-settings' },
        { type: 'code', language: 'python', value: '# pip install pydantic-settings\nfrom pydantic_settings import BaseSettings, SettingsConfigDict\n\nclass Settings(BaseSettings):\n    model_config = SettingsConfigDict(\n        env_file=".env",\n        env_file_encoding="utf-8",\n        case_sensitive=False\n    )\n\n    database_url: str\n    secret_key: str\n    access_token_expire_minutes: int = 30\n    debug: bool = False\n    allowed_origins: list[str] = ["http://localhost:3000"]\n\nsettings = Settings()\n\n# .env файл:\n# DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/mydb\n# SECRET_KEY=super-secret-key-32chars-minimum\n# DEBUG=false' }
      ]
    },
    {
      id: 8,
      title: 'Практика: CRUD с PostgreSQL',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полный CRUD для блога с пользователями и постами, используя SQLAlchemy async с PostgreSQL.',
      requirements: [
        'Модели: User (id, name, email, password_hash, created_at) и Post (id, title, content, user_id, created_at)',
        'CRUD функции в crud.py: get_user, create_user, get_posts, get_post, create_post, delete_post',
        'Роутер users: POST /users, GET /users/{id}',
        'Роутер posts: GET /posts (с пагинацией), POST /posts (нужен user_id), GET /posts/{id}, DELETE /posts/{id}',
        'При создании поста — проверить что пользователь существует',
        'GET /posts/{id} возвращает пост с информацией об авторе (selectinload)',
        'Settings через pydantic-settings читает DATABASE_URL из .env'
      ],
      hint: 'PostResponse должен включать поле author: UserResponse. Для этого нужен selectinload(Post.author) при загрузке поста.',
      expectedOutput: 'POST /users с body {"name": "Алия", "email": "aliya@example.com", "password": "hashed"} → 201 Created, body: {"id": 1, "name": "Алия", "email": "aliya@example.com", "created_at": "..."}\nPOST /posts с body {"title": "Первый пост", "content": "Привет мир", "user_id": 1} → 201 Created, body: {"id": 1, "title": "Первый пост", "content": "Привет мир", "author": {"id": 1, "name": "Алия", "email": "aliya@example.com"}}\nGET /posts/99 → 404 Not Found, body: {"detail": "Пост не найден"}\nGET /posts?skip=0&limit=10 → 200 OK, body: [{"id": 1, "title": "Первый пост", "author": {...}}]',
      solution: '# models.py\nclass User(Base):\n    __tablename__ = "users"\n    id = Column(Integer, primary_key=True)\n    name = Column(String(100))\n    email = Column(String(255), unique=True)\n    password_hash = Column(String)\n    posts = relationship("Post", back_populates="author", lazy="selectin")\n\nclass Post(Base):\n    __tablename__ = "posts"\n    id = Column(Integer, primary_key=True)\n    title = Column(String(255))\n    content = Column(Text)\n    user_id = Column(Integer, ForeignKey("users.id"))\n    author = relationship("User", back_populates="posts")\n\n# crud.py\nasync def create_post(db: AsyncSession, post: PostCreate) -> Post:\n    user = await get_user(db, post.user_id)\n    if not user: raise HTTPException(404, "Пользователь не найден")\n    db_post = Post(**post.model_dump())\n    db.add(db_post)\n    await db.flush()\n    await db.refresh(db_post)\n    return db_post\n\n# schemas.py\nclass PostResponse(BaseModel):\n    model_config = ConfigDict(from_attributes=True)\n    id: int\n    title: str\n    content: str\n    author: UserResponse',
      explanation: 'from_attributes=True (ConfigDict) позволяет Pydantic читать поля из ORM объекта как атрибуты. selectinload загружает связанные объекты отдельным SELECT, что эффективнее для one-to-many.'
    }
  ]
}
