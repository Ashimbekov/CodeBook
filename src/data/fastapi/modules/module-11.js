export default {
  id: 11,
  title: 'Middleware в FastAPI',
  description: 'Создание и использование middleware в FastAPI: логирование, rate limiting, кеширование, обработка ошибок, кастомные заголовки и сжатие',
  lessons: [
    {
      id: 1,
      title: 'Принцип работы Middleware',
      type: 'theory',
      content: [
        { type: 'text', value: 'Middleware — слой между клиентом и приложением. Каждый запрос проходит через все middleware (в порядке регистрации), обрабатывается endpoint, и ответ проходит через middleware в обратном порядке.' },
        { type: 'heading', value: 'Базовый middleware' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, Request\nfrom fastapi.responses import Response\nimport time\n\napp = FastAPI()\n\n@app.middleware("http")\nasync def timing_middleware(request: Request, call_next):\n    """\n    Запрос → [этот код] → endpoint → [этот код] → ответ\n    """\n    # --- ДО обработки запроса ---\n    start_time = time.perf_counter()\n    request_id = str(uuid.uuid4())  # уникальный ID запроса\n\n    # Вызвать следующий handler (endpoint или следующий middleware)\n    response = await call_next(request)\n\n    # --- ПОСЛЕ обработки ---\n    duration = time.perf_counter() - start_time\n    response.headers["X-Request-ID"] = request_id\n    response.headers["X-Process-Time"] = f"{duration:.4f}"\n\n    return response' },
        { type: 'tip', value: 'Middleware регистрируются в обратном порядке: последний зарегистрированный — первый выполняется при запросе (LIFO для вызова, FIFO для ответа).' }
      ]
    },
    {
      id: 2,
      title: 'Middleware для логирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'Middleware логирования записывает каждый запрос и ответ: метод, путь, статус код, время обработки. Это даёт полный аудит всех запросов к API.' },
        { type: 'heading', value: 'LoggingMiddleware' },
        { type: 'code', language: 'python', value: 'import logging\nimport time\nimport uuid\nfrom fastapi import Request\n\nlogger = logging.getLogger("api")\n\n@app.middleware("http")\nasync def logging_middleware(request: Request, call_next):\n    request_id = str(uuid.uuid4())[:8]\n\n    # Логировать входящий запрос\n    logger.info(\n        f"[{request_id}] → {request.method} {request.url.path} "\n        f"from {request.client.host}"\n    )\n\n    start = time.perf_counter()\n    response = await call_next(request)\n    duration_ms = (time.perf_counter() - start) * 1000\n\n    # Логировать ответ\n    level = logging.INFO if response.status_code < 400 else logging.WARNING\n    logger.log(\n        level,\n        f"[{request_id}] ← {response.status_code} "\n        f"({duration_ms:.1f}ms)"\n    )\n\n    response.headers["X-Request-ID"] = request_id\n    return response' }
      ]
    },
    {
      id: 3,
      title: 'Rate Limiting Middleware',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rate limiting ограничивает количество запросов с одного IP. Защищает от DDoS, брутфорса, злоупотреблений. В памяти — для одного сервера, Redis — для нескольких.' },
        { type: 'heading', value: 'In-memory Rate Limiter' },
        { type: 'code', language: 'python', value: 'from collections import defaultdict\nfrom datetime import datetime, timedelta\nfrom fastapi.responses import JSONResponse\n\nclass RateLimiter:\n    def __init__(self, requests: int, window_seconds: int):\n        self.requests = requests\n        self.window = window_seconds\n        self._storage: dict[str, list[datetime]] = defaultdict(list)\n\n    def is_allowed(self, ip: str) -> tuple[bool, int]:\n        now = datetime.utcnow()\n        window_start = now - timedelta(seconds=self.window)\n\n        # Оставить только запросы в текущем окне\n        self._storage[ip] = [\n            t for t in self._storage[ip] if t > window_start\n        ]\n        remaining = self.requests - len(self._storage[ip])\n\n        if len(self._storage[ip]) >= self.requests:\n            return False, 0\n\n        self._storage[ip].append(now)\n        return True, remaining - 1\n\nrate_limiter = RateLimiter(requests=100, window_seconds=60)\n\n@app.middleware("http")\nasync def rate_limit_middleware(request: Request, call_next):\n    ip = request.client.host\n\n    # Пропустить health check\n    if request.url.path in [\"/health\", \"/docs\"]:\n        return await call_next(request)\n\n    allowed, remaining = rate_limiter.is_allowed(ip)\n\n    if not allowed:\n        return JSONResponse(\n            status_code=429,\n            content={"detail": "Превышен лимит запросов"},\n            headers={"Retry-After": "60"}\n        )\n\n    response = await call_next(request)\n    response.headers["X-RateLimit-Remaining"] = str(remaining)\n    return response' }
      ]
    },
    {
      id: 4,
      title: 'BaseHTTPMiddleware класс',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для более сложных middleware используй класс BaseHTTPMiddleware — он позволяет инкапсулировать состояние и конфигурацию.' },
        { type: 'heading', value: 'BaseHTTPMiddleware' },
        { type: 'code', language: 'python', value: 'from starlette.middleware.base import BaseHTTPMiddleware\nfrom starlette.requests import Request\nfrom starlette.responses import Response\n\nclass SecurityHeadersMiddleware(BaseHTTPMiddleware):\n    """Добавляет заголовки безопасности к каждому ответу"""\n\n    async def dispatch(self, request: Request, call_next) -> Response:\n        response = await call_next(request)\n\n        # Заголовки безопасности\n        response.headers["X-Content-Type-Options"] = "nosniff"\n        response.headers["X-Frame-Options"] = "DENY"\n        response.headers["X-XSS-Protection"] = "1; mode=block"\n        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"\n        response.headers["Content-Security-Policy"] = (\n            "default-src \'self\'; "\n            "script-src \'self\' \'unsafe-inline\'; "\n            "style-src \'self\' \'unsafe-inline\'"\n        )\n        if request.url.scheme == "https":\n            response.headers["Strict-Transport-Security"] = (\n                "max-age=31536000; includeSubDomains"\n            )\n        return response\n\napp.add_middleware(SecurityHeadersMiddleware)' }
      ]
    },
    {
      id: 5,
      title: 'GZip и сжатие ответов',
      type: 'theory',
      content: [
        { type: 'text', value: 'GZipMiddleware сжимает большие ответы, уменьшая трафик. Включить просто — одна строка кода. Starlette также предоставляет TrustedHostMiddleware.' },
        { type: 'heading', value: 'Middleware из Starlette' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\nfrom starlette.middleware.gzip import GZipMiddleware\nfrom starlette.middleware.trustedhost import TrustedHostMiddleware\n\napp = FastAPI()\n\n# Сжатие ответов больше 1000 байт\napp.add_middleware(GZipMiddleware, minimum_size=1000)\n\n# Разрешить только указанные хосты\napp.add_middleware(\n    TrustedHostMiddleware,\n    allowed_hosts=["myapp.kz", "*.myapp.kz", "localhost"]\n)\n\n# HTTPS редирект\nfrom starlette.middleware.httpsredirect import HTTPSRedirectMiddleware\n# app.add_middleware(HTTPSRedirectMiddleware)  # только в продакшене!' }
      ]
    },
    {
      id: 6,
      title: 'Middleware для обработки исключений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Middleware может перехватывать исключения, которые не обработаны эндпоинтами, и возвращать стандартный JSON ответ.' },
        { type: 'heading', value: 'Error Handling Middleware' },
        { type: 'code', language: 'python', value: 'import traceback\nfrom starlette.middleware.base import BaseHTTPMiddleware\n\nclass ErrorHandlingMiddleware(BaseHTTPMiddleware):\n    async def dispatch(self, request: Request, call_next) -> Response:\n        try:\n            return await call_next(request)\n        except Exception as e:\n            # Логировать полный traceback\n            logger.error(\n                f"Необработанная ошибка: {type(e).__name__}: {e}\\n"\n                f"{traceback.format_exc()}"\n            )\n            # Вернуть стандартный ответ (не раскрывать внутренние детали!)\n            return JSONResponse(\n                status_code=500,\n                content={"detail": "Внутренняя ошибка сервера"}\n            )\n\napp.add_middleware(ErrorHandlingMiddleware)' },
        { type: 'warning', value: 'В ответ на ошибку 500 никогда не отправляй traceback или внутренние детали — это уязвимость безопасности. Логируй детали на сервере, клиенту — только общее сообщение.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: стек middleware для продакшена',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полный стек middleware для продакшен API: логирование, rate limiting, заголовки безопасности, GZip, обработка ошибок.',
      requirements: [
        'RequestIDMiddleware: добавляет уникальный X-Request-ID к каждому запросу',
        'LoggingMiddleware: логирует метод, путь, статус, время (миллисекунды)',
        'RateLimitMiddleware: 100 запросов/минуту с IP, исключить /docs и /health',
        'SecurityHeadersMiddleware: X-Content-Type-Options, X-Frame-Options',
        'GZipMiddleware для сжатия > 1000 байт',
        'Правильный порядок регистрации middleware',
        'Endpoint /health возвращает {"status": "ok", "version": "1.0"}'
      ],
      hint: 'Порядок: Security → RateLimit → Logging → RequestID → GZip → app. Middleware выполняются в LIFO порядке для запросов. add_middleware последний добавленный — первый выполняется.',
      solution: 'from fastapi import FastAPI, Request\nfrom starlette.middleware.base import BaseHTTPMiddleware\nfrom starlette.middleware.gzip import GZipMiddleware\nfrom fastapi.responses import JSONResponse\nimport uuid, time, logging\n\nlogger = logging.getLogger("api")\napp = FastAPI()\n\nclass RequestIDMiddleware(BaseHTTPMiddleware):\n    async def dispatch(self, request: Request, call_next):\n        request_id = str(uuid.uuid4())[:8]\n        request.state.request_id = request_id\n        response = await call_next(request)\n        response.headers["X-Request-ID"] = request_id\n        return response\n\nclass LoggingMiddleware(BaseHTTPMiddleware):\n    async def dispatch(self, request: Request, call_next):\n        start = time.perf_counter()\n        response = await call_next(request)\n        ms = (time.perf_counter() - start) * 1000\n        logger.info(f"{request.method} {request.url.path} {response.status_code} {ms:.1f}ms")\n        return response\n\nclass RateLimitMiddleware(BaseHTTPMiddleware):\n    def __init__(self, app, limit=100, window=60):\n        super().__init__(app)\n        self.limiter = RateLimiter(limit, window)\n    async def dispatch(self, request: Request, call_next):\n        if request.url.path in ["/docs", "/health", "/openapi.json"]:\n            return await call_next(request)\n        allowed, remaining = self.limiter.is_allowed(request.client.host)\n        if not allowed:\n            return JSONResponse(429, {"detail": "Лимит превышен"}, headers={"Retry-After": "60"})\n        return await call_next(request)\n\n# Порядок регистрации (выполняются в обратном порядке)\napp.add_middleware(GZipMiddleware, minimum_size=1000)\napp.add_middleware(RequestIDMiddleware)\napp.add_middleware(LoggingMiddleware)\napp.add_middleware(RateLimitMiddleware, limit=100, window=60)\n\n@app.get("/health")\nasync def health(): return {"status": "ok", "version": "1.0"}',
      explanation: 'Middleware добавляются последним-первым. GZip добавлен первым — значит выполняется последним (после всех других). RequestID добавляется рано чтобы был доступен во всех middleware через request.state.'
    }
  ]
}
