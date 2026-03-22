export default {
  id: 17,
  title: 'Тестирование',
  description: 'Тестирование FastAPI с TestClient: unit-тесты, интеграционные тесты, моки зависимостей, тестирование аутентификации и базы данных',
  lessons: [
    {
      id: 1,
      title: 'TestClient: основы тестирования',
      type: 'theory',
      content: [
        { type: 'text', value: 'TestClient из fastapi.testclient позволяет тестировать FastAPI-приложение без запуска реального сервера. Под капотом используется httpx. Поддерживает все HTTP-методы и работает синхронно.' },
        { type: 'code', language: 'python', value: '# main.py\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    price: float\n\n@app.get("/")\ndef root():\n    return {"message": "Hello World"}\n\n@app.post("/items/")\ndef create_item(item: Item):\n    return {"id": 1, **item.dict()}\n\n# test_main.py\nfrom fastapi.testclient import TestClient\nfrom main import app\n\nclient = TestClient(app)\n\ndef test_root():\n    response = client.get("/")\n    assert response.status_code == 200\n    assert response.json() == {"message": "Hello World"}\n\ndef test_create_item():\n    response = client.post(\n        "/items/",\n        json={"name": "Ноутбук", "price": 50000.0}\n    )\n    assert response.status_code == 200\n    data = response.json()\n    assert data["name"] == "Ноутбук"\n    assert data["price"] == 50000.0\n    assert "id" in data' },
        { type: 'tip', value: 'TestClient создаётся один раз на весь модуль тестов — это эффективнее чем создавать его в каждой функции. Используй pytest для запуска: pytest test_main.py -v.' }
      ]
    },
    {
      id: 2,
      title: 'Pytest fixtures и организация тестов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pytest fixtures позволяют переиспользовать настройку тестов: создание клиента, подготовка базы данных, аутентификация. Это устраняет дублирование кода.' },
        { type: 'code', language: 'python', value: '# conftest.py\nimport pytest\nfrom fastapi.testclient import TestClient\nfrom main import app\n\n@pytest.fixture(scope="module")\ndef client():\n    """TestClient для всего модуля"""\n    with TestClient(app) as c:\n        yield c\n\n@pytest.fixture\ndef auth_headers(client):\n    """Заголовки с токеном аутентификации"""\n    response = client.post(\n        "/auth/login",\n        json={"username": "testuser", "password": "testpass"}\n    )\n    token = response.json()["access_token"]\n    return {"Authorization": f"Bearer {token}"}\n\n@pytest.fixture\ndef sample_item(client, auth_headers):\n    """Создаём тестовый товар"""\n    response = client.post(\n        "/items/",\n        json={"name": "Тестовый товар", "price": 100.0},\n        headers=auth_headers\n    )\n    return response.json()\n\n# test_items.py\nclass TestItems:\n    def test_create_item(self, client, auth_headers):\n        r = client.post("/items/", json={"name": "TV", "price": 30000}, headers=auth_headers)\n        assert r.status_code == 201\n\n    def test_get_item(self, client, sample_item):\n        r = client.get(f"/items/{sample_item[\'id\']}")\n        assert r.status_code == 200\n        assert r.json()["name"] == "Тестовый товар"' },
        { type: 'note', value: 'scope="module" создаёт fixture один раз для всего модуля. scope="function" (по умолчанию) — для каждой тестовой функции. Для базы данных обычно используют scope="function" чтобы тесты были изолированы.' }
      ]
    },
    {
      id: 3,
      title: 'Мокирование зависимостей',
      type: 'theory',
      content: [
        { type: 'text', value: 'app.dependency_overrides позволяет заменять зависимости в тестах. Это ключевая возможность для изоляции тестов: заменяем реальную БД на in-memory, реальный email-сервис на mock.' },
        { type: 'code', language: 'python', value: '# main.py\nfrom fastapi import FastAPI, Depends\nfrom typing import Generator\n\napp = FastAPI()\n\ndef get_database():\n    """Реальная зависимость базы данных"""\n    db = RealDatabase()\n    try:\n        yield db\n    finally:\n        db.close()\n\ndef get_current_user(token: str = Depends(get_token)):\n    return {"id": 1, "role": "admin"}\n\n@app.get("/users/me")\ndef get_me(user=Depends(get_current_user)):\n    return user\n\n# test_main.py\nfrom fastapi.testclient import TestClient\nfrom main import app, get_database, get_current_user\n\n# Мок базы данных\nclass FakeDB:\n    def query(self, model):\n        return [{"id": 1, "name": "Test"}]\n    def close(self):\n        pass\n\ndef override_db():\n    yield FakeDB()\n\ndef override_user():\n    return {"id": 42, "role": "admin"}\n\nclient = TestClient(app)\n\ndef test_with_mocked_deps():\n    app.dependency_overrides[get_database] = override_db\n    app.dependency_overrides[get_current_user] = override_user\n\n    response = client.get("/users/me")\n    assert response.json()["id"] == 42\n\n    app.dependency_overrides.clear()  # важно очистить после теста!' },
        { type: 'warning', value: 'Всегда вызывай app.dependency_overrides.clear() после тестов! Иначе моки будут активны в следующих тестах. Лучше использовать pytest fixture с yield для автоматической очистки.' }
      ]
    },
    {
      id: 4,
      title: 'Тестирование с in-memory базой данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для интеграционных тестов используй SQLite in-memory базу данных. Каждый тест получает чистую базу и не влияет на другие тесты.' },
        { type: 'code', language: 'python', value: '# conftest.py\nimport pytest\nfrom fastapi.testclient import TestClient\nfrom sqlalchemy import create_engine\nfrom sqlalchemy.orm import sessionmaker\nfrom main import app, get_db, Base\n\nTEST_DATABASE_URL = "sqlite:///./test.db"\n\nengine = create_engine(\n    TEST_DATABASE_URL,\n    connect_args={"check_same_thread": False}\n)\nTestingSessionLocal = sessionmaker(bind=engine)\n\n@pytest.fixture(autouse=True)\ndef setup_db():\n    """Создаём таблицы перед каждым тестом, удаляем после"""\n    Base.metadata.create_all(bind=engine)\n    yield\n    Base.metadata.drop_all(bind=engine)\n\n@pytest.fixture\ndef db_session():\n    session = TestingSessionLocal()\n    try:\n        yield session\n    finally:\n        session.close()\n\n@pytest.fixture\ndef client(db_session):\n    def override_get_db():\n        try:\n            yield db_session\n        finally:\n            pass\n\n    app.dependency_overrides[get_db] = override_get_db\n    with TestClient(app) as c:\n        yield c\n    app.dependency_overrides.clear()' },
        { type: 'tip', value: 'autouse=True в fixture setup_db означает, что она применяется автоматически к каждому тесту без явного указания. Base.metadata.drop_all() перед каждым тестом гарантирует чистое состояние.' }
      ]
    },
    {
      id: 5,
      title: 'Тестирование ошибок и граничных случаев',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошее тестовое покрытие включает не только happy path, но и обработку ошибок: несуществующие ресурсы, невалидные данные, проблемы авторизации.' },
        { type: 'code', language: 'python', value: 'from fastapi.testclient import TestClient\nfrom main import app\n\nclient = TestClient(app)\n\nclass TestErrorHandling:\n    def test_item_not_found(self):\n        """404 когда товар не существует"""\n        r = client.get("/items/99999")\n        assert r.status_code == 404\n        data = r.json()\n        assert "detail" in data\n\n    def test_validation_error(self):\n        """422 при невалидных данных"""\n        r = client.post("/items/", json={"name": "Test", "price": "не число"})\n        assert r.status_code == 422\n        errors = r.json()["detail"]\n        assert len(errors) > 0\n\n    def test_unauthorized(self):\n        """401 без токена"""\n        r = client.get("/protected-route")\n        assert r.status_code == 401\n\n    def test_forbidden(self):\n        """403 с недостаточными правами"""\n        headers = {"Authorization": "Bearer user_token_not_admin"}\n        r = client.delete("/admin/items/1", headers=headers)\n        assert r.status_code == 403\n\n    def test_empty_name_validation(self):\n        """Пустое имя не должно проходить"""\n        r = client.post("/items/", json={"name": "", "price": 100})\n        assert r.status_code == 422\n\n    def test_negative_price(self):\n        """Отрицательная цена не должна проходить"""\n        r = client.post("/items/", json={"name": "Test", "price": -100})\n        assert r.status_code == 422' }
      ]
    },
    {
      id: 6,
      title: 'Параметризованные тесты и покрытие кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'pytest.mark.parametrize позволяет запускать один тест с разными входными данными. pytest-cov показывает процент покрытия кода тестами.' },
        { type: 'code', language: 'python', value: 'import pytest\nfrom fastapi.testclient import TestClient\nfrom main import app\n\nclient = TestClient(app)\n\n@pytest.mark.parametrize("item_id,expected_status", [\n    (1, 200),\n    (2, 200),\n    (999, 404),\n    (-1, 422),\n    (0, 422),\n])\ndef test_get_item_parametrized(item_id, expected_status):\n    r = client.get(f"/items/{item_id}")\n    assert r.status_code == expected_status\n\n@pytest.mark.parametrize("name,price,expected", [\n    ("Ноутбук", 50000.0, 201),\n    ("", 100.0, 422),       # пустое имя\n    ("TV", -100.0, 422),    # отрицательная цена\n    ("X" * 300, 100.0, 422) # слишком длинное имя\n])\ndef test_create_item_parametrized(name, price, expected):\n    r = client.post("/items/", json={"name": name, "price": price})\n    assert r.status_code == expected\n\n# Запуск с покрытием:\n# pytest --cov=main --cov-report=html\n# Открыть htmlcov/index.html для отчёта' },
        { type: 'tip', value: 'Цель — 80%+ покрытие кода тестами для продакшн-приложений. Запускай pytest -v --cov=. --cov-report=term-missing чтобы видеть непокрытые строки прямо в терминале.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Полный тестовый сьют',
      type: 'practice',
      difficulty: 'hard',
      description: 'Напиши полный набор тестов для CRUD API с аутентификацией.',
      requirements: [
        'conftest.py с fixtures: client, auth_token, sample_user, sample_item',
        'Тесты регистрации и входа (happy path + ошибки)',
        'Тесты CRUD для товаров: создание, чтение, обновление, удаление',
        'Тест что неавторизованный пользователь не может изменять данные',
        'Параметризованный тест валидации полей товара',
        'Минимум 15 тестовых функций'
      ],
      expectedOutput: 'pytest test_suite.py -v\n15 passed in 0.85s\nCoverage: 87%',
      hint: 'Используй pytest fixture с yield для создания и очистки тестовых данных. app.dependency_overrides используй для мокирования get_current_user. client.post("/auth/login") возвращает токен.',
      solution: '# conftest.py\nimport pytest\nfrom fastapi.testclient import TestClient\nfrom main import app, get_current_user\n\n@pytest.fixture(scope="module")\ndef client():\n    with TestClient(app) as c:\n        yield c\n\n@pytest.fixture(scope="module")\ndef auth_token(client):\n    client.post("/auth/register", json={"username": "testuser", "password": "test123"})\n    r = client.post("/auth/login", json={"username": "testuser", "password": "test123"})\n    return r.json()["access_token"]\n\n@pytest.fixture(scope="module")\ndef auth_headers(auth_token):\n    return {"Authorization": f"Bearer {auth_token}"}\n\n@pytest.fixture\ndef sample_item(client, auth_headers):\n    r = client.post("/items/", json={"name": "Тест", "price": 100.0}, headers=auth_headers)\n    item = r.json()\n    yield item\n    client.delete(f"/items/{item[\'id\']}", headers=auth_headers)\n\n# test_auth.py\nclass TestAuth:\n    def test_register_success(self, client):\n        r = client.post("/auth/register", json={"username": "newuser2", "password": "pass123"})\n        assert r.status_code == 201\n\n    def test_register_duplicate(self, client):\n        client.post("/auth/register", json={"username": "dup", "password": "pass"})\n        r = client.post("/auth/register", json={"username": "dup", "password": "pass"})\n        assert r.status_code == 409\n\n    def test_login_success(self, client, auth_token):\n        assert auth_token is not None\n\n    def test_login_wrong_password(self, client):\n        r = client.post("/auth/login", json={"username": "testuser", "password": "wrong"})\n        assert r.status_code == 401\n\nclass TestItems:\n    def test_create_item(self, client, auth_headers):\n        r = client.post("/items/", json={"name": "Новый", "price": 500.0}, headers=auth_headers)\n        assert r.status_code == 201\n        assert r.json()["name"] == "Новый"\n\n    def test_get_item(self, client, sample_item):\n        r = client.get(f"/items/{sample_item[\'id\']}")\n        assert r.status_code == 200\n\n    def test_update_item(self, client, sample_item, auth_headers):\n        r = client.put(f"/items/{sample_item[\'id\']}", json={"name": "Обновлён", "price": 200.0}, headers=auth_headers)\n        assert r.status_code == 200\n\n    def test_delete_item(self, client, auth_headers):\n        r = client.post("/items/", json={"name": "ToDelete", "price": 1.0}, headers=auth_headers)\n        item_id = r.json()["id"]\n        r = client.delete(f"/items/{item_id}", headers=auth_headers)\n        assert r.status_code == 204\n\n    def test_unauthorized_create(self, client):\n        r = client.post("/items/", json={"name": "Test", "price": 1.0})\n        assert r.status_code == 401\n\n    @pytest.mark.parametrize("name,price,code", [\n        ("", 100.0, 422),\n        ("OK", -1.0, 422),\n        ("OK", 0.0, 422),\n        ("A" * 201, 100.0, 422),\n    ])\n    def test_validation(self, client, auth_headers, name, price, code):\n        r = client.post("/items/", json={"name": name, "price": price}, headers=auth_headers)\n        assert r.status_code == code',
      explanation: 'conftest.py содержит все fixtures. scope="module" создаёт токен один раз для модуля — эффективнее. sample_item fixture создаёт товар и удаляет его после теста через yield. Параметризованный тест проверяет 4 невалидных сценария одной функцией. Тест unauthorized_create проверяет что без токена нельзя создать товар.'
    }
  ]
}
