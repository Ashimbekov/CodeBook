export default {
  id: 13,
  title: 'Rate Limiting',
  description: 'Ограничение частоты запросов: Token Bucket, Leaky Bucket, Fixed Window, Sliding Window. Распределённый rate limiting с Redis.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужен Rate Limiting',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rate Limiting — ограничение частоты запросов от клиента. Защищает систему от перегрузки, DDoS атак, злоупотреблений API.' },
        { type: 'heading', value: 'Почему это необходимо' },
        { type: 'list', value: [
          'Защита от DoS/DDoS: один клиент не может "положить" сервис',
          'Равномерное распределение ресурсов: один агрессивный клиент не забирает всё',
          'Защита backend систем: база данных, внешние API',
          'Монетизация: бесплатный тариф — 100 RPS, платный — 10,000 RPS',
          'Предотвращение scraping: защита данных от парсеров'
        ]},
        { type: 'heading', value: 'Уровни rate limiting' },
        { type: 'text', value: 'По IP адресу: простейший, но обходится через прокси/botnet\nПо User ID: точнее, требует аутентификации\nПо API Key: для разработчиков, тарифные планы\nПо эндпоинту: /api/expensive-operation — строже\nГлобальный: суммарный лимит на сервис' },
        { type: 'heading', value: 'Ответ при превышении лимита' },
        { type: 'text', value: 'HTTP 429 Too Many Requests\nЗаголовки ответа:\n  X-RateLimit-Limit: 100       → сколько разрешено\n  X-RateLimit-Remaining: 0     → сколько осталось\n  X-RateLimit-Reset: 1700000060 → когда сбросится (Unix timestamp)\n  Retry-After: 60              → подождать N секунд' }
      ]
    },
    {
      id: 2,
      title: 'Fixed Window Counter: простой алгоритм',
      type: 'theory',
      content: [
        { type: 'text', value: 'Самый простой алгоритм: считать запросы в фиксированных временных окнах (по минутам, часам).' },
        { type: 'heading', value: 'Алгоритм' },
        { type: 'text', value: 'Псевдокод:\nfunction isAllowed(userId, limit, windowSeconds):\n  key = userId + ":" + floor(currentTime / windowSeconds)\n  count = redis.incr(key)\n  if count == 1:\n    redis.expire(key, windowSeconds)  // Установить TTL\n  return count <= limit\n\nПример: лимит 5 запросов в минуту для user:123\n  ключи: "user:123:16833" (16833 = текущая минута)\n  14:00:00 → count=1 ✓\n  14:00:15 → count=2 ✓\n  14:00:30 → count=3 ✓\n  14:00:45 → count=4 ✓\n  14:00:50 → count=5 ✓\n  14:00:55 → count=6 ✗ → 429' },
        { type: 'heading', value: 'Проблема: edge case у границы окна' },
        { type: 'text', value: 'Проблема:\n  Лимит: 5 запросов в минуту\n  14:00:55 → 5 запросов (последние секунды первого окна)\n  14:01:00 → 5 запросов (первые секунды второго окна)\n  Итого за 10 секунд: 10 запросов — в 2 раза больше лимита!' },
        { type: 'note', value: 'Fixed Window — для начала подходит, прост в реализации. Для точного контроля нужен Sliding Window.' }
      ]
    },
    {
      id: 3,
      title: 'Token Bucket и Leaky Bucket',
      type: 'theory',
      content: [
        { type: 'text', value: 'Два классических алгоритма для более гибкого rate limiting.' },
        { type: 'heading', value: 'Token Bucket (Ведро с токенами)' },
        { type: 'text', value: 'Концепция:\n- Есть "ведро" ёмкостью B токенов\n- Токены добавляются со скоростью R (например, 10 токенов/сек)\n- Каждый запрос потребляет 1 токен\n- Если токенов нет → запрос отклонён\n- Ведро не может переполниться (максимум B токенов)\n\nСостояние: {tokens: 10, last_refill: timestamp}\n\nПри запросе:\n  elapsed = now - last_refill\n  tokens = min(capacity, tokens + elapsed * rate)\n  if tokens >= 1: tokens -= 1; allow\n  else: reject\n\nПлюсы: Bursts разрешены (если накопились токены).\nПример: лимит 10 RPS, но разрешён burst до 100 (если минуту не было запросов).' },
        { type: 'heading', value: 'Leaky Bucket (Дырявое ведро)' },
        { type: 'text', value: 'Концепция:\n- Запросы попадают в "ведро" (очередь)\n- Ведро "вытекает" с постоянной скоростью R запросов/сек\n- Если ведро переполнено → запрос отклонён\n\nПлюсы: равномерный поток запросов (не burst)\nМинусы: легитимные burst запросы тоже отклоняются\n\nПрименение: ограничение трафика к backend (защита от спайков)' },
        { type: 'tip', value: 'Token Bucket — для API с разрешёнными burst (AWS API Gateway, Stripe API). Leaky Bucket — для выравнивания трафика к downstream сервисам. В большинстве случаев Token Bucket предпочтительнее для пользовательских лимитов.' }
      ]
    },
    {
      id: 4,
      title: 'Sliding Window Log и Sliding Window Counter',
      type: 'theory',
      content: [
        { type: 'text', value: 'Скользящее окно решает проблему Fixed Window у границ.' },
        { type: 'heading', value: 'Sliding Window Log (точный, дорогой)' },
        { type: 'text', value: 'Алгоритм:\n1. Храним timestamp каждого запроса в упорядоченном списке\n2. При новом запросе: удалить старые записи (за пределами окна)\n3. Если len(log) < limit → разрешить, добавить timestamp\n\nПсевдокод:\nfunction isAllowed(userId, limit, windowSeconds):\n  now = currentTime\n  windowStart = now - windowSeconds\n  key = "rate:" + userId\n  \n  // Удалить записи старше окна\n  redis.zremrangebyscore(key, 0, windowStart)\n  // Посчитать оставшиеся\n  count = redis.zcard(key)\n  if count < limit:\n    redis.zadd(key, now, now)  // Добавить новую запись\n    redis.expire(key, windowSeconds)\n    return allowed\n  return rejected\n\nПлюс: точный, нет проблемы границы окна\nМинус: хранит все timestamps → много памяти при высоком RPS' },
        { type: 'heading', value: 'Sliding Window Counter (приближённый, эффективный)' },
        { type: 'text', value: 'Гибрид Fixed Window и Sliding Window:\n\ncount = prev_window_count * overlap_ratio + current_window_count\nгде overlap_ratio = (window - elapsed_in_current) / window\n\nПример:\n  Лимит: 10 req/min, окно: 00:00–01:00\n  Сейчас 00:45 (45 сек в новом окне)\n  prev_window: 8 запросов, current_window: 3 запроса\n  overlap = 15/60 = 0.25 (25% предыдущего окна ещё в диапазоне)\n  estimated = 8 * 0.25 + 3 = 5\n  5 < 10 → разрешить\n\nПамять: O(1) на пользователя. Погрешность < 1%.' }
      ]
    },
    {
      id: 5,
      title: 'Распределённый Rate Limiting с Redis',
      type: 'practice',
      content: [
        { type: 'text', value: 'Когда несколько инстансов сервиса, локальный rate limiting не работает. Нужен распределённый с общим состоянием.' },
        { type: 'heading', value: 'Проблема локального rate limiting' },
        { type: 'text', value: 'Ситуация:\n  3 инстанса сервиса за Load Balancer\n  Лимит: 100 RPS на пользователя\n  Каждый инстанс хранит счётчик локально: 100/3 ≈ 33 RPS per инстанс\n  \n  Но если все запросы пользователя приходят на один инстанс (sticky session):\n  Этот инстанс блокирует, остальные не знают о превышении лимита.\n  С round-robin: пользователь реально может делать 100 × 3 = 300 RPS!' },
        { type: 'heading', value: 'Решение: Redis как общий счётчик' },
        { type: 'text', value: 'Реализация Sliding Window Counter на Redis:\n\nfunction isAllowed(userId, limit=100, windowSec=1):\n  key = "rate:" + userId\n  now = currentTimeMs\n  windowStart = now - windowSec * 1000\n  \n  // Атомарная операция с Lua скриптом:\n  script = """\n    redis.call("ZREMRANGEBYSCORE", KEYS[1], 0, ARGV[1])\n    local count = redis.call("ZCARD", KEYS[1])\n    if tonumber(count) < tonumber(ARGV[2]) then\n      redis.call("ZADD", KEYS[1], ARGV[3], ARGV[3])\n      redis.call("PEXPIRE", KEYS[1], ARGV[4])\n      return 1\n    end\n    return 0\n  """\n  result = redis.eval(script, [key], [windowStart, limit, now, windowSec*1000])\n  return result == 1\n\nLua скрипт выполняется атомарно — нет race condition.\nRedis однопоточный → гарантированная атомарность.' },
        { type: 'heading', value: 'Архитектура распределённого rate limiting' },
        { type: 'text', value: 'Схема:\n[Clients] → [Load Balancer] → [API Servers] → [Redis Cluster (Rate Limit Store)]\n                                            ↓\n                                      [Application DB]\n\nAPI Server: перед обработкой запроса → проверить Redis\nRedis: отдельный Redis кластер для rate limiting (не основной кеш)\n\nLatency: добавляет ~1 мс per запрос (Redis в том же датацентре)' },
        { type: 'tip', value: 'Cloudflare обрабатывает rate limiting на уровне CDN Edge, до доходжения до ваших серверов. AWS API Gateway, Kong имеют встроенный rate limiting. Не изобретайте колесо — используйте готовые решения если доступны.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: проектируем rate limiter',
      type: 'practice',
      content: [
        { type: 'text', value: 'Спроектируем rate limiter для публичного API.' },
        { type: 'heading', value: 'Требования' },
        { type: 'text', value: '- Бесплатный план: 1,000 запросов/час\n- Базовый план: 10,000 запросов/час\n- Премиум: 100,000 запросов/час\n- Burst: разрешить burst до 2× минутного лимита\n- Ответ: 429 с заголовками сколько осталось\n- Распределённая система (несколько серверов)' },
        { type: 'heading', value: 'Компоненты' },
        { type: 'text', value: 'Rate Limit Rules хранятся в Redis:\n  "plan:free" → {limit: 1000, window: 3600}\n  "plan:basic" → {limit: 10000, window: 3600}\n  "plan:premium" → {limit: 100000, window: 3600}\n\nАлгоритм: Token Bucket (разрешает burst)\n\nДля каждого API Key:\n  "bucket:{apiKey}" → {tokens: 16, last_refill: timestamp}\n\nRefill rate:\n  free: 1000/3600 ≈ 0.28 токена/сек\n  basic: 2.78 токена/сек\n  premium: 27.8 токена/сек\n\nBurst capacity = 2 × (limit/60) = 2-минутный лимит' },
        { type: 'heading', value: 'Middleware архитектура' },
        { type: 'text', value: 'function rateLimitMiddleware(request):\n  apiKey = getApiKey(request)  // из заголовка Authorization\n  plan = getPlanForKey(apiKey)  // из БД (кешировать в Redis 5 мин)\n  \n  allowed, remaining, resetAt = checkRateLimit(apiKey, plan)\n  \n  response.setHeader("X-RateLimit-Limit", plan.limit)\n  response.setHeader("X-RateLimit-Remaining", remaining)\n  response.setHeader("X-RateLimit-Reset", resetAt)\n  \n  if not allowed:\n    return 429, {"error": "Rate limit exceeded", "retry_after": secondsUntilReset}\n  \n  return next(request)  // Продолжить обработку' },
        { type: 'note', value: 'Мониторинг rate limiting: отслеживайте топ-N клиентов по количеству 429 ответов. Это покажет как намеренных злоупотребителей, так и клиентов, которым нужно повысить план или оптимизировать код.' }
      ]
    }
  ]
}
