export default {
  id: 6,
  title: 'Валидация данных',
  description: 'Глубокое изучение валидации в FastAPI и Pydantic: кастомные валидаторы, вложенная валидация, обработка ошибок валидации, Form данные и заголовки',
  lessons: [
    {
      id: 1,
      title: 'Встроенная валидация Pydantic',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pydantic предоставляет богатый набор встроенных типов с валидацией: EmailStr, HttpUrl, IPvAnyAddress, PositiveInt и другие.' },
        { type: 'heading', value: 'Специальные типы Pydantic' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel, EmailStr, HttpUrl, Field\nfrom pydantic import PositiveInt, NonNegativeFloat, constr, conint\nfrom typing import Optional\nimport re\n\nclass UserCreate(BaseModel):\n    email: EmailStr           # валидный email\n    website: Optional[HttpUrl] = None  # валидный URL\n    age: PositiveInt          # целое > 0\n    balance: NonNegativeFloat = 0.0  # число >= 0\n    # Ограниченные типы через Annotated\n    name: str = Field(min_length=2, max_length=100)\n    phone: Optional[str] = Field(\n        default=None,\n        pattern=r"^\\+?[1-9]\\d{10,14}$"  # международный формат\n    )\n    username: str = Field(\n        min_length=3,\n        max_length=30,\n        pattern=r"^[a-zA-Z0-9_-]+$"\n    )' },
        { type: 'tip', value: 'EmailStr, HttpUrl, IPvAnyAddress — из pydantic. Требуют pip install email-validator. Используй для надёжной валидации формата.' }
      ]
    },
    {
      id: 2,
      title: '@field_validator: кастомная логика',
      type: 'theory',
      content: [
        { type: 'text', value: '@field_validator позволяет добавить произвольную логику проверки поля. Можно валидировать, нормализовать и трансформировать данные.' },
        { type: 'heading', value: 'Примеры кастомных валидаторов' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel, field_validator\nfrom datetime import date\n\nclass ProductCreate(BaseModel):\n    name: str\n    price: float\n    sku: str\n    expiry_date: Optional[date] = None\n\n    @field_validator("name")\n    @classmethod\n    def clean_name(cls, v: str) -> str:\n        v = v.strip()\n        if len(v) < 2:\n            raise ValueError("Название должно быть не менее 2 символов")\n        # Убрать лишние пробелы между словами\n        return " ".join(v.split())\n\n    @field_validator("price")\n    @classmethod\n    def price_must_be_positive(cls, v: float) -> float:\n        if v <= 0:\n            raise ValueError("Цена должна быть больше нуля")\n        return round(v, 2)  # нормализовать до 2 знаков\n\n    @field_validator("sku")\n    @classmethod\n    def sku_format(cls, v: str) -> str:\n        v = v.upper().strip()\n        if not v.replace("-", "").isalnum():\n            raise ValueError("SKU может содержать только буквы, цифры и дефис")\n        return v\n\n    @field_validator("expiry_date")\n    @classmethod\n    def expiry_in_future(cls, v: Optional[date]) -> Optional[date]:\n        if v and v < date.today():\n            raise ValueError("Дата истечения срока должна быть в будущем")\n        return v' }
      ]
    },
    {
      id: 3,
      title: '@model_validator: межполевая валидация',
      type: 'theory',
      content: [
        { type: 'text', value: '@model_validator получает доступ ко всей модели — подходит для проверок зависящих от нескольких полей.' },
        { type: 'heading', value: 'Примеры model_validator' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel, model_validator\nfrom datetime import date\n\nclass DateRange(BaseModel):\n    start_date: date\n    end_date: date\n    max_days: int = 30\n\n    @model_validator(mode="after")\n    def validate_date_range(self) -> "DateRange":\n        if self.start_date >= self.end_date:\n            raise ValueError("Дата начала должна быть раньше даты конца")\n        days = (self.end_date - self.start_date).days\n        if days > self.max_days:\n            raise ValueError(f"Диапазон не может превышать {self.max_days} дней")\n        return self\n\nclass DiscountCreate(BaseModel):\n    original_price: float\n    discount_percent: float\n    final_price: Optional[float] = None\n\n    @model_validator(mode="after")\n    def calculate_final_price(self) -> "DiscountCreate":\n        if self.final_price is None:\n            self.final_price = self.original_price * (1 - self.discount_percent / 100)\n        expected = self.original_price * (1 - self.discount_percent / 100)\n        if abs(self.final_price - expected) > 0.01:\n            raise ValueError("Итоговая цена не соответствует скидке")\n        return self' }
      ]
    },
    {
      id: 4,
      title: 'Обработка ошибок валидации',
      type: 'theory',
      content: [
        { type: 'text', value: 'При ошибке валидации FastAPI возвращает 422 Unprocessable Entity с детальным описанием ошибок. Можно кастомизировать формат ошибки.' },
        { type: 'heading', value: 'Кастомный обработчик ошибок валидации' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, Request\nfrom fastapi.exceptions import RequestValidationError\nfrom fastapi.responses import JSONResponse\n\napp = FastAPI()\n\n@app.exception_handler(RequestValidationError)\nasync def validation_exception_handler(request: Request, exc: RequestValidationError):\n    errors = []\n    for error in exc.errors():\n        field = " -> ".join(str(loc) for loc in error["loc"])\n        errors.append({\n            "field": field,\n            "message": error["msg"],\n            "type": error["type"]\n        })\n    return JSONResponse(\n        status_code=422,\n        content={\n            "success": False,\n            "message": "Ошибка валидации",\n            "errors": errors\n        }\n    )\n\n# Стандартный ответ FastAPI:\n# {"detail": [{"loc": ["body", "email"], "msg": "value is not a valid email address", "type": "value_error"}]}\n\n# Кастомный ответ:\n# {"success": false, "message": "Ошибка валидации",\n#  "errors": [{"field": "body -> email", "message": "...", "type": "value_error"}]}' }
      ]
    },
    {
      id: 5,
      title: 'Form данные и заголовки',
      type: 'theory',
      content: [
        { type: 'text', value: 'Кроме JSON body, FastAPI поддерживает Form данные (application/x-www-form-urlencoded) и заголовки через Header().' },
        { type: 'heading', value: 'Form и Header' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, Form, Header\nfrom typing import Optional\n\napp = FastAPI()\n\n# Form данные (как в HTML форме)\n@app.post("/login")\nasync def login(\n    username: str = Form(...),  # ... = обязательно\n    password: str = Form(...)\n):\n    return {"username": username}\n\n# Заголовки\n@app.get("/items")\nasync def get_items(\n    user_agent: Optional[str] = Header(default=None),\n    x_api_key: str = Header(..., alias="X-API-Key")  # кастомный заголовок\n):\n    return {"user_agent": user_agent, "key": x_api_key}\n\n# Cookie\nfrom fastapi import Cookie\n@app.get("/profile")\nasync def get_profile(\n    session_token: Optional[str] = Cookie(default=None)\n):\n    return {"token": session_token}' },
        { type: 'warning', value: 'Для Form нужна зависимость: pip install python-multipart. Имена заголовков в Python автоматически конвертируются: user_agent → User-Agent.' }
      ]
    },
    {
      id: 6,
      title: 'Annotated — современный стиль валидации',
      type: 'theory',
      content: [
        { type: 'text', value: 'Annotated из typing позволяет описывать типы с метаданными. Это более явный и переиспользуемый способ указывать ограничения.' },
        { type: 'heading', value: 'Annotated в FastAPI' },
        { type: 'code', language: 'python', value: 'from typing import Annotated\nfrom fastapi import FastAPI, Query, Path\nfrom pydantic import BaseModel, Field\n\n# Переиспользуемые типы\nPositiveID = Annotated[int, Path(gt=0, title="ID")]\nSearchQuery = Annotated[str, Query(min_length=3, max_length=50)]\nPageNum = Annotated[int, Query(ge=1, default=1)]\n\napp = FastAPI()\n\n@app.get("/products/{product_id}")\nasync def get_product(\n    product_id: PositiveID,  # переиспользуем тип\n    q: SearchQuery = None,\n    page: PageNum = 1\n):\n    return {"id": product_id, "q": q, "page": page}\n\n# В Pydantic моделях\nUsername = Annotated[str, Field(min_length=3, max_length=30, pattern=r"^[a-zA-Z0-9_]+$")]\nEmail = Annotated[str, Field(pattern=r"^[^@]+@[^@]+\\.[^@]+$")]\n\nclass UserCreate(BaseModel):\n    username: Username\n    email: Email' }
      ]
    },
    {
      id: 7,
      title: 'Практика: продвинутая валидация формы регистрации',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте строгую валидацию формы регистрации с кастомными валидаторами и понятными сообщениями об ошибках.',
      requirements: [
        'RegisterForm: username (3-30, только a-z0-9_), email (EmailStr), password (8+, 1 заглавная, 1 цифра, 1 спецсимвол), password_confirm, birth_date',
        '@field_validator для username: нижний регистр, только допустимые символы',
        '@field_validator для birth_date: должно быть 18+ лет',
        '@model_validator: проверить совпадение паролей',
        'Кастомный exception_handler для RequestValidationError: русские сообщения об ошибках',
        'Маппинг ошибок: value_error → понятное сообщение на русском',
        'POST /register возвращает { success, message } или 422 с кастомными ошибками'
      ],
      hint: 'Для проверки возраста: from datetime import date; age = (date.today() - birth_date).days // 365. Для маппинга ошибок: if "value_error" in error["type"]: return error["msg"].',
      solution: 'from pydantic import BaseModel, EmailStr, field_validator, model_validator\nfrom datetime import date\nfrom fastapi.exceptions import RequestValidationError\nfrom fastapi.responses import JSONResponse\n\nclass RegisterForm(BaseModel):\n    username: str\n    email: EmailStr\n    password: str\n    password_confirm: str\n    birth_date: date\n\n    @field_validator("username")\n    @classmethod\n    def validate_username(cls, v):\n        v = v.lower().strip()\n        if not re.match(r"^[a-z0-9_]{3,30}$", v):\n            raise ValueError("Логин: только буквы a-z, цифры, _ (3-30 символов)")\n        return v\n\n    @field_validator("password")\n    @classmethod\n    def validate_password(cls, v):\n        errors = []\n        if len(v) < 8: errors.append("минимум 8 символов")\n        if not any(c.isupper() for c in v): errors.append("хотя бы одна заглавная буква")\n        if not any(c.isdigit() for c in v): errors.append("хотя бы одна цифра")\n        if not any(c in "!@#$%^&*" for c in v): errors.append("хотя бы один спецсимвол")\n        if errors: raise ValueError("Пароль должен содержать: " + ", ".join(errors))\n        return v\n\n    @field_validator("birth_date")\n    @classmethod\n    def check_age(cls, v):\n        age = (date.today() - v).days // 365\n        if age < 18: raise ValueError(f"Регистрация только для 18+. Ваш возраст: {age}")\n        return v\n\n    @model_validator(mode="after")\n    def passwords_match(self):\n        if self.password != self.password_confirm:\n            raise ValueError("Пароли не совпадают")\n        return self\n\n@app.exception_handler(RequestValidationError)\nasync def handle_validation(request, exc):\n    errors = [{"field": ".".join(str(l) for l in e["loc"]), "message": e["msg"]} for e in exc.errors()]\n    return JSONResponse(422, {"success": False, "errors": errors})',
      explanation: '@field_validator собирает несколько ошибок пароля в одно сообщение. @model_validator(after) проверяет совпадение паролей после их индивидуальной валидации. Кастомный exception_handler даёт полный контроль над форматом ошибок.'
    }
  ]
}
