export default {
  id: 4,
  title: 'Request Body и Pydantic модели',
  description: 'Принятие данных в теле запроса с помощью Pydantic моделей: создание схем, вложенные модели, валидация, примеры и конфигурация',
  lessons: [
    {
      id: 1,
      title: 'Pydantic BaseModel — основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pydantic — библиотека валидации данных через Python type hints. В FastAPI все request/response модели строятся на Pydantic. Он автоматически валидирует данные, конвертирует типы и генерирует JSON схему.' },
        { type: 'heading', value: 'Первая Pydantic модель' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel\nfrom fastapi import FastAPI\nfrom typing import Optional\n\napp = FastAPI()\n\nclass UserCreate(BaseModel):\n    name: str\n    email: str\n    age: int\n    bio: Optional[str] = None  # необязательное поле\n\n@app.post("/users", status_code=201)\nasync def create_user(user: UserCreate):  # FastAPI читает JSON из body\n    # user.name, user.email, user.age — автоматически провалидированы!\n    return {\n        "id": 1,\n        "name": user.name,\n        "email": user.email\n    }\n\n# Тело запроса:\n# {\n#   "name": "Алибек",\n#   "email": "alibek@mail.ru",\n#   "age": 25\n# }' },
        { type: 'tip', value: 'Pydantic автоматически конвертирует типы: "25" (строка) → 25 (int). И валидирует: "abc" для int поля → ошибка 422.' }
      ]
    },
    {
      id: 2,
      title: 'Валидация полей через Field()',
      type: 'theory',
      content: [
        { type: 'text', value: 'Field() в Pydantic работает как Query()/Path() — добавляет ограничения и описания к полям модели.' },
        { type: 'heading', value: 'Field() для валидации' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel, Field, EmailStr\nfrom typing import Optional\n\nclass UserCreate(BaseModel):\n    name: str = Field(\n        min_length=2,\n        max_length=100,\n        title="Имя пользователя",\n        description="Полное имя, минимум 2 символа",\n        example="Алибек Жаксыбеков"\n    )\n    email: EmailStr = Field(\n        description="Email адрес",\n        example="alibek@mail.ru"\n    )  # EmailStr автоматически валидирует формат!\n    age: int = Field(\n        ge=18,     # greater or equal 18\n        le=120,    # less or equal 120\n        default=18\n    )\n    password: str = Field(\n        min_length=8,\n        pattern=r"^(?=.*[A-Z])(?=.*\\d).+$"  # хотя бы 1 заглавная и 1 цифра\n    )' },
        { type: 'heading', value: 'Установка email-validator' },
        { type: 'code', language: 'python', value: '# Для EmailStr нужна библиотека\npip install email-validator\n\n# Или с fastapi[all]:\npip install "fastapi[all]"' }
      ]
    },
    {
      id: 3,
      title: 'Вложенные модели',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pydantic поддерживает вложенные модели: адрес внутри пользователя, список предметов в заказе. FastAPI автоматически обрабатывает глубокую вложенность.' },
        { type: 'heading', value: 'Вложенные модели' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel\nfrom typing import List, Optional\n\nclass Address(BaseModel):\n    city: str\n    street: str\n    apartment: Optional[str] = None\n    postal_code: str\n\nclass OrderItem(BaseModel):\n    product_id: int\n    quantity: int\n    price: float\n\nclass OrderCreate(BaseModel):\n    user_id: int\n    items: List[OrderItem]  # список вложенных моделей\n    shipping_address: Address  # вложенная модель\n    notes: Optional[str] = None\n\n# JSON запрос:\n# {\n#   "user_id": 1,\n#   "items": [\n#     {"product_id": 5, "quantity": 2, "price": 15000.0},\n#     {"product_id": 8, "quantity": 1, "price": 80000.0}\n#   ],\n#   "shipping_address": {\n#     "city": "Алматы",\n#     "street": "ул. Абая 50",\n#     "postal_code": "050000"\n#   }\n# }\n\n@app.post("/orders")\nasync def create_order(order: OrderCreate):\n    total = sum(item.quantity * item.price for item in order.items)\n    return {"order": order.model_dump(), "total": total}' }
      ]
    },
    {
      id: 4,
      title: 'model_dump(), model_validate() и сериализация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pydantic v2 предоставляет методы для работы с моделями: model_dump() для сериализации в dict, model_validate() для создания из dict/JSON.' },
        { type: 'heading', value: 'Работа с Pydantic моделями' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel\nfrom datetime import datetime\nfrom typing import Optional\n\nclass User(BaseModel):\n    id: Optional[int] = None\n    name: str\n    email: str\n    created_at: datetime = datetime.now()\n    is_active: bool = True\n\n# Создание из kwargs\nuser = User(name="Алибек", email="a@mail.ru")\n\n# Сериализация в dict\nuser_dict = user.model_dump()\n# {"id": None, "name": "Алибек", "email": "a@mail.ru", ...}\n\n# Сериализация с исключением полей\nuser_dict = user.model_dump(exclude={"id", "is_active"})\nuser_dict = user.model_dump(exclude_none=True)  # исключить None значения\n\n# Создание из dict\ndata = {"name": "Дана", "email": "dana@mail.ru"}\nuser = User.model_validate(data)\n\n# Создание из JSON строки\nuser = User.model_validate_json(\'{"name": "Дана", "email": "dana@mail.ru"}\')' }
      ]
    },
    {
      id: 5,
      title: 'Модели запроса и ответа (разделение)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Хорошая практика — разные модели для запроса (Create, Update) и ответа (Response). Так можно скрыть пароль из ответа, добавить id и timestamps.' },
        { type: 'heading', value: 'Паттерн разделения схем' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel, EmailStr\nfrom datetime import datetime\nfrom typing import Optional\n\n# Запрос создания (нет id, нет timestamps)\nclass UserCreate(BaseModel):\n    name: str\n    email: EmailStr\n    password: str  # принимаем пароль\n\n# Запрос обновления (все поля необязательные)\nclass UserUpdate(BaseModel):\n    name: Optional[str] = None\n    email: Optional[EmailStr] = None\n\n# Ответ (нет пароля, есть id и timestamps)\nclass UserResponse(BaseModel):\n    id: int\n    name: str\n    email: str\n    created_at: datetime\n    is_active: bool\n\n    class Config:\n        from_attributes = True  # для конвертации из ORM объекта\n\n@app.post("/users", response_model=UserResponse, status_code=201)\nasync def create_user(user: UserCreate):\n    # Хешируем пароль, сохраняем в БД...\n    db_user = save_to_db(user)  # возвращает ORM объект\n    return db_user  # FastAPI использует UserResponse для сериализации' }
      ]
    },
    {
      id: 6,
      title: 'Validator и @field_validator',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кастомные валидаторы через @field_validator позволяют добавить бизнес-логику валидации: проверка уникальности, нормализация данных, сложные правила.' },
        { type: 'heading', value: 'field_validator в Pydantic v2' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel, field_validator, model_validator\nfrom typing import Optional\n\nclass UserCreate(BaseModel):\n    name: str\n    email: str\n    password: str\n    password_confirm: str\n    age: int\n\n    @field_validator("name")\n    @classmethod\n    def name_must_not_be_empty(cls, v: str) -> str:\n        v = v.strip()\n        if not v:\n            raise ValueError("Имя не может быть пустым")\n        return v.title()  # нормализация: "алибек" → "Алибек"\n\n    @field_validator("email")\n    @classmethod\n    def email_must_be_lowercase(cls, v: str) -> str:\n        return v.lower()\n\n    @model_validator(mode="after")  # проверяет всю модель\n    def passwords_match(self) -> "UserCreate":\n        if self.password != self.password_confirm:\n            raise ValueError("Пароли не совпадают")\n        return self' },
        { type: 'tip', value: '@field_validator для одного поля, @model_validator(mode="after") для проверки нескольких полей вместе.' }
      ]
    },
    {
      id: 7,
      title: 'model_config и примеры',
      type: 'theory',
      content: [
        { type: 'text', value: 'model_config в Pydantic v2 заменяет внутренний класс Config. Позволяет настраивать поведение модели и добавлять примеры для документации.' },
        { type: 'heading', value: 'Настройка модели' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel, ConfigDict\n\nclass UserCreate(BaseModel):\n    model_config = ConfigDict(\n        str_strip_whitespace=True,  # trim пробелы у строк\n        str_min_length=1,           # мин. длина всех строк\n        json_schema_extra={\n            "example": {\n                "name": "Алибек Жаксыбеков",\n                "email": "alibek@mail.ru",\n                "age": 25\n            }\n        }\n    )\n\n    name: str\n    email: str\n    age: int\n\n# from_attributes для работы с ORM\nclass UserResponse(BaseModel):\n    model_config = ConfigDict(from_attributes=True)\n\n    id: int\n    name: str\n    email: str' }
      ]
    },
    {
      id: 8,
      title: 'Практика: API регистрации пользователей',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полный API регистрации с валидацией: принимайте данные пользователя, валидируйте, возвращайте без пароля.',
      requirements: [
        'UserCreate: name (2-100), email (EmailStr), password (min 8, 1 заглавная), age (18-100)',
        'UserUpdate: все поля Optional',
        'UserResponse: id, name, email, created_at (нет password!)',
        '@field_validator для name: нормализовать в title case',
        '@model_validator: если передан password — проверить password_confirm',
        'POST /users — создать, вернуть UserResponse',
        'GET /users/{user_id} — вернуть UserResponse',
        'PUT /users/{user_id} — обновить, вернуть UserResponse'
      ],
      hint: 'response_model=UserResponse в декораторе автоматически фильтрует поля. from_attributes=True в Config позволяет создавать ответ из dict.',
      solution: 'from pydantic import BaseModel, EmailStr, field_validator, model_validator, ConfigDict\nfrom datetime import datetime\nfrom typing import Optional\n\nclass UserCreate(BaseModel):\n    name: str = Field(min_length=2, max_length=100)\n    email: EmailStr\n    password: str = Field(min_length=8)\n    password_confirm: str\n    age: int = Field(ge=18, le=100)\n\n    @field_validator("name")\n    @classmethod\n    def normalize_name(cls, v): return v.strip().title()\n\n    @model_validator(mode="after")\n    def check_passwords(self):\n        if self.password != self.password_confirm:\n            raise ValueError("Пароли не совпадают")\n        return self\n\nclass UserResponse(BaseModel):\n    model_config = ConfigDict(from_attributes=True)\n    id: int\n    name: str\n    email: str\n    created_at: datetime\n\nusers_db = {}\ncounter = 0\n\n@app.post("/users", response_model=UserResponse, status_code=201)\nasync def create_user(user: UserCreate):\n    global counter; counter += 1\n    new_user = {"id": counter, "name": user.name, "email": user.email,\n                "created_at": datetime.now()}\n    users_db[counter] = new_user\n    return new_user',
      explanation: 'response_model=UserResponse автоматически исключает поля отсутствующие в UserResponse — пароль никогда не попадёт в ответ. @model_validator(after) имеет доступ ко всем полям после их валидации.'
    }
  ]
}
