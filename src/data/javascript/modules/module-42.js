export default {
  id: 42,
  title: 'Socket.io',
  description: 'Реалтайм коммуникация с Socket.io: io.on/emit, комнаты (rooms), broadcast, namespace и двунаправленный обмен данными',
  lessons: [
    {
      id: 1,
      title: 'Настройка Socket.io',
      type: 'theory',
      content: [
        { type: 'text', value: 'Socket.io — библиотека для реалтайм двунаправленной связи. Использует WebSocket с fallback на long-polling. Сервер и клиент обмениваются событиями через emit/on.' },
        { type: 'heading', value: 'Сервер и клиент' },
        { type: 'code', language: 'javascript', value: '// npm install socket.io\n\n// СЕРВЕР (server.js)\nconst express = require("express");\nconst { createServer } = require("http");\nconst { Server } = require("socket.io");\n\nconst app = express();\nconst httpServer = createServer(app);\nconst io = new Server(httpServer, {\n  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }\n});\n\nio.on("connection", (socket) => {\n  console.log(`Подключился: ${socket.id}`);\n\n  socket.on("disconnect", (reason) => {\n    console.log(`Отключился: ${socket.id}, причина: ${reason}`);\n  });\n\n  socket.on("message", (data) => {\n    console.log("Получено:", data);\n    socket.emit("reply", `Получили: ${data}`);\n  });\n});\n\nhttpServer.listen(3000, () => console.log("Сервер на :3000"));\n\n// КЛИЕНТ (browser)\n// <script src="/socket.io/socket.io.js"></script>\n// npm install socket.io-client\nconst { io: clientIO } = require("socket.io-client");\n\nconst socket = clientIO("http://localhost:3000");\n\nsocket.on("connect", () => console.log("Подключились! ID:", socket.id));\nsocket.on("disconnect", () => console.log("Отключились"));\nsocket.on("reply", (data) => console.log("Ответ от сервера:", data));\n\nsocket.emit("message", "Привет, сервер!");\n\n// Отправка с callback (acknowledgement)\nsocket.emit("message", "с подтверждением", (response) => {\n  console.log("Сервер подтвердил:", response);\n});' },
        { type: 'tip', value: 'Каждое соединение Socket.io имеет уникальный socket.id. Он меняется при каждом переподключении. Для идентификации пользователей используйте JWT или session.' }
      ]
    },
    {
      id: 2,
      title: 'emit и on — события',
      type: 'theory',
      content: [
        { type: 'text', value: 'Основной способ общения — пользовательские события. emit() отправляет событие с данными, on() подписывается на событие. Данные могут быть любыми JSON-сериализуемыми объектами.' },
        { type: 'heading', value: 'Паттерны событий' },
        { type: 'code', language: 'javascript', value: '// СЕРВЕР\nio.on("connection", (socket) => {\n  // Принять событие и ответить\n  socket.on("chat:message", ({ text, userId }) => {\n    const message = {\n      id: Date.now(),\n      text,\n      userId,\n      timestamp: new Date().toISOString()\n    };\n    // Отправить обратно отправителю\n    socket.emit("chat:message:sent", message);\n    // Broadcast всем кроме отправителя\n    socket.broadcast.emit("chat:message:new", message);\n    // Всем включая отправителя\n    io.emit("chat:users:count", io.sockets.size);\n  });\n\n  // Acknowledgement — с подтверждением доставки\n  socket.on("order:create", async (orderData, callback) => {\n    try {\n      const order = await createOrder(orderData);\n      callback({ success: true, orderId: order.id }); // Ответ клиенту\n    } catch (err) {\n      callback({ success: false, error: err.message });\n    }\n  });\n});\n\n// КЛИЕНТ\nsocket.emit("chat:message", { text: "Привет!", userId: 123 });\n\nsocket.on("chat:message:new", (message) => {\n  displayMessage(message);\n});\n\n// С acknowledgement\nsocket.emit("order:create", { items: [1, 2, 3] }, (response) => {\n  if (response.success) {\n    console.log("Заказ создан:", response.orderId);\n  } else {\n    console.error("Ошибка:", response.error);\n  }\n});\n\n// Только один раз\nsocket.once("connect", () => console.log("Первое подключение"));\n\n// Отписаться\nconst handler = (data) => console.log(data);\nsocket.on("event", handler);\nsocket.off("event", handler); // Отписка' }
      ]
    },
    {
      id: 3,
      title: 'Rooms — комнаты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Rooms — именованные каналы для группировки сокетов. Сокет может присоединиться к нескольким комнатам. Удобно для чат-комнат, игровых сессий, персональных уведомлений.' },
        { type: 'heading', value: 'Управление комнатами' },
        { type: 'code', language: 'javascript', value: '// СЕРВЕР\nio.on("connection", (socket) => {\n  // Присоединиться к комнате\n  socket.on("room:join", (roomId) => {\n    socket.join(roomId);\n    console.log(`${socket.id} вошёл в комнату ${roomId}`);\n\n    // Уведомить всех в комнате\n    socket.to(roomId).emit("room:user:joined", { userId: socket.data.userId });\n    socket.emit("room:joined", { roomId, usersCount: getRoomCount(roomId) });\n  });\n\n  socket.on("room:leave", (roomId) => {\n    socket.leave(roomId);\n    socket.to(roomId).emit("room:user:left", { userId: socket.data.userId });\n  });\n\n  socket.on("room:message", ({ roomId, text }) => {\n    const message = { text, userId: socket.data.userId, timestamp: Date.now() };\n    // Отправить всем в комнате включая отправителя\n    io.to(roomId).emit("room:message:new", message);\n  });\n\n  // Личное сообщение (по socket.id)\n  socket.on("private:message", ({ targetSocketId, text }) => {\n    io.to(targetSocketId).emit("private:message:new", {\n      from: socket.id, text\n    });\n  });\n});\n\n// Получить список пользователей в комнате\nasync function getRoomCount(roomId) {\n  const sockets = await io.in(roomId).fetchSockets();\n  return sockets.length;\n}\n\n// Отправить из вне обработчика connection\nfunction notifyRoom(roomId, event, data) {\n  io.to(roomId).emit(event, data);\n}\n\n// Каждый сокет автоматически в своей комнате socket.id\nio.to(socket.id).emit("personal", "Только тебе");' }
      ]
    },
    {
      id: 4,
      title: 'Broadcast и namespace',
      type: 'theory',
      content: [
        { type: 'text', value: 'Broadcast отправляет событие всем сокетам кроме отправителя. Namespace разделяет Socket.io на независимые каналы с отдельными событиями и комнатами.' },
        { type: 'heading', value: 'Broadcast и Namespace' },
        { type: 'code', language: 'javascript', value: 'const { Server } = require("socket.io");\nconst io = new Server(httpServer);\n\n// === BROADCAST ===\nio.on("connection", (socket) => {\n  // Всем кроме отправителя\n  socket.broadcast.emit("user:connected", socket.id);\n\n  // Всем в комнате кроме отправителя\n  socket.to("room1").emit("event", data);\n\n  // Всем без исключения\n  io.emit("announcement", "Сервер будет перезапущен");\n\n  // Volatile — не гарантирует доставку (для real-time данных)\n  socket.volatile.emit("cursor:position", { x: 100, y: 200 });\n});\n\n// === NAMESPACE ===\n// Дефолтный namespace: "/"\n// Кастомные namespace для разных частей приложения\n\nconst chatNS = io.of("/chat");\nchatNS.on("connection", (socket) => {\n  console.log("Подключился в /chat:", socket.id);\n  socket.on("message", (msg) => chatNS.emit("message", msg));\n});\n\nconst adminNS = io.of("/admin");\n// Middleware для проверки прав\nadminNS.use((socket, next) => {\n  const token = socket.handshake.auth.token;\n  if (!isAdmin(token)) return next(new Error("Нет доступа"));\n  next();\n});\nadminNS.on("connection", (socket) => {\n  socket.emit("stats", getServerStats());\n});\n\n// КЛИЕНТ подключается к namespace\nconst chatSocket = io("http://localhost:3000/chat");\nconst adminSocket = io("http://localhost:3000/admin", {\n  auth: { token: "admin-jwt" }\n});' }
      ]
    },
    {
      id: 5,
      title: 'Аутентификация в Socket.io',
      type: 'theory',
      content: [
        { type: 'text', value: 'Middleware в Socket.io работает как middleware в Express, но для WebSocket соединений. Используется для аутентификации и авторизации при подключении.' },
        { type: 'heading', value: 'JWT аутентификация' },
        { type: 'code', language: 'javascript', value: 'const jwt = require("jsonwebtoken");\nconst { Server } = require("socket.io");\nconst io = new Server(httpServer);\n\n// Middleware аутентификации\nio.use((socket, next) => {\n  const token = socket.handshake.auth.token ||\n                socket.handshake.headers.authorization?.split(" ")[1];\n\n  if (!token) return next(new Error("Нет токена"));\n\n  try {\n    const decoded = jwt.verify(token, process.env.JWT_SECRET);\n    socket.data.user = decoded; // Сохраняем данные пользователя\n    next();\n  } catch (err) {\n    next(new Error("Неверный токен"));\n  }\n});\n\nio.on("connection", (socket) => {\n  const { userId, name } = socket.data.user;\n  console.log(`${name} (${userId}) подключился`);\n\n  // Автоматически добавляем в персональную комнату\n  socket.join(`user:${userId}`);\n\n  // Теперь можно отправить личное уведомление любому пользователю\n  // io.to(`user:${userId}`).emit("notification", data);\n});\n\n// КЛИЕНТ передаёт токен при подключении\nconst token = localStorage.getItem("token");\nconst socket = io("http://localhost:3000", {\n  auth: { token },\n  // Переподключение при истечении токена\n  reconnectionAttempts: 3\n});\n\nsocket.on("connect_error", (err) => {\n  if (err.message === "Неверный токен") {\n    // Обновить токен и переподключиться\n    refreshToken().then(newToken => {\n      socket.auth.token = newToken;\n      socket.connect();\n    });\n  }\n});' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Чат приложение',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте реалтайм чат с комнатами, личными сообщениями, уведомлениями о наборе текста и списком онлайн пользователей.',
      requirements: [
        'Пользователи выбирают никнейм при подключении',
        'Глобальный чат — сообщения всем',
        'Комнаты: join/leave с уведомлениями',
        'Список онлайн пользователей обновляется при подключении/отключении',
        'Typing indicator: "Пользователь пишет..." показывается 2 секунды',
        'История последних 20 сообщений при входе в комнату',
        'Приватные сообщения по имени пользователя'
      ],
      solution: {
        code: 'const express = require("express");\nconst { createServer } = require("http");\nconst { Server } = require("socket.io");\n\nconst app = express();\nconst httpServer = createServer(app);\nconst io = new Server(httpServer, { cors: { origin: "*" } });\n\nconst users = new Map();        // socketId -> { name, rooms }\nconst roomMessages = new Map(); // roomId -> messages[]\n\nio.on("connection", (socket) => {\n  socket.on("user:join", (name) => {\n    users.set(socket.id, { name, rooms: new Set() });\n    io.emit("users:update", [...users.values()].map(u => u.name));\n    socket.emit("joined", { id: socket.id, name });\n  });\n\n  socket.on("room:join", (roomId) => {\n    socket.join(roomId);\n    const user = users.get(socket.id);\n    if (user) user.rooms.add(roomId);\n    const history = roomMessages.get(roomId) || [];\n    socket.emit("room:history", history.slice(-20));\n    socket.to(roomId).emit("room:user:joined", { name: user?.name });\n  });\n\n  socket.on("room:message", ({ roomId, text }) => {\n    const user = users.get(socket.id);\n    const msg = { id: Date.now(), text, author: user?.name, timestamp: Date.now() };\n    if (!roomMessages.has(roomId)) roomMessages.set(roomId, []);\n    roomMessages.get(roomId).push(msg);\n    io.to(roomId).emit("room:message:new", msg);\n  });\n\n  socket.on("typing:start", (roomId) => {\n    const user = users.get(socket.id);\n    socket.to(roomId).emit("user:typing", { name: user?.name, roomId });\n  });\n\n  socket.on("private:message", ({ targetName, text }) => {\n    const target = [...users.entries()].find(([, u]) => u.name === targetName);\n    if (target) {\n      const sender = users.get(socket.id);\n      io.to(target[0]).emit("private:message:new", { from: sender?.name, text });\n    }\n  });\n\n  socket.on("disconnect", () => {\n    const user = users.get(socket.id);\n    users.delete(socket.id);\n    io.emit("users:update", [...users.values()].map(u => u.name));\n    if (user) io.emit("user:left", user.name);\n  });\n});\n\nhttpServer.listen(3000, () => console.log("Чат на :3000"));',
        language: 'javascript'
      },
      explanation: 'Map хранит пользователей по socket.id — быстрый доступ O(1) при отключении. socket.join(roomId) добавляет сокет в комнату Socket.io. history.slice(-20) возвращает последние 20 сообщений без изменения оригинального массива. socket.to(roomId) отправляет всем в комнате кроме отправителя — используется для уведомлений о входе. io.to(roomId) включает отправителя — нужно для сообщений. Приватные сообщения находят socketId по имени через Map.entries() и отправляют напрямую через io.to(socketId).'
    }
  ]
};
