export default {
  id: 50,
  title: 'Работа с API',
  description: 'requests + JSON: GET/POST запросы к API, аутентификация, обработка ответов, работа с REST API',
  lessons: [
    {
      id: 1,
      title: 'GET запросы и JSON ответы',
      type: 'theory',
      content: [
        { type: 'text', value: 'REST API возвращает данные в формате JSON. requests автоматически декодирует JSON через .json(). Параметры запроса передаются через params.' },
        { type: 'code', language: 'python', value: 'import requests\n\n# Публичное API (JSONPlaceholder для тестирования)\nbase_url = \'https://jsonplaceholder.typicode.com\'\n\n# Получить список постов\nresponse = requests.get(f\'{base_url}/posts\')\nprint(response.status_code)   # 200\nprint(response.headers[\'Content-Type\'])  # application/json\n\nposts = response.json()  # Python list/dict\nprint(type(posts))       # <class \'list\'>\nprint(len(posts))        # 100\nprint(posts[0])          # {\'userId\': 1, \'id\': 1, \'title\': ..., \'body\': ...}\n\n# Получить конкретный пост\npost = requests.get(f\'{base_url}/posts/1\').json()\nprint(post[\'title\'])\n\n# С параметрами запроса\nparams = {\'userId\': 1}  # фильтрация по пользователю\nuser_posts = requests.get(f\'{base_url}/posts\', params=params).json()\nprint(f"Постов пользователя 1: {len(user_posts)}")\n\n# Обработка ошибок\ntry:\n    r = requests.get(f\'{base_url}/posts/999\', timeout=5)\n    if r.status_code == 404:\n        print("Пост не найден")\n    elif r.status_code == 200:\n        print(r.json())\n    else:\n        r.raise_for_status()\nexcept requests.Timeout:\n    print("Превышено время ожидания")\nexcept requests.RequestException as e:\n    print(f"Ошибка: {e}")' }
      ]
    },
    {
      id: 2,
      title: 'POST, PUT, DELETE запросы',
      type: 'theory',
      content: [
        { type: 'text', value: 'POST создаёт ресурс, PUT обновляет, PATCH частично обновляет, DELETE удаляет. Данные передаются в теле запроса как JSON.' },
        { type: 'code', language: 'python', value: 'import requests\n\nbase_url = \'https://jsonplaceholder.typicode.com\'\n\n# POST — создать ресурс\nnew_post = {\n    \'title\': \'Мой новый пост\',\n    \'body\': \'Содержимое поста\',\n    \'userId\': 1\n}\nresponse = requests.post(f\'{base_url}/posts\', json=new_post)\nprint(response.status_code)   # 201 Created\nprint(response.json())         # {\'id\': 101, \'title\': ..., ...}\n\n# PUT — полное обновление\nupdated = {\n    \'id\': 1,\n    \'title\': \'Обновлённый заголовок\',\n    \'body\': \'Обновлённое тело\',\n    \'userId\': 1\n}\nresponse = requests.put(f\'{base_url}/posts/1\', json=updated)\nprint(response.json())\n\n# PATCH — частичное обновление\npatch_data = {\'title\': \'Только заголовок изменился\'}\nresponse = requests.patch(f\'{base_url}/posts/1\', json=patch_data)\nprint(response.json())\n\n# DELETE — удаление\nresponse = requests.delete(f\'{base_url}/posts/1\')\nprint(response.status_code)  # 200 или 204\n\n# Заголовки Content-Type\nheaders = {\'Content-Type\': \'application/json\'}\nresponse = requests.post(f\'{base_url}/posts\',\n                          json=new_post,  # json= автоматически ставит Content-Type\n                          headers=headers)' }
      ]
    },
    {
      id: 3,
      title: 'Аутентификация: API Key, Bearer Token',
      type: 'theory',
      content: [
        { type: 'text', value: 'Большинство API требуют аутентификацию. Популярные методы: API Key в заголовке, Bearer Token (JWT), Basic Auth, OAuth2.' },
        { type: 'code', language: 'python', value: 'import requests\nimport os\n\n# API Key в заголовке\napi_key = os.environ.get(\'API_KEY\', \'your_api_key\')\nheaders = {\'X-API-Key\': api_key}\nresponse = requests.get(\'https://api.example.com/data\', headers=headers)\n\n# Bearer Token (JWT)\ntoken = os.environ.get(\'ACCESS_TOKEN\', \'jwt_token_here\')\nheaders = {\'Authorization\': f\'Bearer {token}\'}\nresponse = requests.get(\'https://api.example.com/users/me\', headers=headers)\n\n# Basic Auth\nfrom requests.auth import HTTPBasicAuth\nresponse = requests.get(\n    \'https://api.example.com/data\',\n    auth=HTTPBasicAuth(\'username\', \'password\')\n)\n# Или сокращённо:\nresponse = requests.get(url, auth=(\'username\', \'password\'))\n\n# Получение токена через логин\ndef get_token(base_url, username, password):\n    response = requests.post(f\'{base_url}/auth/login\', json={\n        \'username\': username,\n        \'password\': password\n    })\n    response.raise_for_status()\n    return response.json()[\'access_token\']\n\n# Session с авторизацией\nclass APIClient:\n    def __init__(self, base_url, api_key):\n        self.base_url = base_url\n        self.session = requests.Session()\n        self.session.headers.update({\n            \'Authorization\': f\'Bearer {api_key}\',\n            \'Content-Type\': \'application/json\'\n        })\n\n    def get(self, endpoint, **kwargs):\n        return self.session.get(f\'{self.base_url}{endpoint}\', **kwargs).json()\n\n    def post(self, endpoint, data, **kwargs):\n        return self.session.post(f\'{self.base_url}{endpoint}\', json=data, **kwargs).json()' },
        { type: 'warning', value: 'Никогда не храни API ключи в коде. Используй переменные окружения (os.environ) или файл .env с python-dotenv. Добавь .env в .gitignore.' }
      ]
    },
    {
      id: 4,
      title: 'Пагинация и сбор данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'API часто возвращают данные страницами. Нужно обходить все страницы для получения полного набора данных.' },
        { type: 'code', language: 'python', value: 'import requests\nimport time\n\ndef fetch_all_pages(base_url, endpoint, params=None, page_param=\'page\',\n                   max_pages=100, delay=0.5):\n    """Собирает данные со всех страниц API."""\n    all_items = []\n    params = params or {}\n    page = 1\n\n    with requests.Session() as session:\n        while page <= max_pages:\n            params[page_param] = page\n            response = session.get(f\'{base_url}{endpoint}\', params=params, timeout=10)\n            response.raise_for_status()\n            data = response.json()\n\n            # Разные API возвращают данные по-разному\n            if isinstance(data, list):  # Список — сами данные\n                items = data\n            elif \'results\' in data:  # {results: [...], next: ...}\n                items = data[\'results\']\n            elif \'data\' in data:     # {data: [...], meta: {...}}\n                items = data[\'data\']\n            else:\n                items = []\n\n            if not items:\n                break\n\n            all_items.extend(items)\n            print(f"Страница {page}: получено {len(items)} элементов")\n\n            # Проверка наличия следующей страницы\n            if isinstance(data, dict):\n                if not data.get(\'next\') and not data.get(\'has_more\'):\n                    break\n\n            page += 1\n            time.sleep(delay)  # вежливая пауза\n\n    return all_items\n\n# Пример с cursor-based пагинацией\ndef fetch_cursor_based(url, session):\n    all_data = []\n    cursor = None\n    while True:\n        params = {\'cursor\': cursor} if cursor else {}\n        data = session.get(url, params=params).json()\n        all_data.extend(data[\'items\'])\n        cursor = data.get(\'next_cursor\')\n        if not cursor:\n            break\n    return all_data' }
      ]
    },
    {
      id: 5,
      title: 'Обработка ответов и сохранение',
      type: 'theory',
      content: [
        { type: 'text', value: 'После сбора данных нужно их обработать и сохранить. Pandas отлично подходит для работы с JSON-ответами API.' },
        { type: 'code', language: 'python', value: 'import requests\nimport pandas as pd\nimport json\nfrom pathlib import Path\nfrom datetime import datetime\n\n# Нормализация вложенного JSON\nresponse = requests.get(\'https://jsonplaceholder.typicode.com/users\')\nusers = response.json()\n\n# Вложенная структура: {address: {city: ...}, company: {name: ...}}\nprint(users[0][\'address\'])  # {\'street\': ..., \'city\': ..., \'geo\': {...}}\n\n# pd.json_normalize — разворачивает вложенный JSON\ndf = pd.json_normalize(\n    users,\n    sep=\'_\',              # разделитель для вложенных ключей\n    meta=[\'id\', \'name\', \'email\']\n)\nprint(df.columns.tolist())  # id, name, email, address_street, address_city, ...\n\n# Сохранение с метаданными\ndef save_api_response(data, filename):\n    output = {\n        \'timestamp\': datetime.now().isoformat(),\n        \'count\': len(data),\n        \'data\': data\n    }\n    with open(filename, \'w\', encoding=\'utf-8\') as f:\n        json.dump(output, f, ensure_ascii=False, indent=2)\n    print(f"Сохранено {len(data)} записей в {filename}")\n\n# Загрузка кэшированных данных\ndef load_or_fetch(url, cache_file, ttl_hours=24):\n    cache_path = Path(cache_file)\n    if cache_path.exists():\n        with open(cache_path) as f:\n            cached = json.load(f)\n        print(f"Загружено из кэша: {cache_file}")\n        return cached[\'data\']\n    data = requests.get(url).json()\n    save_api_response(data, cache_file)\n    return data' },
        { type: 'tip', value: 'Кэшируй ответы API во время разработки. Это ускоряет итерации и не нагружает сервер. Удаляй кэш когда нужны свежие данные.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Клиент для открытого API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай клиент для JSONPlaceholder API: получи данные, обработай и проанализируй.',
      requirements: [
        'Получи всех пользователей с https://jsonplaceholder.typicode.com/users',
        'Для каждого пользователя получи его посты (endpoint /posts?userId=N)',
        'Создай DataFrame: user_id, name, email, city, posts_count',
        'Найди пользователя с наибольшим числом постов',
        'Создай сводную таблицу: количество пользователей по городам',
        'Сохрани результат в users_analysis.json'
      ],
      expectedOutput: 'Получено 10 пользователей\nСобрано постов: {user_id: count, ...}\nПользователь с max постами: ...\nГорода и пользователи:\n...',
      hint: 'Цикл по users, для каждого requests.get(f"{base}/posts", params={"userId": u["id"]}) и len(posts). pd.json_normalize(users) для удобного создания DataFrame.',
      solution: 'import requests\nimport pandas as pd\nimport json\n\nbase_url = \'https://jsonplaceholder.typicode.com\'\n\n# Получить пользователей\nresponse = requests.get(f\'{base_url}/users\')\nresponse.raise_for_status()\nusers = response.json()\nprint(f"Получено {len(users)} пользователей")\n\n# Получить количество постов для каждого\ndata = []\nfor user in users:\n    posts_resp = requests.get(f\'{base_url}/posts\', params={\'userId\': user[\'id\']})\n    posts_count = len(posts_resp.json())\n    data.append({\n        \'user_id\': user[\'id\'],\n        \'name\': user[\'name\'],\n        \'email\': user[\'email\'],\n        \'city\': user[\'address\'][\'city\'],\n        \'company\': user[\'company\'][\'name\'],\n        \'posts_count\': posts_count\n    })\n    print(f"  {user[\'name\']}: {posts_count} постов")\n\ndf = pd.DataFrame(data)\nprint("\\nDataFrame:")\nprint(df[[\'name\', \'city\', \'posts_count\']])\n\nbest_user = df.loc[df[\'posts_count\'].idxmax()]\nprint(f"\\nПользователь с max постами: {best_user[\'name\']} ({best_user[\'posts_count\']} постов)")\n\nprint("\\nПользователи по городам:")\nprint(df.groupby(\'city\')[\'name\'].apply(list))\n\nresult = {\n    \'total_users\': len(df),\n    \'total_posts\': df[\'posts_count\'].sum(),\n    \'most_active\': best_user[\'name\'],\n    \'users\': data\n}\nwith open(\'users_analysis.json\', \'w\', encoding=\'utf-8\') as f:\n    json.dump(result, f, ensure_ascii=False, indent=2)\nprint("\\nСохранено в users_analysis.json")',
      explanation: 'Каждый вложенный запрос добавляет задержку — в реальном проекте используй многопоточность (concurrent.futures) для ускорения. idxmax() возвращает индекс строки с максимумом, df.loc[idx] получает всю строку. ensure_ascii=False сохраняет кириллицу читаемой.'
    }
  ]
}
