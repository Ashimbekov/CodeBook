export default {
  id: 45,
  title: 'Чат-бот с памятью',
  description: 'Управление историей диалога, краткосрочная (контекст) и долгосрочная (база данных) память, суммаризация длинных разговоров, профили пользователей, согласованность личности.',
  lessons: [
    {
      id: 1,
      title: 'Управление историей диалога',
      type: 'theory',
      content: [
        { type: 'text', value: 'История диалога — это список сообщений (messages array), который передаётся Claude с каждым запросом. Правильное управление историей критично: слишком короткая — бот теряет контекст, слишком длинная — дорого и медленно.' },
        { type: 'heading', value: 'Структура истории' },
        { type: 'code', language: 'python', value: '# Структура истории диалога для Claude API\nmessages = [\n    # Первый пользовательский запрос\n    {\n        "role": "user",\n        "content": "Привет! Меня зовут Мария. Я разрабатываю приложение."\n    },\n    # Первый ответ ассистента\n    {\n        "role": "assistant",\n        "content": "Привет, Мария! Рад познакомиться. Расскажи подробнее о приложении."\n    },\n    # Второй запрос (бот должен помнить имя!)\n    {\n        "role": "user",\n        "content": "Я хочу добавить авторизацию через Google."\n    },\n    # При следующем вызове API добавляем ответ и новый вопрос\n    # ...\n]\n\n# ПРАВИЛА:\n# 1. Messages всегда начинается с role="user"\n# 2. Чередуются user и assistant (нельзя два user подряд)\n# 3. system prompt — отдельный параметр, не в messages\n# 4. Максимум ~200K токенов для claude-opus-4-5' },
        { type: 'heading', value: 'Базовый менеджер истории' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclass ChatBot:\n    def __init__(self, system_prompt: str, model: str = "claude-opus-4-5"):\n        self.client = anthropic.Anthropic()\n        self.system = system_prompt\n        self.model = model\n        self.history = []  # список {role, content}\n    \n    def send_message(self, user_input: str) -> str:\n        """Отправить сообщение и получить ответ."""\n        # Добавляем в историю\n        self.history.append({"role": "user", "content": user_input})\n        \n        # Запрос к Claude\n        response = self.client.messages.create(\n            model=self.model,\n            max_tokens=1024,\n            system=self.system,\n            messages=self.history  # вся история\n        )\n        \n        assistant_reply = response.content[0].text\n        \n        # Сохраняем ответ в историю\n        self.history.append({"role": "assistant", "content": assistant_reply})\n        \n        return assistant_reply\n    \n    def clear_history(self):\n        """Начать разговор заново."""\n        self.history = []\n    \n    def get_history_length(self) -> int:\n        """Количество сообщений в истории."""\n        return len(self.history)\n\n# Демонстрация\nbot = ChatBot("Ты дружелюбный ассистент. Запоминай детали разговора.")\n\nprint(bot.send_message("Меня зовут Алёша, я учу Python."))\nprint(bot.send_message("Что бы ты посоветовал начинающему?"))\nprint(bot.send_message("Напомни как меня зовут?"))  # Бот вспомнит!\nprint(f"\\nИстория: {bot.get_history_length()} сообщений")' },
        { type: 'tip', value: 'История диалога хранится НА ВАШЕЙ стороне, не в API Anthropic. Claude stateless — он не помнит предыдущих запросов. Вы отвечаете за сохранение и передачу истории с каждым запросом.' }
      ]
    },
    {
      id: 2,
      title: 'Краткосрочная память: управление контекстным окном',
      type: 'theory',
      content: [
        { type: 'text', value: 'Краткосрочная память — это то что находится в текущем контекстном окне (messages array). Claude claude-opus-4-5 поддерживает ~200K токенов. Но длинные истории стоят дорого — нужно управлять размером.' },
        { type: 'heading', value: 'Стратегии управления контекстом' },
        { type: 'list', value: [
          'Sliding window: оставляем только последние N сообщений',
          'Token-based trimming: оставляем столько сообщений сколько влезает в лимит',
          'Summarization: сжимаем старую историю в резюме',
          'Importance-based: сохраняем важные сообщения, удаляем малозначимые',
          'Pinned messages: первое сообщение (важный контекст) всегда сохраняется'
        ]},
        { type: 'heading', value: 'Реализация sliding window с pinned messages' },
        { type: 'code', language: 'python', value: 'class SmartContextManager:\n    def __init__(self, max_messages: int = 20, pin_first: bool = True):\n        self.max_messages = max_messages\n        self.pin_first = pin_first\n        self.all_history = []   # полная история (в памяти/БД)\n    \n    def add_message(self, role: str, content: str):\n        self.all_history.append({"role": role, "content": content})\n    \n    def get_context(self) -> list:\n        """Возвращает историю для передачи в API."""\n        if len(self.all_history) <= self.max_messages:\n            return self.all_history\n        \n        if self.pin_first and len(self.all_history) > 0:\n            # Первые 2 сообщения (user + assistant) — всегда включаем\n            pinned = self.all_history[:2]\n            recent = self.all_history[-(self.max_messages - 2):]\n            return pinned + recent\n        \n        return self.all_history[-self.max_messages:]\n    \n    def estimate_tokens(self) -> int:\n        """Примерная оценка токенов в контексте."""\n        total_chars = sum(\n            len(m["content"]) for m in self.get_context()\n        )\n        return total_chars // 4  # ~4 символа на токен\n\n# Дополнительная стратегия: обрезка по токенам\ndef trim_to_token_limit(messages: list, \n                        limit: int = 150_000,\n                        chars_per_token: int = 4) -> list:\n    """Обрезаем историю чтобы влезть в лимит токенов."""\n    total = 0\n    result = []\n    \n    # Идём с конца (самые новые сообщения важнее)\n    for msg in reversed(messages):\n        msg_tokens = len(msg["content"]) // chars_per_token\n        if total + msg_tokens > limit:\n            break\n        result.append(msg)\n        total += msg_tokens\n    \n    return list(reversed(result))  # восстанавливаем порядок' }
      ]
    },
    {
      id: 3,
      title: 'Долгосрочная память: база данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Долгосрочная память позволяет боту "помнить" пользователя между сессиями. Когда пользователь возвращается через неделю, бот знает его имя, предпочтения и предыдущие разговоры.' },
        { type: 'heading', value: 'Архитектура долгосрочной памяти' },
        { type: 'code', language: 'python', value: 'import sqlite3\nimport json\nfrom datetime import datetime\nfrom typing import Optional\n\nclass LongTermMemory:\n    """\n    Долгосрочная память на SQLite.\n    В production используйте PostgreSQL или MongoDB.\n    """\n    \n    def __init__(self, db_path: str = "chatbot.db"):\n        self.db_path = db_path\n        self._init_db()\n    \n    def _init_db(self):\n        with sqlite3.connect(self.db_path) as conn:\n            conn.executescript("""\n                CREATE TABLE IF NOT EXISTS conversations (\n                    id INTEGER PRIMARY KEY AUTOINCREMENT,\n                    user_id TEXT NOT NULL,\n                    session_id TEXT NOT NULL,\n                    started_at TEXT DEFAULT (datetime(\'now\')),\n                    summary TEXT\n                );\n                \n                CREATE TABLE IF NOT EXISTS messages (\n                    id INTEGER PRIMARY KEY AUTOINCREMENT,\n                    conversation_id INTEGER REFERENCES conversations(id),\n                    role TEXT NOT NULL,\n                    content TEXT NOT NULL,\n                    created_at TEXT DEFAULT (datetime(\'now\'))\n                );\n                \n                CREATE TABLE IF NOT EXISTS user_facts (\n                    id INTEGER PRIMARY KEY AUTOINCREMENT,\n                    user_id TEXT NOT NULL,\n                    fact_key TEXT NOT NULL,\n                    fact_value TEXT NOT NULL,\n                    updated_at TEXT DEFAULT (datetime(\'now\')),\n                    UNIQUE(user_id, fact_key)\n                );\n                \n                CREATE INDEX IF NOT EXISTS idx_conv_user ON conversations(user_id);\n                CREATE INDEX IF NOT EXISTS idx_msg_conv ON messages(conversation_id);\n            """)\n    \n    def save_message(self, conversation_id: int, role: str, content: str):\n        with sqlite3.connect(self.db_path) as conn:\n            conn.execute(\n                "INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)",\n                (conversation_id, role, content)\n            )\n    \n    def get_recent_messages(self, conversation_id: int, limit: int = 20) -> list:\n        with sqlite3.connect(self.db_path) as conn:\n            rows = conn.execute(\n                """SELECT role, content FROM messages \n                   WHERE conversation_id = ? \n                   ORDER BY created_at DESC LIMIT ?""",\n                (conversation_id, limit)\n            ).fetchall()\n        return [{"role": r[0], "content": r[1]} for r in reversed(rows)]\n    \n    def save_user_fact(self, user_id: str, key: str, value: str):\n        """Сохраняем факт о пользователе (имя, город, предпочтения...)."""\n        with sqlite3.connect(self.db_path) as conn:\n            conn.execute(\n                """INSERT OR REPLACE INTO user_facts (user_id, fact_key, fact_value, updated_at)\n                   VALUES (?, ?, ?, datetime(\'now\'))""",\n                (user_id, key, value)\n            )\n    \n    def get_user_facts(self, user_id: str) -> dict:\n        with sqlite3.connect(self.db_path) as conn:\n            rows = conn.execute(\n                "SELECT fact_key, fact_value FROM user_facts WHERE user_id = ?",\n                (user_id,)\n            ).fetchall()\n        return {row[0]: row[1] for row in rows}' },
        { type: 'tip', value: 'Извлечение фактов — ключевой паттерн долгосрочной памяти. После каждого сообщения просите Claude вычленить важные факты ("имя: Алексей", "город: Москва") и сохраняйте их в user_facts.' }
      ]
    },
    {
      id: 4,
      title: 'Суммаризация длинных разговоров',
      type: 'theory',
      content: [
        { type: 'text', value: 'Когда разговор становится очень длинным, его нужно сжимать. Суммаризация позволяет сохранить суть разговора без дублирования полного текста в каждом запросе.' },
        { type: 'heading', value: 'Паттерн прогрессивной суммаризации' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nclass SummarizingChatBot:\n    def __init__(self, system: str, max_messages: int = 30):\n        self.system = system\n        self.max_messages = max_messages\n        self.history = []\n        self.summary = None  # резюме предыдущих сообщений\n    \n    def send_message(self, user_input: str) -> str:\n        self.history.append({"role": "user", "content": user_input})\n        \n        # Если история слишком длинная — суммаризируем\n        if len(self.history) > self.max_messages:\n            self._compress_history()\n        \n        # Формируем контекст с учётом резюме\n        context_messages = self._build_context()\n        \n        response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=1024,\n            system=self._build_system(),\n            messages=context_messages\n        )\n        \n        reply = response.content[0].text\n        self.history.append({"role": "assistant", "content": reply})\n        return reply\n    \n    def _compress_history(self):\n        """Суммаризируем первые 2/3 истории."""\n        split_point = len(self.history) * 2 // 3\n        to_compress = self.history[:split_point]\n        self.history = self.history[split_point:]  # оставляем свежие\n        \n        # Создаём резюме через Claude Haiku (дешевле)\n        summary_response = client.messages.create(\n            model="claude-haiku-4-5",\n            max_tokens=500,\n            messages=[{\n                "role": "user",\n                "content": (\n                    "Сделай краткое резюме этого разговора (3-5 предложений). "\n                    "Выдели ключевые факты, решения и контекст:\\n\\n"\n                    + "\\n".join(\n                        f"{m[\'role\'].upper()}: {m[\'content\']}"\n                        for m in to_compress\n                    )\n                )\n            }]\n        )\n        \n        new_summary = summary_response.content[0].text\n        \n        # Если было предыдущее резюме — объединяем\n        if self.summary:\n            self.summary = f"{self.summary}\\n\\n[Позже]: {new_summary}"\n        else:\n            self.summary = new_summary\n        \n        print(f"[Резюме обновлено: {len(to_compress)} -> {len(self.summary.split())} слов]")\n    \n    def _build_system(self) -> str:\n        if self.summary:\n            return f"{self.system}\\n\\nКонтекст предыдущего разговора: {self.summary}"\n        return self.system\n    \n    def _build_context(self) -> list:\n        """Возвращаем только последние N сообщений."""\n        return self.history[-self.max_messages:]' }
      ]
    },
    {
      id: 5,
      title: 'Профили пользователей',
      type: 'theory',
      content: [
        { type: 'text', value: 'Профиль пользователя — это структурированные данные о пользователе, которые помогают боту персонализировать ответы. Имя, предпочтения, история взаимодействий, уровень экспертизы.' },
        { type: 'heading', value: 'Структура профиля' },
        { type: 'code', language: 'python', value: 'from dataclasses import dataclass, field, asdict\nfrom typing import Optional\nimport json\n\n@dataclass\nclass UserProfile:\n    user_id: str\n    name: Optional[str] = None\n    preferred_language: str = "ru"\n    expertise_level: str = "beginner"  # beginner, intermediate, expert\n    interests: list = field(default_factory=list)\n    communication_style: str = "friendly"  # formal, friendly, technical\n    timezone: str = "UTC"\n    custom_facts: dict = field(default_factory=dict)  # любые дополнительные факты\n    \n    def to_system_prompt_addition(self) -> str:\n        """Генерируем дополнение к системному промпту."""\n        parts = []\n        if self.name:\n            parts.append(f"Имя пользователя: {self.name}")\n        parts.append(f"Уровень экспертизы: {self.expertise_level}")\n        parts.append(f"Стиль общения: {self.communication_style}")\n        if self.interests:\n            parts.append(f"Интересы: {\', \'.join(self.interests)}")\n        if self.custom_facts:\n            for key, value in self.custom_facts.items():\n                parts.append(f"{key}: {value}")\n        return "\\n".join(parts)\n\n# Автоматическое извлечение фактов из разговора\ndef extract_facts_from_conversation(\n    user_message: str,\n    profile: UserProfile\n) -> dict:\n    """Используем Claude для извлечения фактов о пользователе."""\n    client = anthropic.Anthropic()\n    \n    response = client.messages.create(\n        model="claude-haiku-4-5",  # Haiku — дешевле для такой задачи\n        max_tokens=300,\n        messages=[{\n            "role": "user",\n            "content": f"""Извлеки факты о пользователе из его сообщения.\nОтвечай только в JSON формате. Если фактов нет — пустой объект {{}}.\n\nВозможные ключи: name, city, profession, hobby, age, company\n\nСообщение: {user_message}\n\nJSON:"""\n        }]\n    )\n    \n    try:\n        facts = json.loads(response.content[0].text.strip())\n        return facts\n    except json.JSONDecodeError:\n        return {}\n\n# Пример использования\nprofile = UserProfile(user_id="user_123")\n\nmessage = "Меня зовут Анна, я работаю дизайнером в Санкт-Петербурге"\nfacts = extract_facts_from_conversation(message, profile)\nprint(f"Извлечённые факты: {facts}")\n# {"name": "Анна", "profession": "дизайнер", "city": "Санкт-Петербург"}\n\n# Обновляем профиль\nif "name" in facts:\n    profile.name = facts["name"]\nprofile.custom_facts.update(facts)\n\nprint(profile.to_system_prompt_addition())' }
      ]
    },
    {
      id: 6,
      title: 'Согласованность личности бота',
      type: 'theory',
      content: [
        { type: 'text', value: 'Личность (persona) бота должна оставаться согласованной: одинаковый тон, стиль, "характер" независимо от темы разговора. Это создаёт ощущение общения с живым персонажем, а не с API.' },
        { type: 'heading', value: 'Компоненты личности бота' },
        { type: 'list', value: [
          'Имя и роль: "Я Алиса, ваш помощник в банке ВТБ"',
          'Тон общения: формальный/неформальный, весёлый/серьёзный',
          'Словарный запас: специализированные термины vs простой язык',
          'Ограничения: что бот делает и не делает ("Я не даю юридических советов")',
          'Реакции на off-topic: как вежливо возвращать к теме',
          'Catchphrases: фирменные фразы для узнаваемости'
        ]},
        { type: 'code', language: 'python', value: '# Хорошо спроектированный системный промпт для личности\nBANK_BOT_PERSONA = """\nТы Алиса — ассистент банка ВТБ.\n\nЛИЧНОСТЬ:\n- Дружелюбная, профессиональная, терпеливая\n- Говоришь на "вы", избегаешь жаргона\n- Всегда уточняешь детали перед тем как давать советы\n\nЧТО ТЫ ДЕЛАЕШЬ:\n- Помогаешь с вопросами о продуктах ВТБ\n- Объясняешь условия кредитов и вкладов\n- Помогаешь разобраться с интернет-банком\n\nЧТО НЕ ДЕЛАЕШЬ:\n- Не даёшь конкретных инвестиционных советов\n- Не раскрываешь данные других клиентов\n- Не обещаешь того, в чём не уверена\n\nЕСЛИ СПРАШИВАЮТ OFF-TOPIC:\nВежливо объясни: "Это выходит за рамки моей специализации.\nМогу помочь вам с вопросами о продуктах ВТБ."\n\nКАТЧФРАЗА: Заканчивай каждый ответ: "Могу ли я помочь ещё чем-нибудь?"\n"""\n\n# Тест на согласованность личности\nclient = anthropic.Anthropic()\n\ndef test_persona(question: str) -> str:\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=200,\n        system=BANK_BOT_PERSONA,\n        messages=[{"role": "user", "content": question}]\n    )\n    return response.content[0].text\n\n# Должна вернуться к теме банка:\nprint(test_persona("Расскажи анекдот!"))' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Полноценный чат-бот с памятью',
      type: 'practice',
      difficulty: 'hard',
      description: 'Постройте чат-бота поддержки клиентов с краткосрочной и долгосрочной памятью: SQLite для истории, суммаризация при переполнении контекста, извлечение фактов о пользователе.',
      requirements: [
        'Создайте класс MemoryChatBot с SQLite для хранения истории и профилей',
        'Реализуйте метод chat(user_id, message) — принимает ID пользователя и сообщение',
        'При первом сообщении создайте профиль. При последующих — загружайте из БД',
        'После каждого ответа извлекайте факты о пользователе через Claude Haiku',
        'Если история > 20 сообщений — суммаризируйте первые 10',
        'Системный промпт должен включать профиль пользователя',
        'Протестируйте: 3 сообщения от одного пользователя (представиться, спросить, вернуться "после перерыва")'
      ],
      expectedOutput: 'Бот помнит имя пользователя между вызовами, включает факты в системный промпт и суммаризирует длинные разговоры.',
      hint: 'Используйте SQLite в режиме check_same_thread=False или создавайте новое соединение в каждом методе. Для извлечения фактов используйте claude-haiku-4-5 — это дешевле.',
      solution: `import sqlite3
import json
import anthropic

client = anthropic.Anthropic()
DB_PATH = "memory_chatbot.db"

def init_db():
    with sqlite3.connect(DB_PATH) as conn:
        conn.executescript("""
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                name TEXT,
                facts TEXT DEFAULT '{}',
                created_at TEXT DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                role TEXT,
                content TEXT,
                ts TEXT DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS summaries (
                user_id TEXT PRIMARY KEY,
                summary TEXT
            );
        """)

def get_or_create_user(user_id: str) -> dict:
    with sqlite3.connect(DB_PATH) as conn:
        row = conn.execute("SELECT * FROM users WHERE user_id=?", (user_id,)).fetchone()
        if not row:
            conn.execute("INSERT INTO users (user_id) VALUES (?)", (user_id,))
            return {"user_id": user_id, "name": None, "facts": {}}
        return {"user_id": row[0], "name": row[1], "facts": json.loads(row[2] or "{}")}

def save_facts(user_id: str, facts: dict):
    with sqlite3.connect(DB_PATH) as conn:
        existing = conn.execute("SELECT facts FROM users WHERE user_id=?", (user_id,)).fetchone()
        current = json.loads(existing[0] or "{}") if existing else {}
        current.update(facts)
        conn.execute("UPDATE users SET facts=?, name=? WHERE user_id=?",
                     (json.dumps(current, ensure_ascii=False),
                      current.get("name"), user_id))

def get_messages(user_id: str, limit: int = 20) -> list:
    with sqlite3.connect(DB_PATH) as conn:
        rows = conn.execute(
            "SELECT role, content FROM messages WHERE user_id=? ORDER BY id DESC LIMIT ?",
            (user_id, limit)
        ).fetchall()
    return [{"role": r[0], "content": r[1]} for r in reversed(rows)]

def save_message(user_id: str, role: str, content: str):
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("INSERT INTO messages (user_id, role, content) VALUES (?,?,?)",
                     (user_id, role, content))

def get_summary(user_id: str) -> str:
    with sqlite3.connect(DB_PATH) as conn:
        row = conn.execute("SELECT summary FROM summaries WHERE user_id=?", (user_id,)).fetchone()
    return row[0] if row else ""

def save_summary(user_id: str, summary: str):
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("INSERT OR REPLACE INTO summaries (user_id, summary) VALUES (?,?)",
                     (user_id, summary))

def maybe_summarize(user_id: str):
    with sqlite3.connect(DB_PATH) as conn:
        count = conn.execute("SELECT COUNT(*) FROM messages WHERE user_id=?", (user_id,)).fetchone()[0]

    if count > 20:
        old_messages = get_messages(user_id, limit=count)[:10]
        resp = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=300,
            messages=[{"role": "user", "content":
                "Сделай резюме разговора (2-3 предл):\\n" +
                "\\n".join(f"{m['role'].upper()}: {m['content']}" for m in old_messages)
            }]
        )
        new_summary = resp.content[0].text
        existing = get_summary(user_id)
        combined = (existing + "\\n" + new_summary).strip() if existing else new_summary
        save_summary(user_id, combined)
        # Удаляем старые сообщения
        with sqlite3.connect(DB_PATH) as conn:
            conn.execute(
                "DELETE FROM messages WHERE user_id=? AND id IN "
                "(SELECT id FROM messages WHERE user_id=? ORDER BY id LIMIT 10)",
                (user_id, user_id)
            )

def extract_facts(message: str) -> dict:
    resp = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=100,
        messages=[{"role": "user", "content":
            f"Извлеки факты о пользователе из сообщения. JSON или {{}}:\\n{message}"
        }]
    )
    try:
        return json.loads(resp.content[0].text.strip())
    except:
        return {}

def chat(user_id: str, message: str) -> str:
    user = get_or_create_user(user_id)

    # Строим системный промпт
    system_parts = ["Ты полезный ассистент с памятью о пользователе."]
    if user["name"]:
        system_parts.append(f"Имя пользователя: {user['name']}")
    if user["facts"]:
        for k, v in user["facts"].items():
            system_parts.append(f"{k}: {v}")
    summary = get_summary(user_id)
    if summary:
        system_parts.append(f"Предыдущий разговор: {summary}")
    system = "\\n".join(system_parts)

    # История
    history = get_messages(user_id, limit=20)
    history.append({"role": "user", "content": message})

    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=512,
        system=system,
        messages=history
    )
    reply = response.content[0].text

    # Сохраняем
    save_message(user_id, "user", message)
    save_message(user_id, "assistant", reply)

    # Извлекаем факты
    facts = extract_facts(message)
    if facts:
        save_facts(user_id, facts)

    # Суммаризируем если нужно
    maybe_summarize(user_id)

    return reply

# Тест
init_db()
uid = "user_test_1"

print("1:", chat(uid, "Привет! Меня зовут Кирилл, я живу в Новосибирске."))
print()
print("2:", chat(uid, "Что посоветуешь почитать по Python?"))
print()
# Симулируем "возвращение" — очищаем runtime но БД сохраняется
print("3 (после перерыва):", chat(uid, "Привет снова! Напомни как меня зовут и где я живу?"))`,
      explanation: 'Бот реализует трёхуровневую память: 1) SQLite хранит полную историю и профиль пользователя между сессиями, 2) При каждом запросе профиль загружается и добавляется в системный промпт, 3) Claude Haiku автоматически извлекает факты из сообщений и сохраняет их в профиль. Суммаризация активируется когда накапливается > 20 сообщений, сжимая старые 10 в краткое резюме.'
    }
  ]
}
