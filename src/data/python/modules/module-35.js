export default {
  id: 35,
  title: 'HTTP запросы (requests)',
  description: 'Научимся делать HTTP запросы с библиотекой requests: GET/POST, заголовки, сессии, обработка ответов и аутентификация',
  lessons: [
    {
      id: 1, title: 'GET запросы и работа с ответом', type: 'theory',
      content: [
        { type: 'text', value: 'Библиотека requests — самый популярный способ работать с HTTP в Python. Она делает сложные запросы простыми: управление куками, заголовками, таймаутами — всё в одном.' },
        { type: 'heading', value: 'Установка и первый запрос' },
        { type: 'code', language: 'python', value: '# pip install requests\nimport requests\n\n# GET запрос\nresponse = requests.get("https://httpbin.org/get")\n\nprint(response.status_code)   # 200\nprint(response.ok)            # True (статус 200-299)\nprint(response.url)           # URL запроса\nprint(response.headers)       # заголовки ответа\nprint(response.text)          # тело как строка\nprint(response.content)       # тело как bytes\ndata = response.json()        # тело как Python dict (если JSON)' },
        { type: 'heading', value: 'GET с параметрами запроса' },
        { type: 'code', language: 'python', value: 'import requests\n\n# Параметры передаются как словарь — requests сам кодирует URL\nparams = {\n    "q": "python",\n    "page": 1,\n    "per_page": 10\n}\n\nresponse = requests.get("https://httpbin.org/get", params=params)\nprint(response.url)\n# https://httpbin.org/get?q=python&page=1&per_page=10\n\ndata = response.json()\nprint(data["args"])  # {"q": "python", "page": "1", ...}' },
        { type: 'tip', value: 'response.raise_for_status() вызывает исключение при статусах 4xx и 5xx. Это удобный способ обнаружить ошибки без ручной проверки статуса.' }
      ]
    },
    {
      id: 2, title: 'POST запросы: JSON и форм-данные', type: 'theory',
      content: [
        { type: 'text', value: 'POST запросы используются для отправки данных на сервер. requests.post() поддерживает JSON, форм-данные и загрузку файлов.' },
        { type: 'heading', value: 'POST с JSON' },
        { type: 'code', language: 'python', value: 'import requests\n\n# Отправляем JSON данные\npayload = {\n    "username": "alice",\n    "email": "alice@example.com",\n    "age": 25\n}\n\nresponse = requests.post(\n    "https://httpbin.org/post",\n    json=payload  # автоматически Content-Type: application/json\n)\n\ndata = response.json()\nprint(data["json"])    # {"username": "alice", ...}\nprint(response.status_code)  # 200' },
        { type: 'heading', value: 'POST с формой' },
        { type: 'code', language: 'python', value: 'import requests\n\n# Форм-данные (application/x-www-form-urlencoded)\nform_data = {"username": "alice", "password": "secret"}\n\nresponse = requests.post(\n    "https://httpbin.org/post",\n    data=form_data  # НЕ json= а data= !\n)\n\n# Загрузка файла\nwith open("photo.jpg", "rb") as f:\n    files = {"file": ("photo.jpg", f, "image/jpeg")}\n    resp = requests.post("https://httpbin.org/post", files=files)' },
        { type: 'note', value: 'json= автоматически устанавливает Content-Type: application/json. data= устанавливает application/x-www-form-urlencoded. Разница важна для API.' }
      ]
    },
    {
      id: 3, title: 'Заголовки и аутентификация', type: 'theory',
      content: [
        { type: 'text', value: 'HTTP заголовки передают метаинформацию: тип контента, токены аутентификации, язык. requests поддерживает базовую аутентификацию, Bearer токены и OAuth.' },
        { type: 'heading', value: 'Пользовательские заголовки' },
        { type: 'code', language: 'python', value: 'import requests\n\nheaders = {\n    "User-Agent": "MyApp/1.0",\n    "Accept": "application/json",\n    "X-API-Key": "my-secret-key",\n    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9..."\n}\n\nresponse = requests.get(\n    "https://httpbin.org/headers",\n    headers=headers\n)\nprint(response.json()["headers"])' },
        { type: 'heading', value: 'Виды аутентификации' },
        { type: 'code', language: 'python', value: 'import requests\nfrom requests.auth import HTTPBasicAuth, HTTPDigestAuth\n\n# Basic Auth\nresponse = requests.get(\n    "https://httpbin.org/basic-auth/user/pass",\n    auth=HTTPBasicAuth("user", "pass")\n    # или короче: auth=("user", "pass")\n)\nprint(response.status_code)  # 200\n\n# Bearer токен через заголовок\ntoken = "my_token_here"\nresponse = requests.get(\n    "https://api.example.com/data",\n    headers={"Authorization": f"Bearer {token}"}\n)' }
      ]
    },
    {
      id: 4, title: 'Session — сессии для множественных запросов', type: 'theory',
      content: [
        { type: 'text', value: 'Session сохраняет настройки (заголовки, куки, аутентификацию) между запросами и переиспользует TCP-соединения. Для множества запросов к одному серверу — всегда используй Session.' },
        { type: 'heading', value: 'Использование сессии' },
        { type: 'code', language: 'python', value: 'import requests\n\n# Создаём сессию\nwith requests.Session() as session:\n    # Устанавливаем общие заголовки для всех запросов\n    session.headers.update({\n        "Authorization": "Bearer my_token",\n        "User-Agent": "MyApp/1.0"\n    })\n\n    # Все запросы используют эти заголовки\n    r1 = session.get("https://httpbin.org/get")\n    r2 = session.post("https://httpbin.org/post", json={"data": 1})\n    r3 = session.get("https://httpbin.org/headers")\n\n    print(r3.json()["headers"]["User-Agent"])  # MyApp/1.0' },
        { type: 'heading', value: 'Сессия с cookies' },
        { type: 'code', language: 'python', value: 'import requests\n\nwith requests.Session() as session:\n    # Логинимся (сервер устанавливает куки)\n    session.post("https://example.com/login", data={"user": "alice", "pass": "123"})\n\n    # Куки автоматически передаются в следующих запросах!\n    profile = session.get("https://example.com/profile")\n    orders  = session.get("https://example.com/orders")' },
        { type: 'tip', value: 'Session — это как браузер. Один раз залогинился, и куки сохраняются для всех последующих запросов. Плюс переиспользование TCP соединения ускоряет работу.' }
      ]
    },
    {
      id: 5, title: 'Обработка ошибок и таймауты', type: 'theory',
      content: [
        { type: 'text', value: 'Сеть ненадёжна: запросы могут упасть, зависнуть, вернуть ошибку. Правильная обработка ошибок и таймауты — обязательная часть любого продакшн-кода.' },
        { type: 'heading', value: 'Таймауты' },
        { type: 'code', language: 'python', value: 'import requests\n\n# timeout=(connect_timeout, read_timeout) в секундах\ntry:\n    response = requests.get(\n        "https://httpbin.org/delay/5",\n        timeout=(3.0, 5.0)  # 3 сек на подключение, 5 сек на чтение\n    )\nexcept requests.exceptions.ConnectTimeout:\n    print("Не удалось подключиться за 3 секунды")\nexcept requests.exceptions.ReadTimeout:\n    print("Сервер не ответил за 5 секунд")' },
        { type: 'heading', value: 'Обработка HTTP ошибок' },
        { type: 'code', language: 'python', value: 'import requests\n\ndef safe_request(url: str) -> dict | None:\n    try:\n        response = requests.get(url, timeout=10)\n        response.raise_for_status()  # Exception при 4xx/5xx\n        return response.json()\n\n    except requests.exceptions.HTTPError as e:\n        print(f"HTTP ошибка: {e.response.status_code}")\n    except requests.exceptions.ConnectionError:\n        print("Нет соединения с сервером")\n    except requests.exceptions.Timeout:\n        print("Таймаут запроса")\n    except requests.exceptions.RequestException as e:\n        print(f"Ошибка запроса: {e}")\n\n    return None\n\ndata = safe_request("https://httpbin.org/status/404")\nprint(data)  # None (и сообщение об ошибке)' }
      ]
    },
    {
      id: 6, title: 'Повторные попытки и retry', type: 'theory',
      content: [
        { type: 'text', value: 'В продакшне запросы иногда падают из-за временных проблем сети. Автоматические повторные попытки через urllib3.Retry делают код более надёжным.' },
        { type: 'heading', value: 'Настройка retry' },
        { type: 'code', language: 'python', value: 'import requests\nfrom requests.adapters import HTTPAdapter\nfrom urllib3.util.retry import Retry\n\ndef create_session_with_retry(retries=3, backoff=0.3):\n    """Создаёт сессию с автоматическими повторами."""\n    session = requests.Session()\n\n    retry = Retry(\n        total=retries,\n        backoff_factor=backoff,   # пауза между попытками\n        status_forcelist=[500, 502, 503, 504],  # коды для retry\n    )\n\n    adapter = HTTPAdapter(max_retries=retry)\n    session.mount("https://", adapter)\n    session.mount("http://", adapter)\n\n    return session\n\nwith create_session_with_retry() as session:\n    response = session.get("https://httpbin.org/get", timeout=10)\n    print(response.status_code)' }
      ]
    },
    {
      id: 7, title: 'Практика: Клиент для публичного API', type: 'practice', difficulty: 'medium',
      description: 'Создай клиент для работы с публичным API JSONPlaceholder. Реализуй получение, создание и фильтрацию постов.',
      requirements: [
        'BASE_URL = "https://jsonplaceholder.typicode.com"',
        'Функция get_posts(user_id=None) — получает все посты или посты конкретного пользователя',
        'Функция get_post(post_id) — получает пост по ID с обработкой 404',
        'Функция create_post(title, body, user_id) — создаёт пост через POST',
        'Используй Session для всех запросов',
        'Добавь таймаут 5 секунд и обработку RequestException'
      ],
      expectedOutput: 'Постов всего: 100\nПостов пользователя 1: 10\nПост 1: sunt aut facere...\nПост 999: не найден\nСоздан пост с ID: 101',
      hint: 'Для фильтрации по user_id используй params={"userId": user_id}. При 404 response.status_code == 404, не raise_for_status.',
      solution: 'import requests\n\nBASE_URL = "https://jsonplaceholder.typicode.com"\n\nclass PostClient:\n    def __init__(self):\n        self.session = requests.Session()\n        self.session.headers.update({"Content-Type": "application/json"})\n\n    def get_posts(self, user_id=None):\n        params = {"userId": user_id} if user_id else {}\n        try:\n            r = self.session.get(f"{BASE_URL}/posts", params=params, timeout=5)\n            r.raise_for_status()\n            return r.json()\n        except requests.RequestException as e:\n            print(f"Ошибка: {e}")\n            return []\n\n    def get_post(self, post_id):\n        try:\n            r = self.session.get(f"{BASE_URL}/posts/{post_id}", timeout=5)\n            if r.status_code == 404:\n                return None\n            r.raise_for_status()\n            return r.json()\n        except requests.RequestException as e:\n            print(f"Ошибка: {e}")\n            return None\n\n    def create_post(self, title, body, user_id):\n        try:\n            r = self.session.post(\n                f"{BASE_URL}/posts",\n                json={"title": title, "body": body, "userId": user_id},\n                timeout=5\n            )\n            r.raise_for_status()\n            return r.json()\n        except requests.RequestException as e:\n            print(f"Ошибка: {e}")\n            return None\n\nclient = PostClient()\n\nposts = client.get_posts()\nprint(f"Постов всего: {len(posts)}")\n\nuser_posts = client.get_posts(user_id=1)\nprint(f"Постов пользователя 1: {len(user_posts)}")\n\npost = client.get_post(1)\nif post:\n    print(f"Пост 1: {post[\'title\'][:20]}...")\n\nmissing = client.get_post(999)\nprint(f"Пост 999: {\'не найден\' if not missing else missing}")\n\nnew_post = client.create_post("Тест", "Тело поста", user_id=1)\nif new_post:\n    print(f"Создан пост с ID: {new_post[\'id\']}")',
      explanation: 'Session переиспользует TCP соединение для всех запросов к одному серверу. timeout предотвращает зависание. Явная проверка status_code == 404 даёт понятное поведение вместо исключения. raise_for_status() упрощает обработку других ошибок.'
    }
  ]
}
