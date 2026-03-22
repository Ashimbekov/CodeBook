export default {
  id: 14,
  title: 'Фоновые задачи',
  description: 'BackgroundTasks в FastAPI: запуск задач после ответа, отправка email, логирование, интеграция с Celery для тяжёлых задач',
  lessons: [
    {
      id: 1,
      title: 'BackgroundTasks: основы',
      type: 'theory',
      content: [
        { type: 'text', value: 'BackgroundTasks позволяет запускать функции после отправки ответа клиенту. Это полезно для задач, которые не должны задерживать ответ: отправка email, логирование, обновление кэша.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, BackgroundTasks\nimport time\n\napp = FastAPI()\n\ndef send_notification(email: str, message: str):\n    # Имитируем долгую операцию\n    time.sleep(2)\n    print(f"[EMAIL] Отправлено на {email}: {message}")\n\n@app.post("/send-notification/")\ndef create_notification(\n    email: str,\n    background_tasks: BackgroundTasks\n):\n    background_tasks.add_task(send_notification, email, "Ваш заказ принят!")\n    return {"message": "Уведомление будет отправлено"}' },
        { type: 'tip', value: 'BackgroundTasks инжектируется как зависимость через параметр функции. FastAPI сначала отправит ответ клиенту, а потом выполнит фоновые задачи — клиент не ждёт их завершения.' },
        { type: 'heading', value: 'Несколько задач одновременно' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, BackgroundTasks\n\napp = FastAPI()\n\ndef write_log(message: str):\n    with open("app.log", "a") as f:\n        f.write(f"{message}\\n")\n\ndef update_cache(key: str, value: str):\n    print(f"[CACHE] Обновление {key} = {value}")\n\n@app.post("/items/")\ndef create_item(name: str, background_tasks: BackgroundTasks):\n    background_tasks.add_task(write_log, f"Создан товар: {name}")\n    background_tasks.add_task(update_cache, f"item_{name}", name)\n    return {"name": name, "status": "created"}' }
      ]
    },
    {
      id: 2,
      title: 'Async фоновые задачи',
      type: 'theory',
      content: [
        { type: 'text', value: 'BackgroundTasks поддерживает как синхронные, так и асинхронные функции. Async-задачи выполняются в том же event loop, что и основное приложение.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, BackgroundTasks\nimport asyncio\n\napp = FastAPI()\n\nasync def send_email_async(email: str, subject: str, body: str):\n    await asyncio.sleep(1)  # имитация async отправки\n    print(f"[EMAIL ASYNC] {email}: {subject} - {body}")\n\nasync def update_stats(user_id: int, action: str):\n    await asyncio.sleep(0.5)\n    print(f"[STATS] Пользователь {user_id}: {action}")\n\n@app.post("/orders/")\nasync def create_order(\n    user_id: int,\n    product: str,\n    background_tasks: BackgroundTasks\n):\n    # Добавляем несколько async-задач\n    background_tasks.add_task(\n        send_email_async,\n        "user@example.com",\n        "Заказ оформлен",\n        f"Ваш заказ на {product} принят"\n    )\n    background_tasks.add_task(update_stats, user_id, f"order:{product}")\n    return {"status": "ok", "product": product}' },
        { type: 'note', value: 'Sync-функции в BackgroundTasks выполняются в пуле потоков (thread pool), чтобы не блокировать event loop. Async-функции выполняются прямо в event loop. Используй async для I/O операций, sync — для CPU-intensive задач.' }
      ]
    },
    {
      id: 3,
      title: 'BackgroundTasks в зависимостях',
      type: 'theory',
      content: [
        { type: 'text', value: 'BackgroundTasks можно использовать внутри зависимостей Depends. Это позволяет инкапсулировать логику фоновых задач в переиспользуемые компоненты.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, BackgroundTasks, Depends\nfrom datetime import datetime\n\napp = FastAPI()\n\nclass EmailService:\n    def __init__(self, background_tasks: BackgroundTasks):\n        self.background_tasks = background_tasks\n\n    def send_welcome(self, email: str):\n        self.background_tasks.add_task(self._send, email, "Добро пожаловать!")\n\n    def send_reset_password(self, email: str, token: str):\n        self.background_tasks.add_task(\n            self._send, email, f"Сброс пароля: {token}"\n        )\n\n    def _send(self, email: str, message: str):\n        print(f"[{datetime.now()}] Письмо на {email}: {message}")\n\ndef get_email_service(background_tasks: BackgroundTasks) -> EmailService:\n    return EmailService(background_tasks)\n\n@app.post("/register/")\ndef register(\n    email: str,\n    email_service: EmailService = Depends(get_email_service)\n):\n    email_service.send_welcome(email)\n    return {"email": email, "status": "registered"}' },
        { type: 'tip', value: 'Инжекция BackgroundTasks в зависимости — чистый способ организации кода. EmailService не знает о FastAPI, но может добавлять фоновые задачи. Это упрощает тестирование.' }
      ]
    },
    {
      id: 4,
      title: 'Практический пример: обработка заказов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Рассмотрим реалистичный пример: приём заказа с несколькими фоновыми задачами — уведомления, обновление базы, отправка в аналитику.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, BackgroundTasks\nfrom pydantic import BaseModel\nfrom typing import List\nimport uuid\nimport asyncio\n\napp = FastAPI()\n\nclass OrderItem(BaseModel):\n    product_id: int\n    quantity: int\n    price: float\n\nclass Order(BaseModel):\n    user_id: int\n    items: List[OrderItem]\n    email: str\n\n# Фоновые функции\nasync def notify_user(email: str, order_id: str, total: float):\n    await asyncio.sleep(0.5)\n    print(f"[EMAIL] {email}: Заказ {order_id} на {total:.2f} руб. принят")\n\ndef save_to_analytics(order_id: str, user_id: int, total: float):\n    print(f"[ANALYTICS] Заказ {order_id}: user={user_id}, total={total}")\n\ndef update_inventory(items: list):\n    for item in items:\n        print(f"[INVENTORY] Товар {item[\'product_id\']}: -{item[\'quantity\']} шт.")\n\n@app.post("/orders/", status_code=201)\ndef create_order(order: Order, background_tasks: BackgroundTasks):\n    order_id = str(uuid.uuid4())[:8]\n    total = sum(item.price * item.quantity for item in order.items)\n\n    background_tasks.add_task(notify_user, order.email, order_id, total)\n    background_tasks.add_task(save_to_analytics, order_id, order.user_id, total)\n    background_tasks.add_task(\n        update_inventory,\n        [item.dict() for item in order.items]\n    )\n\n    return {\n        "order_id": order_id,\n        "status": "processing",\n        "total": total\n    }' },
        { type: 'note', value: 'Задачи выполняются в порядке добавления. Если одна задача упадёт с ошибкой, остальные всё равно выполнятся. Для критически важных задач лучше использовать Celery с retry-логикой.' }
      ]
    },
    {
      id: 5,
      title: 'Ограничения и когда использовать Celery',
      type: 'theory',
      content: [
        { type: 'text', value: 'BackgroundTasks имеет ограничения: задачи выполняются в том же процессе, нет retry, нет мониторинга, нет очередей. Для серьёзных продакшн-задач нужен Celery.' },
        { type: 'code', language: 'python', value: '# Когда BackgroundTasks достаточно:\n# - Отправка email/уведомлений (не критично если упадёт)\n# - Логирование в файл\n# - Обновление кэша\n# - Небольшие аналитические задачи\n\n# Когда нужен Celery:\n# - Тяжёлые вычисления (обработка изображений)\n# - Задачи с retry при ошибках\n# - Отложенные задачи (выполнить через час)\n# - Задачи по расписанию (cron)\n# - Мониторинг выполнения задач\n\n# Базовая интеграция Celery с FastAPI\nfrom celery import Celery\n\ncelery_app = Celery(\n    "tasks",\n    broker="redis://localhost:6379",\n    backend="redis://localhost:6379"\n)\n\n@celery_app.task\ndef heavy_task(data: dict):\n    # Долгая обработка...\n    return {"result": "done"}\n\n# В FastAPI-эндпоинте:\n# task = heavy_task.delay({"key": "value"})\n# return {"task_id": task.id}' },
        { type: 'tip', value: 'Правило выбора: BackgroundTasks — для простых задач до 5-10 секунд где потеря допустима. Celery — для всего остального. Redis или RabbitMQ в роли брокера сообщений для Celery.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Система уведомлений',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создай FastAPI-приложение с системой уведомлений через BackgroundTasks.',
      requirements: [
        'Модель User: id, name, email',
        'Модель Notification: user_id, message, channel (email/sms)',
        'POST /users/ — регистрация пользователя, фоновая задача приветственного email',
        'POST /notifications/ — отправка уведомления через нужный канал в фоне',
        'GET /notifications/status/{task_id} — имитация проверки статуса',
        'Логирование всех фоновых задач с временем выполнения'
      ],
      expectedOutput: 'POST /users/ -> {"id": 1, "name": "Анна", "message": "Уведомление будет отправлено"}\n[BACKGROUND] Welcome email sent to anna@mail.ru in 0.52s',
      hint: 'Используй time.time() до и после задачи для замера времени. Для имитации отправки используй asyncio.sleep() в async-функциях.',
      solution: 'from fastapi import FastAPI, BackgroundTasks\nfrom pydantic import BaseModel\nfrom typing import Optional\nimport asyncio\nimport time\nimport uuid\n\napp = FastAPI()\n\nclass User(BaseModel):\n    name: str\n    email: str\n\nclass Notification(BaseModel):\n    user_id: int\n    message: str\n    channel: str = "email"  # email или sms\n\nusers_db = {}\nnext_id = 1\n\nasync def send_welcome_email(email: str, name: str):\n    start = time.time()\n    await asyncio.sleep(0.5)  # имитация отправки\n    elapsed = time.time() - start\n    print(f"[BACKGROUND] Welcome email sent to {email} in {elapsed:.2f}s")\n\nasync def send_notification(channel: str, user_id: int, message: str):\n    start = time.time()\n    await asyncio.sleep(0.3)\n    elapsed = time.time() - start\n    print(f"[BACKGROUND] [{channel.upper()}] User {user_id}: {message} ({elapsed:.2f}s)")\n\n@app.post("/users/", status_code=201)\nasync def create_user(user: User, background_tasks: BackgroundTasks):\n    global next_id\n    user_id = next_id\n    next_id += 1\n    users_db[user_id] = {"id": user_id, "name": user.name, "email": user.email}\n    background_tasks.add_task(send_welcome_email, user.email, user.name)\n    return {"id": user_id, "name": user.name, "message": "Уведомление будет отправлено"}\n\n@app.post("/notifications/")\nasync def create_notification(\n    notification: Notification,\n    background_tasks: BackgroundTasks\n):\n    task_id = str(uuid.uuid4())[:8]\n    background_tasks.add_task(\n        send_notification,\n        notification.channel,\n        notification.user_id,\n        notification.message\n    )\n    return {"task_id": task_id, "status": "queued"}\n\n@app.get("/notifications/status/{task_id}")\ndef get_task_status(task_id: str):\n    return {"task_id": task_id, "status": "completed"}',
      explanation: 'BackgroundTasks инжектируется автоматически FastAPI. add_task() принимает функцию и её аргументы. Async-задачи не блокируют event loop. Для имитации реальной работы используем asyncio.sleep(). В продакшне вместо print будет реальная отправка через SMTP или SMS-шлюз.'
    }
  ]
}
