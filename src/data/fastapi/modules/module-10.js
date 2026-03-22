export default {
  id: 10,
  title: 'OAuth2 и JWT аутентификация',
  description: 'Полная реализация аутентификации в FastAPI: хеширование паролей, JWT токены, OAuth2 flow, защита эндпоинтов и refresh токены',
  lessons: [
    {
      id: 1,
      title: 'Хеширование паролей с bcrypt',
      type: 'theory',
      content: [
        { type: 'text', value: 'Пароли никогда не хранятся в открытом виде. Bcrypt — адаптивная хеш-функция специально для паролей: медленная (устойчивость к брутфорсу) и солёная (защита от rainbow tables).' },
        { type: 'heading', value: 'PassLib и bcrypt' },
        { type: 'code', language: 'python', value: 'pip install "passlib[bcrypt]"' },
        { type: 'code', language: 'python', value: 'from passlib.context import CryptContext\n\n# Создать контекст для хеширования\npwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")\n\ndef hash_password(password: str) -> str:\n    """Хешировать пароль"""\n    return pwd_context.hash(password)\n\ndef verify_password(plain_password: str, hashed_password: str) -> bool:\n    """Проверить пароль против хеша"""\n    return pwd_context.verify(plain_password, hashed_password)\n\n# Использование:\nhashed = hash_password("mysecretpassword")\n# "$2b$12$..." — bcrypt хеш\n\nverify_password("mysecretpassword", hashed)  # True\nverify_password("wrongpassword", hashed)     # False' },
        { type: 'tip', value: 'Никогда не сравнивай пароли напрямую: password == stored_hash. Всегда используй verify_password — она защищена от timing attacks.' }
      ]
    },
    {
      id: 2,
      title: 'JWT токены',
      type: 'theory',
      content: [
        { type: 'text', value: 'JWT (JSON Web Token) — компактный самодостаточный токен. Состоит из: header.payload.signature. Сервер не хранит сессии — проверяет подпись токена.' },
        { type: 'heading', value: 'Создание и валидация JWT' },
        { type: 'code', language: 'python', value: 'pip install "python-jose[cryptography]"' },
        { type: 'code', language: 'python', value: 'from datetime import datetime, timedelta\nfrom jose import JWTError, jwt\nfrom typing import Optional\n\nSECRET_KEY = "your-secret-key-at-least-32-characters-long"\nALGORITHM = "HS256"\nACCESS_TOKEN_EXPIRE_MINUTES = 30\n\ndef create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:\n    """Создать JWT access токен"""\n    to_encode = data.copy()\n    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))\n    to_encode.update({"exp": expire, "type": "access"})\n    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)\n\ndef decode_token(token: str) -> dict:\n    """Декодировать и проверить JWT токен"""\n    try:\n        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n        return payload\n    except JWTError:\n        return None\n\n# Создать токен:\ntoken = create_access_token({"sub": str(user.id), "email": user.email})\n# eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....\n\n# Декодировать:\npayload = decode_token(token)\n# {"sub": "1", "email": "user@mail.ru", "exp": 1714000000}' }
      ]
    },
    {
      id: 3,
      title: 'OAuth2 схема в FastAPI',
      type: 'theory',
      content: [
        { type: 'text', value: 'FastAPI поддерживает OAuth2 с паролем (Password Bearer) из коробки. OAuth2PasswordBearer — зависимость, которая автоматически читает токен из заголовка Authorization.' },
        { type: 'heading', value: 'OAuth2 настройка' },
        { type: 'code', language: 'python', value: 'from fastapi import Depends, HTTPException, status\nfrom fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm\nfrom sqlalchemy.ext.asyncio import AsyncSession\nfrom database import get_db\nimport crud\n\n# tokenUrl указывает где получить токен (для Swagger UI)\noauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")\n\nasync def get_current_user(\n    token: str = Depends(oauth2_scheme),\n    db: AsyncSession = Depends(get_db)\n):\n    """Зависимость: получить текущего пользователя по токену"""\n    credentials_exception = HTTPException(\n        status_code=status.HTTP_401_UNAUTHORIZED,\n        detail="Не удалось проверить учётные данные",\n        headers={"WWW-Authenticate": "Bearer"}\n    )\n    payload = decode_token(token)\n    if payload is None:\n        raise credentials_exception\n\n    user_id = payload.get("sub")\n    if user_id is None:\n        raise credentials_exception\n\n    user = await crud.get_user(db, int(user_id))\n    if user is None:\n        raise credentials_exception\n    if not user.is_active:\n        raise HTTPException(400, "Аккаунт деактивирован")\n\n    return user' }
      ]
    },
    {
      id: 4,
      title: 'Login endpoint и защита маршрутов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Endpoint /auth/login проверяет пароль и возвращает JWT токен. Защищённые эндпоинты получают текущего пользователя через Depends(get_current_user).' },
        { type: 'heading', value: 'Auth роутер' },
        { type: 'code', language: 'python', value: 'from fastapi import APIRouter, Depends, HTTPException\nfrom fastapi.security import OAuth2PasswordRequestForm\nfrom pydantic import BaseModel\n\nrouter = APIRouter(prefix="/auth", tags=["Аутентификация"])\n\nclass Token(BaseModel):\n    access_token: str\n    token_type: str = "bearer"\n    expires_in: int = ACCESS_TOKEN_EXPIRE_MINUTES * 60\n\n@router.post("/login", response_model=Token)\nasync def login(\n    form_data: OAuth2PasswordRequestForm = Depends(),  # username + password\n    db: AsyncSession = Depends(get_db)\n):\n    # Найти пользователя по email (OAuth2 использует username для email)\n    user = await crud.get_user_by_email(db, form_data.username)\n    if not user or not verify_password(form_data.password, user.password_hash):\n        raise HTTPException(\n            status_code=401,\n            detail="Неверный email или пароль",\n            headers={"WWW-Authenticate": "Bearer"}\n        )\n    access_token = create_access_token({"sub": str(user.id)})\n    return Token(access_token=access_token)\n\n# Защищённый эндпоинт\n@router.get("/me")\nasync def get_me(current_user = Depends(get_current_user)):\n    return current_user  # текущий пользователь из токена' }
      ]
    },
    {
      id: 5,
      title: 'Refresh токены',
      type: 'theory',
      content: [
        { type: 'text', value: 'Access токен живёт 15-30 минут. Refresh токен — 7-30 дней. Когда access токен истекает, клиент использует refresh токен для получения нового access токена без повторного входа.' },
        { type: 'heading', value: 'Реализация refresh токенов' },
        { type: 'code', language: 'python', value: 'import secrets\nfrom datetime import datetime, timedelta\n\n# Refresh токен — просто случайная строка, хранится в БД\nclass RefreshToken(Base):\n    __tablename__ = "refresh_tokens"\n    id = Column(Integer, primary_key=True)\n    token = Column(String(255), unique=True, index=True)\n    user_id = Column(Integer, ForeignKey("users.id"))\n    expires_at = Column(DateTime)\n    created_at = Column(DateTime, server_default=func.now())\n\nasync def create_refresh_token(db: AsyncSession, user_id: int) -> str:\n    token_str = secrets.token_urlsafe(32)\n    db_token = RefreshToken(\n        token=token_str,\n        user_id=user_id,\n        expires_at=datetime.utcnow() + timedelta(days=30)\n    )\n    db.add(db_token)\n    await db.flush()\n    return token_str\n\n@router.post("/refresh")\nasync def refresh_token(\n    refresh_token: str,\n    db: AsyncSession = Depends(get_db)\n):\n    result = await db.execute(\n        select(RefreshToken)\n        .where(RefreshToken.token == refresh_token)\n        .where(RefreshToken.expires_at > datetime.utcnow())\n    )\n    db_token = result.scalar_one_or_none()\n    if not db_token:\n        raise HTTPException(401, "Недействительный refresh токен")\n\n    # Rotate: удалить старый, создать новый\n    await db.delete(db_token)\n    new_access = create_access_token({"sub": str(db_token.user_id)})\n    new_refresh = await create_refresh_token(db, db_token.user_id)\n    return {"access_token": new_access, "refresh_token": new_refresh}' }
      ]
    },
    {
      id: 6,
      title: 'Роли и разрешения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Авторизация — что пользователь может делать. Реализуется через роли (ADMIN, USER) или зависимости проверки прав.' },
        { type: 'heading', value: 'Проверка ролей через зависимости' },
        { type: 'code', language: 'python', value: 'from fastapi import Depends, HTTPException\nfrom enum import Enum\n\nclass UserRole(str, Enum):\n    USER = "USER"\n    ADMIN = "ADMIN"\n    MODERATOR = "MODERATOR"\n\ndef require_role(role: UserRole):\n    """Фабрика зависимостей для проверки роли"""\n    async def check_role(current_user = Depends(get_current_user)):\n        if current_user.role != role and current_user.role != UserRole.ADMIN:\n            raise HTTPException(\n                status_code=403,\n                detail=f"Требуется роль: {role}"\n            )\n        return current_user\n    return check_role\n\n# Использование в эндпоинте\n@router.get("/admin/users")\nasync def list_all_users(\n    admin = Depends(require_role(UserRole.ADMIN))\n):\n    return await crud.get_all_users(db)\n\n@router.delete("/posts/{post_id}")\nasync def delete_post(\n    post_id: int,\n    current_user = Depends(get_current_user),\n    db: AsyncSession = Depends(get_db)\n):\n    post = await crud.get_post(db, post_id)\n    # Удалить может автор или ADMIN\n    if post.user_id != current_user.id and current_user.role != UserRole.ADMIN:\n        raise HTTPException(403, "Нет прав на удаление")\n    await crud.delete_post(db, post_id)' }
      ]
    },
    {
      id: 7,
      title: 'Практика: полная аутентификация',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полную систему аутентификации: регистрация, вход, refresh токены, защита эндпоинтов, смена пароля.',
      requirements: [
        'POST /auth/register — регистрация, создать пользователя, вернуть токены',
        'POST /auth/login — вход по email/password, вернуть access+refresh токены',
        'POST /auth/refresh — обновить access токен по refresh токену (rotation)',
        'POST /auth/logout — удалить refresh токен',
        'GET /auth/me — информация о текущем пользователе (защищённый)',
        'PATCH /auth/me/password — смена пароля (старый + новый)',
        'GET /admin/users — только для ADMIN роли',
        'При logout — удалять все refresh токены пользователя'
      ],
      hint: 'secrets.token_urlsafe(32) генерирует безопасный refresh токен. Token rotation: при каждом refresh удаляй старый и создавай новый refresh токен.',
      solution: 'from fastapi import APIRouter, Depends, HTTPException\nfrom fastapi.security import OAuth2PasswordRequestForm\nfrom sqlalchemy.ext.asyncio import AsyncSession\n\nrouter = APIRouter(prefix="/auth")\n\n@router.post("/register", status_code=201)\nasync def register(data: UserCreate, db: AsyncSession = Depends(get_db)):\n    if await crud.get_by_email(db, data.email):\n        raise HTTPException(409, "Email уже занят")\n    user = await crud.create_user(db, data)\n    access = create_access_token({"sub": str(user.id)})\n    refresh = await create_refresh_token(db, user.id)\n    return {"access_token": access, "refresh_token": refresh, "token_type": "bearer"}\n\n@router.post("/login")\nasync def login(form: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):\n    user = await crud.get_by_email(db, form.username)\n    if not user or not verify_password(form.password, user.password_hash):\n        raise HTTPException(401, "Неверные данные")\n    access = create_access_token({"sub": str(user.id)})\n    refresh = await create_refresh_token(db, user.id)\n    return {"access_token": access, "refresh_token": refresh}\n\n@router.post("/logout")\nasync def logout(current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):\n    await db.execute(delete(RefreshToken).where(RefreshToken.user_id == current_user.id))\n    return {"message": "Выход выполнен"}\n\n@router.get("/me")\nasync def me(current_user = Depends(get_current_user)):\n    return UserResponse.model_validate(current_user)',
      explanation: 'OAuth2PasswordRequestForm ожидает form-data (не JSON): username и password. Token rotation при refresh предотвращает повторное использование украденного refresh токена. Logout удаляет все сессии — это безопаснее.'
    },
    {
      id: 8,
      title: 'Практика: защита ресурсов и роли',
      type: 'practice',
      difficulty: 'medium',
      description: 'Добавьте авторизацию к блог API: только автор может редактировать/удалять пост, ADMIN может всё.',
      requirements: [
        'Добавь поле role (USER/ADMIN) в модель User',
        'Зависимость get_current_active_user — проверяет is_active',
        'Зависимость require_admin — только ADMIN',
        'POST /posts — любой авторизованный',
        'PUT /posts/{id} — только автор или ADMIN',
        'DELETE /posts/{id} — только автор или ADMIN',
        'GET /admin/posts — все посты включая черновики (только ADMIN)',
        'PATCH /admin/users/{id}/role — изменить роль (только ADMIN)'
      ],
      hint: 'Функция-фабрика require_role(role) возвращает зависимость. В эндпоинте проверяй post.user_id == current_user.id or current_user.role == UserRole.ADMIN.',
      solution: 'def get_current_active_user(current_user = Depends(get_current_user)):\n    if not current_user.is_active:\n        raise HTTPException(400, "Аккаунт отключён")\n    return current_user\n\ndef require_admin(user = Depends(get_current_active_user)):\n    if user.role != UserRole.ADMIN:\n        raise HTTPException(403, "Требуются права администратора")\n    return user\n\n@router.put("/{post_id}")\nasync def update_post(\n    post_id: int,\n    data: PostUpdate,\n    current_user = Depends(get_current_active_user),\n    db: AsyncSession = Depends(get_db)\n):\n    post = await crud.get_post(db, post_id)\n    if not post: raise HTTPException(404, "Пост не найден")\n    if post.user_id != current_user.id and current_user.role != UserRole.ADMIN:\n        raise HTTPException(403, "Нет прав на редактирование")\n    return await crud.update_post(db, post_id, data)\n\n@router.get("/admin/posts")\nasync def admin_posts(admin = Depends(require_admin), db: AsyncSession = Depends(get_db)):\n    return await crud.get_all_posts_including_drafts(db)',
      explanation: 'Зависимости Depends() в FastAPI образуют граф: require_admin вызывает get_current_active_user, который вызывает get_current_user — все автоматически. Проверка owner OR admin — стандартный паттерн авторизации.'
    }
  ]
}
