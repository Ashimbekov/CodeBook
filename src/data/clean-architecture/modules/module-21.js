export default {
  id: 21,
  title: 'Архитектура REST API',
  description: 'Проектирование REST API: ресурсы, HATEOAS, версионирование, пагинация, фильтрация и лучшие практики.',
  lessons: [
    {
      id: 1,
      title: 'Принципы проектирования REST API',
      type: 'theory',
      content: [
        { type: 'text', value: 'REST (Representational State Transfer) — архитектурный стиль для веб-API. Ресурсо-ориентированный подход: URL идентифицирует ресурс, HTTP-методы определяют операцию.' },
        { type: 'heading', value: 'Правила именования ресурсов' },
        { type: 'list', value: [
          'Существительные во множественном числе: /api/orders, /api/users, /api/products',
          'Иерархия через вложенность: /api/users/{id}/orders',
          'Без глаголов в URL: НЕ /api/getUsers, а GET /api/users',
          'Kebab-case для составных имён: /api/order-items',
          'Версия в URL: /api/v1/orders'
        ]},
        { type: 'heading', value: 'HTTP-методы и семантика' },
        { type: 'code', language: 'java', value: '// CRUD через HTTP-методы\nGET    /api/v1/orders          // Получить список заказов\nGET    /api/v1/orders/{id}     // Получить один заказ\nPOST   /api/v1/orders          // Создать заказ\nPUT    /api/v1/orders/{id}     // Полностью обновить заказ\nPATCH  /api/v1/orders/{id}     // Частично обновить заказ\nDELETE /api/v1/orders/{id}     // Удалить заказ\n\n// Действия (не-CRUD) через под-ресурсы\nPOST   /api/v1/orders/{id}/cancel   // Отменить заказ\nPOST   /api/v1/orders/{id}/confirm  // Подтвердить заказ\nPOST   /api/v1/orders/{id}/ship     // Отправить заказ' },
        { type: 'tip', value: 'REST API — это интерфейс Presentation-слоя. Структура API не обязана повторять структуру доменной модели. API проектируется для удобства клиента, а не для отображения БД.' }
      ]
    },
    {
      id: 2,
      title: 'Статус-коды и формат ответов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Правильные HTTP-статусы помогают клиенту понять результат без парсинга тела ответа.' },
        { type: 'heading', value: 'Основные статус-коды' },
        { type: 'list', value: [
          '200 OK — успешное получение/обновление ресурса',
          '201 Created — успешное создание ресурса (+ заголовок Location)',
          '204 No Content — успешное удаление (без тела ответа)',
          '400 Bad Request — некорректные входные данные',
          '401 Unauthorized — не аутентифицирован',
          '403 Forbidden — нет прав на операцию',
          '404 Not Found — ресурс не найден',
          '409 Conflict — конфликт (дубликат, конкурентное изменение)',
          '422 Unprocessable Entity — валидные данные, но бизнес-правило нарушено',
          '500 Internal Server Error — непредвиденная ошибка сервера'
        ]},
        { type: 'code', language: 'typescript', value: '// Единообразный формат ответа\ninterface ApiSuccessResponse<T> {\n  success: true;\n  data: T;\n  meta?: { page: number; totalPages: number; totalItems: number };\n}\n\ninterface ApiErrorResponse {\n  success: false;\n  error: {\n    code: string;\n    message: string;\n    details?: Record<string, string[]>;\n  };\n}\n\n// Примеры\n// GET /api/v1/orders/123\n// 200: { success: true, data: { id: "123", status: "confirmed", total: 5000 } }\n\n// POST /api/v1/orders  (невалидные данные)\n// 400: { success: false, error: { code: "VALIDATION_ERROR", message: "...", details: { "items": ["Список товаров пуст"] } } }\n\n// POST /api/v1/orders/123/cancel  (уже отправлен)\n// 422: { success: false, error: { code: "ORDER_NOT_CANCELLABLE", message: "Нельзя отменить отправленный заказ" } }' },
        { type: 'note', value: '400 vs 422: 400 — данные технически некорректны (не JSON, отсутствует поле). 422 — данные корректны, но бизнес-правило не позволяет операцию. На практике многие используют только 400.' }
      ]
    },
    {
      id: 3,
      title: 'Пагинация, фильтрация, сортировка',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для списков ресурсов нужна пагинация (постраничность), фильтрация и сортировка. Это параметры запроса в Query String.' },
        { type: 'code', language: 'java', value: '// Пагинация\nGET /api/v1/products?page=2&size=20\n\n// Фильтрация\nGET /api/v1/products?category=electronics&minPrice=1000&maxPrice=5000\n\n// Сортировка\nGET /api/v1/products?sort=price:asc,name:desc\n\n// Поиск\nGET /api/v1/products?search=iphone\n\n// Комбинация\nGET /api/v1/products?category=electronics&sort=price:asc&page=1&size=10' },
        { type: 'heading', value: 'Формат пагинированного ответа' },
        { type: 'code', language: 'typescript', value: '// Ответ с пагинацией\n{\n  "success": true,\n  "data": [\n    { "id": "p-1", "name": "iPhone 15", "price": 99990 },\n    { "id": "p-2", "name": "Samsung S24", "price": 89990 }\n  ],\n  "meta": {\n    "page": 1,\n    "pageSize": 20,\n    "totalItems": 156,\n    "totalPages": 8\n  },\n  "links": {\n    "self": "/api/v1/products?page=1&size=20",\n    "next": "/api/v1/products?page=2&size=20",\n    "last": "/api/v1/products?page=8&size=20"\n  }\n}' },
        { type: 'heading', value: 'Cursor-based пагинация' },
        { type: 'text', value: 'Для больших наборов данных offset-пагинация неэффективна (OFFSET 100000 медленно). Cursor-based: клиент получает курсор (ID последнего элемента) и запрашивает следующую страницу после курсора.' },
        { type: 'code', language: 'java', value: '// Cursor-based\nGET /api/v1/events?after=evt_abc123&limit=20\n\n// Ответ\n{\n  "data": [...],\n  "cursors": {\n    "after": "evt_xyz789",\n    "hasMore": true\n  }\n}' },
        { type: 'tip', value: 'Offset для маленьких наборов (< 10000 записей). Cursor для больших (ленты, логи, события). Cursor не позволяет "прыгнуть" на страницу 50, но работает O(1) вместо O(N).' }
      ]
    },
    {
      id: 4,
      title: 'HATEOAS и уровни зрелости REST',
      type: 'theory',
      content: [
        { type: 'text', value: 'Richardson Maturity Model определяет 4 уровня зрелости REST API. Большинство API останавливаются на уровне 2.' },
        { type: 'heading', value: 'Уровни зрелости' },
        { type: 'list', value: [
          'Level 0: один URL, один метод (POST /api). По сути RPC.',
          'Level 1: разные URL для разных ресурсов (/api/orders, /api/users). Но всё через POST.',
          'Level 2: правильные HTTP-методы (GET, POST, PUT, DELETE) + статус-коды. Это стандарт индустрии.',
          'Level 3: HATEOAS — ответ содержит ссылки на доступные действия. Полный REST.'
        ]},
        { type: 'heading', value: 'HATEOAS' },
        { type: 'code', language: 'typescript', value: '// HATEOAS: ответ содержит ссылки на действия\n// GET /api/v1/orders/123\n{\n  "data": {\n    "id": "123",\n    "status": "confirmed",\n    "total": 5000\n  },\n  "links": {\n    "self": { "href": "/api/v1/orders/123", "method": "GET" },\n    "cancel": { "href": "/api/v1/orders/123/cancel", "method": "POST" },\n    "pay": { "href": "/api/v1/orders/123/pay", "method": "POST" }\n  }\n}\n\n// После оплаты — ссылка "pay" пропадает, появляется "ship"\n// GET /api/v1/orders/123  (status: "paid")\n{\n  "data": { "id": "123", "status": "paid" },\n  "links": {\n    "self": { "href": "/api/v1/orders/123", "method": "GET" },\n    "ship": { "href": "/api/v1/orders/123/ship", "method": "POST" },\n    "refund": { "href": "/api/v1/orders/123/refund", "method": "POST" }\n  }\n}' },
        { type: 'note', value: 'HATEOAS красиво в теории, но на практике большинство API используют Level 2 + OpenAPI/Swagger документацию. HATEOAS сложно реализовать и клиенты редко его используют.' }
      ]
    },
    {
      id: 5,
      title: 'API Gateway и аутентификация',
      type: 'theory',
      content: [
        { type: 'text', value: 'API Gateway — единая точка входа для всех клиентов. Он обрабатывает cross-cutting concerns: аутентификацию, rate limiting, логирование, CORS.' },
        { type: 'heading', value: 'Обязанности API Gateway' },
        { type: 'list', value: [
          'Аутентификация — проверка JWT-токена',
          'Rate Limiting — ограничение количества запросов',
          'Routing — маршрутизация к нужному сервису',
          'SSL Termination — HTTPS завершается на Gateway',
          'Request/Response Transformation — адаптация форматов',
          'Logging и Monitoring — логирование всех запросов'
        ]},
        { type: 'code', language: 'typescript', value: '// JWT Middleware для аутентификации\nfunction authMiddleware(req: Request, res: Response, next: NextFunction): void {\n  const token = req.headers.authorization?.replace("Bearer ", "");\n  if (!token) {\n    res.status(401).json({ error: "Token required" });\n    return;\n  }\n\n  try {\n    const payload = jwt.verify(token, process.env.JWT_SECRET!);\n    req.user = payload as UserPayload; // добавляем пользователя в запрос\n    next();\n  } catch (err) {\n    res.status(401).json({ error: "Invalid token" });\n  }\n}\n\n// Rate Limiting Middleware\nfunction rateLimiter(maxRequests: number, windowMs: number) {\n  const requests = new Map<string, { count: number; resetAt: number }>();\n\n  return (req: Request, res: Response, next: NextFunction) => {\n    const key = req.ip;\n    const now = Date.now();\n    const record = requests.get(key);\n\n    if (!record || now > record.resetAt) {\n      requests.set(key, { count: 1, resetAt: now + windowMs });\n      return next();\n    }\n\n    if (record.count >= maxRequests) {\n      res.status(429).json({ error: "Too many requests" });\n      return;\n    }\n\n    record.count++;\n    next();\n  };\n}' },
        { type: 'tip', value: 'Аутентификация и rate limiting — Presentation-слой. Domain не знает о JWT-токенах. Контроллер извлекает userId из токена и передаёт в Use Case как обычный параметр.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: проектирование REST API',
      type: 'practice',
      difficulty: 'medium',
      description: 'Спроектируйте REST API для системы бронирования ресторанов: ресурсы, эндпоинты, статусы, пагинация.',
      requirements: [
        'Определить ресурсы: restaurants, reservations, reviews',
        'Спроектировать CRUD-эндпоинты для каждого ресурса',
        'Добавить фильтрацию и пагинацию для списков',
        'Определить статус-коды для каждой операции',
        'Реализовать endpoint для действия: confirm/cancel reservation'
      ],
      hint: 'Ресурсы: /api/v1/restaurants, /api/v1/restaurants/:id/reservations. Действия: POST /api/v1/reservations/:id/confirm. Фильтры: ?date=2025-06-15&partySize=4.',
      expectedOutput: 'Полное REST API: ресурсы, HTTP-методы, статус-коды, пагинация, фильтрация. API следует RESTful принципам и подходит для Clean Architecture.',
      solution: '// REST API для бронирования ресторанов\n\n// === RESTAURANTS ===\nGET    /api/v1/restaurants                    // Список ресторанов\n       ?cuisine=italian&city=moscow&sort=rating:desc&page=1&size=20\n       → 200 { data: [...], meta: { page, totalPages, totalItems } }\n\nGET    /api/v1/restaurants/:id                // Детали ресторана\n       → 200 { data: { id, name, cuisine, address, rating, ... } }\n       → 404 { error: { code: "RESTAURANT_NOT_FOUND" } }\n\n// === RESERVATIONS ===\nGET    /api/v1/restaurants/:id/reservations   // Бронирования ресторана\n       ?date=2025-06-15&status=confirmed\n       → 200 { data: [...] }\n\nPOST   /api/v1/reservations                  // Создать бронирование\n       Body: { restaurantId, date, time, partySize, guestName, phone }\n       → 201 { data: { id, status: "pending", ... } }\n       → 400 { error: { code: "VALIDATION_ERROR", details: {...} } }\n       → 422 { error: { code: "NO_AVAILABLE_TABLES" } }\n\nGET    /api/v1/reservations/:id              // Детали бронирования\n       → 200 { data: { id, restaurant, date, time, partySize, status } }\n\nPOST   /api/v1/reservations/:id/confirm      // Подтвердить\n       → 200 { data: { id, status: "confirmed" } }\n       → 422 { error: { code: "CANNOT_CONFIRM" } }\n\nPOST   /api/v1/reservations/:id/cancel       // Отменить\n       Body: { reason: "Изменились планы" }\n       → 200 { data: { id, status: "cancelled" } }\n\nDELETE /api/v1/reservations/:id              // Удалить\n       → 204 (no content)\n\n// === REVIEWS ===\nGET    /api/v1/restaurants/:id/reviews        // Отзывы ресторана\n       ?sort=date:desc&page=1\n       → 200 { data: [...], meta: {...} }\n\nPOST   /api/v1/restaurants/:id/reviews        // Оставить отзыв\n       Body: { rating: 5, comment: "Отлично!" }\n       → 201 { data: { id, rating, comment, author } }\n       → 422 { error: { code: "ALREADY_REVIEWED" } }\n\n// Контроллер (Presentation-слой)\nclass ReservationController {\n  constructor(\n    private createReservation: CreateReservationUseCase,\n    private confirmReservation: ConfirmReservationUseCase\n  ) {}\n\n  async create(req, res) {\n    const result = await this.createReservation.execute(req.body);\n    res.status(201).json({ success: true, data: result });\n  }\n\n  async confirm(req, res) {\n    const result = await this.confirmReservation.execute(req.params.id);\n    res.status(200).json({ success: true, data: result });\n  }\n}',
      explanation: 'API ресурсо-ориентированный: /restaurants, /reservations, /reviews. HTTP-методы соответствуют операциям. Действия (confirm, cancel) — POST к подресурсам. Фильтрация и пагинация через query params. Статус-коды различают технические (400) и бизнес-ошибки (422). Контроллер тонкий — вызывает Use Case.'
    }
  ]
}
