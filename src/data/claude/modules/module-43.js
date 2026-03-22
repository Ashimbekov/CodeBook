export default {
  id: 43,
  title: 'AI-агенты: основы',
  description: 'Что такое AI-агент, цикл observe-think-act, инструменты и действия, планирование, память (кратко- и долгосрочная), архитектуры ReAct и Plan-and-Execute, безопасность агентов.',
  lessons: [
    {
      id: 1,
      title: 'Что такое AI-агент',
      type: 'theory',
      content: [
        { type: 'text', value: 'AI-агент — это система на основе LLM, которая воспринимает окружение, принимает решения и выполняет действия для достижения цели. В отличие от простого чат-бота, агент действует автономно: планирует шаги, вызывает инструменты, реагирует на результаты.' },
        { type: 'heading', value: 'Разница между LLM, чат-ботом и агентом' },
        { type: 'list', value: [
          'LLM: принимает текст → возвращает текст. Один шаг. Нет памяти.',
          'Чат-бот: LLM + история диалога. Несколько шагов, но только разговор.',
          'AI-агент: LLM + инструменты + память + цикл выполнения. Может ДЕЛАТЬ вещи.',
          'Пример: агент для исследований — ищет в интернете, читает документы, пишет отчёт.',
          'Пример: агент для кода — анализирует репозиторий, пишет код, запускает тесты, фиксит ошибки.'
        ]},
        { type: 'heading', value: 'Компоненты AI-агента' },
        { type: 'code', language: 'python', value: '# Минимальный AI-агент состоит из:\n\n# 1. BRAIN (мозг) — языковая модель\n#    Принимает решения, планирует, рассуждает\n\n# 2. TOOLS (инструменты) — функции, которые агент может вызывать\n#    Поиск в интернете, выполнение кода, чтение файлов,\n#    вызов API, работа с базой данных...\n\n# 3. MEMORY (память)\n#    Кратковременная: текущий контекст (messages array)\n#    Долговременная: БД, векторное хранилище\n\n# 4. EXECUTION LOOP (цикл выполнения)\n#    Наблюдение → Мышление → Действие → Повтор до достижения цели\n\n# 5. ENVIRONMENT (окружение)\n#    Файловая система, интернет, API, базы данных\n\nclass SimpleAgent:\n    def __init__(self, tools: list, llm_client):\n        self.tools = {t.name: t for t in tools}\n        self.llm = llm_client\n        self.memory = []  # история действий\n    \n    def run(self, goal: str) -> str:\n        """Запускает агента для достижения цели."""\n        self.memory.append({"role": "user", "content": goal})\n        \n        while True:\n            # Think: что делать дальше?\n            response = self.llm.decide(self.memory, self.tools)\n            \n            if response.is_final_answer:\n                return response.answer\n            \n            # Act: выполняем действие\n            result = self.tools[response.tool_name].call(response.tool_args)\n            \n            # Observe: запоминаем результат\n            self.memory.append({\n                "role": "tool",\n                "content": str(result)\n            })' },
        { type: 'tip', value: 'Не путайте AI-агента с простым tool use. Tool use — это разовый вызов инструмента. AI-агент — это цикл, где результаты инструментов влияют на следующие решения.' }
      ]
    },
    {
      id: 2,
      title: 'Цикл агента: Observe-Think-Act',
      type: 'theory',
      content: [
        { type: 'text', value: 'Цикл Observe-Think-Act (Наблюдай-Думай-Действуй) — фундаментальная петля обратной связи AI-агента. Каждая итерация приближает агента к цели.' },
        { type: 'heading', value: 'Три фазы цикла' },
        { type: 'code', language: 'python', value: 'import anthropic\nimport json\n\nclient = anthropic.Anthropic()\n\ndef agent_loop(goal: str, tools: list, max_iterations: int = 10) -> str:\n    messages = [{"role": "user", "content": goal}]\n    \n    for iteration in range(max_iterations):\n        print(f"\\n=== Итерация {iteration + 1} ===")\n        \n        # === OBSERVE ===\n        # Собираем текущее состояние (уже в messages)\n        print(f"Контекст: {len(messages)} сообщений")\n        \n        # === THINK ===\n        # Модель анализирует состояние и решает что делать\n        response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=1024,\n            tools=tools,\n            messages=messages\n        )\n        \n        print(f"Решение модели: stop_reason={response.stop_reason}")\n        \n        # === ACT ===\n        if response.stop_reason == "end_turn":\n            # Цель достигнута — возвращаем финальный ответ\n            final_text = next(\n                block.text for block in response.content \n                if hasattr(block, \'text\')\n            )\n            print(f"Финальный ответ: {final_text[:100]}...")\n            return final_text\n        \n        elif response.stop_reason == "tool_use":\n            # Нужно выполнить инструмент\n            messages.append({"role": "assistant", "content": response.content})\n            \n            tool_results = []\n            for block in response.content:\n                if block.type == "tool_use":\n                    print(f"Вызов инструмента: {block.name}({block.input})")\n                    result = execute_tool(block.name, block.input)\n                    print(f"Результат: {str(result)[:100]}")\n                    tool_results.append({\n                        "type": "tool_result",\n                        "tool_use_id": block.id,\n                        "content": str(result)\n                    })\n            \n            messages.append({"role": "user", "content": tool_results})\n    \n    return "Достигнут лимит итераций"' },
        { type: 'heading', value: 'Важность лимита итераций' },
        { type: 'warning', value: 'Всегда устанавливайте max_iterations! Агент может застрять в бесконечном цикле, вызывая дорогие инструменты. Типичные значения: 5-20 итераций для простых задач, 50-100 для сложных.' }
      ]
    },
    {
      id: 3,
      title: 'Инструменты (Tools) и действия',
      type: 'theory',
      content: [
        { type: 'text', value: 'Инструменты — это функции, которые расширяют возможности агента за пределы текстовой генерации. Хорошо спроектированные инструменты — ключ к эффективному агенту.' },
        { type: 'heading', value: 'Типы инструментов' },
        { type: 'list', value: [
          'Поиск: web search, vector DB search, SQL queries',
          'Файловая система: read_file, write_file, list_directory',
          'Вычисления: execute_python, run_bash, calculator',
          'Внешние API: weather, maps, calendar, email, Slack',
          'Браузер: navigate_to, click, fill_form, take_screenshot',
          'Память: save_note, recall_note (долговременная память)'
        ]},
        { type: 'heading', value: 'Определение инструментов для Claude' },
        { type: 'code', language: 'python', value: 'import anthropic\nimport json\n\n# Определяем инструменты в формате Claude\ntools = [\n    {\n        "name": "search_web",\n        "description": "Ищет информацию в интернете. Используй для получения актуальных данных.",\n        "input_schema": {\n            "type": "object",\n            "properties": {\n                "query": {\n                    "type": "string",\n                    "description": "Поисковый запрос"\n                }\n            },\n            "required": ["query"]\n        }\n    },\n    {\n        "name": "calculate",\n        "description": "Выполняет математические вычисления. Принимает Python-выражение.",\n        "input_schema": {\n            "type": "object",\n            "properties": {\n                "expression": {\n                    "type": "string",\n                    "description": "Python-выражение, например: 2 + 2 * 10 или sum([1,2,3])"\n                }\n            },\n            "required": ["expression"]\n        }\n    },\n    {\n        "name": "save_note",\n        "description": "Сохраняет заметку для последующего использования.",\n        "input_schema": {\n            "type": "object",\n            "properties": {\n                "key": {"type": "string", "description": "Ключ для заметки"},\n                "content": {"type": "string", "description": "Содержимое заметки"}\n            },\n            "required": ["key", "content"]\n        }\n    }\n]\n\n# Реализация инструментов\nnotes_storage = {}\n\ndef execute_tool(name: str, args: dict):\n    if name == "search_web":\n        # В реальности: requests.get("https://api.search.com?q=" + args["query"])\n        return f"Результаты поиска по \'{args[\'query\']}\': [список результатов]"\n    \n    elif name == "calculate":\n        try:\n            result = eval(args["expression"], {"__builtins__": {}},\n                         {"sum": sum, "len": len, "max": max, "min": min})\n            return result\n        except Exception as e:\n            return f"Ошибка: {e}"\n    \n    elif name == "save_note":\n        notes_storage[args["key"]] = args["content"]\n        return f"Заметка \'{args[\'key\']}\' сохранена"\n    \n    return f"Неизвестный инструмент: {name}"' },
        { type: 'tip', value: 'Пишите чёткие description для инструментов — модель использует их для принятия решений о том, какой инструмент вызвать. Плохое описание = неправильный выбор инструментов.' }
      ]
    },
    {
      id: 4,
      title: 'Планирование и рассуждение',
      type: 'theory',
      content: [
        { type: 'text', value: 'Сложные задачи требуют планирования: декомпозиции на подзадачи, определения порядка выполнения и адаптации плана при получении новой информации.' },
        { type: 'heading', value: 'Промпт для планирования' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nPLANNING_SYSTEM = """Ты AI-агент-исследователь. При получении сложной задачи:\n1. Сначала составь план из конкретных шагов\n2. Выполняй шаги по одному, используя инструменты\n3. После каждого шага обновляй план если нужно\n4. Финальный ответ должен быть полным и обоснованным\n\nФормат плана:\n<plan>\n  Шаг 1: [действие]\n  Шаг 2: [действие]\n  ...\n</plan>\n\nЗатем выполняй шаги."""\n\ndef planning_agent(task: str, tools: list) -> str:\n    messages = [{"role": "user", "content": task}]\n    \n    # Фаза 1: получаем план\n    plan_response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=500,\n        system=PLANNING_SYSTEM,\n        messages=messages + [{\n            "role": "user",\n            "content": "Сначала составь план выполнения задачи."\n        }]\n    )\n    plan = plan_response.content[0].text\n    print(f"ПЛАН:\\n{plan}\\n")\n    \n    # Фаза 2: выполняем план\n    messages.append({"role": "assistant", "content": plan})\n    messages.append({"role": "user", "content": "Теперь выполняй план шаг за шагом."})\n    \n    return agent_loop_with_tools(messages, tools)' },
        { type: 'heading', value: 'Chain-of-Thought в агенте' },
        { type: 'code', language: 'python', value: '# Просим агента "думать вслух" перед действием\nCOT_SYSTEM = """Перед каждым действием используй теги <thinking>:\n\n<thinking>\nЧто я уже знаю: ...\nЧто мне нужно узнать: ...\nКакой инструмент использовать: ...\nПочему именно этот инструмент: ...\n</thinking>\n\nЗатем вызывай инструмент или давай финальный ответ.\nЭто помогает рассуждать более чётко."""\n\n# Claude будет рассуждать перед каждым действием,\n# что значительно улучшает качество планирования' },
        { type: 'note', value: 'Используйте extended thinking (claude-3-7-sonnet-20250219) для задач, требующих глубокого рассуждения. Это встроенный CoT без необходимости специальных промптов.' }
      ]
    },
    {
      id: 5,
      title: 'Память агента: краткосрочная и долгосрочная',
      type: 'theory',
      content: [
        { type: 'text', value: 'Память определяет что агент знает и помнит. Без правильной памяти агент "забывает" важный контекст или "переполняется" лишними деталями.' },
        { type: 'heading', value: 'Виды памяти агента' },
        { type: 'list', value: [
          'In-context (рабочая память): текущий массив messages. Ограничена контекстным окном.',
          'Episodic (эпизодическая): история прошлых взаимодействий. Хранится в БД.',
          'Semantic (семантическая): факты, знания. Хранится в векторной БД (RAG).',
          'Procedural (процедурная): как выполнять задачи. Встроена в системный промпт или примеры.',
          'Working notes: временные заметки в процессе задачи. Инструмент save_note/recall_note.'
        ]},
        { type: 'heading', value: 'Управление памятью в агенте' },
        { type: 'code', language: 'python', value: 'from datetime import datetime\nimport json\n\nclass AgentMemory:\n    def __init__(self, db_client, vector_store):\n        self.db = db_client\n        self.vectors = vector_store\n        self.working_notes = {}  # временные заметки\n        self.context_window = []  # текущий контекст\n    \n    def add_to_context(self, role: str, content: str):\n        """Добавляем в рабочую память (in-context)."""\n        self.context_window.append({"role": role, "content": content})\n        # Если контекст слишком большой — сжимаем\n        if self._estimate_tokens() > 150_000:  # 80% от лимита claude\n            self._compress_context()\n    \n    def _compress_context(self):\n        """Сжимаем старую историю в краткое резюме."""\n        old_messages = self.context_window[:-10]  # все кроме последних 10\n        \n        # Просим Claude сделать резюме\n        from anthropic import Anthropic\n        summary = Anthropic().messages.create(\n            model="claude-haiku-4-5",\n            max_tokens=500,\n            messages=[{\n                "role": "user",\n                "content": f"Сделай краткое резюме этой переписки:\\n{json.dumps(old_messages)}"\n            }]\n        ).content[0].text\n        \n        # Заменяем старые сообщения резюме\n        self.context_window = [\n            {"role": "assistant", "content": f"[Резюме предыдущего контекста]: {summary}"}\n        ] + self.context_window[-10:]\n    \n    def save_note(self, key: str, content: str):\n        """Рабочие заметки (временная память)."""\n        self.working_notes[key] = {\n            "content": content,\n            "timestamp": datetime.utcnow().isoformat()\n        }\n    \n    def recall_note(self, key: str) -> str:\n        note = self.working_notes.get(key)\n        return note["content"] if note else "Заметка не найдена"\n    \n    def save_to_long_term(self, fact: str, category: str = "general"):\n        """Сохраняем в долгосрочную (векторную) память."""\n        self.vectors.add_texts([fact], metadatas=[{"category": category}])\n    \n    def recall_from_long_term(self, query: str) -> list:\n        """Ищем в долгосрочной памяти."""\n        return self.vectors.similarity_search(query, k=3)\n    \n    def _estimate_tokens(self) -> int:\n        total_chars = sum(len(m["content"]) for m in self.context_window)\n        return total_chars // 4  # примерно 4 символа на токен' },
        { type: 'tip', value: 'Компрессия контекста — важная техника для долгих задач. Используйте Claude Haiku для создания резюме (дешевле). Всегда сохраняйте последние N сообщений без изменений.' }
      ]
    },
    {
      id: 6,
      title: 'Архитектуры агентов: ReAct и Plan-and-Execute',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существуют устоявшиеся архитектурные паттерны для агентов. ReAct и Plan-and-Execute — самые популярные и хорошо изученные.' },
        { type: 'heading', value: 'ReAct (Reason + Act)' },
        { type: 'code', language: 'python', value: '# ReAct: модель чередует рассуждение и действие\n# Reasoning -> Action -> Observation -> Reasoning -> ...\n\nREACT_SYSTEM = """Решай задачи используя формат:\n\nThought: [рассуждение о текущей ситуации]\nAction: [название инструмента]\nAction Input: [входные данные в JSON]\nObservation: [результат инструмента]\n... (повторяй Thought/Action/Observation)\nThought: Я знаю финальный ответ\nFinal Answer: [ответ]\n\nДоступные инструменты:\n- search(query): поиск информации\n- calculate(expr): вычисления\n- read_file(path): чтение файла\n"""\n\n# Пример диалога ReAct:\n# User: Какова площадь России в кв. км? Переведи в кв. мили.\n# \n# Thought: Мне нужна площадь России.\n# Action: search\n# Action Input: {"query": "площадь России в кв. км"}\n# Observation: Площадь России — 17,098,242 кв. км\n#\n# Thought: Теперь переведу в кв. мили (1 кв. км = 0.386102 кв. мили)\n# Action: calculate\n# Action Input: {"expr": "17098242 * 0.386102"}\n# Observation: 6601665.7284\n#\n# Thought: Я знаю финальный ответ\n# Final Answer: Площадь России — 17,098,242 кв. км или ≈6,601,666 кв. миль.' },
        { type: 'heading', value: 'Plan-and-Execute' },
        { type: 'code', language: 'python', value: '# Plan-and-Execute: сначала составляем полный план, потом выполняем\n# Лучше для длинных задач с зависимостями между шагами\n\nclass PlanAndExecuteAgent:\n    def __init__(self, planner_llm, executor_llm, tools):\n        self.planner = planner_llm  # более мощная модель для планирования\n        self.executor = executor_llm  # более дешёвая для выполнения\n        self.tools = tools\n    \n    def run(self, task: str) -> str:\n        # Шаг 1: Планирование (используем мощную модель)\n        plan = self.planner.plan(task)\n        print(f"Составлен план из {len(plan.steps)} шагов")\n        \n        results = []\n        for i, step in enumerate(plan.steps):\n            print(f"\\nШаг {i+1}/{len(plan.steps)}: {step.description}")\n            \n            # Шаг 2: Выполнение (используем дешёвую модель)\n            result = self.executor.execute(\n                step=step,\n                tools=self.tools,\n                previous_results=results  # контекст предыдущих результатов\n            )\n            results.append(result)\n            \n            # Шаг 3: Переплановка если нужно\n            if result.requires_replan:\n                plan = self.planner.replan(\n                    original_task=task,\n                    completed_steps=results,\n                    failure_reason=result.error\n                )\n        \n        # Финальный синтез результатов\n        return self.planner.synthesize(task, results)' },
        { type: 'note', value: 'ReAct проще и работает хорошо для задач, где следующий шаг зависит от предыдущего. Plan-and-Execute лучше для задач с параллельными шагами и когда нужно видеть "большую картину" перед выполнением.' }
      ]
    },
    {
      id: 7,
      title: 'Безопасность агентов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Агенты, которые могут выполнять реальные действия (удалять файлы, отправлять email, делать покупки) — это серьёзный риск безопасности. Безопасность должна быть встроена с самого начала.' },
        { type: 'heading', value: 'Ключевые риски агентов' },
        { type: 'list', value: [
          'Prompt injection: вредоносный текст в документе переопределяет инструкции агента',
          'Privilege escalation: агент получает доступ к данным сверх необходимого',
          'Infinite loops: агент застревает в бесконечном цикле дорогих вызовов',
          'Unintended actions: агент выполняет нежелательные действия (удаляет данные)',
          'Data exfiltration: агент отправляет приватные данные на внешние ресурсы'
        ]},
        { type: 'heading', value: 'Принципы безопасного агента' },
        { type: 'code', language: 'python', value: 'class SafeAgent:\n    def __init__(self, tools: list, max_iterations: int = 20):\n        self.tools = tools\n        self.max_iterations = max_iterations\n        self.action_log = []\n    \n    # Принцип 1: Минимальные привилегии\n    # Давайте агенту только те инструменты, которые нужны для задачи\n    def get_scoped_tools(self, task_type: str) -> list:\n        TOOL_SCOPES = {\n            "research": ["search_web", "read_file", "save_note"],\n            "coding": ["read_file", "write_file", "run_python"],\n            "email": ["read_email", "send_email"],  # НЕ удаление!\n        }\n        allowed = TOOL_SCOPES.get(task_type, [])\n        return [t for t in self.tools if t.name in allowed]\n    \n    # Принцип 2: Подтверждение опасных действий\n    DANGEROUS_TOOLS = ["delete_file", "send_email", "make_payment", "run_bash"]\n    \n    def execute_tool(self, tool_name: str, args: dict) -> str:\n        if tool_name in self.DANGEROUS_TOOLS:\n            # Human-in-the-loop: просим подтверждение\n            print(f"\\n[ТРЕБУЕТСЯ ПОДТВЕРЖДЕНИЕ]")\n            print(f"Инструмент: {tool_name}")\n            print(f"Аргументы: {args}")\n            confirm = input("Разрешить? (да/нет): ")\n            if confirm.lower() != \'да\':\n                return "Действие отменено пользователем"\n        \n        # Логируем все действия\n        self.action_log.append({\n            "tool": tool_name,\n            "args": args,\n            "timestamp": __import__(\'datetime\').datetime.utcnow().isoformat()\n        })\n        \n        return self._call_tool(tool_name, args)\n    \n    # Принцип 3: Ограничение ресурсов\n    def check_resource_limits(self):\n        if len(self.action_log) > self.max_iterations:\n            raise RuntimeError(f"Превышен лимит действий: {self.max_iterations}")\n        \n        cost_estimate = len(self.action_log) * 0.01  # $0.01 за действие примерно\n        if cost_estimate > 1.0:  # $1 лимит\n            raise RuntimeError(f"Превышен бюджет: ${cost_estimate:.2f}")' },
        { type: 'warning', value: 'Правило "минимальных привилегий" критично: если агент не должен отправлять email — не давайте ему инструмент send_email, даже если prompt injection попросит это сделать.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Простой исследовательский агент',
      type: 'practice',
      difficulty: 'hard',
      description: 'Постройте ReAct-агента для исследования темы: агент должен использовать инструменты поиска и вычислений для ответа на многошаговый вопрос.',
      requirements: [
        'Определите 3 инструмента: search(query) — мок, calculate(expr) — реальный eval, save_fact(fact) — в список',
        'Реализуйте агентный цикл с Claude через tool_use',
        'Добавьте ограничение: максимум 8 итераций',
        'Задача для агента: "Найди год основания компании Apple, вычисли сколько лет ей исполнится в 2030 году, сохрани факт об этом"',
        'Выводите каждый шаг: вызов инструмента + результат'
      ],
      expectedOutput: 'Агент должен: 1) вызвать search для года основания Apple, 2) вызвать calculate для возраста, 3) вызвать save_fact, 4) дать финальный ответ.',
      hint: 'Используйте stop_reason == "tool_use" для обнаружения вызовов инструментов. Не забудьте добавить tool_results обратно в messages со структурой {"type": "tool_result", "tool_use_id": ..., "content": ...}.',
      solution: `import anthropic

client = anthropic.Anthropic()

# Инструменты
TOOLS = [
    {
        "name": "search",
        "description": "Поиск информации в интернете.",
        "input_schema": {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "Поисковый запрос"}
            },
            "required": ["query"]
        }
    },
    {
        "name": "calculate",
        "description": "Математические вычисления. Принимает Python-выражение.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expr": {"type": "string", "description": "Python выражение"}
            },
            "required": ["expr"]
        }
    },
    {
        "name": "save_fact",
        "description": "Сохраняет найденный факт.",
        "input_schema": {
            "type": "object",
            "properties": {
                "fact": {"type": "string", "description": "Текст факта для сохранения"}
            },
            "required": ["fact"]
        }
    }
]

saved_facts = []

# Мок-данные для поиска
SEARCH_DB = {
    "apple": "Компания Apple была основана в 1976 году Стивом Джобсом, Стивом Возняком и Роном Уэйном.",
    "год основания apple": "Apple Inc. основана 1 апреля 1976 года.",
}

def execute_tool(name: str, args: dict) -> str:
    if name == "search":
        query = args["query"].lower()
        for key, value in SEARCH_DB.items():
            if key in query:
                return value
        return f"Поиск '{args['query']}': не найдено, но Apple основана в 1976 году."

    elif name == "calculate":
        try:
            result = eval(args["expr"], {"__builtins__": {}})
            return str(result)
        except Exception as e:
            return f"Ошибка вычисления: {e}"

    elif name == "save_fact":
        saved_facts.append(args["fact"])
        return f"Факт сохранён: '{args['fact']}'"

    return f"Неизвестный инструмент: {name}"

def run_agent(task: str, max_iterations: int = 8) -> str:
    messages = [{"role": "user", "content": task}]
    print(f"Задача: {task}\\n")

    for i in range(max_iterations):
        print(f"--- Итерация {i+1} ---")

        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1024,
            tools=TOOLS,
            system="Ты исследовательский агент. Используй инструменты чтобы ответить на вопрос. Все рассуждения веди на русском языке.",
            messages=messages
        )

        if response.stop_reason == "end_turn":
            final = next(
                (b.text for b in response.content if hasattr(b, "text")),
                "Нет ответа"
            )
            print(f"\\nФинальный ответ: {final}")
            print(f"\\nСохранённые факты: {saved_facts}")
            return final

        messages.append({"role": "assistant", "content": response.content})

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"Инструмент: {block.name}({block.input})")
                result = execute_tool(block.name, block.input)
                print(f"Результат: {result}")
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result
                })

        messages.append({"role": "user", "content": tool_results})

    return "Достигнут лимит итераций"

# Запуск
run_agent(
    "Найди год основания компании Apple, вычисли сколько лет ей исполнится в 2030 году и сохрани этот факт."
)`,
      explanation: 'Агент работает в цикле: отправляем запрос → Claude решает вызвать инструмент (stop_reason="tool_use") → выполняем инструмент → добавляем результат в messages → повторяем. Когда Claude имеет достаточно информации, он возвращает stop_reason="end_turn" с финальным ответом. Ключевой момент: структура сообщений соблюдает протокол Claude tool_use с правильными tool_use_id.'
    }
  ]
}
