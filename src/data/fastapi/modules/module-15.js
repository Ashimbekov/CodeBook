export default {
  id: 15,
  title: 'WebSocket',
  description: 'WebSocket в FastAPI: двунаправленное соединение, чат в реальном времени, управление подключениями и обработка событий',
  lessons: [
    {
      id: 1,
      title: 'Основы WebSocket в FastAPI',
      type: 'theory',
      content: [
        { type: 'text', value: 'WebSocket обеспечивает постоянное двунаправленное соединение между клиентом и сервером. В отличие от HTTP, нет цикла запрос-ответ — данные можно отправлять в любой момент с обеих сторон.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, WebSocket\nfrom fastapi.responses import HTMLResponse\n\napp = FastAPI()\n\nhtml = """\n<!DOCTYPE html>\n<html>\n<body>\n    <input id="msg" type="text">\n    <button onclick="send()">Отправить</button>\n    <div id="msgs"></div>\n    <script>\n        const ws = new WebSocket("ws://localhost:8000/ws");\n        ws.onmessage = (e) => {\n            document.getElementById("msgs").innerHTML += "<p>" + e.data + "</p>";\n        };\n        function send() {\n            ws.send(document.getElementById("msg").value);\n        }\n    </script>\n</body>\n</html>\n"""\n\n@app.get("/")\ndef root():\n    return HTMLResponse(html)\n\n@app.websocket("/ws")\nasync def websocket_endpoint(websocket: WebSocket):\n    await websocket.accept()\n    while True:\n        data = await websocket.receive_text()\n        await websocket.send_text(f"Сервер получил: {data}")' },
        { type: 'tip', value: 'websocket.accept() обязателен перед отправкой/получением данных. receive_text() ждёт сообщения от клиента. send_text() отправляет ответ. Цикл while True поддерживает соединение живым.' }
      ]
    },
    {
      id: 2,
      title: 'Работа с JSON и бинарными данными',
      type: 'theory',
      content: [
        { type: 'text', value: 'WebSocket поддерживает передачу текста, JSON и бинарных данных. FastAPI предоставляет методы receive_json(), send_json(), receive_bytes(), send_bytes().' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, WebSocket\nfrom pydantic import BaseModel\nfrom typing import Optional\nimport json\n\napp = FastAPI()\n\nclass ChatMessage(BaseModel):\n    user: str\n    text: str\n    room: Optional[str] = "general"\n\n@app.websocket("/ws/chat")\nasync def chat_websocket(websocket: WebSocket):\n    await websocket.accept()\n    try:\n        while True:\n            # Получаем JSON-сообщение\n            data = await websocket.receive_json()\n            message = ChatMessage(**data)\n\n            # Отправляем обратно обработанное сообщение\n            response = {\n                "type": "message",\n                "user": message.user,\n                "text": message.text,\n                "room": message.room,\n                "echo": True\n            }\n            await websocket.send_json(response)\n\n    except Exception as e:\n        print(f"WebSocket ошибка: {e}")\n    finally:\n        print("WebSocket соединение закрыто")' },
        { type: 'note', value: 'receive_json() автоматически разбирает JSON. Если клиент отключится, receive_text()/receive_json() выбросит исключение WebSocketDisconnect — его нужно обработать.' }
      ]
    },
    {
      id: 3,
      title: 'ConnectionManager: управление подключениями',
      type: 'theory',
      content: [
        { type: 'text', value: 'Для многопользовательских приложений нужен менеджер подключений, который хранит все активные соединения и умеет рассылать сообщения всем или конкретным пользователям.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, WebSocket, WebSocketDisconnect\nfrom typing import List\n\napp = FastAPI()\n\nclass ConnectionManager:\n    def __init__(self):\n        self.active_connections: List[WebSocket] = []\n\n    async def connect(self, websocket: WebSocket):\n        await websocket.accept()\n        self.active_connections.append(websocket)\n\n    def disconnect(self, websocket: WebSocket):\n        self.active_connections.remove(websocket)\n\n    async def send_personal(self, message: str, websocket: WebSocket):\n        await websocket.send_text(message)\n\n    async def broadcast(self, message: str):\n        for connection in self.active_connections:\n            await connection.send_text(message)\n\nmanager = ConnectionManager()\n\n@app.websocket("/ws/{client_id}")\nasync def websocket_endpoint(websocket: WebSocket, client_id: int):\n    await manager.connect(websocket)\n    try:\n        while True:\n            data = await websocket.receive_text()\n            await manager.send_personal(f"Ты написал: {data}", websocket)\n            await manager.broadcast(f"[{client_id}] {data}")\n    except WebSocketDisconnect:\n        manager.disconnect(websocket)\n        await manager.broadcast(f"Клиент #{client_id} покинул чат")' },
        { type: 'tip', value: 'WebSocketDisconnect — специальное исключение FastAPI, которое возникает когда клиент закрывает соединение. Обязательно обрабатывай его, иначе приложение упадёт с ошибкой.' }
      ]
    },
    {
      id: 4,
      title: 'Аутентификация в WebSocket',
      type: 'theory',
      content: [
        { type: 'text', value: 'WebSocket не поддерживает стандартные HTTP-заголовки авторизации при установлении соединения. Токен передаётся через query-параметры или первым сообщением после подключения.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, status\nimport jwt\n\napp = FastAPI()\nSECRET_KEY = "mysecretkey"\n\ndef verify_token(token: str) -> dict:\n    try:\n        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])\n        return payload\n    except jwt.InvalidTokenError:\n        return None\n\n@app.websocket("/ws/secure")\nasync def secure_websocket(\n    websocket: WebSocket,\n    token: str = Query(...)\n):\n    user = verify_token(token)\n    if not user:\n        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)\n        return\n\n    await websocket.accept()\n    await websocket.send_text(f"Добро пожаловать, {user.get(\'sub\', \'User\')}!")\n\n    try:\n        while True:\n            data = await websocket.receive_text()\n            await websocket.send_text(f"[{user[\'sub\']}]: {data}")\n    except WebSocketDisconnect:\n        print(f"Пользователь {user[\'sub\']} отключился")' },
        { type: 'note', value: 'Закрытие через websocket.close() с кодом 1008 (Policy Violation) сигнализирует клиенту о нарушении политики. Важно вызвать close() ДО accept() если аутентификация не прошла.' }
      ]
    },
    {
      id: 5,
      title: 'Комнаты и группы в WebSocket',
      type: 'theory',
      content: [
        { type: 'text', value: 'Реальные приложения требуют чатов с комнатами или группами. Реализуем менеджер с поддержкой комнат, где каждый пользователь подключается к определённой комнате.' },
        { type: 'code', language: 'python', value: 'from fastapi import FastAPI, WebSocket, WebSocketDisconnect\nfrom typing import Dict, List\nimport json\n\napp = FastAPI()\n\nclass RoomManager:\n    def __init__(self):\n        self.rooms: Dict[str, List[WebSocket]] = {}\n\n    async def join(self, room: str, websocket: WebSocket):\n        await websocket.accept()\n        if room not in self.rooms:\n            self.rooms[room] = []\n        self.rooms[room].append(websocket)\n        await self.broadcast_room(room, f"Новый участник присоединился к {room}")\n\n    def leave(self, room: str, websocket: WebSocket):\n        if room in self.rooms:\n            self.rooms[room].remove(websocket)\n            if not self.rooms[room]:\n                del self.rooms[room]\n\n    async def broadcast_room(self, room: str, message: str, exclude=None):\n        if room in self.rooms:\n            for ws in self.rooms[room]:\n                if ws != exclude:\n                    await ws.send_text(message)\n\n    def get_room_count(self, room: str) -> int:\n        return len(self.rooms.get(room, []))\n\nmanager = RoomManager()\n\n@app.websocket("/ws/room/{room_name}/{username}")\nasync def room_endpoint(\n    websocket: WebSocket,\n    room_name: str,\n    username: str\n):\n    await manager.join(room_name, websocket)\n    try:\n        while True:\n            data = await websocket.receive_text()\n            msg = json.dumps({"user": username, "text": data})\n            await manager.broadcast_room(room_name, msg)\n    except WebSocketDisconnect:\n        manager.leave(room_name, websocket)\n        await manager.broadcast_room(room_name, f"{username} покинул комнату")' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Чат в реальном времени',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай полноценный WebSocket-чат с комнатами, историей сообщений и статусом онлайн.',
      requirements: [
        'ConnectionManager хранит подключения по комнатам',
        'История последних 20 сообщений для каждой комнаты',
        'При подключении клиент получает историю сообщений',
        'Сообщения в формате JSON: {user, text, timestamp, room}',
        'При подключении/отключении рассылается системное сообщение всем в комнате',
        'GET /rooms/ — список активных комнат и количество участников'
      ],
      expectedOutput: 'Клиент подключается к /ws/room/tech/Анна\nПолучает историю: [{...}, {...}]\nОтправляет: {"text": "Привет!"}\nВсе в комнате получают: {"user": "Анна", "text": "Привет!", "timestamp": "..."}',
      hint: 'Храни историю как dict[str, list] где ключ — название комнаты. При подключении сразу отправляй историю через send_json(). Используй datetime.now().isoformat() для timestamp.',
      solution: 'from fastapi import FastAPI, WebSocket, WebSocketDisconnect\nfrom typing import Dict, List\nfrom datetime import datetime\nimport json\n\napp = FastAPI()\n\nclass ChatManager:\n    def __init__(self):\n        self.rooms: Dict[str, List[WebSocket]] = {}\n        self.history: Dict[str, List[dict]] = {}\n        self.usernames: Dict[WebSocket, str] = {}\n\n    async def connect(self, room: str, username: str, ws: WebSocket):\n        await ws.accept()\n        if room not in self.rooms:\n            self.rooms[room] = []\n            self.history[room] = []\n        self.rooms[room].append(ws)\n        self.usernames[ws] = username\n        # Отправляем историю\n        await ws.send_json({"type": "history", "messages": self.history[room]})\n        await self.broadcast(room, {"type": "system", "text": f"{username} вошёл в чат"}, None)\n\n    def disconnect(self, room: str, ws: WebSocket):\n        username = self.usernames.pop(ws, "Unknown")\n        if room in self.rooms and ws in self.rooms[room]:\n            self.rooms[room].remove(ws)\n        return username\n\n    async def broadcast(self, room: str, message: dict, exclude: WebSocket):\n        for ws in self.rooms.get(room, []):\n            if ws != exclude:\n                await ws.send_json(message)\n\n    def add_to_history(self, room: str, message: dict):\n        self.history.setdefault(room, []).append(message)\n        if len(self.history[room]) > 20:\n            self.history[room] = self.history[room][-20:]\n\nmanager = ChatManager()\n\n@app.websocket("/ws/room/{room}/{username}")\nasync def chat(websocket: WebSocket, room: str, username: str):\n    await manager.connect(room, username, websocket)\n    try:\n        while True:\n            data = await websocket.receive_text()\n            msg = {"type": "message", "user": username, "text": data,\n                   "room": room, "timestamp": datetime.now().isoformat()}\n            manager.add_to_history(room, msg)\n            await manager.broadcast(room, msg, None)\n    except WebSocketDisconnect:\n        uname = manager.disconnect(room, websocket)\n        await manager.broadcast(room, {"type": "system", "text": f"{uname} покинул чат"}, None)\n\n@app.get("/rooms/")\ndef get_rooms():\n    return {room: len(users) for room, users in manager.rooms.items()}',
      explanation: 'ChatManager хранит три словаря: rooms (подключения), history (история) и usernames (имена). При подключении сразу отправляется история через send_json. broadcast рассылает всем в комнате. История ограничена 20 сообщениями через срез списка. WebSocketDisconnect перехватывается для корректного удаления пользователя.'
    }
  ]
}
