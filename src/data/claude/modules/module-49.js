export default {
  id: 49,
  title: 'Деплой AI-приложений',
  description: 'Варианты деплоя, FastAPI + Claude, serverless (AWS Lambda, Vercel), Docker-контейнеризация, переменные окружения и секреты, мониторинг и логирование.',
  lessons: [
    {
      id: 1,
      title: 'Варианты деплоя AI-приложений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выбор способа деплоя AI-приложения зависит от нагрузки, бюджета и требований к latency. Каждый подход имеет свои сильные стороны.' },
        { type: 'heading', value: 'Сравнение подходов к деплою' },
        { type: 'list', value: [
          'VPS / выделенный сервер: полный контроль, дёшево при постоянной нагрузке, нужно администрирование',
          'Контейнеры (Docker + Kubernetes): масштабируемость, изоляция, хороший выбор для production',
          'PaaS (Railway, Render, Fly.io): простой деплой, меньше администрирования, ограниченная гибкость',
          'Serverless (AWS Lambda, Vercel): оплата только за запросы, нет idle cost, cold start проблемы',
          'Managed AI (Bedrock, Vertex AI): интегрированный мониторинг, дороже, привязка к провайдеру'
        ]},
        { type: 'heading', value: 'Матрица выбора' },
        { type: 'code', language: 'python', value: '# Выбор платформы деплоя:\n\n# < 100 запросов/день, MVP:\n#   -> Railway или Render (простой деплой, есть бесплатный tier)\n\n# 100-10K запросов/день, стартап:\n#   -> Docker на VPS (Hetzner, DigitalOcean) + возможно Kubernetes\n\n# Непредсказуемая нагрузка, пики:\n#   -> AWS Lambda / Vercel Serverless + SQS очередь для длинных запросов\n\n# Enterprise, высокие требования:\n#   -> Kubernetes (EKS/GKE) + CI/CD + мониторинг\n\n# Особенности AI-приложений при деплое:\n# 1. Streaming требует WebSocket или SSE (не подходит для некоторых serverless)\n# 2. Timeout: стандартный 30 секунд может не хватить для длинных ответов\n# 3. Secrets: API ключ Anthropic никогда не должен быть в коде или образе\n# 4. Cost control: нужен мониторинг расходов API\nprint("Платформа выбрана!")' },
        { type: 'tip', value: 'Для первого деплоя рекомендуем Railway или Render — они поддерживают Docker, имеют бесплатный tier и деплой из GitHub занимает 5 минут. Мигрировать на AWS/GKE всегда можно позже.' }
      ]
    },
    {
      id: 2,
      title: 'FastAPI + Claude: REST API',
      type: 'theory',
      content: [
        { type: 'text', value: 'FastAPI — самый популярный Python-фреймворк для создания REST API для AI-приложений. Асинхронный, быстрый, с автодокументацией и встроенной валидацией.' },
        { type: 'heading', value: 'Полный FastAPI приложение с Claude' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, HTTPException, Depends\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom pydantic import BaseModel, Field\nfrom typing import Optional\nimport anthropic\nimport os\nimport uuid\nfrom datetime import datetime\n\napp = FastAPI(title="Claude Chat API", version="1.0.0")\n\n# CORS для фронтенда\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=["http://localhost:3000", "https://your-domain.com"],\n    allow_methods=["POST", "GET"],\n    allow_headers=["*"],\n)\n\n# Клиент Anthropic (один на приложение)\nclient = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])\n\n# Простое in-memory хранилище (в production: Redis/PostgreSQL)\nconversations: dict = {}\n\n# Модели запросов/ответов\nclass ChatRequest(BaseModel):\n    message: str = Field(..., min_length=1, max_length=10000)\n    conversation_id: Optional[str] = None\n    model: str = Field(default="claude-opus-4-5")\n\nclass ChatResponse(BaseModel):\n    reply: str\n    conversation_id: str\n    input_tokens: int\n    output_tokens: int\n    created_at: str\n\nclass HealthResponse(BaseModel):\n    status: str\n    version: str\n\n@app.get("/health", response_model=HealthResponse)\nasync def health_check():\n    return HealthResponse(status="ok", version="1.0.0")\n\n@app.post("/chat", response_model=ChatResponse)\nasync def chat(request: ChatRequest):\n    # Получаем или создаём разговор\n    conv_id = request.conversation_id or str(uuid.uuid4())\n    if conv_id not in conversations:\n        conversations[conv_id] = []\n    \n    history = conversations[conv_id]\n    history.append({"role": "user", "content": request.message})\n    \n    try:\n        response = client.messages.create(\n            model=request.model,\n            max_tokens=2048,\n            system="Ты полезный ассистент.",\n            messages=history\n        )\n    except anthropic.AuthenticationError:\n        raise HTTPException(status_code=500, detail="Ошибка конфигурации AI")\n    except anthropic.RateLimitError:\n        raise HTTPException(status_code=429, detail="Превышен лимит запросов. Попробуйте позже.")\n    except anthropic.APIStatusError as e:\n        raise HTTPException(status_code=502, detail=f"Ошибка AI сервиса: {e.status_code}")\n    \n    reply = response.content[0].text\n    history.append({"role": "assistant", "content": reply})\n    \n    # Ограничиваем историю\n    if len(history) > 40:\n        conversations[conv_id] = history[-40:]\n    \n    return ChatResponse(\n        reply=reply,\n        conversation_id=conv_id,\n        input_tokens=response.usage.input_tokens,\n        output_tokens=response.usage.output_tokens,\n        created_at=datetime.utcnow().isoformat()\n    )\n\n@app.delete("/conversations/{conv_id}")\nasync def delete_conversation(conv_id: str):\n    conversations.pop(conv_id, None)\n    return {"deleted": conv_id}\n\n# Запуск: uvicorn main:app --host 0.0.0.0 --port 8000' },
        { type: 'heading', value: 'Streaming ответы через SSE' },
        { type: 'code', language: 'python', value: 'from fastapi.responses import StreamingResponse\n\n@app.post("/chat/stream")\nasync def chat_stream(request: ChatRequest):\n    async def generate():\n        with client.messages.stream(\n            model=request.model,\n            max_tokens=2048,\n            messages=[{"role": "user", "content": request.message}]\n        ) as stream:\n            for text in stream.text_stream:\n                # Формат SSE: data: текст\\n\\n\n                yield f"data: {text}\\n\\n"\n        yield "data: [DONE]\\n\\n"\n    \n    return StreamingResponse(\n        generate(),\n        media_type="text/event-stream",\n        headers={\n            "Cache-Control": "no-cache",\n            "X-Accel-Buffering": "no"  # для Nginx\n        }\n    )' }
      ]
    },
    {
      id: 3,
      title: 'Serverless деплой (AWS Lambda, Vercel)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Serverless идеален для AI-приложений с нерегулярной нагрузкой: платите только за реальные запросы, авто-масштабирование. Главный вызов: таймаут и cold start.' },
        { type: 'heading', value: 'AWS Lambda + Claude' },
        { type: 'code', language: 'python', value: '# lambda_function.py — AWS Lambda handler\nimport json\nimport os\nimport anthropic\n\n# Клиент создаём вне handler для reuse между invocations\nclient = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])\n\ndef lambda_handler(event, context):\n    """\n    AWS Lambda handler для Claude API.\n    Ожидает: {body: {message: str, conversation_id?: str}}\n    """\n    try:\n        body = json.loads(event.get("body", "{}"))\n        message = body.get("message", "")\n        \n        if not message:\n            return {\n                "statusCode": 400,\n                "headers": {"Content-Type": "application/json"},\n                "body": json.dumps({"error": "message is required"})\n            }\n        \n        response = client.messages.create(\n            model="claude-haiku-4-5",  # Haiku быстрее для Lambda\n            max_tokens=1024,\n            messages=[{"role": "user", "content": message}]\n        )\n        \n        return {\n            "statusCode": 200,\n            "headers": {\n                "Content-Type": "application/json",\n                "Access-Control-Allow-Origin": "*"\n            },\n            "body": json.dumps({\n                "reply": response.content[0].text,\n                "tokens": response.usage.output_tokens\n            })\n        }\n    \n    except anthropic.RateLimitError:\n        return {\n            "statusCode": 429,\n            "body": json.dumps({"error": "Rate limit exceeded"})\n        }\n    except Exception as e:\n        return {\n            "statusCode": 500,\n            "body": json.dumps({"error": "Internal error"})\n        }' },
        { type: 'heading', value: 'Vercel Serverless (Next.js API route)' },
        { type: 'code', language: 'javascript', value: '// pages/api/chat.js — Vercel serverless function\nimport Anthropic from "@anthropic-ai/sdk";\n\nconst client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });\n\nexport default async function handler(req, res) {\n  if (req.method !== "POST") {\n    return res.status(405).json({ error: "Method not allowed" });\n  }\n\n  const { message } = req.body;\n  if (!message) {\n    return res.status(400).json({ error: "message is required" });\n  }\n\n  try {\n    // Streaming response\n    res.writeHead(200, {\n      "Content-Type": "text/event-stream",\n      "Cache-Control": "no-cache",\n    });\n\n    const stream = await client.messages.stream({\n      model: "claude-opus-4-5",\n      max_tokens: 1024,\n      messages: [{ role: "user", content: message }],\n    });\n\n    for await (const chunk of stream) {\n      if (\n        chunk.type === "content_block_delta" &&\n        chunk.delta.type === "text_delta"\n      ) {\n        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\\n\\n`);\n      }\n    }\n\n    res.write("data: [DONE]\\n\\n");\n    res.end();\n  } catch (error) {\n    res.status(500).json({ error: "AI service error" });\n  }\n}\n\n// vercel.json — увеличиваем timeout\n// { "functions": { "api/chat.js": { "maxDuration": 60 } } }' },
        { type: 'warning', value: 'Стандартный timeout AWS Lambda — 3 секунды (можно до 15 минут). Vercel Hobby plan — 10 секунд (Pro — 60 секунд). Claude может отвечать дольше для сложных запросов. Используйте streaming для улучшения UX.' }
      ]
    },
    {
      id: 4,
      title: 'Docker-контейнеризация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Docker обеспечивает воспроизводимое окружение: одинаково работает локально, в CI/CD и в production. Для AI-приложений это особенно важно из-за зависимостей от библиотек.' },
        { type: 'heading', value: 'Dockerfile для FastAPI + Claude' },
        { type: 'code', language: 'bash', value: '# Dockerfile\n\n# Используем официальный Python образ\nFROM python:3.11-slim\n\n# Устанавливаем рабочую директорию\nWORKDIR /app\n\n# Устанавливаем системные зависимости\nRUN apt-get update && apt-get install -y --no-install-recommends \\\n    curl \\\n    && rm -rf /var/lib/apt/lists/*\n\n# Сначала копируем requirements для кэширования слоёв\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\n\n# Копируем код приложения\nCOPY . .\n\n# Создаём непривилегированного пользователя\nRUN useradd --create-home --shell /bin/bash appuser\nUSER appuser\n\n# Переменные окружения (не секреты! Секреты через env файл или secrets manager)\nENV PYTHONUNBUFFERED=1\nENV PORT=8000\n\n# Health check\nHEALTHCHECK --interval=30s --timeout=5s --start-period=5s \\\n  CMD curl -f http://localhost:$PORT/health || exit 1\n\n# Запуск\nCMD uvicorn main:app --host 0.0.0.0 --port $PORT --workers 2' },
        { type: 'code', language: 'bash', value: '# docker-compose.yml для разработки\n\n# Содержимое файла:\n# version: "3.8"\n# services:\n#   api:\n#     build: .\n#     ports:\n#       - "8000:8000"\n#     env_file:\n#       - .env          # содержит ANTHROPIC_API_KEY\n#     volumes:\n#       - .:/app        # hot reload при разработке\n#     command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload\n#\n#   redis:\n#     image: redis:7-alpine\n#     ports:\n#       - "6379:6379"\n\n# .env файл (НЕ коммитить в git!):\n# ANTHROPIC_API_KEY=sk-ant-api...\n# DATABASE_URL=postgresql://user:pass@localhost/db\n\n# Сборка и запуск\ndocker compose up --build\n\n# Только в production (без volume mount):\ndocker build -t my-ai-app:latest .\ndocker run -d --env-file .env -p 8000:8000 my-ai-app:latest' }
      ]
    },
    {
      id: 5,
      title: 'Переменные окружения и секреты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильное управление секретами критично для безопасности. API-ключ Anthropic — это деньги и доступ к мощному инструменту. Его утечка может стоить дорого.' },
        { type: 'heading', value: 'Иерархия управления секретами' },
        { type: 'list', value: [
          'Разработка: .env файл + python-dotenv (никогда не коммитить)',
          'CI/CD: переменные окружения в GitHub Actions/GitLab CI Secrets',
          'Staging/Production: AWS Secrets Manager, HashiCorp Vault, Doppler',
          'Kubernetes: Secrets (base64-encoded, лучше с sealed-secrets)',
          'Vercel/Railway: переменные окружения через дашборд платформы'
        ]},
        { type: 'code', language: 'python', value: '# config.py — централизованная конфигурация\nimport os\nfrom functools import lru_cache\nfrom pydantic_settings import BaseSettings\n\nclass Settings(BaseSettings):\n    # Обязательные секреты\n    anthropic_api_key: str\n    \n    # Опциональные с дефолтами\n    default_model: str = "claude-opus-4-5"\n    max_tokens: int = 2048\n    environment: str = "development"\n    database_url: str = "sqlite:///./chatbot.db"\n    redis_url: str = "redis://localhost:6379/0"\n    \n    # Rate limiting\n    requests_per_minute: int = 60\n    max_conversation_length: int = 40\n    \n    # Мониторинг\n    sentry_dsn: str = ""  # пустая строка = выключено\n    log_level: str = "INFO"\n    \n    class Config:\n        env_file = ".env"\n        env_file_encoding = "utf-8"\n\n@lru_cache()\ndef get_settings() -> Settings:\n    """Кэшируем настройки (parses env vars once)."""\n    return Settings()\n\n# Использование\nsettings = get_settings()\nclient = anthropic.Anthropic(api_key=settings.anthropic_api_key)\n\n# НИКОГДА не логируем секреты!\nprint(f"Запуск в режиме: {settings.environment}")\nprint(f"Модель: {settings.default_model}")  # OK\n# print(f"API Key: {settings.anthropic_api_key}")  # НИКОГДА!' },
        { type: 'warning', value: 'Добавьте .env в .gitignore ПЕРЕД первым коммитом. Если ключ уже попал в git-историю — его нужно отозвать в консоли Anthropic немедленно, история не очищается простым удалением файла.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Деплой бота на Railway',
      type: 'practice',
      difficulty: 'medium',
      description: 'Подготовьте FastAPI приложение с Claude к production деплою: Dockerfile, health check, правильное управление секретами, базовый мониторинг через логи.',
      requirements: [
        'Создайте FastAPI приложение с эндпоинтом POST /chat и GET /health',
        'Напишите Dockerfile: python:3.11-slim, непривилегированный пользователь, health check',
        'Реализуйте структурированное логирование: каждый запрос логируем с timestamp, user_id, tokens, latency',
        'Добавьте middleware для подсчёта request/response метрик',
        'Конфигурация через pydantic BaseSettings с .env',
        'Обработка всех возможных ошибок Anthropic API с правильными HTTP статусами'
      ],
      expectedOutput: 'Готовый к деплою проект с Dockerfile, main.py и .env.example файлами.',
      hint: 'Используйте Python logging модуль с JSON форматом для структурированных логов. Время отклика измеряйте через time.time() в middleware.',
      solution: `# === main.py ===
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings
from typing import Optional
import anthropic
import logging
import time
import uuid
import json
from functools import lru_cache

# === Конфигурация ===
class Settings(BaseSettings):
    anthropic_api_key: str
    default_model: str = "claude-opus-4-5"
    max_tokens: int = 1024
    log_level: str = "INFO"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()

# === Логирование ===
logging.basicConfig(
    level=logging.INFO,
    format='%(message)s'
)
logger = logging.getLogger("chat_api")

def log_request(method, path, status, latency_ms, **kwargs):
    entry = {
        "ts": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "method": method,
        "path": path,
        "status": status,
        "latency_ms": latency_ms,
        **kwargs
    }
    logger.info(json.dumps(entry, ensure_ascii=False))

# === FastAPI ===
settings = get_settings()
client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

app = FastAPI(title="Claude Chat API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def logging_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    latency = int((time.time() - start) * 1000)
    log_request(
        request.method,
        request.url.path,
        response.status_code,
        latency
    )
    return response

# === Модели ===
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=8000)
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    reply: str
    conversation_id: str
    input_tokens: int
    output_tokens: int

# === Хранилище ===
conversations: dict = {}

# === Эндпоинты ===
@app.get("/health")
async def health():
    return {"status": "ok", "model": settings.default_model}

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    conv_id = req.conversation_id or str(uuid.uuid4())
    history = conversations.setdefault(conv_id, [])
    history.append({"role": "user", "content": req.message})

    try:
        response = client.messages.create(
            model=settings.default_model,
            max_tokens=settings.max_tokens,
            system="Ты полезный ассистент.",
            messages=history[-20:]
        )
    except anthropic.AuthenticationError:
        logger.error("Auth error - check ANTHROPIC_API_KEY")
        raise HTTPException(500, "Конфигурационная ошибка сервиса")
    except anthropic.RateLimitError:
        raise HTTPException(429, "Сервис временно перегружен. Попробуйте через минуту.")
    except anthropic.APIStatusError as e:
        logger.error(f"API error: {e.status_code}")
        raise HTTPException(502, "Ошибка внешнего AI сервиса")

    reply = response.content[0].text
    history.append({"role": "assistant", "content": reply})

    # Trim history
    if len(history) > 40:
        conversations[conv_id] = history[-40:]

    log_request("POST", "/chat", 200, 0,
                conv_id=conv_id[:8],
                in_tokens=response.usage.input_tokens,
                out_tokens=response.usage.output_tokens)

    return ChatResponse(
        reply=reply,
        conversation_id=conv_id,
        input_tokens=response.usage.input_tokens,
        output_tokens=response.usage.output_tokens
    )

# uvicorn main:app --host 0.0.0.0 --port 8000

# === Dockerfile ===
# FROM python:3.11-slim
# WORKDIR /app
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
# COPY . .
# RUN useradd -m appuser && chown -R appuser /app
# USER appuser
# ENV PYTHONUNBUFFERED=1 PORT=8000
# HEALTHCHECK --interval=30s CMD curl -f http://localhost:$PORT/health || exit 1
# CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]

# === requirements.txt ===
# fastapi==0.111.0
# uvicorn[standard]==0.30.0
# anthropic==0.29.0
# pydantic-settings==2.3.0
# python-dotenv==1.0.1

# === .env.example ===
# ANTHROPIC_API_KEY=sk-ant-api...
# DEFAULT_MODEL=claude-opus-4-5
# LOG_LEVEL=INFO`,
      explanation: 'Production-ready приложение включает: 1) Pydantic Settings для типизированной конфигурации из env, 2) Logging middleware записывает каждый запрос в JSON (удобно для инструментов наблюдаемости), 3) Обработка всех типов ошибок Anthropic с правильными HTTP-кодами, 4) Dockerfile с непривилегированным пользователем и health check. Для деплоя на Railway: push в GitHub → connect repository → добавить ANTHROPIC_API_KEY в Variables.'
    }
  ]
}
