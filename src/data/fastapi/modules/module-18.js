export default {
  id: 18,
  title: 'Swagger и документация',
  description: 'Автодокументация FastAPI: Swagger UI, ReDoc, настройка OpenAPI, описание эндпоинтов, примеры запросов и ответов',
  lessons: [
    {
      id: 1,
      title: 'Swagger UI и ReDoc: встроенная документация',
      type: 'theory',
      content: [
        { type: 'text', value: 'FastAPI автоматически генерирует OpenAPI-спецификацию и предоставляет два UI: Swagger UI (интерактивный) и ReDoc (читабельный). Документация создаётся на основе type hints и Pydantic-моделей.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\n\n# Настройка метаданных приложения\napp = FastAPI(\n    title="Мой API",\n    description="API для управления товарами и заказами.\\n\\n## Возможности\\n\\n* Создание товаров\\n* Управление заказами",\n    version="1.0.0",\n    terms_of_service="https://example.com/terms",\n    contact={\n        "name": "Команда разработки",\n        "url": "https://example.com/contact",\n        "email": "dev@example.com",\n    },\n    license_info={\n        "name": "MIT",\n        "url": "https://opensource.org/licenses/MIT",\n    }\n)\n\n# Документация доступна по адресам:\n# /docs — Swagger UI\n# /redoc — ReDoc\n# /openapi.json — JSON-спецификация' },
        { type: 'tip', value: 'description поддерживает Markdown. Можно использовать заголовки, списки, ссылки. Это отображается на главной странице Swagger UI как описание API.' }
      ]
    },
    {
      id: 2,
      title: 'Документирование эндпоинтов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Каждый эндпоинт можно снабдить документацией через параметры декоратора: summary, description, response_description, tags и deprecated.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\nfrom pydantic import BaseModel\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    price: float\n\n@app.get(\n    "/items/{item_id}",\n    summary="Получить товар",\n    description="Возвращает товар по его уникальному идентификатору.\\n\\nЕсли товар не найден, возвращает 404.",\n    response_description="Данные товара",\n    tags=["items"],\n    deprecated=False\n)\ndef get_item(item_id: int):\n    """Можно также использовать docstring для описания.\n\n    Markdown поддерживается в docstring.\n    \"\"\"\n    return {"id": item_id, "name": "Пример"}\n\n@app.post(\n    "/items/",\n    summary="Создать товар",\n    tags=["items"],\n    status_code=201,\n    response_description="Созданный товар с присвоенным ID"\n)\ndef create_item(item: Item):\n    return {**item.dict(), "id": 1}' },
        { type: 'note', value: 'tags группируют эндпоинты в Swagger UI. Все эндпоинты с одинаковым тегом попадают в один раздел. Можно добавить описание к тегам через openapi_tags в параметрах FastAPI().' }
      ]
    },
    {
      id: 3,
      title: 'Документирование моделей и полей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pydantic-модели можно документировать через Field() с description и example. Документация к моделям автоматически появляется в разделе Schemas Swagger UI.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI\nfrom pydantic import BaseModel, Field\nfrom typing import Optional\n\napp = FastAPI()\n\nclass ItemCreate(BaseModel):\n    name: str = Field(\n        ...,\n        description="Название товара",\n        example="Ноутбук ASUS",\n        min_length=2,\n        max_length=100\n    )\n    price: float = Field(\n        ...,\n        description="Цена в рублях",\n        example=49999.99,\n        gt=0\n    )\n    description: Optional[str] = Field(\n        None,\n        description="Подробное описание товара",\n        example="Мощный ноутбук для работы и учёбы"\n    )\n    category: str = Field(\n        "general",\n        description="Категория товара",\n        example="electronics"\n    )\n\n    class Config:\n        schema_extra = {\n            "example": {\n                "name": "Ноутбук ASUS VivoBook",\n                "price": 49999.99,\n                "description": "15-дюймовый ноутбук",\n                "category": "electronics"\n            }\n        }' },
        { type: 'tip', value: 'schema_extra в Config.Model задаёт пример для всей модели целиком. Он отображается в Swagger UI в секции Examples. Это помогает пользователям понять формат запроса.' }
      ]
    },
    {
      id: 4,
      title: 'Теги и группировка эндпоинтов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для больших API важно логически группировать эндпоинты. FastAPI позволяет задавать описания к тегам и использовать APIRouter для организации кода.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, APIRouter\n\ntags_metadata = [\n    {\n        "name": "items",\n        "description": "Операции с товарами. Включает создание, чтение, обновление и удаление.",\n    },\n    {\n        "name": "users",\n        "description": "Управление пользователями и аутентификация.",\n        "externalDocs": {\n            "description": "Документация по аутентификации",\n            "url": "https://docs.example.com/auth"\n        }\n    },\n    {\n        "name": "orders",\n        "description": "Заказы и их обработка."\n    }\n]\n\napp = FastAPI(\n    title="Shop API",\n    openapi_tags=tags_metadata\n)\n\nitems_router = APIRouter(prefix="/items", tags=["items"])\nusers_router = APIRouter(prefix="/users", tags=["users"])\n\n@items_router.get("/")\ndef list_items():\n    return []\n\n@users_router.get("/me")\ndef get_me():\n    return {"id": 1}\n\napp.include_router(items_router)\napp.include_router(users_router)' }
      ]
    },
    {
      id: 5,
      title: 'Примеры запросов и ответов',
      type: 'theory',
      content: [
        { type: 'text', value: 'В Swagger UI можно добавлять несколько примеров запросов через параметр openapi_examples. Это помогает показать разные сценарии использования API.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, Body\nfrom pydantic import BaseModel\nfrom typing import Annotated\n\napp = FastAPI()\n\nclass Item(BaseModel):\n    name: str\n    price: float\n    tax: float = 0.0\n\n@app.post("/items/")\ndef create_item(\n    item: Annotated[\n        Item,\n        Body(\n            openapi_examples={\n                "normal": {\n                    "summary": "Обычный пример",\n                    "description": "Стандартный товар без налога",\n                    "value": {\n                        "name": "Ноутбук",\n                        "price": 50000.0\n                    }\n                },\n                "with_tax": {\n                    "summary": "Пример с налогом",\n                    "description": "Товар с указанием налоговой ставки",\n                    "value": {\n                        "name": "Ноутбук",\n                        "price": 50000.0,\n                        "tax": 0.2\n                    }\n                }\n            }\n        )\n    ]\n):\n    return item' },
        { type: 'note', value: 'openapi_examples отображает выпадающий список примеров в Swagger UI. Пользователь может выбрать пример и сразу отправить запрос. Это значительно улучшает UX документации.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Документированное API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай хорошо задокументированное API для библиотеки книг.',
      requirements: [
        'FastAPI с title, description (Markdown), version',
        'Теги: books, authors с описаниями в openapi_tags',
        'Модели Book и Author с Field() и description/example для каждого поля',
        'Минимум 4 эндпоинта с summary, description, tags',
        'Хотя бы один эндпоинт с openapi_examples для тела запроса',
        'Правильные status_code (201 для создания, 204 для удаления)'
      ],
      expectedOutput: 'GET /docs -> Swagger UI с группами Books и Authors\nМодели отображают описания полей и примеры\nПримеры запросов доступны в интерфейсе',
      hint: 'Используй class Config: schema_extra = {...} в Pydantic-моделях для примера всей модели. openapi_tags задаётся в параметрах FastAPI(). APIRouter удобен для группировки.',
      solution: 'from fastapi import FastAPI, APIRouter, Body\nfrom pydantic import BaseModel, Field\nfrom typing import Optional, List, Annotated\n\ntags_metadata = [\n    {"name": "books", "description": "Управление книгами в библиотеке"},\n    {"name": "authors", "description": "Информация об авторах книг"}\n]\n\napp = FastAPI(\n    title="Library API",\n    description="## API библиотеки\\n\\nПозволяет управлять каталогом книг и авторов.\\n\\n* Полный CRUD для книг\\n* Поиск по автору",\n    version="1.0.0",\n    openapi_tags=tags_metadata\n)\n\nclass Author(BaseModel):\n    name: str = Field(..., description="Полное имя автора", example="Лев Толстой")\n    birth_year: Optional[int] = Field(None, description="Год рождения", example=1828)\n\n    class Config:\n        schema_extra = {"example": {"name": "Лев Толстой", "birth_year": 1828}}\n\nclass Book(BaseModel):\n    title: str = Field(..., description="Название книги", example="Война и мир")\n    author: str = Field(..., description="Имя автора", example="Лев Толстой")\n    year: int = Field(..., description="Год издания", example=1869)\n    pages: Optional[int] = Field(None, description="Количество страниц", example=1274)\n\nbooks_router = APIRouter(prefix="/books", tags=["books"])\nauthors_router = APIRouter(prefix="/authors", tags=["authors"])\n\nbooks_db = []\nauthors_db = []\n\n@books_router.get("/", summary="Список книг", response_description="Список всех книг")\ndef list_books():\n    return books_db\n\n@books_router.post(\n    "/",\n    summary="Добавить книгу",\n    status_code=201,\n    response_description="Созданная книга"\n)\ndef create_book(\n    book: Annotated[Book, Body(openapi_examples={\n        "classic": {"summary": "Классика", "value": {"title": "Война и мир", "author": "Толстой", "year": 1869}},\n        "modern": {"summary": "Современная", "value": {"title": "Гарри Поттер", "author": "Роулинг", "year": 1997}}\n    })]\n):\n    books_db.append(book.dict())\n    return book\n\n@books_router.delete("/{index}", summary="Удалить книгу", status_code=204)\ndef delete_book(index: int):\n    books_db.pop(index)\n\n@authors_router.get("/", summary="Список авторов", tags=["authors"])\ndef list_authors():\n    return authors_db\n\n@authors_router.post("/", summary="Добавить автора", status_code=201)\ndef create_author(author: Author):\n    authors_db.append(author.dict())\n    return author\n\napp.include_router(books_router)\napp.include_router(authors_router)',
      explanation: 'openapi_tags задаёт описания разделов. APIRouter группирует эндпоинты логически. Field() с description и example заполняет документацию к полям модели. openapi_examples показывает несколько примеров запроса в Swagger UI. status_code=201 и 204 документирует правильные коды ответов.'
    }
  ]
}
