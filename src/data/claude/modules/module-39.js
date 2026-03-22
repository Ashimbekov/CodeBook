export default {
  id: 39,
  title: 'Обработка ошибок и rate limits',
  description: 'Разбираем типы ошибок Anthropic API, обработку rate limits (429) и overloaded (529), реализацию exponential backoff, паттерны устойчивого кода и мониторинг использования API.',
  lessons: [
    {
      id: 1,
      title: 'Типы ошибок API',
      content: [
        {
          type: 'heading',
          value: 'Классификация ошибок Anthropic API'
        },
        {
          type: 'text',
          value: 'Anthropic API возвращает разные типы ошибок в зависимости от причины. Python SDK представляет их как иерархию исключений. Правильная обработка каждого типа критична для надёжного приложения.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\ntry:\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=1024,\n        messages=[{"role": "user", "content": "Привет"}]\n    )\nexcept anthropic.AuthenticationError as e:\n    # 401: Неверный или отсутствующий API ключ\n    print(f"Ошибка аутентификации: {e}")\nexcept anthropic.PermissionDeniedError as e:\n    # 403: Нет доступа к ресурсу\n    print(f"Нет доступа: {e}")\nexcept anthropic.NotFoundError as e:\n    # 404: Ресурс не найден (например, неверная модель)\n    print(f"Не найдено: {e}")\nexcept anthropic.UnprocessableEntityError as e:\n    # 422: Неверный формат запроса\n    print(f"Неверный запрос: {e}")\nexcept anthropic.RateLimitError as e:\n    # 429: Превышен rate limit\n    print(f"Rate limit: {e}")\nexcept anthropic.InternalServerError as e:\n    # 529: Сервис перегружен или 500: внутренняя ошибка\n    print(f"Ошибка сервера: {e}")\nexcept anthropic.APIConnectionError as e:\n    # Проблемы с сетевым соединением\n    print(f"Ошибка соединения: {e}")\nexcept anthropic.APIError as e:\n    # Базовый класс для всех ошибок API\n    print(f"Неизвестная ошибка API: {e.status_code} - {e}")'
        },
        {
          type: 'list',
          value: '401 AuthenticationError: неверный API ключ — проверьте ANTHROPIC_API_KEY\n403 PermissionDeniedError: нет доступа к модели или функции\n404 NotFoundError: несуществующая модель или ресурс\n422 UnprocessableEntityError: невалидные параметры запроса\n429 RateLimitError: превышен лимит запросов — нужен retry\n500 InternalServerError: внутренняя ошибка Anthropic\n529 OverloadedError: сервис перегружен — нужен retry с задержкой'
        }
      ]
    },
    {
      id: 2,
      title: '429: Rate Limit',
      content: [
        {
          type: 'heading',
          value: 'Ограничения на частоту запросов'
        },
        {
          type: 'text',
          value: 'Rate limit (429) означает, что вы превысили допустимое количество запросов за единицу времени. У каждого аккаунта есть лимиты: по количеству запросов в минуту (RPM) и по токенам в минуту (TPM).'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\ntry:\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=1024,\n        messages=[{"role": "user", "content": "Привет"}]\n    )\nexcept anthropic.RateLimitError as e:\n    print(f"Rate limit достигнут!")\n    print(f"Статус код: {e.status_code}")  # 429\n    print(f"Сообщение: {e.message}")\n    print(f"Retry-After заголовок: {e.response.headers.get(\'retry-after\', \'нет\')}")\n    # Заголовки ответа содержат информацию о лимитах:\n    headers = e.response.headers\n    print(f"Лимит RPM: {headers.get(\'x-ratelimit-limit-requests\', \'?')}")\n    print(f"Осталось RPM: {headers.get(\'x-ratelimit-remaining-requests\', \'?')}")\n    print(f"Сброс RPM: {headers.get(\'x-ratelimit-reset-requests\', \'?')}")\n    print(f"Лимит TPM: {headers.get(\'x-ratelimit-limit-tokens\', \'?')}")\n    print(f"Осталось TPM: {headers.get(\'x-ratelimit-remaining-tokens\', \'?')}")'
        },
        {
          type: 'text',
          value: 'Заголовки x-ratelimit-* доступны в каждом ответе API (не только при ошибках). Мониторинг этих заголовков позволяет заранее замедлить отправку запросов, не дожидаясь 429.'
        },
        {
          type: 'tip',
          value: 'Стратегии избежать rate limit: разбивайте большие задачи на части с задержкой, используйте Batches API для массовой обработки, следите за заголовками x-ratelimit-remaining-requests.'
        }
      ]
    },
    {
      id: 3,
      title: '529: Overloaded',
      content: [
        {
          type: 'heading',
          value: 'Ошибка перегрузки сервиса'
        },
        {
          type: 'text',
          value: '529 OverloadedError означает, что серверы Anthropic временно перегружены. Это отличается от rate limit: не вы превысили лимиты, а сервис временно не может обработать запросы. Стратегия та же — retry с задержкой.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport time\n\nclient = anthropic.Anthropic()\n\ndef make_request_with_overload_handling(messages: list, max_retries: int = 5):\n    """Обработка overloaded с exponential backoff"""\n    for attempt in range(max_retries):\n        try:\n            return client.messages.create(\n                model="claude-opus-4-5",\n                max_tokens=1024,\n                messages=messages\n            )\n        except anthropic.InternalServerError as e:\n            if e.status_code == 529:  # Overloaded\n                if attempt < max_retries - 1:\n                    wait = 2 ** attempt  # 1, 2, 4, 8, 16 секунд\n                    print(f"Сервис перегружен. Повтор через {wait} сек...")\n                    time.sleep(wait)\n                else:\n                    print("Превышено число попыток. Сервис недоступен.")\n                    raise\n            else:\n                # Другая внутренняя ошибка — не ретраить\n                raise\n\nresult = make_request_with_overload_handling(\n    [{"role": "user", "content": "Привет"}]\n)\nif result:\n    print(result.content[0].text)'
        },
        {
          type: 'note',
          value: 'Ошибка 529 чаще встречается в часы пиковой нагрузки. Если приложение критично к доступности, реализуйте fallback-стратегию: уведомление пользователя, очередь запросов, переключение на другую модель.'
        }
      ]
    },
    {
      id: 4,
      title: 'Exponential Backoff',
      content: [
        {
          type: 'heading',
          value: 'Умный алгоритм повторных попыток'
        },
        {
          type: 'text',
          value: 'Exponential backoff — алгоритм повторных попыток с экспоненциально растущей задержкой. Предотвращает шторм запросов при восстановлении сервиса и снижает нагрузку на API при ошибках.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport time\nimport random\nfrom typing import Callable, Any\n\nclient = anthropic.Anthropic()\n\ndef retry_with_backoff(\n    func: Callable,\n    max_retries: int = 5,\n    base_delay: float = 1.0,\n    max_delay: float = 60.0,\n    jitter: bool = True\n) -> Any:\n    """\n    Универсальный декоратор exponential backoff.\n    Формула: delay = min(base_delay * 2^attempt + jitter, max_delay)\n    """\n    retryable_errors = (\n        anthropic.RateLimitError,\n        anthropic.InternalServerError,\n        anthropic.APIConnectionError,\n    )\n\n    for attempt in range(max_retries):\n        try:\n            return func()\n        except retryable_errors as e:\n            if attempt == max_retries - 1:\n                print(f"Все {max_retries} попыток исчерпаны")\n                raise\n\n            # Вычисляем задержку\n            delay = min(base_delay * (2 ** attempt), max_delay)\n            if jitter:\n                delay *= (0.5 + random.random() * 0.5)  # ±50% случайности\n\n            print(f"Попытка {attempt + 1} не удалась: {type(e).__name__}. "\n                  f"Повтор через {delay:.1f} сек...")\n            time.sleep(delay)\n        except anthropic.AuthenticationError:\n            # Аутентификация — не ретраить!\n            raise\n\n# Использование\ndef my_api_call():\n    return client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=512,\n        messages=[{"role": "user", "content": "Привет"}]\n    )\n\nresponse = retry_with_backoff(my_api_call)\nprint(response.content[0].text)'
        },
        {
          type: 'text',
          value: 'Jitter (случайная составляющая) важен при параллельных запросах: без него все клиенты повторяют запросы одновременно, создавая новый шторм. С jitter запросы "рассыпаются" по времени.'
        }
      ]
    },
    {
      id: 5,
      title: 'Паттерны обработки ошибок',
      content: [
        {
          type: 'heading',
          value: 'Практические паттерны для продакшена'
        },
        {
          type: 'text',
          value: 'Надёжный код для работы с Claude API использует несколько паттернов: circuit breaker, timeout, graceful degradation. Рассмотрим каждый.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport time\nimport logging\nfrom dataclasses import dataclass, field\nfrom datetime import datetime\n\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger(__name__)\n\n@dataclass\nclass APIStats:\n    """Статистика вызовов API"""\n    total_requests: int = 0\n    successful: int = 0\n    rate_limited: int = 0\n    overloaded: int = 0\n    errors: int = 0\n    total_input_tokens: int = 0\n    total_output_tokens: int = 0\n\n    def record_success(self, usage):\n        self.total_requests += 1\n        self.successful += 1\n        self.total_input_tokens += usage.input_tokens\n        self.total_output_tokens += usage.output_tokens\n\n    def record_error(self, error_type: str):\n        self.total_requests += 1\n        if error_type == "rate_limit":\n            self.rate_limited += 1\n        elif error_type == "overloaded":\n            self.overloaded += 1\n        else:\n            self.errors += 1\n\n    def report(self):\n        logger.info(f"Всего запросов: {self.total_requests}")\n        logger.info(f"Успешных: {self.successful}")\n        logger.info(f"Rate limited: {self.rate_limited}")\n        logger.info(f"Overloaded: {self.overloaded}")\n        logger.info(f"Других ошибок: {self.errors}")\n        logger.info(f"Токенов: вх={self.total_input_tokens}, исх={self.total_output_tokens}")\n\nstats = APIStats()\nclient = anthropic.Anthropic()\n\ndef safe_ask(question: str, fallback: str = "Сервис временно недоступен") -> str:\n    """Запрос с полной обработкой ошибок и fallback"""\n    try:\n        response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=512,\n            messages=[{"role": "user", "content": question}]\n        )\n        stats.record_success(response.usage)\n        return response.content[0].text\n    except anthropic.AuthenticationError:\n        stats.record_error("auth")\n        logger.error("Неверный API ключ!")\n        raise  # Это не ретраим — конфигурационная ошибка\n    except anthropic.RateLimitError:\n        stats.record_error("rate_limit")\n        logger.warning("Rate limit. Используем fallback.")\n        return fallback\n    except anthropic.InternalServerError:\n        stats.record_error("overloaded")\n        logger.warning("Сервер перегружен. Используем fallback.")\n        return fallback\n    except Exception as e:\n        stats.record_error("unknown")\n        logger.error(f"Неизвестная ошибка: {e}")\n        return fallback\n\nprint(safe_ask("Привет!"))\nstats.report()'
        }
      ]
    },
    {
      id: 6,
      title: 'Мониторинг использования',
      content: [
        {
          type: 'heading',
          value: 'Отслеживание расходов и лимитов'
        },
        {
          type: 'text',
          value: 'Мониторинг помогает предотвратить неожиданные счёта и понять паттерны использования. Следите за токенами, ошибками и приближением к rate limits.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import anthropic\nimport time\nfrom collections import deque\nfrom datetime import datetime, timedelta\n\nclient = anthropic.Anthropic()\n\nclass RateLimitMonitor:\n    """Мониторинг rate limits через заголовки ответа"""\n\n    def __init__(self):\n        self.request_times = deque()  # очередь времён запросов\n        self.window = 60  # секунд\n\n    def check_response_headers(self, response):\n        """Читаем заголовки rate limit из ответа"""\n        headers = response.http_response.headers if hasattr(response, \'http_response\') else {}\n        remaining = headers.get("x-ratelimit-remaining-requests")\n        limit = headers.get("x-ratelimit-limit-requests")\n        reset = headers.get("x-ratelimit-reset-requests")\n\n        if remaining and limit:\n            remaining = int(remaining)\n            limit = int(limit)\n            usage_pct = (1 - remaining/limit) * 100\n            if usage_pct > 80:\n                print(f"Внимание! Использовано {usage_pct:.0f}% лимита запросов")\n            if usage_pct > 90:\n                print(f"Критично! Осталось только {remaining} запросов. Замедляем...")\n                time.sleep(1)  # искусственная задержка\n\n    def track_request(self):\n        """Отслеживаем частоту запросов"""\n        now = time.time()\n        self.request_times.append(now)\n        # Удаляем старые запросы (за пределами окна)\n        while self.request_times and self.request_times[0] < now - self.window:\n            self.request_times.popleft()\n        rpm = len(self.request_times)  # запросов в последнюю минуту\n        print(f"RPM: {rpm}")\n        return rpm\n\nmonitor = RateLimitMonitor()\n\ndef monitored_request(question: str):\n    monitor.track_request()\n    response = client.messages.create(\n        model="claude-haiku-3-5",\n        max_tokens=100,\n        messages=[{"role": "user", "content": question}]\n    )\n    print(f"Ответ получен. Токенов: {response.usage.output_tokens}")\n    return response.content[0].text\n\nprint(monitored_request("Привет!"))'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Надёжный клиент API',
      type: 'practice',
      difficulty: 'advanced',
      description: 'Создайте класс RobustAnthropicClient, который оборачивает стандартный клиент с: exponential backoff для 429/529, ведением статистики (успехи, ошибки, токены), timeout и логированием.',
      requirements: [
        'Класс RobustAnthropicClient с методом create()',
        'Exponential backoff: базовая задержка 1 сек, максимум 60 сек, jitter ±25%',
        'Максимум 5 попыток для 429 и 529 ошибок',
        'Атрибут stats: dict с ключами requests, successes, failures, tokens',
        'Логирование каждой попытки через logging.warning()',
        'Метод get_stats() возвращающий статистику',
        'Тест: сделать 3 успешных запроса и вывести статистику'
      ],
      expectedOutput: 'Делаем запрос 1...\nОтвет: Привет! Я Claude...\nДелаем запрос 2...\nОтвет: Python — это...\nДелаем запрос 3...\nОтвет: Алматы — крупнейший город...\n\nСтатистика клиента:\n  Всего запросов: 3\n  Успешных: 3\n  Ошибок: 0\n  Входящих токенов: 87\n  Исходящих токенов: 156',
      hint: 'Используйте isinstance(e, anthropic.RateLimitError) для определения типа ошибки. Jitter реализуйте как delay *= (0.75 + random.random() * 0.5). Обновляйте stats["tokens"] из response.usage.',
      solution: 'import anthropic\nimport time\nimport random\nimport logging\n\nlogging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")\nlogger = logging.getLogger(__name__)\n\nclass RobustAnthropicClient:\n    def __init__(self, max_retries: int = 5):\n        self.client = anthropic.Anthropic()\n        self.max_retries = max_retries\n        self.stats = {\n            "requests": 0,\n            "successes": 0,\n            "failures": 0,\n            "input_tokens": 0,\n            "output_tokens": 0\n        }\n\n    def create(self, **kwargs):\n        """Обёртка над messages.create() с retry-логикой"""\n        self.stats["requests"] += 1\n        base_delay = 1.0\n        max_delay = 60.0\n\n        for attempt in range(self.max_retries):\n            try:\n                response = self.client.messages.create(**kwargs)\n                self.stats["successes"] += 1\n                self.stats["input_tokens"] += response.usage.input_tokens\n                self.stats["output_tokens"] += response.usage.output_tokens\n                return response\n\n            except (anthropic.RateLimitError, anthropic.InternalServerError) as e:\n                error_name = type(e).__name__\n                if attempt == self.max_retries - 1:\n                    self.stats["failures"] += 1\n                    logger.error(f"Все {self.max_retries} попытки исчерпаны: {error_name}")\n                    raise\n\n                delay = min(base_delay * (2 ** attempt), max_delay)\n                delay *= (0.75 + random.random() * 0.5)  # jitter ±25%\n                logger.warning(f"Попытка {attempt + 1}: {error_name}. Повтор через {delay:.1f} сек")\n                time.sleep(delay)\n\n            except anthropic.AuthenticationError:\n                self.stats["failures"] += 1\n                logger.error("Ошибка аутентификации — не повторяем")\n                raise\n\n            except Exception as e:\n                self.stats["failures"] += 1\n                logger.error(f"Неожиданная ошибка: {e}")\n                raise\n\n    def get_stats(self) -> dict:\n        return dict(self.stats)\n\n# Тест\nrobust = RobustAnthropicClient()\n\nquestions = [\n    "Скажи привет одним предложением",\n    "Что такое Python? Одно предложение",\n    "Назови столицу Казахстана. Одно слово"\n]\n\nfor i, q in enumerate(questions, 1):\n    print(f"Делаем запрос {i}...")\n    response = robust.create(\n        model="claude-haiku-3-5",\n        max_tokens=100,\n        messages=[{"role": "user", "content": q}]\n    )\n    print(f"Ответ: {response.content[0].text.strip()}")\n\nprint("\\nСтатистика клиента:")\nstats = robust.get_stats()\nprint(f"  Всего запросов: {stats[\'requests\']}")\nprint(f"  Успешных: {stats[\'successes\']}")\nprint(f"  Ошибок: {stats[\'failures\']}")\nprint(f"  Входящих токенов: {stats[\'input_tokens\']}")\nprint(f"  Исходящих токенов: {stats[\'output_tokens\']}")',
      explanation: 'RobustAnthropicClient инкапсулирует всю логику устойчивости: retry с exponential backoff, ведение статистики, разделение ошибок на retryable (RateLimitError, InternalServerError) и non-retryable (AuthenticationError). Jitter предотвращает thundering herd — одновременные повторные запросы от нескольких экземпляров клиента. Статистика помогает мониторить здоровье приложения: высокий уровень failures указывает на проблемы с конфигурацией или нагрузкой.'
    }
  ]
}
