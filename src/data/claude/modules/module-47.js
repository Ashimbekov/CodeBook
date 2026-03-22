export default {
  id: 47,
  title: 'Мультиагентные системы',
  description: 'Зачем нужны мультиагентные системы, паттерны оркестратор и супервизор, дебаты агентов, специализация (кодер + ревьюер + тестировщик), межагентная коммуникация.',
  lessons: [
    {
      id: 1,
      title: 'Зачем нужны мультиагентные системы',
      type: 'theory',
      content: [
        { type: 'text', value: 'Один агент имеет ограничения: контекстное окно, специализация, скорость. Мультиагентные системы разделяют сложные задачи между несколькими специализированными агентами, каждый из которых работает в своей области.' },
        { type: 'heading', value: 'Когда нужно несколько агентов' },
        { type: 'list', value: [
          'Задача слишком большая для одного контекстного окна',
          'Нужна параллельная обработка независимых подзадач',
          'Разные части задачи требуют разной специализации',
          'Нужна проверка и верификация (один агент делает — другой проверяет)',
          'Нужна "конкуренция идей" (несколько агентов предлагают решения)',
          'Система должна быть устойчивой к ошибкам одного агента'
        ]},
        { type: 'heading', value: 'Основные паттерны мультиагентных систем' },
        { type: 'code', language: 'python', value: '# Паттерн 1: ORCHESTRATOR\n# Главный агент управляет командой подагентов\n# Оркестратор: разбивает задачу -> делегирует -> собирает результаты\n\n# Паттерн 2: PIPELINE\n# Агенты работают последовательно, передавая результат следующему\n# Researcher -> Writer -> Editor -> Publisher\n\n# Паттерн 3: SUPERVISOR\n# Контролирующий агент проверяет работу исполнительных агентов\n# Worker делает задачу -> Supervisor проверяет -> если OK, продолжаем\n\n# Паттерн 4: DEBATE\n# Несколько агентов спорят, финальный агент выносит вердикт\n# Agent A: "Лучший алгоритм — X" -> Agent B: "Нет, Y лучше" -> Judge: выбирает\n\n# Паттерн 5: SWARM\n# Множество простых агентов без явного лидера\n# Каждый решает часть задачи, результаты объединяются\n\nprint("Паттерны мультиагентных систем изучены!")' },
        { type: 'note', value: 'Мультиагентность не всегда лучше. Один хорошо настроенный агент часто превосходит сложную систему из нескольких. Начинайте с одного агента и добавляйте агентов только когда это действительно решает реальную проблему.' }
      ]
    },
    {
      id: 2,
      title: 'Паттерн Оркестратор',
      type: 'theory',
      content: [
        { type: 'text', value: 'Оркестратор — главный агент, который принимает высокоуровневую задачу, разбивает её на подзадачи и делегирует специализированным подагентам. Он же собирает и интегрирует результаты.' },
        { type: 'heading', value: 'Реализация оркестратора' },
        { type: 'code', language: 'python', value: 'import anthropic\nimport json\nfrom typing import Callable\n\nclient = anthropic.Anthropic()\n\nclass SubAgent:\n    """Базовый специализированный подагент."""\n    def __init__(self, name: str, system: str, model: str = "claude-haiku-4-5"):\n        self.name = name\n        self.system = system\n        self.model = model\n    \n    def run(self, task: str) -> str:\n        response = client.messages.create(\n            model=self.model,\n            max_tokens=2048,\n            system=self.system,\n            messages=[{"role": "user", "content": task}]\n        )\n        return response.content[0].text\n\n\nclass OrchestratorAgent:\n    """Оркестратор, управляющий командой специализированных агентов."""\n    \n    def __init__(self, subagents: dict):\n        self.subagents = subagents  # {"name": SubAgent}\n        self.results = {}\n    \n    def _plan(self, task: str) -> list:\n        """Просим оркестратора составить план."""\n        agents_desc = "\\n".join(\n            f"- {name}: {agent.system[:100]}"\n            for name, agent in self.subagents.items()\n        )\n        \n        response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=1000,\n            system="Ты оркестратор. Разбиваешь задачи на подзадачи для специалистов.",\n            messages=[{\n                "role": "user",\n                "content": f"""Задача: {task}\n\nДоступные агенты:\n{agents_desc}\n\nСоставь план выполнения в JSON:\n[\n  {{"agent": "имя_агента", "task": "подзадача", "depends_on": []}},\n  ...\n]\nТолько JSON, без объяснений."""\n            }]\n        )\n        \n        try:\n            plan_text = response.content[0].text.strip()\n            # Убираем markdown если есть\n            if plan_text.startswith("```"):\n                plan_text = plan_text.split("\\n", 1)[1].rsplit("```", 1)[0]\n            return json.loads(plan_text)\n        except json.JSONDecodeError:\n            # Fallback: выполняем всеми агентами\n            return [{"agent": name, "task": task} for name in self.subagents]\n    \n    def run(self, task: str) -> str:\n        print(f"\\nОркестратор получил задачу: {task}\\n")\n        \n        # Планируем\n        plan = self._plan(task)\n        print(f"План ({len(plan)} шагов):")\n        for step in plan:\n            print(f"  - [{step[\'agent\']}]: {step[\'task\'][:60]}")\n        \n        # Выполняем\n        results = {}\n        for step in plan:\n            agent_name = step["agent"]\n            subtask = step["task"]\n            \n            if agent_name not in self.subagents:\n                continue\n            \n            # Добавляем контекст из предыдущих результатов\n            context = ""\n            if results:\n                context = "\\n\\nКонтекст от других агентов:\\n" + "\\n".join(\n                    f"[{k}]: {v[:300]}..." for k, v in results.items()\n                )\n            \n            print(f"\\nВыполняю: [{agent_name}]")\n            result = self.subagents[agent_name].run(subtask + context)\n            results[agent_name] = result\n            print(f"Результат: {result[:100]}...")\n        \n        # Синтез\n        synthesis_prompt = f"""Задача: {task}\n\nРезультаты команды:\n""" + "\\n\\n".join(f"[{k}]:\\n{v}" for k, v in results.items()) + "\\n\\nСинтезируй финальный ответ."\n        \n        final_response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=2048,\n            messages=[{"role": "user", "content": synthesis_prompt}]\n        )\n        \n        return final_response.content[0].text' }
      ]
    },
    {
      id: 3,
      title: 'Паттерн Супервизор',
      type: 'theory',
      content: [
        { type: 'text', value: 'Паттерн Supervisor: исполняющий агент (Worker) делает работу, контролирующий агент (Supervisor) проверяет качество. Если качество недостаточно — Worker делает повторно с учётом замечаний.' },
        { type: 'code', language: 'python', value: 'import anthropic\nfrom dataclasses import dataclass\nfrom typing import Optional\n\nclient = anthropic.Anthropic()\n\n@dataclass\nclass ReviewResult:\n    approved: bool\n    score: float  # 0-10\n    feedback: str\n    suggestions: list\n\nclass SupervisorAgent:\n    def __init__(self, criteria: list):\n        self.criteria = criteria  # критерии оценки\n    \n    def review(self, task: str, result: str) -> ReviewResult:\n        criteria_text = "\\n".join(f"- {c}" for c in self.criteria)\n        \n        response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=500,\n            system="Ты строгий супервизор. Оценивай объективно, 0-10.",\n            messages=[{\n                "role": "user",\n                "content": f"""Задача: {task}\n\nРезультат работника:\n{result}\n\nКритерии оценки:\n{criteria_text}\n\nОцени и ответь в JSON:\n{{"approved": true/false, "score": 8.5, "feedback": "...", "suggestions": ["..."]}}"""\n            }]\n        )\n        \n        import json, re\n        text = response.content[0].text.strip()\n        # Извлекаем JSON\n        json_match = re.search(r\'\\{.*\\}\', text, re.DOTALL)\n        if json_match:\n            data = json.loads(json_match.group())\n            return ReviewResult(**data)\n        return ReviewResult(approved=True, score=7.0, feedback=text, suggestions=[])\n\n\nclass WorkerAgent:\n    def __init__(self, specialization: str):\n        self.specialization = specialization\n    \n    def work(self, task: str, previous_feedback: str = None) -> str:\n        prompt = task\n        if previous_feedback:\n            prompt += f"\\n\\nПредыдущая попытка не прошла ревью.\\nЗамечания: {previous_feedback}\\nИсправь согласно замечаниям."\n        \n        response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=2048,\n            system=f"Ты {self.specialization}. Выполняй задачи качественно.",\n            messages=[{"role": "user", "content": prompt}]\n        )\n        return response.content[0].text\n\n\ndef supervisor_loop(\n    task: str,\n    worker: WorkerAgent,\n    supervisor: SupervisorAgent,\n    min_score: float = 7.0,\n    max_attempts: int = 3\n) -> str:\n    """Цикл worker-supervisor с итеративным улучшением."""\n    \n    feedback = None\n    for attempt in range(max_attempts):\n        print(f"\\nПопытка {attempt + 1}/{max_attempts}")\n        \n        # Worker выполняет задачу\n        result = worker.work(task, feedback)\n        print(f"Worker: {result[:100]}...")\n        \n        # Supervisor проверяет\n        review = supervisor.review(task, result)\n        print(f"Supervisor: оценка={review.score}, одобрено={review.approved}")\n        \n        if review.approved and review.score >= min_score:\n            print(f"Принято! Оценка: {review.score}")\n            return result\n        \n        # Передаём обратную связь для следующей попытки\n        feedback = f"{review.feedback}\\nСоветы: {\', \'.join(review.suggestions)}"\n        print(f"Отклонено: {review.feedback[:100]}")\n    \n    print("Достигнут лимит попыток, возвращаем последний результат")\n    return result' }
      ]
    },
    {
      id: 4,
      title: 'Паттерн Дебаты',
      type: 'theory',
      content: [
        { type: 'text', value: 'Паттерн Debate: несколько агентов высказывают аргументы за разные подходы, затем агент-судья анализирует аргументы и выносит взвешенное решение. Полезен для сложных решений с неочевидным ответом.' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\nclass DebateSystem:\n    """Система дебатов для принятия взвешенных решений."""\n    \n    def __init__(self, perspectives: list):\n        """\n        perspectives: список точек зрения\n        Например: ["оптимист", "скептик", "прагматик"]\n        """\n        self.perspectives = perspectives\n    \n    def _argue(self, question: str, perspective: str, \n                previous_arguments: list = None) -> str:\n        """Агент отстаивает свою точку зрения."""\n        context = ""\n        if previous_arguments:\n            context = "\\n\\nАргументы других участников:\\n" + "\\n".join(\n                f"[{p}]: {a[:300]}" for p, a in previous_arguments\n            )\n        \n        response = client.messages.create(\n            model="claude-haiku-4-5",\n            max_tokens=400,\n            system=f"""Ты {perspective}. Аргументируй с позиции {perspective}.\nБудь конкретным. Приводи реальные аргументы, не общие фразы.""",\n            messages=[{\n                "role": "user",\n                "content": f"Вопрос: {question}{context}\\n\\nВырази своё мнение."\n            }]\n        )\n        return response.content[0].text\n    \n    def _judge(self, question: str, debate: list) -> str:\n        """Судья анализирует все аргументы и выносит решение."""\n        debate_text = "\\n\\n".join(\n            f"[{perspective}]:\\n{argument}"\n            for perspective, argument in debate\n        )\n        \n        response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=1000,\n            system="Ты беспристрастный судья. Анализируй все аргументы и делай взвешенное заключение.",\n            messages=[{\n                "role": "user",\n                "content": f"""Вопрос: {question}\n\nДебаты:\n{debate_text}\n\nПроанализируй все аргументы и дай взвешенное заключение:\n1. Какие аргументы наиболее убедительны?\n2. Что упускают участники дебатов?\n3. Твоё итоговое рекомендованное решение"""\n            }]\n        )\n        return response.content[0].text\n    \n    def debate(self, question: str, rounds: int = 2) -> dict:\n        """Проводит N раундов дебатов."""\n        print(f"Вопрос: {question}\\n")\n        all_arguments = []  # (perspective, argument)\n        \n        for round_num in range(rounds):\n            print(f"Раунд {round_num + 1}:")\n            round_args = []\n            \n            for perspective in self.perspectives:\n                print(f"  {perspective} говорит...")\n                argument = self._argue(\n                    question, perspective,\n                    previous_arguments=all_arguments if round_num > 0 else None\n                )\n                round_args.append((perspective, argument))\n                all_arguments.append((perspective, argument))\n                print(f"  -> {argument[:80]}...")\n        \n        print("\\nСудья выносит решение...")\n        verdict = self._judge(question, all_arguments)\n        \n        return {\n            "question": question,\n            "debate": all_arguments,\n            "verdict": verdict\n        }\n\n# Пример\ndebate = DebateSystem(["оптимист", "скептик", "технический эксперт"])\nresult = debate.debate(\n    "Стоит ли компании переходить на микросервисную архитектуру?"\n)\nprint("\\n=== РЕШЕНИЕ СУДЬИ ===")\nprint(result["verdict"])' }
      ]
    },
    {
      id: 5,
      title: 'Специализация: Кодер + Ревьюер + Тестировщик',
      type: 'theory',
      content: [
        { type: 'text', value: 'Классический пример мультиагентной системы для разработки: три специализированных агента. Coder пишет код, Reviewer делает ревью, Tester пишет тесты. Вместе они обеспечивают качество.' },
        { type: 'code', language: 'python', value: 'import anthropic\nimport subprocess\nimport tempfile\nimport os\n\nclient = anthropic.Anthropic()\n\ndef run_code(code: str) -> tuple:\n    """Выполняет Python-код, возвращает (stdout, stderr, exitcode)."""\n    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:\n        f.write(code)\n        tmp = f.name\n    try:\n        result = subprocess.run(\n            ["python", tmp], capture_output=True, text=True, timeout=10\n        )\n        return result.stdout, result.stderr, result.returncode\n    except subprocess.TimeoutExpired:\n        return "", "Timeout", 1\n    finally:\n        os.unlink(tmp)\n\ndef coder_agent(task: str, feedback: str = None) -> str:\n    """Агент-разработчик: пишет реализацию."""\n    prompt = task\n    if feedback:\n        prompt += f"\\n\\nЗамечания ревьюера:\\n{feedback}\\n\\nИсправь код."\n    \n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=2048,\n        system="Ты senior Python-разработчик. Пиши чистый, эффективный код с типами и docstring.",\n        messages=[{"role": "user", "content": prompt}]\n    )\n    return response.content[0].text\n\ndef reviewer_agent(code: str) -> dict:\n    """Агент-ревьюер: проверяет качество кода."""\n    import json\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=800,\n        system="Ты строгий code reviewer. Ищи баги, нарушения стиля, проблемы безопасности.",\n        messages=[{\n            "role": "user",\n            "content": f"Проверь код:\\n```python\\n{code}\\n```\\n"\n                       f"Ответь JSON: {{\\\"approved\\\": true/false, \\\"issues\\\": [\\\"...\\\"], \\\"suggestions\\\": [\\\"...\\\"]}}" \n        }]\n    )\n    try:\n        import re\n        match = re.search(r\'\\{.*\\}\', response.content[0].text, re.DOTALL)\n        if match:\n            return json.loads(match.group())\n    except:\n        pass\n    return {"approved": True, "issues": [], "suggestions": []}\n\ndef tester_agent(code: str, task_description: str) -> str:\n    """Агент-тестировщик: пишет тесты."""\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=2048,\n        system="Ты QA инженер. Пиши исчерпывающие pytest-тесты.",\n        messages=[{\n            "role": "user",\n            "content": f"Напиши тесты для:\\n{task_description}\\n\\nКод:\\n```python\\n{code}\\n```\\n"\n                       f"Покрой: нормальные случаи, граничные, ошибки. Только код тестов."\n        }]\n    )\n    return response.content[0].text\n\ndef development_pipeline(task: str) -> dict:\n    """Полный пайплайн разработки: Code -> Review -> Test -> Run."""\n    import re\n    \n    print(f"Задача: {task}\\n")\n    \n    # 1. Разработка\n    print("1. Coder пишет код...")\n    code_raw = coder_agent(task)\n    # Извлекаем код из markdown\n    code_match = re.search(r\'```python\\n(.+?)```\', code_raw, re.DOTALL)\n    code = code_match.group(1) if code_match else code_raw\n    \n    # 2. Ревью с итерацией\n    for review_attempt in range(2):\n        print(f"\\n2. Reviewer проверяет (попытка {review_attempt+1})...")\n        review = reviewer_agent(code)\n        print(f"   Одобрено: {review[\'approved\']}")\n        if review.get("issues"):\n            print(f"   Замечания: {review[\'issues\'][:2]}")\n        \n        if review["approved"] or not review.get("issues"):\n            break\n        \n        # Переделываем с учётом замечаний\n        feedback = "\\n".join(review.get("issues", []))\n        print("   Coder исправляет...")\n        code_raw = coder_agent(task, feedback)\n        code_match = re.search(r\'```python\\n(.+?)```\', code_raw, re.DOTALL)\n        code = code_match.group(1) if code_match else code_raw\n    \n    # 3. Тесты\n    print("\\n3. Tester пишет тесты...")\n    tests_raw = tester_agent(code, task)\n    test_match = re.search(r\'```python\\n(.+?)```\', tests_raw, re.DOTALL)\n    tests = test_match.group(1) if test_match else tests_raw\n    \n    # 4. Запуск тестов\n    print("\\n4. Запуск тестов...")\n    stdout, stderr, exitcode = run_code(code + "\\n\\n" + tests)\n    print(f"   Exit code: {exitcode}")\n    if stdout:\n        print(f"   Output: {stdout[:200]}")\n    \n    return {\n        "code": code,\n        "tests": tests,\n        "review": review,\n        "test_result": {"exitcode": exitcode, "stdout": stdout, "stderr": stderr}\n    }' }
      ]
    },
    {
      id: 6,
      title: 'Межагентная коммуникация',
      type: 'theory',
      content: [
        { type: 'text', value: 'Агенты в мультиагентной системе должны общаться: передавать задачи, обмениваться результатами, сигнализировать об ошибках. Правильная коммуникация — ключ к слаженной работе системы.' },
        { type: 'heading', value: 'Форматы межагентных сообщений' },
        { type: 'code', language: 'python', value: 'from dataclasses import dataclass, field\nfrom typing import Any, Optional\nfrom enum import Enum\nimport uuid\nfrom datetime import datetime\n\nclass MessageType(Enum):\n    TASK = "task"          # задание для агента\n    RESULT = "result"      # результат выполнения\n    ERROR = "error"        # ошибка\n    STATUS = "status"      # статус выполнения\n    QUERY = "query"        # запрос информации у другого агента\n    RESPONSE = "response"  # ответ на запрос\n\n@dataclass\nclass AgentMessage:\n    sender: str\n    recipient: str\n    msg_type: MessageType\n    content: Any\n    message_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])\n    reply_to: Optional[str] = None\n    timestamp: str = field(default_factory=lambda: datetime.utcnow().isoformat())\n    metadata: dict = field(default_factory=dict)\n\nclass MessageBus:\n    """Шина сообщений для межагентной коммуникации."""\n    \n    def __init__(self):\n        self.queues = {}  # agent_name -> list of messages\n        self.history = []\n    \n    def register_agent(self, agent_name: str):\n        self.queues[agent_name] = []\n    \n    def send(self, message: AgentMessage):\n        if message.recipient not in self.queues:\n            raise ValueError(f"Агент {message.recipient} не зарегистрирован")\n        self.queues[message.recipient].append(message)\n        self.history.append(message)\n        print(f"[Bus] {message.sender} -> {message.recipient}: "\n              f"{message.msg_type.value} | {str(message.content)[:50]}")\n    \n    def receive(self, agent_name: str) -> Optional[AgentMessage]:\n        if not self.queues.get(agent_name):\n            return None\n        return self.queues[agent_name].pop(0)\n    \n    def receive_all(self, agent_name: str) -> list:\n        msgs = list(self.queues.get(agent_name, []))\n        self.queues[agent_name] = []\n        return msgs\n\n# Пример коммуникации\nbus = MessageBus()\nbus.register_agent("planner")\nbus.register_agent("coder")\nbus.register_agent("reviewer")\n\n# Planner отправляет задачу Coder-у\nbus.send(AgentMessage(\n    sender="planner",\n    recipient="coder",\n    msg_type=MessageType.TASK,\n    content={"task": "Напиши функцию сортировки", "priority": "high"}\n))\n\n# Coder выполняет и отправляет на ревью\nbus.send(AgentMessage(\n    sender="coder",\n    recipient="reviewer",\n    msg_type=MessageType.RESULT,\n    content={"code": "def sort(lst): return sorted(lst)"},\n    reply_to="task_id_123"\n))' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Мультиагентный исследователь',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте систему из трёх агентов: Planner разбивает задачу на части, два Worker работают параллельно (каждый над своей частью), Synthesizer объединяет результаты.',
      requirements: [
        'Реализуйте 4 класса: PlannerAgent, WorkerAgent, SynthesizerAgent, MultiAgentSystem',
        'PlannerAgent: разбивает задачу на 2-3 подзадачи через Claude',
        'WorkerAgent: выполняет одну подзадачу через Claude (2 инстанса с разными именами)',
        'SynthesizerAgent: объединяет все результаты в единый ответ',
        'MultiAgentSystem: оркестрирует всё, выводит лог каждого шага',
        'Задача для теста: "Исследуй плюсы и минусы Python vs JavaScript для веб-разработки"'
      ],
      expectedOutput: 'Система запускает 3 агентов, каждый выполняет свою роль, финальный ответ объединяет работу всех агентов.',
      hint: 'Используйте threading.Thread для параллельного запуска Workers, но помните что результаты нужно собрать до Synthesizer. Список results и threading.Lock() для безопасности.',
      solution: `import anthropic
import threading

client = anthropic.Anthropic()

class PlannerAgent:
    def plan(self, task: str) -> list:
        response = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=400,
            system="Ты планировщик. Разбивай задачи на 2-3 независимые подзадачи.",
            messages=[{
                "role": "user",
                "content": f"Разбей на 2-3 подзадачи (каждая с новой строки, формат: '1. подзадача'):\\n{task}"
            }]
        )
        text = response.content[0].text
        subtasks = []
        for line in text.splitlines():
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith("-")):
                # Убираем номер/маркер
                clean = line.lstrip("0123456789.-) ").strip()
                if clean:
                    subtasks.append(clean)
        return subtasks[:3] if subtasks else [task]

class WorkerAgent:
    def __init__(self, name: str, specialty: str = "исследователь"):
        self.name = name
        self.specialty = specialty

    def work(self, subtask: str) -> str:
        response = client.messages.create(
            model="claude-haiku-4-5",
            max_tokens=600,
            system=f"Ты {self.specialty}. Отвечай подробно и структурированно.",
            messages=[{"role": "user", "content": subtask}]
        )
        return response.content[0].text

class SynthesizerAgent:
    def synthesize(self, original_task: str, results: dict) -> str:
        results_text = "\\n\\n".join(
            f"[Часть {i+1} — {name}]:\\n{text}"
            for i, (name, text) in enumerate(results.items())
        )
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=1500,
            system="Ты синтезатор. Объединяй результаты в целостный, хорошо структурированный ответ.",
            messages=[{
                "role": "user",
                "content": f"Исходная задача: {original_task}\\n\\nРаботы агентов:\\n{results_text}\\n\\nСоздай итоговый ответ."
            }]
        )
        return response.content[0].text

class MultiAgentSystem:
    def __init__(self):
        self.planner = PlannerAgent()
        self.workers = [
            WorkerAgent("Аналитик-1", "аналитик и исследователь"),
            WorkerAgent("Аналитик-2", "технический эксперт"),
        ]
        self.synthesizer = SynthesizerAgent()

    def run(self, task: str) -> str:
        print(f"Задача: {task}\\n")

        # 1. Планирование
        print("=== Planner планирует ===")
        subtasks = self.planner.plan(task)
        for i, st in enumerate(subtasks, 1):
            print(f"  Подзадача {i}: {st[:80]}")

        # 2. Параллельное выполнение
        print("\\n=== Workers работают параллельно ===")
        results = {}
        lock = threading.Lock()

        def worker_run(worker, subtask):
            print(f"  [{worker.name}] начал: {subtask[:60]}...")
            result = worker.work(subtask)
            with lock:
                results[worker.name] = result
            print(f"  [{worker.name}] завершил ({len(result)} символов)")

        threads = []
        for i, subtask in enumerate(subtasks):
            worker = self.workers[i % len(self.workers)]
            t = threading.Thread(target=worker_run, args=(worker, subtask))
            threads.append(t)
            t.start()

        for t in threads:
            t.join()

        print(f"\\nВсе workers завершили: {len(results)} результатов")

        # 3. Синтез
        print("\\n=== Synthesizer объединяет ===")
        final = self.synthesizer.synthesize(task, results)
        print(f"Финальный ответ готов ({len(final)} символов)")

        return final

# Тест
system = MultiAgentSystem()
result = system.run(
    "Исследуй плюсы и минусы Python vs JavaScript для веб-разработки"
)
print("\\n===== ИТОГОВЫЙ ОТВЕТ =====")
print(result)`,
      explanation: 'Система реализует pipeline-паттерн с параллельным выполнением: Planner разбивает задачу на подзадачи, Workers выполняют их параллельно через threading.Thread (что ускоряет работу для IO-bound задач вроде API-вызовов), Synthesizer собирает результаты в единый ответ. Lock обеспечивает потокобезопасную запись в общий словарь results.'
    }
  ]
}
