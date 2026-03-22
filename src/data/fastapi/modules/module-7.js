export default {
  id: 7,
  title: 'CRUD операции',
  description: 'Полный цикл CRUD операций в FastAPI: создание, чтение, обновление, удаление с правильными HTTP методами, статус кодами и паттернами проектирования',
  lessons: [
    {
      id: 1,
      title: 'CRUD паттерн в FastAPI',
      type: 'theory',
      content: [
        { type: 'text', value: 'CRUD (Create, Read, Update, Delete) — базовые операции для работы с данными. В REST API они маппятся на HTTP методы: POST → Create, GET → Read, PUT/PATCH → Update, DELETE → Delete.' },
        { type: 'heading', value: 'Маппинг CRUD на HTTP' },
        { type: 'code', language: 'python', value: '# Стандартный CRUD для ресурса /products\n\n# CREATE: POST /products → 201 Created\n# READ all: GET /products → 200 OK\n# READ one: GET /products/{id} → 200 OK или 404\n# FULL UPDATE: PUT /products/{id} → 200 OK или 404\n# PARTIAL UPDATE: PATCH /products/{id} → 200 OK или 404\n# DELETE: DELETE /products/{id} → 204 No Content или 404\n\n# PUT заменяет ВСЕ поля (нужно передать все данные)\n# PATCH обновляет ТОЛЬКО переданные поля' }
      ]
    },
    {
      id: 2,
      title: 'Слой репозитория',
      type: 'theory',
      content: [
        { type: 'text', value: 'Repository паттерн отделяет логику доступа к данным от бизнес-логики. Контроллер (роутер) не знает где хранятся данные — он вызывает методы репозитория.' },
        { type: 'heading', value: 'Repository для in-memory хранилища' },
        { type: 'code', language: 'python', value: 'from typing import Optional, List, Dict\nfrom pydantic import BaseModel\n\nclass ProductCreate(BaseModel):\n    name: str\n    price: float\n    description: Optional[str] = None\n\nclass ProductUpdate(BaseModel):\n    name: Optional[str] = None\n    price: Optional[float] = None\n    description: Optional[str] = None\n\nclass Product(BaseModel):\n    id: int\n    name: str\n    price: float\n    description: Optional[str] = None\n\nclass ProductRepository:\n    def __init__(self):\n        self._storage: Dict[int, Product] = {}\n        self._counter = 0\n\n    def create(self, data: ProductCreate) -> Product:\n        self._counter += 1\n        product = Product(id=self._counter, **data.model_dump())\n        self._storage[self._counter] = product\n        return product\n\n    def get_by_id(self, product_id: int) -> Optional[Product]:\n        return self._storage.get(product_id)\n\n    def get_all(self, skip: int = 0, limit: int = 10) -> List[Product]:\n        items = list(self._storage.values())\n        return items[skip:skip + limit]\n\n    def update(self, product_id: int, data: ProductUpdate) -> Optional[Product]:\n        product = self.get_by_id(product_id)\n        if not product:\n            return None\n        # Обновить только переданные поля (PATCH семантика)\n        update_data = data.model_dump(exclude_none=True)\n        updated = product.model_copy(update=update_data)\n        self._storage[product_id] = updated\n        return updated\n\n    def delete(self, product_id: int) -> bool:\n        if product_id not in self._storage:\n            return False\n        del self._storage[product_id]\n        return True\n\n    def count(self) -> int:\n        return len(self._storage)\n\n# Глобальный экземпляр (позже заменим на Depends)\nproduct_repo = ProductRepository()' }
      ]
    },
    {
      id: 3,
      title: 'Полный CRUD роутер',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реализуем полный CRUD роутер используя Repository. Каждый метод возвращает правильный статус код и обрабатывает 404.' },
        { type: 'heading', value: 'ProductRouter' },
        { type: 'code', language: 'python', value: 'from fastapi import APIRouter, HTTPException, status\nfrom fastapi.responses import Response\nfrom typing import List\n\nrouter = APIRouter(prefix="/products", tags=["Продукты"])\n\n@router.post("/", response_model=Product, status_code=status.HTTP_201_CREATED)\nasync def create_product(data: ProductCreate):\n    return product_repo.create(data)\n\n@router.get("/", response_model=List[Product])\nasync def list_products(skip: int = 0, limit: int = 10):\n    return product_repo.get_all(skip, limit)\n\n@router.get("/{product_id}", response_model=Product)\nasync def get_product(product_id: int):\n    product = product_repo.get_by_id(product_id)\n    if not product:\n        raise HTTPException(\n            status_code=status.HTTP_404_NOT_FOUND,\n            detail=f"Продукт с ID {product_id} не найден"\n        )\n    return product\n\n@router.put("/{product_id}", response_model=Product)\nasync def update_product(product_id: int, data: ProductCreate):\n    # PUT: полная замена — нужны все поля\n    product = product_repo.get_by_id(product_id)\n    if not product:\n        raise HTTPException(status_code=404, detail="Продукт не найден")\n    update_data = ProductUpdate(**data.model_dump())\n    return product_repo.update(product_id, update_data)\n\n@router.patch("/{product_id}", response_model=Product)\nasync def partial_update(product_id: int, data: ProductUpdate):\n    # PATCH: частичное обновление\n    product = product_repo.update(product_id, data)\n    if not product:\n        raise HTTPException(status_code=404, detail="Продукт не найден")\n    return product\n\n@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)\nasync def delete_product(product_id: int):\n    if not product_repo.delete(product_id):\n        raise HTTPException(status_code=404, detail="Продукт не найден")\n    return Response(status_code=204)' }
      ]
    },
    {
      id: 4,
      title: 'PATCH vs PUT: частичное обновление',
      type: 'theory',
      content: [
        { type: 'text', value: 'PUT заменяет весь ресурс — нужно передать все поля. PATCH обновляет только переданные поля. В Pydantic для PATCH используй Optional поля с None по умолчанию.' },
        { type: 'heading', value: 'Правильный PATCH' },
        { type: 'code', language: 'python', value: 'from pydantic import BaseModel\nfrom typing import Optional\n\nclass ProductUpdate(BaseModel):\n    # ВСЕ поля Optional — можно передавать любое подмножество\n    name: Optional[str] = None\n    price: Optional[float] = None\n    description: Optional[str] = None\n    is_active: Optional[bool] = None\n\n@router.patch("/{product_id}")\nasync def patch_product(product_id: int, data: ProductUpdate):\n    product = product_repo.get_by_id(product_id)\n    if not product:\n        raise HTTPException(404, "Не найден")\n\n    # model_dump(exclude_none=True) — только переданные поля\n    update_dict = data.model_dump(exclude_none=True)\n\n    if not update_dict:  # пустое тело запроса\n        raise HTTPException(400, "Нет данных для обновления")\n\n    updated = product.model_copy(update=update_dict)\n    product_repo.save(updated)\n    return updated\n\n# PATCH /products/1 {"price": 99000} — обновляет только price\n# PUT /products/1 {"name": "...", "price": ..., "description": "..."} — все поля' }
      ]
    },
    {
      id: 5,
      title: 'Поиск и фильтрация в CRUD',
      type: 'theory',
      content: [
        { type: 'text', value: 'Полноценный CRUD обычно включает поиск и фильтрацию. Добавим эти возможности к нашему репозиторию.' },
        { type: 'heading', value: 'Поиск и фильтрация' },
        { type: 'code', language: 'python', value: 'from typing import Optional\n\nclass ProductFilter(BaseModel):\n    q: Optional[str] = None\n    min_price: Optional[float] = None\n    max_price: Optional[float] = None\n    is_active: Optional[bool] = None\n\nclass ProductRepository:\n    def search(self, filters: ProductFilter, skip: int, limit: int) -> List[Product]:\n        items = list(self._storage.values())\n\n        if filters.q:\n            items = [p for p in items\n                     if filters.q.lower() in p.name.lower()]\n        if filters.min_price is not None:\n            items = [p for p in items if p.price >= filters.min_price]\n        if filters.max_price is not None:\n            items = [p for p in items if p.price <= filters.max_price]\n        if filters.is_active is not None:\n            items = [p for p in items if p.is_active == filters.is_active]\n\n        return items[skip:skip + limit]\n\n@router.get("/search")\nasync def search_products(\n    q: Optional[str] = None,\n    min_price: Optional[float] = Query(default=None, ge=0),\n    max_price: Optional[float] = Query(default=None, ge=0),\n    skip: int = 0,\n    limit: int = 10\n):\n    filters = ProductFilter(q=q, min_price=min_price, max_price=max_price)\n    return product_repo.search(filters, skip, limit)' }
      ]
    },
    {
      id: 6,
      title: 'Проверка уникальности и бизнес-правила',
      type: 'theory',
      content: [
        { type: 'text', value: 'В реальных приложениях нужно проверять уникальность email/username при создании и другие бизнес-правила. Эти проверки делаются на уровне сервиса.' },
        { type: 'heading', value: 'Проверки перед сохранением' },
        { type: 'code', language: 'python', value: 'class UserService:\n    def __init__(self, repo: UserRepository):\n        self.repo = repo\n\n    async def create_user(self, data: UserCreate) -> User:\n        # Бизнес-правило: email должен быть уникальным\n        existing = await self.repo.get_by_email(data.email)\n        if existing:\n            raise HTTPException(\n                status_code=409,  # Conflict\n                detail=f"Пользователь с email {data.email} уже существует"\n            )\n\n        # Хешировать пароль\n        hashed = hash_password(data.password)\n\n        return await self.repo.create(UserDB(\n            name=data.name,\n            email=data.email,\n            password_hash=hashed\n        ))\n\n    async def update_email(self, user_id: int, new_email: str) -> User:\n        # Проверить что новый email не занят другим пользователем\n        existing = await self.repo.get_by_email(new_email)\n        if existing and existing.id != user_id:\n            raise HTTPException(409, "Email уже используется другим пользователем")\n\n        return await self.repo.update_email(user_id, new_email)' }
      ]
    },
    {
      id: 7,
      title: 'Мягкое удаление (Soft Delete)',
      type: 'theory',
      content: [
        { type: 'text', value: 'Soft Delete — помечать записи как удалённые вместо физического удаления. Это позволяет восстанавливать данные и сохранять историю.' },
        { type: 'heading', value: 'Реализация soft delete' },
        { type: 'code', language: 'python', value: 'from datetime import datetime\nfrom typing import Optional\n\nclass Product(BaseModel):\n    id: int\n    name: str\n    price: float\n    deleted_at: Optional[datetime] = None  # None = не удалён\n\n    @property\n    def is_deleted(self) -> bool:\n        return self.deleted_at is not None\n\nclass ProductRepository:\n    def soft_delete(self, product_id: int) -> bool:\n        product = self.get_by_id(product_id)\n        if not product or product.is_deleted:\n            return False\n        updated = product.model_copy(update={"deleted_at": datetime.now()})\n        self._storage[product_id] = updated\n        return True\n\n    def get_all(self, include_deleted: bool = False) -> List[Product]:\n        items = list(self._storage.values())\n        if not include_deleted:\n            items = [p for p in items if not p.is_deleted]\n        return items\n\n    def restore(self, product_id: int) -> Optional[Product]:\n        product = self.get_by_id(product_id)\n        if product and product.is_deleted:\n            restored = product.model_copy(update={"deleted_at": None})\n            self._storage[product_id] = restored\n            return restored\n        return None' }
      ]
    },
    {
      id: 8,
      title: 'Практика: полный CRUD для Task Manager',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте полный CRUD для системы управления задачами с приоритетами, статусами и назначением исполнителей.',
      requirements: [
        'Task: id, title, description, status (TODO/IN_PROGRESS/DONE), priority (LOW/MEDIUM/HIGH), assignee_id, created_at, updated_at',
        'TaskCreate: title, description, priority (по умолчанию MEDIUM), assignee_id',
        'TaskUpdate: все поля Optional',
        'POST /tasks — создать задачу',
        'GET /tasks — список с фильтрами: status, priority, assignee_id',
        'GET /tasks/{id} — получить задачу',
        'PATCH /tasks/{id} — обновить только переданные поля',
        'DELETE /tasks/{id} — soft delete',
        'PATCH /tasks/{id}/complete — установить статус DONE'
      ],
      hint: 'Используй Enum для status и priority. model_copy(update=...) для PATCH. Отдельный endpoint /complete — хорошая практика для бизнес-действий.',
      solution: 'from enum import Enum\nfrom pydantic import BaseModel\nfrom datetime import datetime\nfrom typing import Optional, List\n\nclass TaskStatus(str, Enum):\n    TODO = "TODO"\n    IN_PROGRESS = "IN_PROGRESS"\n    DONE = "DONE"\n\nclass Priority(str, Enum):\n    LOW = "LOW"\n    MEDIUM = "MEDIUM"\n    HIGH = "HIGH"\n\nclass Task(BaseModel):\n    id: int\n    title: str\n    description: Optional[str] = None\n    status: TaskStatus = TaskStatus.TODO\n    priority: Priority = Priority.MEDIUM\n    assignee_id: Optional[int] = None\n    created_at: datetime\n    updated_at: datetime\n    deleted_at: Optional[datetime] = None\n\nclass TaskCreate(BaseModel):\n    title: str\n    description: Optional[str] = None\n    priority: Priority = Priority.MEDIUM\n    assignee_id: Optional[int] = None\n\nclass TaskUpdate(BaseModel):\n    title: Optional[str] = None\n    description: Optional[str] = None\n    status: Optional[TaskStatus] = None\n    priority: Optional[Priority] = None\n    assignee_id: Optional[int] = None\n\n@router.patch("/{task_id}/complete")\nasync def complete_task(task_id: int):\n    task = repo.get_by_id(task_id)\n    if not task: raise HTTPException(404, "Задача не найдена")\n    return repo.update(task_id, TaskUpdate(status=TaskStatus.DONE))',
      explanation: 'str, Enum — Enum сохраняется и сериализуется как строка. Отдельный /complete endpoint читабельнее чем PATCH со status. updated_at обновляется в каждом update методе репозитория.'
    }
  ]
}
