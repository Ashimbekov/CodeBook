export default {
  id: 1,
  title: 'Todo App: React + FastAPI + PostgreSQL',
  description: 'Полноценное веб-приложение для управления задачами. Вы создадите REST API на FastAPI, подключите PostgreSQL через SQLAlchemy, реализуете CRUD-операции и построите интерактивный интерфейс на React с фильтрацией задач. Итог — задеплоенное приложение в Docker.',
  lessons: [
    {
      id: 101,
      title: 'Шаг 1: Инициализация проекта',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте структуру папок для full-stack проекта. Инициализируйте Vite-приложение для фронтенда и настройте виртуальное окружение Python для FastAPI-бэкенда.',
      requirements: [
        'Создать корневую папку todo-app/',
        'Внутри создать папки frontend/ и backend/',
        'Инициализировать Vite + React в frontend/',
        'Создать виртуальное окружение Python в backend/',
        'Установить FastAPI, uvicorn, sqlalchemy, psycopg2-binary, alembic',
        'Создать backend/main.py с базовым FastAPI-приложением',
        'Убедиться, что оба сервера запускаются без ошибок'
      ],
      expectedOutput: 'Фронтенд доступен на http://localhost:5173, бэкенд на http://localhost:8000. Swagger UI открывается на http://localhost:8000/docs.',
      hint: 'Используйте команду: npm create vite@latest frontend -- --template react. Для Python: python -m venv venv && source venv/bin/activate && pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic python-dotenv',
      solution: '# Структура проекта\n# todo-app/\n# ├── frontend/          (Vite + React)\n# ├── backend/\n# │   ├── venv/\n# │   ├── main.py\n# │   ├── requirements.txt\n# │   └── .env\n# └── docker-compose.yml\n\n# Команды инициализации:\n# mkdir todo-app && cd todo-app\n# npm create vite@latest frontend -- --template react\n# mkdir backend && cd backend\n# python -m venv venv\n# source venv/bin/activate\n# pip install fastapi uvicorn sqlalchemy psycopg2-binary alembic python-dotenv\n# pip freeze > requirements.txt\n\n# backend/main.py\nfrom fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\n\napp = FastAPI(title="Todo API", version="1.0.0")\n\napp.add_middleware(\n    CORSMiddleware,\n    allow_origins=["http://localhost:5173"],\n    allow_credentials=True,\n    allow_methods=["*"],\n    allow_headers=["*"],\n)\n\n@app.get("/")\ndef read_root():\n    return {"message": "Todo API работает!"}\n\n# Запуск: uvicorn main:app --reload --port 8000\n\n# backend/.env\n# DATABASE_URL=postgresql://user:password@localhost:5432/tododb',
      explanation: 'Мы разделили проект на два независимых сервиса: frontend (React/Vite) и backend (FastAPI). CORS middleware необходим, чтобы браузер разрешал запросы с порта 5173 на 8000. requirements.txt фиксирует версии зависимостей для воспроизводимой среды.'
    },
    {
      id: 102,
      title: 'Шаг 2: Модели БД (SQLAlchemy + Alembic)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте модель Task с помощью SQLAlchemy ORM. Настройте подключение к PostgreSQL через переменные окружения. Создайте первую миграцию через Alembic.',
      requirements: [
        'Создать файл backend/database.py с настройкой подключения',
        'Создать файл backend/models.py с моделью Task',
        'Модель Task должна содержать: id, title, description, completed, created_at',
        'Инициализировать Alembic: alembic init alembic',
        'Настроить alembic.ini и alembic/env.py для работы с моделями',
        'Создать и применить первую миграцию',
        'Убедиться, что таблица tasks создана в PostgreSQL'
      ],
      expectedOutput: 'В базе данных tododb создана таблица tasks с колонками: id (serial PK), title (varchar), description (text), completed (boolean, default false), created_at (timestamp).',
      hint: 'В alembic/env.py нужно импортировать Base из models.py и установить target_metadata = Base.metadata. Команды: alembic revision --autogenerate -m "create tasks table" && alembic upgrade head',
      solution: '# backend/database.py\nfrom sqlalchemy import create_engine\nfrom sqlalchemy.ext.declarative import declarative_base\nfrom sqlalchemy.orm import sessionmaker\nimport os\nfrom dotenv import load_dotenv\n\nload_dotenv()\n\nDATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/tododb")\n\nengine = create_engine(DATABASE_URL)\nSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)\nBase = declarative_base()\n\ndef get_db():\n    db = SessionLocal()\n    try:\n        yield db\n    finally:\n        db.close()\n\n\n# backend/models.py\nfrom sqlalchemy import Column, Integer, String, Boolean, DateTime, Text\nfrom sqlalchemy.sql import func\nfrom database import Base\n\nclass Task(Base):\n    __tablename__ = "tasks"\n\n    id = Column(Integer, primary_key=True, index=True)\n    title = Column(String(200), nullable=False)\n    description = Column(Text, nullable=True)\n    completed = Column(Boolean, default=False)\n    created_at = Column(DateTime(timezone=True), server_default=func.now())\n\n\n# alembic/env.py (ключевые строки)\nfrom models import Base\ntarget_metadata = Base.metadata\n\n# Команды:\n# alembic init alembic\n# alembic revision --autogenerate -m "create tasks table"\n# alembic upgrade head',
      explanation: 'SQLAlchemy ORM позволяет работать с БД через Python-классы вместо сырого SQL. get_db() — это dependency injection для FastAPI, который гарантирует закрытие сессии после каждого запроса. Alembic управляет версиями схемы БД, что критично при командной разработке и деплое.'
    },
    {
      id: 103,
      title: 'Шаг 3: CRUD API (FastAPI endpoints)',
      type: 'practice',
      difficulty: 'medium',
      description: 'Реализуйте все CRUD-эндпоинты для задач: получение списка, создание, обновление и удаление. Используйте Dependency Injection FastAPI для работы с сессией БД.',
      requirements: [
        'GET /api/tasks — список всех задач',
        'GET /api/tasks/{id} — одна задача по ID',
        'POST /api/tasks — создать задачу',
        'PUT /api/tasks/{id} — обновить задачу (title, description, completed)',
        'DELETE /api/tasks/{id} — удалить задачу',
        'Возвращать 404 если задача не найдена',
        'Все эндпоинты должны быть доступны в Swagger UI'
      ],
      expectedOutput: 'Через Swagger UI (http://localhost:8000/docs) можно создать задачу POST /api/tasks, получить её GET /api/tasks, обновить PUT /api/tasks/1 и удалить DELETE /api/tasks/1.',
      hint: 'Используйте APIRouter для группировки эндпоинтов. HTTPException(status_code=404) возвращает ошибку если db.query(Task).filter(Task.id == task_id).first() вернул None.',
      solution: '# backend/routers/tasks.py\nfrom fastapi import APIRouter, Depends, HTTPException\nfrom sqlalchemy.orm import Session\nfrom typing import List\nfrom database import get_db\nfrom models import Task\nfrom schemas import TaskCreate, TaskUpdate, TaskResponse\n\nrouter = APIRouter(prefix="/api/tasks", tags=["tasks"])\n\n@router.get("/", response_model=List[TaskResponse])\ndef get_tasks(db: Session = Depends(get_db)):\n    return db.query(Task).order_by(Task.created_at.desc()).all()\n\n@router.get("/{task_id}", response_model=TaskResponse)\ndef get_task(task_id: int, db: Session = Depends(get_db)):\n    task = db.query(Task).filter(Task.id == task_id).first()\n    if not task:\n        raise HTTPException(status_code=404, detail="Задача не найдена")\n    return task\n\n@router.post("/", response_model=TaskResponse, status_code=201)\ndef create_task(task: TaskCreate, db: Session = Depends(get_db)):\n    db_task = Task(**task.dict())\n    db.add(db_task)\n    db.commit()\n    db.refresh(db_task)\n    return db_task\n\n@router.put("/{task_id}", response_model=TaskResponse)\ndef update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):\n    db_task = db.query(Task).filter(Task.id == task_id).first()\n    if not db_task:\n        raise HTTPException(status_code=404, detail="Задача не найдена")\n    for field, value in task.dict(exclude_unset=True).items():\n        setattr(db_task, field, value)\n    db.commit()\n    db.refresh(db_task)\n    return db_task\n\n@router.delete("/{task_id}", status_code=204)\ndef delete_task(task_id: int, db: Session = Depends(get_db)):\n    db_task = db.query(Task).filter(Task.id == task_id).first()\n    if not db_task:\n        raise HTTPException(status_code=404, detail="Задача не найдена")\n    db.delete(db_task)\n    db.commit()\n\n\n# backend/main.py (обновлённый)\nfrom fastapi import FastAPI\nfrom fastapi.middleware.cors import CORSMiddleware\nfrom routers import tasks\n\napp = FastAPI(title="Todo API", version="1.0.0")\napp.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"],\n    allow_credentials=True, allow_methods=["*"], allow_headers=["*"])\napp.include_router(tasks.router)',
      explanation: 'APIRouter позволяет разбить приложение на модули — каждый ресурс (tasks, users) живёт в своём файле. exclude_unset=True в PUT-запросе позволяет обновлять только переданные поля, а не перезаписывать всю запись. status_code=204 для DELETE означает "успешно, нет тела ответа".'
    },
    {
      id: 104,
      title: 'Шаг 4: Pydantic schemas',
      type: 'practice',
      difficulty: 'easy',
      description: 'Создайте Pydantic-схемы для валидации входящих данных и форматирования ответов API. Разделите схемы на Create, Update и Response.',
      requirements: [
        'TaskCreate: title (обязательный, min 1 символ), description (опциональный)',
        'TaskUpdate: title (опциональный), description (опциональный), completed (опциональный)',
        'TaskResponse: все поля + id и created_at',
        'Настроить orm_mode = True в TaskResponse',
        'Добавить валидацию: title не может быть пустой строкой',
        'Создать файл backend/schemas.py'
      ],
      expectedOutput: 'POST /api/tasks с пустым title возвращает 422 Unprocessable Entity с описанием ошибки. Успешный запрос возвращает объект с id, title, description, completed, created_at.',
      hint: 'В Pydantic v2 orm_mode заменён на model_config = ConfigDict(from_attributes=True). Для опциональных полей используйте Optional[str] = None из typing.',
      solution: '# backend/schemas.py\nfrom pydantic import BaseModel, validator, Field\nfrom typing import Optional\nfrom datetime import datetime\n\nclass TaskCreate(BaseModel):\n    title: str = Field(..., min_length=1, max_length=200, description="Название задачи")\n    description: Optional[str] = Field(None, description="Описание задачи")\n\n    @validator("title")\n    def title_not_empty(cls, v):\n        if not v.strip():\n            raise ValueError("Название задачи не может быть пустым")\n        return v.strip()\n\nclass TaskUpdate(BaseModel):\n    title: Optional[str] = Field(None, min_length=1, max_length=200)\n    description: Optional[str] = None\n    completed: Optional[bool] = None\n\n    @validator("title")\n    def title_not_empty(cls, v):\n        if v is not None and not v.strip():\n            raise ValueError("Название задачи не может быть пустым")\n        return v.strip() if v else v\n\nclass TaskResponse(BaseModel):\n    id: int\n    title: str\n    description: Optional[str]\n    completed: bool\n    created_at: datetime\n\n    class Config:\n        from_attributes = True  # orm_mode в Pydantic v2',
      explanation: 'Pydantic-схемы — это контракт между клиентом и сервером. Разделение на Create/Update/Response — best practice: Create требует обязательные поля, Update делает все поля опциональными (PATCH-семантика), Response добавляет вычисляемые поля БД. from_attributes=True позволяет создавать схему из ORM-объекта напрямую.'
    },
    {
      id: 105,
      title: 'Шаг 5: React компоненты',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте три основных React-компонента: TodoList (список задач), TodoItem (отдельная задача с чекбоксом и кнопкой удаления), AddTodo (форма добавления новой задачи).',
      requirements: [
        'AddTodo: форма с input для title и textarea для description, кнопка Submit',
        'TodoItem: отображает title, описание, чекбокс для completed, кнопку Delete',
        'TodoList: рендерит список TodoItem, показывает "Нет задач" если список пуст',
        'App.jsx: хранит tasks в useState, рендерит AddTodo и TodoList',
        'Передавать callback-функции через props (onAdd, onToggle, onDelete)',
        'Компоненты разместить в src/components/'
      ],
      expectedOutput: 'Страница отображает форму добавления задачи и список задач. Можно добавить задачу через форму, отметить как выполненную через чекбокс, удалить кнопкой Delete (пока без подключения к API — данные только в state).',
      hint: 'Начните с хардкода: const [tasks, setTasks] = useState([{id:1, title:"Тест", completed:false}]). Сначала сделайте UI рабочим, API подключите на следующем шаге.',
      solution: '// src/components/AddTodo.jsx\nimport { useState } from "react";\n\nexport default function AddTodo({ onAdd }) {\n  const [title, setTitle] = useState("");\n  const [description, setDescription] = useState("");\n\n  const handleSubmit = (e) => {\n    e.preventDefault();\n    if (!title.trim()) return;\n    onAdd({ title: title.trim(), description: description.trim() || null });\n    setTitle("");\n    setDescription("");\n  };\n\n  return (\n    <form onSubmit={handleSubmit} className="add-todo-form">\n      <input\n        type="text"\n        placeholder="Название задачи..."\n        value={title}\n        onChange={(e) => setTitle(e.target.value)}\n        required\n      />\n      <textarea\n        placeholder="Описание (необязательно)"\n        value={description}\n        onChange={(e) => setDescription(e.target.value)}\n        rows={2}\n      />\n      <button type="submit">Добавить задачу</button>\n    </form>\n  );\n}\n\n\n// src/components/TodoItem.jsx\nexport default function TodoItem({ task, onToggle, onDelete }) {\n  return (\n    <div className={`todo-item ${task.completed ? "completed" : ""}`}>\n      <input\n        type="checkbox"\n        checked={task.completed}\n        onChange={() => onToggle(task.id)}\n      />\n      <div className="todo-content">\n        <span className="todo-title">{task.title}</span>\n        {task.description && (\n          <p className="todo-description">{task.description}</p>\n        )}\n      </div>\n      <button onClick={() => onDelete(task.id)} className="delete-btn">\n        Удалить\n      </button>\n    </div>\n  );\n}\n\n\n// src/components/TodoList.jsx\nimport TodoItem from "./TodoItem";\n\nexport default function TodoList({ tasks, onToggle, onDelete }) {\n  if (tasks.length === 0) {\n    return <p className="empty-message">Нет задач. Добавьте первую!</p>;\n  }\n  return (\n    <div className="todo-list">\n      {tasks.map((task) => (\n        <TodoItem\n          key={task.id}\n          task={task}\n          onToggle={onToggle}\n          onDelete={onDelete}\n        />\n      ))}\n    </div>\n  );\n}\n\n\n// src/App.jsx\nimport { useState } from "react";\nimport AddTodo from "./components/AddTodo";\nimport TodoList from "./components/TodoList";\n\nexport default function App() {\n  const [tasks, setTasks] = useState([]);\n\n  const handleAdd = (taskData) => {\n    const newTask = { id: Date.now(), ...taskData, completed: false };\n    setTasks((prev) => [newTask, ...prev]);\n  };\n\n  const handleToggle = (id) => {\n    setTasks((prev) =>\n      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))\n    );\n  };\n\n  const handleDelete = (id) => {\n    setTasks((prev) => prev.filter((t) => t.id !== id));\n  };\n\n  return (\n    <div className="app">\n      <h1>Todo App</h1>\n      <AddTodo onAdd={handleAdd} />\n      <TodoList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />\n    </div>\n  );\n}',
      explanation: 'Компонентная архитектура React: App — "умный" компонент (хранит state, содержит бизнес-логику), TodoList и TodoItem — "тупые" компоненты (только рендерят props). Callback-функции через props — стандартный паттерн "подъёма состояния" (lifting state up). На этом шаге API не используется, чтобы сначала убедиться в корректности UI.'
    },
    {
      id: 106,
      title: 'Шаг 6: Подключение к API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Замените локальный state на реальные данные из FastAPI. Используйте fetch для всех CRUD-операций. Добавьте состояния загрузки и обработку ошибок.',
      requirements: [
        'Создать src/api/tasks.js с функциями: fetchTasks, createTask, updateTask, deleteTask',
        'В App.jsx загружать задачи при монтировании через useEffect',
        'Создание задачи: POST запрос, добавить ответ в state',
        'Переключение completed: PUT запрос с { completed: !task.completed }',
        'Удаление: DELETE запрос, убрать из state только после успешного ответа',
        'Добавить состояние loading (показывать спиннер) и error (показывать сообщение)',
        'Обрабатывать ошибки сети через try/catch'
      ],
      expectedOutput: 'Приложение загружает задачи из базы данных при открытии страницы. Добавленные задачи сохраняются после перезагрузки. В консоли нет ошибок CORS.',
      hint: 'Базовый URL вынесите в константу: const API_URL = "http://localhost:8000/api". Для PUT запроса передавайте только изменённые поля: { completed: !task.completed }.',
      solution: '// src/api/tasks.js\nconst API_URL = "http://localhost:8000/api";\n\nexport async function fetchTasks() {\n  const res = await fetch(`${API_URL}/tasks/`);\n  if (!res.ok) throw new Error("Не удалось загрузить задачи");\n  return res.json();\n}\n\nexport async function createTask(taskData) {\n  const res = await fetch(`${API_URL}/tasks/`, {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(taskData),\n  });\n  if (!res.ok) throw new Error("Не удалось создать задачу");\n  return res.json();\n}\n\nexport async function updateTask(id, updates) {\n  const res = await fetch(`${API_URL}/tasks/${id}`, {\n    method: "PUT",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(updates),\n  });\n  if (!res.ok) throw new Error("Не удалось обновить задачу");\n  return res.json();\n}\n\nexport async function deleteTask(id) {\n  const res = await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });\n  if (!res.ok) throw new Error("Не удалось удалить задачу");\n}\n\n\n// src/App.jsx (с подключением к API)\nimport { useState, useEffect } from "react";\nimport AddTodo from "./components/AddTodo";\nimport TodoList from "./components/TodoList";\nimport { fetchTasks, createTask, updateTask, deleteTask } from "./api/tasks";\n\nexport default function App() {\n  const [tasks, setTasks] = useState([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState(null);\n\n  useEffect(() => {\n    fetchTasks()\n      .then(setTasks)\n      .catch((e) => setError(e.message))\n      .finally(() => setLoading(false));\n  }, []);\n\n  const handleAdd = async (taskData) => {\n    try {\n      const newTask = await createTask(taskData);\n      setTasks((prev) => [newTask, ...prev]);\n    } catch (e) {\n      setError(e.message);\n    }\n  };\n\n  const handleToggle = async (id) => {\n    const task = tasks.find((t) => t.id === id);\n    try {\n      const updated = await updateTask(id, { completed: !task.completed });\n      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));\n    } catch (e) {\n      setError(e.message);\n    }\n  };\n\n  const handleDelete = async (id) => {\n    try {\n      await deleteTask(id);\n      setTasks((prev) => prev.filter((t) => t.id !== id));\n    } catch (e) {\n      setError(e.message);\n    }\n  };\n\n  if (loading) return <div className="loading">Загрузка...</div>;\n\n  return (\n    <div className="app">\n      <h1>Todo App</h1>\n      {error && <div className="error">{error}</div>}\n      <AddTodo onAdd={handleAdd} />\n      <TodoList tasks={tasks} onToggle={handleToggle} onDelete={handleDelete} />\n    </div>\n  );\n}',
      explanation: 'Паттерн оптимистичного обновления: сначала делаем запрос к API, и только при успехе обновляем state (а не наоборот). Это гарантирует консистентность данных. Выделение API-функций в отдельный файл (api/tasks.js) — separation of concerns: компоненты не знают о деталях HTTP.'
    },
    {
      id: 107,
      title: 'Шаг 7: Стили (CSS Modules)',
      type: 'practice',
      difficulty: 'easy',
      description: 'Добавьте стили к приложению с использованием CSS Modules. Реализуйте адаптивный дизайн для мобильных устройств.',
      requirements: [
        'Создать App.module.css, AddTodo.module.css, TodoItem.module.css, TodoList.module.css',
        'Стиль для выполненных задач: зачёркнутый текст, приглушённый цвет',
        'Форма AddTodo с красивым input и кнопкой',
        'Адаптивность: на мобильных (<480px) всё в колонку',
        'Анимация появления задач (fadeIn)',
        'Чистый минималистичный дизайн',
        'Переменные CSS для цветовой схемы'
      ],
      expectedOutput: 'Приложение выглядит как готовый продукт: чистый белый фон, тени у карточек, цветные кнопки, плавные переходы. На смартфоне интерфейс не ломается.',
      hint: 'CSS Modules: import styles from "./App.module.css", затем className={styles.app}. Для анимации: @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px) } to { opacity: 1; transform: translateY(0) } }',
      solution: '/* src/App.module.css */\n:root {\n  --primary: #4f46e5;\n  --danger: #ef4444;\n  --success: #22c55e;\n  --text: #1f2937;\n  --text-muted: #9ca3af;\n  --bg: #f9fafb;\n  --card-bg: #ffffff;\n  --border: #e5e7eb;\n  --radius: 8px;\n  --shadow: 0 1px 3px rgba(0,0,0,0.1);\n}\n\n.app {\n  max-width: 640px;\n  margin: 0 auto;\n  padding: 2rem 1rem;\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;\n  background: var(--bg);\n  min-height: 100vh;\n}\n\n.app h1 {\n  text-align: center;\n  color: var(--text);\n  margin-bottom: 2rem;\n  font-size: 2rem;\n}\n\n.error {\n  background: #fef2f2;\n  border: 1px solid #fecaca;\n  color: #dc2626;\n  padding: 0.75rem 1rem;\n  border-radius: var(--radius);\n  margin-bottom: 1rem;\n}\n\n.loading {\n  text-align: center;\n  padding: 4rem;\n  color: var(--text-muted);\n  font-size: 1.1rem;\n}\n\n\n/* src/components/AddTodo.module.css */\n.form {\n  background: var(--card-bg);\n  padding: 1.5rem;\n  border-radius: var(--radius);\n  box-shadow: var(--shadow);\n  margin-bottom: 1.5rem;\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n\n.input, .textarea {\n  width: 100%;\n  padding: 0.625rem 0.875rem;\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  font-size: 0.95rem;\n  outline: none;\n  transition: border-color 0.2s;\n  box-sizing: border-box;\n}\n\n.input:focus, .textarea:focus {\n  border-color: var(--primary);\n  box-shadow: 0 0 0 3px rgba(79,70,229,0.1);\n}\n\n.button {\n  background: var(--primary);\n  color: white;\n  border: none;\n  padding: 0.625rem 1.25rem;\n  border-radius: var(--radius);\n  font-size: 0.95rem;\n  cursor: pointer;\n  transition: background 0.2s;\n  align-self: flex-end;\n}\n\n.button:hover {\n  background: #4338ca;\n}\n\n\n/* src/components/TodoItem.module.css */\n@keyframes fadeIn {\n  from { opacity: 0; transform: translateY(-8px); }\n  to { opacity: 1; transform: translateY(0); }\n}\n\n.item {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.75rem;\n  background: var(--card-bg);\n  padding: 1rem;\n  border-radius: var(--radius);\n  box-shadow: var(--shadow);\n  margin-bottom: 0.5rem;\n  animation: fadeIn 0.2s ease;\n  transition: opacity 0.2s;\n}\n\n.item.completed {\n  opacity: 0.6;\n}\n\n.item.completed .title {\n  text-decoration: line-through;\n  color: var(--text-muted);\n}\n\n.checkbox {\n  width: 1.1rem;\n  height: 1.1rem;\n  margin-top: 0.2rem;\n  cursor: pointer;\n  accent-color: var(--success);\n}\n\n.content {\n  flex: 1;\n}\n\n.title {\n  font-size: 0.95rem;\n  color: var(--text);\n  font-weight: 500;\n}\n\n.description {\n  font-size: 0.82rem;\n  color: var(--text-muted);\n  margin: 0.25rem 0 0;\n}\n\n.deleteBtn {\n  background: none;\n  border: none;\n  color: var(--danger);\n  cursor: pointer;\n  font-size: 0.82rem;\n  padding: 0.25rem 0.5rem;\n  border-radius: 4px;\n  transition: background 0.2s;\n}\n\n.deleteBtn:hover {\n  background: #fef2f2;\n}\n\n@media (max-width: 480px) {\n  .item {\n    padding: 0.75rem;\n  }\n  .deleteBtn {\n    padding: 0.25rem;\n  }\n}',
      explanation: 'CSS Modules автоматически создают уникальные имена классов (App_app__xK2aB), исключая конфликты стилей между компонентами. CSS-переменные (:root) создают единую цветовую систему — меняем один раз, применяется везде. Анимация fadeIn улучшает UX, показывая пользователю что задача добавлена.'
    },
    {
      id: 108,
      title: 'Шаг 8: Фильтрация задач',
      type: 'practice',
      difficulty: 'medium',
      description: 'Добавьте фильтрацию задач по статусу: все, активные (не выполненные), выполненные. Также добавьте счётчик оставшихся задач и кнопку "Очистить выполненные".',
      requirements: [
        'Компонент FilterBar с тремя кнопками: Все, Активные, Выполненные',
        'Активная кнопка фильтра выделяется стилем',
        'Счётчик: "Осталось X задач" (только активные)',
        'Кнопка "Очистить выполненные" — удаляет все completed задачи через API',
        'Фильтрация происходит на фронтенде (не новый API-запрос)',
        'URL не меняется при смене фильтра (просто state)'
      ],
      expectedOutput: 'Три кнопки фильтра работают корректно. Счётчик обновляется при добавлении/удалении задач. "Очистить выполненные" отправляет несколько DELETE-запросов и убирает задачи из списка.',
      hint: 'Для "Очистить выполненные": Promise.all(completedTasks.map(t => deleteTask(t.id))). filteredTasks вычисляйте через useMemo или простым .filter() в render.',
      solution: '// src/components/FilterBar.jsx\nimport styles from "./FilterBar.module.css";\n\nconst FILTERS = [\n  { key: "all", label: "Все" },\n  { key: "active", label: "Активные" },\n  { key: "completed", label: "Выполненные" },\n];\n\nexport default function FilterBar({ filter, onFilter, activeCount, onClearCompleted, hasCompleted }) {\n  return (\n    <div className={styles.bar}>\n      <div className={styles.filters}>\n        {FILTERS.map((f) => (\n          <button\n            key={f.key}\n            className={`${styles.btn} ${filter === f.key ? styles.active : ""}`}\n            onClick={() => onFilter(f.key)}\n          >\n            {f.label}\n          </button>\n        ))}\n      </div>\n      <span className={styles.count}>Осталось: {activeCount}</span>\n      {hasCompleted && (\n        <button className={styles.clearBtn} onClick={onClearCompleted}>\n          Очистить выполненные\n        </button>\n      )}\n    </div>\n  );\n}\n\n\n// src/App.jsx (обновлённый фрагмент)\nimport { useState, useEffect, useMemo } from "react";\nimport FilterBar from "./components/FilterBar";\nimport { deleteTask } from "./api/tasks";\n\n// ... остальной код ...\n\nconst [filter, setFilter] = useState("all");\n\nconst filteredTasks = useMemo(() => {\n  switch (filter) {\n    case "active": return tasks.filter((t) => !t.completed);\n    case "completed": return tasks.filter((t) => t.completed);\n    default: return tasks;\n  }\n}, [tasks, filter]);\n\nconst activeCount = tasks.filter((t) => !t.completed).length;\nconst hasCompleted = tasks.some((t) => t.completed);\n\nconst handleClearCompleted = async () => {\n  const completedTasks = tasks.filter((t) => t.completed);\n  try {\n    await Promise.all(completedTasks.map((t) => deleteTask(t.id)));\n    setTasks((prev) => prev.filter((t) => !t.completed));\n  } catch (e) {\n    setError(e.message);\n  }\n};\n\n// В JSX:\n// <FilterBar\n//   filter={filter}\n//   onFilter={setFilter}\n//   activeCount={activeCount}\n//   onClearCompleted={handleClearCompleted}\n//   hasCompleted={hasCompleted}\n// />\n// <TodoList tasks={filteredTasks} ... />',
      explanation: 'Фильтрация на фронтенде (useMemo) даёт мгновенный отклик без лишних запросов к серверу — данные уже загружены. useMemo пересчитывает filteredTasks только при изменении tasks или filter. Promise.all() позволяет параллельно отправить несколько DELETE-запросов, что быстрее чем последовательные запросы.'
    },
    {
      id: 109,
      title: 'Шаг 9: Docker (Dockerfile + docker-compose)',
      type: 'practice',
      difficulty: 'hard',
      description: 'Контейнеризируйте всё приложение: создайте Dockerfile для фронтенда и бэкенда, настройте docker-compose с PostgreSQL. Используйте многоэтапную сборку для фронтенда.',
      requirements: [
        'frontend/Dockerfile: multi-stage (node:18 для сборки, nginx:alpine для раздачи)',
        'backend/Dockerfile: python:3.11-slim, копировать requirements.txt, uvicorn',
        'docker-compose.yml: три сервиса — frontend, backend, db (postgres:15)',
        'Переменные окружения через environment: в compose и .env файл',
        'backend зависит от db (depends_on)',
        'frontend проксирует /api запросы на backend через nginx.conf',
        'Volumes для PostgreSQL данных (постоянное хранение)'
      ],
      expectedOutput: 'Команда docker-compose up --build запускает всё приложение. Фронтенд доступен на http://localhost:80, бэкенд на http://localhost:8000. После перезапуска данные сохраняются.',
      hint: 'nginx.conf для проксирования: location /api { proxy_pass http://backend:8000; }. В docker-compose сеть по умолчанию позволяет сервисам обращаться друг к другу по имени сервиса.',
      solution: '# frontend/Dockerfile\nFROM node:18-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html\nCOPY nginx.conf /etc/nginx/conf.d/default.conf\nEXPOSE 80\nCMD ["nginx", "-g", "daemon off;"]\n\n\n# frontend/nginx.conf\nserver {\n    listen 80;\n    root /usr/share/nginx/html;\n    index index.html;\n\n    location / {\n        try_files $uri $uri/ /index.html;\n    }\n\n    location /api {\n        proxy_pass http://backend:8000;\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n    }\n}\n\n\n# backend/Dockerfile\nFROM python:3.11-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nCOPY . .\nEXPOSE 8000\nCMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]\n\n\n# docker-compose.yml\nversion: "3.9"\n\nservices:\n  db:\n    image: postgres:15-alpine\n    environment:\n      POSTGRES_USER: ${DB_USER:-todouser}\n      POSTGRES_PASSWORD: ${DB_PASSWORD:-todopassword}\n      POSTGRES_DB: ${DB_NAME:-tododb}\n    volumes:\n      - postgres_data:/var/lib/postgresql/data\n    healthcheck:\n      test: ["CMD-SHELL", "pg_isready -U todouser"]\n      interval: 5s\n      timeout: 5s\n      retries: 5\n\n  backend:\n    build: ./backend\n    environment:\n      DATABASE_URL: postgresql://${DB_USER:-todouser}:${DB_PASSWORD:-todopassword}@db:5432/${DB_NAME:-tododb}\n    depends_on:\n      db:\n        condition: service_healthy\n    ports:\n      - "8000:8000"\n\n  frontend:\n    build: ./frontend\n    ports:\n      - "80:80"\n    depends_on:\n      - backend\n\nvolumes:\n  postgres_data:',
      explanation: 'Multi-stage build для фронтенда уменьшает итоговый образ: тяжёлый node_modules не попадает в production-образ, только собранные статические файлы. nginx выступает и как веб-сервер для статики, и как reverse proxy для API — единая точка входа. healthcheck гарантирует, что backend стартует только после готовности PostgreSQL.'
    },
    {
      id: 110,
      title: 'Шаг 10: Финальная сборка и тестирование',
      type: 'practice',
      difficulty: 'medium',
      description: 'Проведите финальное тестирование всего приложения: напишите базовые тесты для API (pytest), добавьте endpoint для health check, проверьте все сценарии работы.',
      requirements: [
        'Создать backend/tests/test_tasks.py с тестами для всех эндпоинтов',
        'Тесты используют TestClient от FastAPI и отдельную тестовую БД (SQLite in-memory)',
        'Тест: создание задачи, получение списка, обновление, удаление',
        'Тест: 404 при обращении к несуществующей задаче',
        'Добавить GET /health эндпоинт (возвращает { status: "ok", db: "connected" })',
        'Проверить docker-compose up --build',
        'Написать README с инструкцией запуска'
      ],
      expectedOutput: 'pytest возвращает "5 passed". docker-compose up --build запускает всё приложение без ошибок. GET /health возвращает {"status": "ok"}.',
      hint: 'Для тестов используйте in-memory SQLite: SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db". Переопределяйте dependency get_db через app.dependency_overrides[get_db] = override_get_db.',
      solution: '# backend/tests/test_tasks.py\nimport pytest\nfrom fastapi.testclient import TestClient\nfrom sqlalchemy import create_engine\nfrom sqlalchemy.orm import sessionmaker\nfrom main import app\nfrom database import Base, get_db\n\nSQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"\nengine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})\nTestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)\n\ndef override_get_db():\n    db = TestingSessionLocal()\n    try:\n        yield db\n    finally:\n        db.close()\n\napp.dependency_overrides[get_db] = override_get_db\nBase.metadata.create_all(bind=engine)\nclient = TestClient(app)\n\ndef test_create_task():\n    res = client.post("/api/tasks/", json={"title": "Тестовая задача"})\n    assert res.status_code == 201\n    data = res.json()\n    assert data["title"] == "Тестовая задача"\n    assert data["completed"] == False\n\ndef test_get_tasks():\n    res = client.get("/api/tasks/")\n    assert res.status_code == 200\n    assert isinstance(res.json(), list)\n\ndef test_update_task():\n    create_res = client.post("/api/tasks/", json={"title": "Обновить меня"})\n    task_id = create_res.json()["id"]\n    res = client.put(f"/api/tasks/{task_id}", json={"completed": True})\n    assert res.status_code == 200\n    assert res.json()["completed"] == True\n\ndef test_delete_task():\n    create_res = client.post("/api/tasks/", json={"title": "Удалить меня"})\n    task_id = create_res.json()["id"]\n    res = client.delete(f"/api/tasks/{task_id}")\n    assert res.status_code == 204\n\ndef test_task_not_found():\n    res = client.get("/api/tasks/99999")\n    assert res.status_code == 404\n\n\n# backend/main.py (добавить health endpoint)\nfrom sqlalchemy import text\n\n@app.get("/health")\ndef health_check(db: Session = Depends(get_db)):\n    try:\n        db.execute(text("SELECT 1"))\n        db_status = "connected"\n    except Exception:\n        db_status = "error"\n    return {"status": "ok", "db": db_status}',
      explanation: 'TestClient из FastAPI позволяет тестировать HTTP-эндпоинты без реального HTTP-сервера — тесты быстрые и изолированные. dependency_overrides — мощный механизм FastAPI для подмены зависимостей в тестах: production-код использует PostgreSQL, тесты — SQLite. Health endpoint — стандарт для мониторинга: Kubernetes, Docker и load balancer-ы проверяют его чтобы знать что сервис жив.'
    }
  ]
};
