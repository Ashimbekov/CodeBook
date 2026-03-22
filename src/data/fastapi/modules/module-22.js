export default {
  id: 22,
  title: 'Практикум: REST API',
  description: 'Практические задания по созданию REST API: от простых CRUD операций до сложных запросов с фильтрацией, пагинацией и аутентификацией',
  lessons: [
    {
      id: 1,
      title: 'Практика: CRUD для книг',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создай полный CRUD REST API для библиотеки книг без базы данных (in-memory).',
      requirements: [
        'GET /books/ — список всех книг',
        'GET /books/{id} — книга по ID, 404 если не найдена',
        'POST /books/ — создание книги (title: str, author: str, year: int)',
        'PUT /books/{id} — полное обновление книги',
        'DELETE /books/{id} — удаление, 204 No Content'
      ],
      expectedOutput: 'POST /books/ -> {"id": 1, "title": "Мастер и Маргарита", "author": "Булгаков", "year": 1967}\nGET /books/999 -> 404 {"detail": "Книга не найдена"}\nDELETE /books/1 -> 204',
      hint: 'Используй словарь books: dict[int, dict] и счётчик next_id. В HTTPException(404) передавай читаемое сообщение.',
      solution: 'from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Book(BaseModel):\n    title: str\n    author: str\n    year: int\n\nbooks = {}\nnext_id = 1\n\n@app.get("/books/")\ndef list_books():\n    return list(books.values())\n\n@app.get("/books/{book_id}")\ndef get_book(book_id: int):\n    if book_id not in books:\n        raise HTTPException(404, "Книга не найдена")\n    return books[book_id]\n\n@app.post("/books/", status_code=201)\ndef create_book(book: Book):\n    global next_id\n    new_book = {"id": next_id, **book.dict()}\n    books[next_id] = new_book\n    next_id += 1\n    return new_book\n\n@app.put("/books/{book_id}")\ndef update_book(book_id: int, book: Book):\n    if book_id not in books:\n        raise HTTPException(404, "Книга не найдена")\n    books[book_id] = {"id": book_id, **book.dict()}\n    return books[book_id]\n\n@app.delete("/books/{book_id}", status_code=204)\ndef delete_book(book_id: int):\n    if book_id not in books:\n        raise HTTPException(404, "Книга не найдена")\n    del books[book_id]',
      explanation: 'In-memory CRUD использует словарь Python. next_id — глобальный счётчик. HTTPException(404) возбуждается при отсутствии ресурса. status_code=204 для DELETE — стандарт REST.'
    },
    {
      id: 2,
      title: 'Практика: Пагинация и фильтрация',
      type: 'practice',
      difficulty: 'easy',
      description: 'Добавь к API товаров пагинацию (skip/limit) и фильтрацию по категории и цене.',
      requirements: [
        'GET /products/?skip=0&limit=10 — пагинация',
        'GET /products/?category=electronics — фильтр по категории',
        'GET /products/?min_price=100&max_price=5000 — фильтр по цене',
        'GET /products/?category=electronics&min_price=500 — комбинация фильтров',
        'Ответ содержит: items, total, skip, limit'
      ],
      expectedOutput: 'GET /products/?category=electronics&limit=2 -> {"items": [...], "total": 5, "skip": 0, "limit": 2}',
      hint: 'Примени фильтры последовательно к списку. Сначала все продукты -> фильтр по category -> фильтр по min_price -> фильтр по max_price -> пагинация через [skip:skip+limit].',
      solution: 'from fastapi import FastAPI\nfrom typing import Optional\n\napp = FastAPI()\n\nproducts = [\n    {"id": 1, "name": "Ноутбук", "category": "electronics", "price": 50000},\n    {"id": 2, "name": "Мышь", "category": "electronics", "price": 800},\n    {"id": 3, "name": "Стул", "category": "furniture", "price": 5000},\n    {"id": 4, "name": "Телефон", "category": "electronics", "price": 30000},\n    {"id": 5, "name": "Стол", "category": "furniture", "price": 8000},\n]\n\n@app.get("/products/")\ndef list_products(\n    skip: int = 0,\n    limit: int = 10,\n    category: Optional[str] = None,\n    min_price: Optional[float] = None,\n    max_price: Optional[float] = None\n):\n    result = products[:]\n    if category:\n        result = [p for p in result if p["category"] == category]\n    if min_price is not None:\n        result = [p for p in result if p["price"] >= min_price]\n    if max_price is not None:\n        result = [p for p in result if p["price"] <= max_price]\n    total = len(result)\n    return {"items": result[skip:skip+limit], "total": total, "skip": skip, "limit": limit}',
      explanation: 'Фильтры применяются последовательно к копии списка. total считается после фильтрации но до пагинации — так клиент знает сколько всего записей. Срез [skip:skip+limit] реализует пагинацию.'
    },
    {
      id: 3,
      title: 'Практика: Вложенные ресурсы',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй API с вложенными ресурсами: пользователи и их посты.',
      requirements: [
        'POST /users/ — создание пользователя',
        'GET /users/{user_id}/posts/ — все посты пользователя',
        'POST /users/{user_id}/posts/ — создание поста для пользователя',
        'GET /users/{user_id}/posts/{post_id} — конкретный пост',
        'DELETE /users/{user_id}/posts/{post_id} — удаление поста',
        '404 если пользователь или пост не существует'
      ],
      expectedOutput: 'POST /users/ -> {"id": 1, "name": "Анна"}\nPOST /users/1/posts/ -> {"id": 1, "user_id": 1, "title": "Мой первый пост"}\nGET /users/999/posts/ -> 404',
      hint: 'Храни посты в словаре posts: dict[int, dict] с полем user_id. При GET /users/{user_id}/posts/ фильтруй посты по user_id.',
      solution: 'from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass UserCreate(BaseModel):\n    name: str\n\nclass PostCreate(BaseModel):\n    title: str\n    content: str\n\nusers = {}\nposts = {}\nuser_id_counter = 1\npost_id_counter = 1\n\n@app.post("/users/", status_code=201)\ndef create_user(user: UserCreate):\n    global user_id_counter\n    u = {"id": user_id_counter, "name": user.name}\n    users[user_id_counter] = u\n    user_id_counter += 1\n    return u\n\ndef check_user(user_id: int):\n    if user_id not in users:\n        raise HTTPException(404, f"Пользователь {user_id} не найден")\n\n@app.get("/users/{user_id}/posts/")\ndef get_user_posts(user_id: int):\n    check_user(user_id)\n    return [p for p in posts.values() if p["user_id"] == user_id]\n\n@app.post("/users/{user_id}/posts/", status_code=201)\ndef create_post(user_id: int, post: PostCreate):\n    global post_id_counter\n    check_user(user_id)\n    p = {"id": post_id_counter, "user_id": user_id, **post.dict()}\n    posts[post_id_counter] = p\n    post_id_counter += 1\n    return p\n\n@app.get("/users/{user_id}/posts/{post_id}")\ndef get_post(user_id: int, post_id: int):\n    check_user(user_id)\n    post = posts.get(post_id)\n    if not post or post["user_id"] != user_id:\n        raise HTTPException(404, "Пост не найден")\n    return post\n\n@app.delete("/users/{user_id}/posts/{post_id}", status_code=204)\ndef delete_post(user_id: int, post_id: int):\n    check_user(user_id)\n    post = posts.get(post_id)\n    if not post or post["user_id"] != user_id:\n        raise HTTPException(404, "Пост не найден")\n    del posts[post_id]',
      explanation: 'check_user() вынесен в отдельную функцию для переиспользования. При проверке поста важно проверить и что пост принадлежит конкретному пользователю (post["user_id"] != user_id) — нельзя получить пост другого пользователя.'
    },
    {
      id: 4,
      title: 'Практика: Аутентификация JWT',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй регистрацию, вход и защищённые маршруты с JWT-токенами.',
      requirements: [
        'POST /auth/register — регистрация (username, password), хэширование пароля bcrypt',
        'POST /auth/login — вход, возвращает access_token',
        'GET /users/me — защищённый маршрут, возвращает данные текущего пользователя',
        'GET /users/me/items — список товаров текущего пользователя',
        '401 при неверном токене или истёкшем сроке'
      ],
      expectedOutput: 'POST /auth/login -> {"access_token": "eyJ...", "token_type": "bearer"}\nGET /users/me (с токеном) -> {"id": 1, "username": "anna"}\nGET /users/me (без токена) -> 401',
      hint: 'Используй python-jose для JWT и passlib для bcrypt. get_current_user зависимость декодирует токен из заголовка Authorization: Bearer {token}.',
      solution: 'from fastapi import FastAPI, Depends, HTTPException, status\nfrom fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm\nfrom jose import JWTError, jwt\nfrom passlib.context import CryptContext\nfrom datetime import datetime, timedelta\nfrom pydantic import BaseModel\n\napp = FastAPI()\nSECRET_KEY = "supersecret"\nALGORITHM = "HS256"\nEXPIRE_MINUTES = 30\n\npwd_context = CryptContext(schemes=["bcrypt"])\noauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")\n\nusers_db = {}\n\nclass UserCreate(BaseModel):\n    username: str\n    password: str\n\n@app.post("/auth/register", status_code=201)\ndef register(user: UserCreate):\n    if user.username in users_db:\n        raise HTTPException(409, "Пользователь уже существует")\n    users_db[user.username] = {"username": user.username, "hashed_password": pwd_context.hash(user.password), "items": []}\n    return {"username": user.username}\n\n@app.post("/auth/login")\ndef login(form: OAuth2PasswordRequestForm = Depends()):\n    u = users_db.get(form.username)\n    if not u or not pwd_context.verify(form.password, u["hashed_password"]):\n        raise HTTPException(401, "Неверные данные")\n    token = jwt.encode({"sub": form.username, "exp": datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)}, SECRET_KEY, ALGORITHM)\n    return {"access_token": token, "token_type": "bearer"}\n\ndef get_current_user(token: str = Depends(oauth2_scheme)):\n    try:\n        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])\n        username = payload.get("sub")\n        if not username or username not in users_db:\n            raise HTTPException(401, "Неверный токен")\n        return users_db[username]\n    except JWTError:\n        raise HTTPException(401, "Неверный токен")\n\n@app.get("/users/me")\ndef get_me(user=Depends(get_current_user)):\n    return {"username": user["username"]}\n\n@app.get("/users/me/items")\ndef get_my_items(user=Depends(get_current_user)):\n    return user["items"]',
      explanation: 'bcrypt хэширует пароль при регистрации. JWT токен содержит username в поле sub и время истечения exp. OAuth2PasswordBearer извлекает токен из заголовка Authorization. Depends(get_current_user) защищает маршруты — при неверном токене автоматически возвращается 401.'
    },
    {
      id: 5,
      title: 'Практика: Загрузка и обработка файлов',
      type: 'practice',
      difficulty: 'medium',
      description: 'API для загрузки CSV-файла с товарами и его импорта в базу.',
      requirements: [
        'POST /import/csv/ — принимает CSV-файл с колонками name,price,category',
        'Валидация: только text/csv, максимум 1MB',
        'Парсинг CSV строк, создание объектов Product',
        'Возвращает: количество импортированных, список ошибок строк',
        'GET /products/ — список импортированных товаров'
      ],
      expectedOutput: 'POST /import/csv/ -> {"imported": 5, "errors": [], "total_rows": 5}\nПри ошибке в строке: {"imported": 4, "errors": ["Строка 3: невалидная цена"]}',
      hint: 'Используй io.StringIO для чтения байт как текст: csv.reader(io.StringIO(content.decode())). Оберни каждую строку в try/except для сбора ошибок.',
      solution: 'from fastapi import FastAPI, UploadFile, File, HTTPException\nimport csv\nimport io\n\napp = FastAPI()\nproducts_db = []\n\n@app.post("/import/csv/")\nasync def import_csv(file: UploadFile = File(...)):\n    if file.content_type not in ("text/csv", "application/vnd.ms-excel"):\n        raise HTTPException(400, "Только CSV файлы")\n    content = await file.read()\n    if len(content) > 1024 * 1024:\n        raise HTTPException(400, "Файл больше 1MB")\n    reader = csv.DictReader(io.StringIO(content.decode("utf-8")))\n    imported = 0\n    errors = []\n    for i, row in enumerate(reader, start=2):\n        try:\n            product = {"name": row["name"].strip(), "price": float(row["price"]), "category": row.get("category", "general").strip()}\n            products_db.append(product)\n            imported += 1\n        except (KeyError, ValueError) as e:\n            errors.append(f"Строка {i}: {str(e)}")\n    return {"imported": imported, "errors": errors, "total_rows": imported + len(errors)}\n\n@app.get("/products/")\ndef list_products():\n    return products_db',
      explanation: 'io.StringIO преобразует байты в файлоподобный объект для csv.DictReader. enumerate(reader, start=2) — строки нумеруются с 2 (1 это заголовок). try/except на каждую строку позволяет продолжить импорт при ошибках в отдельных строках.'
    },
    {
      id: 6,
      title: 'Практика: WebHook эндпоинт',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай систему вебхуков: регистрация URL, получение событий и рассылка на зарегистрированные URL.',
      requirements: [
        'POST /webhooks/ — регистрация URL для получения событий (event_type: str, url: str)',
        'GET /webhooks/ — список зарегистрированных вебхуков',
        'DELETE /webhooks/{webhook_id} — удаление вебхука',
        'POST /events/ — создание события, рассылка на все подходящие вебхуки (через httpx.AsyncClient)',
        'Логирование успешных/неудачных отправок'
      ],
      expectedOutput: 'POST /webhooks/ -> {"id": "abc123", "event_type": "order.created", "url": "https://..."}\nPOST /events/ -> {"event_id": "xyz", "delivered_to": 2, "failed": 0}',
      hint: 'Используй asyncio.gather() для параллельной отправки на все вебхуки. Оберни каждый запрос в try/except — недоступный получатель не должен ломать всю рассылку.',
      solution: 'import asyncio\nimport uuid\nimport httpx\nfrom fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\nfrom typing import List\n\napp = FastAPI()\n\nclass WebhookCreate(BaseModel):\n    event_type: str\n    url: str\n\nclass Event(BaseModel):\n    event_type: str\n    data: dict\n\nwebhooks = {}\n\n@app.post("/webhooks/", status_code=201)\ndef register_webhook(wh: WebhookCreate):\n    wh_id = str(uuid.uuid4())[:8]\n    webhooks[wh_id] = {"id": wh_id, "event_type": wh.event_type, "url": wh.url}\n    return webhooks[wh_id]\n\n@app.get("/webhooks/")\ndef list_webhooks():\n    return list(webhooks.values())\n\n@app.delete("/webhooks/{webhook_id}", status_code=204)\ndef delete_webhook(webhook_id: str):\n    if webhook_id not in webhooks:\n        raise HTTPException(404, "Вебхук не найден")\n    del webhooks[webhook_id]\n\nasync def deliver(url: str, payload: dict) -> bool:\n    try:\n        async with httpx.AsyncClient(timeout=5.0) as client:\n            r = await client.post(url, json=payload)\n            return r.status_code < 400\n    except Exception as e:\n        print(f"[WEBHOOK] Ошибка отправки на {url}: {e}")\n        return False\n\n@app.post("/events/")\nasync def create_event(event: Event):\n    event_id = str(uuid.uuid4())[:8]\n    payload = {"event_id": event_id, "type": event.event_type, "data": event.data}\n    targets = [wh for wh in webhooks.values() if wh["event_type"] == event.event_type]\n    results = await asyncio.gather(*[deliver(wh["url"], payload) for wh in targets])\n    delivered = sum(1 for r in results if r)\n    return {"event_id": event_id, "delivered_to": delivered, "failed": len(results) - delivered}',
      explanation: 'asyncio.gather() отправляет все вебхуки параллельно. deliver() возвращает bool и никогда не бросает исключение — ошибки логируются и возвращается False. Фильтрация по event_type позволяет одному URL подписаться только на нужные события.'
    },
    {
      id: 7,
      title: 'Практика: Поиск и сортировка',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуй API с полнотекстовым поиском и многоуровневой сортировкой.',
      requirements: [
        'GET /search/?q=текст — поиск по name и description товаров',
        'GET /products/?sort=price&order=asc — сортировка по полю',
        'Поддерживаемые поля сортировки: name, price, year',
        'Поиск регистронезависимый',
        'Комбинация поиска и сортировки в одном запросе'
      ],
      expectedOutput: 'GET /search/?q=ноутбук -> [{"id":1,"name":"Ноутбук",..."match_score":2}]\nGET /products/?sort=price&order=desc -> товары от дорогих к дешёвым',
      hint: 'Для match_score считай количество полей где найдено вхождение. sorted() с key=lambda x: x[sort_field] и reverse=(order=="desc").',
      solution: 'from fastapi import FastAPI\nfrom typing import Optional\n\napp = FastAPI()\n\nproducts = [\n    {"id": 1, "name": "Ноутбук ASUS", "description": "Мощный ноутбук", "price": 50000, "year": 2023},\n    {"id": 2, "name": "Мышь Logitech", "description": "Беспроводная мышь", "price": 2000, "year": 2022},\n    {"id": 3, "name": "Монитор Samsung", "description": "4K монитор для работы", "price": 35000, "year": 2023},\n    {"id": 4, "name": "Клавиатура", "description": "Механическая клавиатура", "price": 5000, "year": 2021},\n]\n\n@app.get("/search/")\ndef search(q: str = ""):\n    q_lower = q.lower()\n    results = []\n    for p in products:\n        score = 0\n        if q_lower in p["name"].lower():\n            score += 2\n        if q_lower in p["description"].lower():\n            score += 1\n        if score > 0:\n            results.append({**p, "match_score": score})\n    results.sort(key=lambda x: x["match_score"], reverse=True)\n    return results\n\n@app.get("/products/")\ndef list_sorted(\n    sort: Optional[str] = None,\n    order: str = "asc"\n):\n    result = products[:]\n    if sort and sort in ("name", "price", "year"):\n        result = sorted(result, key=lambda x: x[sort], reverse=(order == "desc"))\n    return result',
      explanation: 'match_score взвешивает совпадения: в name важнее (2 балла) чем в description (1 балл). Сортировка по score (reverse=True) выводит наиболее релевантные результаты первыми. Белый список полей сортировки if sort in ("name", "price", "year") предотвращает KeyError.'
    },
    {
      id: 8,
      title: 'Практика: Rate limiting вручную',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуй rate limiting без внешних библиотек: ограничение числа запросов по IP за период.',
      requirements: [
        'Middleware считает запросы по IP-адресу',
        'Лимит: 10 запросов в 60 секунд на IP',
        'При превышении: 429 Too Many Requests с заголовком Retry-After',
        'Хранилище запросов очищается от устаревших записей',
        'GET /limit-status/{ip} — текущий счётчик для IP'
      ],
      expectedOutput: '11-й запрос с одного IP -> 429 {"detail": "Слишком много запросов"}\nHeaders: Retry-After: 45',
      hint: 'Храни timestamps запросов: dict[str, list[float]]. При каждом запросе удаляй записи старше 60 секунд, считай оставшиеся. Если > 10 — 429.',
      solution: 'import time\nfrom collections import defaultdict\nfrom fastapi import FastAPI, Request\nfrom fastapi.responses import JSONResponse\n\napp = FastAPI()\n\nREQUEST_LIMIT = 10\nWINDOW_SECONDS = 60\n\nrequest_history: dict = defaultdict(list)\n\n@app.middleware("http")\nasync def rate_limit(request: Request, call_next):\n    ip = request.client.host\n    now = time.time()\n    window_start = now - WINDOW_SECONDS\n\n    # Очищаем устаревшие записи\n    request_history[ip] = [t for t in request_history[ip] if t > window_start]\n\n    if len(request_history[ip]) >= REQUEST_LIMIT:\n        oldest = min(request_history[ip])\n        retry_after = int(WINDOW_SECONDS - (now - oldest)) + 1\n        return JSONResponse(\n            status_code=429,\n            content={"detail": "Слишком много запросов"},\n            headers={"Retry-After": str(retry_after)}\n        )\n\n    request_history[ip].append(now)\n    return await call_next(request)\n\n@app.get("/limit-status/{ip}")\ndef get_limit_status(ip: str):\n    now = time.time()\n    window_start = now - WINDOW_SECONDS\n    recent = [t for t in request_history.get(ip, []) if t > window_start]\n    return {"ip": ip, "requests_in_window": len(recent), "limit": REQUEST_LIMIT, "remaining": max(0, REQUEST_LIMIT - len(recent))}',
      explanation: 'Скользящее окно: при каждом запросе удаляем записи старше 60 секунд. Если в окне >= 10 запросов — отклоняем. Retry-After рассчитывается как время до истечения самого старого запроса в окне. defaultdict(list) автоматически создаёт пустой список для новых IP.'
    },
    {
      id: 9,
      title: 'Практика: API с кэшированием',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай API с интеллектуальным кэшированием: TTL, инвалидация по тегам и мониторинг попаданий в кэш.',
      requirements: [
        'Класс Cache с методами get, set (ttl), invalidate_tag',
        'Каждому ключу можно назначить теги',
        'invalidate_tag("products") инвалидирует все ключи с этим тегом',
        'Счётчики: hits, misses, evictions',
        'GET /cache/stats — статистика кэша',
        'POST /products/ инвалидирует тег "products"'
      ],
      expectedOutput: 'GET /products/ (miss) -> запрос к БД\nGET /products/ (hit) -> из кэша\nGET /cache/stats -> {"hits": 1, "misses": 1, "hit_rate": "50.0%"}',
      hint: 'Храни в Cache: data dict, ttl dict, tags dict (key -> set of tags) и reverse_tags dict (tag -> set of keys). При invalidate_tag удаляй все ключи из reverse_tags[tag].',
      solution: 'import time\nfrom fastapi import FastAPI\nfrom typing import Optional, Set\n\napp = FastAPI()\n\nclass Cache:\n    def __init__(self):\n        self._data = {}\n        self._ttl = {}\n        self._key_tags = {}  # key -> set of tags\n        self._tag_keys = {}  # tag -> set of keys\n        self.hits = 0\n        self.misses = 0\n        self.evictions = 0\n\n    def get(self, key: str):\n        if key in self._data:\n            if time.time() < self._ttl.get(key, 0):\n                self.hits += 1\n                return self._data[key]\n            else:\n                self._remove(key)\n                self.evictions += 1\n        self.misses += 1\n        return None\n\n    def set(self, key: str, value, ttl: int = 60, tags: Optional[Set[str]] = None):\n        self._data[key] = value\n        self._ttl[key] = time.time() + ttl\n        tags = tags or set()\n        self._key_tags[key] = tags\n        for tag in tags:\n            self._tag_keys.setdefault(tag, set()).add(key)\n\n    def _remove(self, key: str):\n        for tag in self._key_tags.get(key, set()):\n            self._tag_keys.get(tag, set()).discard(key)\n        self._data.pop(key, None)\n        self._ttl.pop(key, None)\n        self._key_tags.pop(key, None)\n\n    def invalidate_tag(self, tag: str):\n        keys = list(self._tag_keys.get(tag, set()))\n        for key in keys:\n            self._remove(key)\n        return len(keys)\n\ncache = Cache()\nproducts_db = [{"id": 1, "name": "Ноутбук", "price": 50000}]\n\n@app.get("/products/")\ndef get_products():\n    cached = cache.get("all_products")\n    if cached:\n        return {"data": cached, "from_cache": True}\n    result = products_db[:]\n    cache.set("all_products", result, ttl=60, tags={"products"})\n    return {"data": result, "from_cache": False}\n\n@app.post("/products/", status_code=201)\ndef create_product(name: str, price: float):\n    new_id = max(p["id"] for p in products_db) + 1 if products_db else 1\n    p = {"id": new_id, "name": name, "price": price}\n    products_db.append(p)\n    cache.invalidate_tag("products")\n    return p\n\n@app.get("/cache/stats")\ndef cache_stats():\n    total = cache.hits + cache.misses\n    hit_rate = f"{cache.hits / total * 100:.1f}%" if total else "0%"\n    return {"hits": cache.hits, "misses": cache.misses, "evictions": cache.evictions, "hit_rate": hit_rate}',
      explanation: 'Теги позволяют инвалидировать группы связанных ключей одним вызовом. _key_tags хранит теги каждого ключа, _tag_keys — обратный индекс. При создании товара invalidate_tag("products") удаляет все кэшированные списки товаров. Статистика hits/misses помогает понять эффективность кэша.'
    },
    {
      id: 10,
      title: 'Практика: Мини-биллинг API',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай API биллинговой системы: счета, транзакции, балансы.',
      requirements: [
        'POST /accounts/ — создание счёта с нулевым балансом',
        'POST /accounts/{id}/deposit — пополнение баланса',
        'POST /accounts/{id}/withdraw — снятие средств (400 если недостаточно)',
        'POST /transfer/ — перевод между счетами (атомарный)',
        'GET /accounts/{id}/transactions — история транзакций',
        'GET /accounts/{id}/balance — текущий баланс'
      ],
      expectedOutput: 'POST /accounts/1/deposit {"amount": 1000} -> {"balance": 1000}\nPOST /accounts/1/withdraw {"amount": 2000} -> 400 "Недостаточно средств"\nPOST /transfer/ {"from": 1, "to": 2, "amount": 500} -> {"status": "ok"}',
      hint: 'Для атомарного перевода сначала проверь баланс отправителя, потом списывай и зачисляй. Транзакции храни в списке с типом: deposit/withdrawal/transfer. UUID для transaction_id.',
      solution: 'from fastapi import FastAPI, HTTPException\nfrom pydantic import BaseModel\nfrom typing import List\nfrom datetime import datetime\nimport uuid\n\napp = FastAPI()\n\naccounts = {}\ntransactions = []\nnext_account_id = 1\n\nclass DepositRequest(BaseModel):\n    amount: float\n\nclass TransferRequest(BaseModel):\n    from_account: int\n    to_account: int\n    amount: float\n\n@app.post("/accounts/", status_code=201)\ndef create_account(owner: str):\n    global next_account_id\n    acc = {"id": next_account_id, "owner": owner, "balance": 0.0}\n    accounts[next_account_id] = acc\n    next_account_id += 1\n    return acc\n\ndef get_account(account_id: int):\n    if account_id not in accounts:\n        raise HTTPException(404, f"Счёт {account_id} не найден")\n    return accounts[account_id]\n\ndef add_transaction(account_id, tx_type, amount, ref_id=None):\n    transactions.append({"id": str(uuid.uuid4())[:8], "account_id": account_id, "type": tx_type, "amount": amount, "ref_id": ref_id, "timestamp": datetime.now().isoformat()})\n\n@app.post("/accounts/{account_id}/deposit")\ndef deposit(account_id: int, req: DepositRequest):\n    acc = get_account(account_id)\n    if req.amount <= 0:\n        raise HTTPException(400, "Сумма должна быть положительной")\n    acc["balance"] += req.amount\n    add_transaction(account_id, "deposit", req.amount)\n    return {"balance": acc["balance"]}\n\n@app.post("/accounts/{account_id}/withdraw")\ndef withdraw(account_id: int, req: DepositRequest):\n    acc = get_account(account_id)\n    if acc["balance"] < req.amount:\n        raise HTTPException(400, f"Недостаточно средств. Баланс: {acc[\'balance\']}")\n    acc["balance"] -= req.amount\n    add_transaction(account_id, "withdrawal", req.amount)\n    return {"balance": acc["balance"]}\n\n@app.post("/transfer/")\ndef transfer(req: TransferRequest):\n    src = get_account(req.from_account)\n    dst = get_account(req.to_account)\n    if src["balance"] < req.amount:\n        raise HTTPException(400, "Недостаточно средств для перевода")\n    src["balance"] -= req.amount\n    dst["balance"] += req.amount\n    tx_id = str(uuid.uuid4())[:8]\n    add_transaction(req.from_account, "transfer_out", req.amount, tx_id)\n    add_transaction(req.to_account, "transfer_in", req.amount, tx_id)\n    return {"status": "ok", "transaction_id": tx_id}\n\n@app.get("/accounts/{account_id}/transactions")\ndef get_transactions(account_id: int):\n    get_account(account_id)\n    return [t for t in transactions if t["account_id"] == account_id]\n\n@app.get("/accounts/{account_id}/balance")\ndef get_balance(account_id: int):\n    acc = get_account(account_id)\n    return {"account_id": account_id, "balance": acc["balance"]}',
      explanation: 'Атомарность перевода: проверяем баланс ДО изменений, затем одновременно списываем и зачисляем. В реальной БД это нужно делать в одной транзакции (db.begin()). ref_id связывает две записи transfer_out и transfer_in одного перевода. get_account() вынесен в функцию для переиспользования с автоматическим 404.'
    }
  ]
}
