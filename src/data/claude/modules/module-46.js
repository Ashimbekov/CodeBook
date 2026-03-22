export default {
  id: 46,
  title: 'AI-ассистент для кода',
  description: 'Понимание кода, генерация по контексту репозитория, инструменты для работы с файловой системой, запуск тестов, интеграция с git и построение полноценного code assistant.',
  lessons: [
    {
      id: 1,
      title: 'Понимание кода: анализ и объяснение',
      type: 'theory',
      content: [
        { type: 'text', value: 'AI-ассистент для кода — это агент, который понимает кодовую базу и помогает разработчику: объясняет код, находит баги, генерирует новый код в стиле проекта, пишет тесты, делает ревью.' },
        { type: 'heading', value: 'Задачи AI code assistant' },
        { type: 'list', value: [
          'Code explanation: объяснение что делает функция/класс/файл',
          'Bug detection: нахождение потенциальных проблем',
          'Code generation: написание новых функций по описанию',
          'Refactoring: улучшение существующего кода',
          'Test generation: написание unit-тестов',
          'Documentation: генерация docstring и README',
          'Code review: анализ PR с замечаниями'
        ]},
        { type: 'heading', value: 'Базовый анализатор кода' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\ndef analyze_code(code: str, question: str = "Что делает этот код?") -> str:\n    """Анализирует код и отвечает на вопрос о нём."""\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=2048,\n        system="""Ты опытный code reviewer. Анализируй код внимательно.\nДавай чёткие, практичные советы. Указывай конкретные строки при объяснении.""",\n        messages=[{\n            "role": "user",\n            "content": f"Код:\\n```python\\n{code}\\n```\\n\\n{question}"\n        }]\n    )\n    return response.content[0].text\n\n# Примеры использования\nsample_code = """\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)\n"""\n\nprint("ОБЪЯСНЕНИЕ:")\nprint(analyze_code(sample_code, "Объясни код и найди проблемы с производительностью"))\n\nprint("\\nОПТИМИЗАЦИЯ:")\nprint(analyze_code(sample_code, "Оптимизируй этот код. Покажи улучшенную версию с объяснением."))' },
        { type: 'tip', value: 'Указывайте язык программирования в запросе или через тег языка в коде. Claude лучше анализирует Python-код когда знает что это Python, а не угадывает.' }
      ]
    },
    {
      id: 2,
      title: 'Пайплайн генерации кода',
      type: 'theory',
      content: [
        { type: 'text', value: 'Качественная генерация кода требует контекста: соглашения проекта, используемые библиотеки, стиль кодирования. Без контекста Claude генерирует "generic" код, не подходящий для вашего проекта.' },
        { type: 'heading', value: 'Контекст для генерации' },
        { type: 'code', language: 'python', value: 'import ast\nimport os\nfrom pathlib import Path\n\ndef extract_project_context(project_dir: str) -> dict:\n    """Извлекает контекст из проекта для более релевантной генерации."""\n    context = {\n        "structure": [],\n        "imports": set(),\n        "conventions": []\n    }\n    \n    project_path = Path(project_dir)\n    \n    # Структура проекта\n    for f in project_path.rglob("*.py"):\n        if "__pycache__" not in str(f) and ".venv" not in str(f):\n            context["structure"].append(str(f.relative_to(project_path)))\n    \n    # Анализируем imports\n    for py_file in list(project_path.rglob("*.py"))[:10]:  # первые 10 файлов\n        try:\n            with open(py_file) as f:\n                tree = ast.parse(f.read())\n            for node in ast.walk(tree):\n                if isinstance(node, ast.Import):\n                    for alias in node.names:\n                        context["imports"].add(alias.name.split(".")[0])\n                elif isinstance(node, ast.ImportFrom):\n                    if node.module:\n                        context["imports"].add(node.module.split(".")[0])\n        except:\n            pass\n    \n    return context\n\ndef generate_code_with_context(\n    task: str,\n    context: dict,\n    existing_code: str = None\n) -> str:\n    """Генерирует код с учётом контекста проекта."""\n    client = anthropic.Anthropic()\n    \n    context_text = f"""\nСтруктура проекта:\n{chr(10).join(context[\'structure\'][:20])}\n\nИспользуемые библиотеки: {\', \'.join(sorted(context[\'imports\']))}\n\"\"\"\n    \n    prompt_parts = [f"Контекст проекта:\\n{context_text}"]\n    \n    if existing_code:\n        prompt_parts.append(f"Существующий код для справки:\\n```python\\n{existing_code}\\n```")\n    \n    prompt_parts.append(f"Задача: {task}")\n    prompt_parts.append("Напиши код в стиле проекта. Только код, без лишних объяснений.")\n    \n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=2048,\n        system="Ты опытный Python-разработчик. Пиши чистый, pythonic код.",\n        messages=[{"role": "user", "content": "\\n\\n".join(prompt_parts)}]\n    )\n    return response.content[0].text' }
      ]
    },
    {
      id: 3,
      title: 'Инструменты для работы с файловой системой',
      type: 'theory',
      content: [
        { type: 'text', value: 'Code assistant должен уметь читать файлы проекта, анализировать структуру директорий и безопасно записывать сгенерированный код. Необходима защита от нежелательных изменений.' },
        { type: 'heading', value: 'Файловые инструменты для агента' },
        { type: 'code', language: 'python', value: 'import os\nfrom pathlib import Path\nfrom typing import Optional\n\nclass SafeFileSystem:\n    """Безопасная работа с файловой системой для AI-агентов."""\n    \n    def __init__(self, allowed_root: str, readonly: bool = False):\n        self.root = Path(allowed_root).resolve()\n        self.readonly = readonly\n        self.IGNORED = {\'__pycache__\', \'.git\', \'.venv\', \'node_modules\', \'.idea\'}\n        self.MAX_FILE_SIZE = 100 * 1024  # 100KB\n    \n    def _check_path(self, path: str) -> Path:\n        """Проверяет что путь внутри allowed_root."""\n        full_path = (self.root / path).resolve()\n        # Security: запрещаем выход за пределы root\n        if not str(full_path).startswith(str(self.root)):\n            raise PermissionError(f"Доступ запрещён: {path} вне разрешённой директории")\n        return full_path\n    \n    def list_directory(self, path: str = ".") -> dict:\n        """Список файлов и директорий."""\n        full_path = self._check_path(path)\n        if not full_path.is_dir():\n            return {"error": f"{path} не является директорией"}\n        \n        files, dirs = [], []\n        for item in sorted(full_path.iterdir()):\n            if item.name in self.IGNORED:\n                continue\n            if item.is_dir():\n                dirs.append(item.name + "/")\n            else:\n                files.append(f"{item.name} ({item.stat().st_size} байт)")\n        \n        return {"directories": dirs, "files": files, "path": str(path)}\n    \n    def read_file(self, path: str) -> str:\n        """Читает файл."""\n        full_path = self._check_path(path)\n        if not full_path.is_file():\n            return f"Ошибка: файл {path} не найден"\n        \n        size = full_path.stat().st_size\n        if size > self.MAX_FILE_SIZE:\n            return f"Ошибка: файл {path} слишком большой ({size} байт > {self.MAX_FILE_SIZE})"\n        \n        try:\n            return full_path.read_text(encoding="utf-8")\n        except UnicodeDecodeError:\n            return f"Ошибка: файл {path} не является текстовым"\n    \n    def write_file(self, path: str, content: str) -> str:\n        """Записывает файл (только если не readonly)."""\n        if self.readonly:\n            return "Ошибка: файловая система в режиме только для чтения"\n        \n        full_path = self._check_path(path)\n        full_path.parent.mkdir(parents=True, exist_ok=True)\n        full_path.write_text(content, encoding="utf-8")\n        return f"Файл {path} успешно записан ({len(content)} символов)"\n    \n    def search_in_files(self, pattern: str, file_extension: str = ".py") -> list:\n        """Поиск по содержимому файлов."""\n        import re\n        matches = []\n        for f in self.root.rglob(f"*{file_extension}"):\n            if any(ign in str(f) for ign in self.IGNORED):\n                continue\n            try:\n                content = f.read_text(encoding="utf-8", errors="ignore")\n                if re.search(pattern, content):\n                    # Находим строки с совпадением\n                    for i, line in enumerate(content.splitlines(), 1):\n                        if re.search(pattern, line):\n                            matches.append({\n                                "file": str(f.relative_to(self.root)),\n                                "line": i,\n                                "content": line.strip()\n                            })\n            except:\n                pass\n        return matches[:50]  # максимум 50 результатов' }
      ]
    },
    {
      id: 4,
      title: 'Запуск тестов',
      type: 'theory',
      content: [
        { type: 'text', value: 'AI code assistant должен уметь запускать тесты и интерпретировать их результаты. Это позволяет агенту проверять свой же сгенерированный код и итерировать до получения рабочего решения.' },
        { type: 'heading', value: 'Безопасное выполнение кода' },
        { type: 'code', language: 'python', value: 'import subprocess\nimport tempfile\nimport os\nfrom typing import Tuple\n\nclass CodeRunner:\n    """Безопасный запуск кода и тестов."""\n    \n    TIMEOUT = 30  # секунд\n    \n    def run_python(self, code: str) -> Tuple[str, str, int]:\n        """\n        Выполняет Python-код в изолированном процессе.\n        Возвращает (stdout, stderr, return_code).\n        """\n        with tempfile.NamedTemporaryFile(\n            mode="w", suffix=".py", delete=False, encoding="utf-8"\n        ) as f:\n            f.write(code)\n            tmp_path = f.name\n        \n        try:\n            result = subprocess.run(\n                ["python", tmp_path],\n                capture_output=True,\n                text=True,\n                timeout=self.TIMEOUT,\n                env={**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}\n            )\n            return result.stdout, result.stderr, result.returncode\n        except subprocess.TimeoutExpired:\n            return "", f"Таймаут: выполнение превысило {self.TIMEOUT} секунд", 1\n        finally:\n            os.unlink(tmp_path)\n    \n    def run_pytest(self, test_path: str, project_dir: str) -> dict:\n        """Запускает pytest и парсит результаты."""\n        try:\n            result = subprocess.run(\n                ["python", "-m", "pytest", test_path, "-v", "--tb=short",\n                 "--no-header", "-q"],\n                capture_output=True,\n                text=True,\n                timeout=60,\n                cwd=project_dir\n            )\n            \n            # Парсим результат\n            output = result.stdout + result.stderr\n            lines = output.splitlines()\n            \n            # Ищем строку с итогами типа "3 passed, 1 failed"\n            summary_line = next(\n                (l for l in reversed(lines) if "passed" in l or "failed" in l or "error" in l),\n                "Нет информации"\n            )\n            \n            return {\n                "success": result.returncode == 0,\n                "output": output[:3000],  # ограничиваем размер\n                "summary": summary_line,\n                "returncode": result.returncode\n            }\n        except subprocess.TimeoutExpired:\n            return {"success": False, "output": "Таймаут", "summary": "timeout"}\n    \n    def generate_and_test(self, task: str, test_code: str) -> dict:\n        """Генерирует реализацию и проверяет тестами."""\n        client = anthropic.Anthropic()\n        \n        for attempt in range(3):  # 3 попытки\n            # Генерируем реализацию\n            response = client.messages.create(\n                model="claude-opus-4-5",\n                max_tokens=2048,\n                messages=[{\n                    "role": "user",\n                    "content": f"Реализуй задачу. Только код без объяснений.\\n"\n                               f"Задача: {task}\\n"\n                               f"Тесты:\\n```python\\n{test_code}\\n```"\n                }]\n            )\n            \n            impl_code = response.content[0].text\n            # Извлекаем код из markdown блоков если есть\n            import re\n            code_match = re.search(r\'```python\\n(.+?)```\', impl_code, re.DOTALL)\n            if code_match:\n                impl_code = code_match.group(1)\n            \n            # Запускаем тесты\n            full_code = impl_code + "\\n\\n" + test_code\n            stdout, stderr, code = self.run_python(full_code)\n            \n            if code == 0:\n                return {"success": True, "code": impl_code, "attempts": attempt + 1}\n            \n            # Добавляем ошибку в следующий запрос\n            task = f"{task}\\n\\nПредыдущая попытка не прошла тесты. Ошибка:\\n{stderr}\\n\\nИсправь код."\n        \n        return {"success": False, "code": impl_code, "attempts": 3}' }
      ]
    },
    {
      id: 5,
      title: 'Git-интеграция',
      type: 'theory',
      content: [
        { type: 'text', value: 'Интеграция с git позволяет агенту понимать изменения в коде: какие файлы изменились, что добавлено, что удалено. Это полезно для code review, генерации commit messages и анализа diff.' },
        { type: 'heading', value: 'Git-инструменты для агента' },
        { type: 'code', language: 'python', value: 'import subprocess\nfrom pathlib import Path\n\nclass GitTools:\n    def __init__(self, repo_path: str):\n        self.repo = Path(repo_path)\n    \n    def _git(self, *args) -> str:\n        """Выполняет git команду."""\n        try:\n            result = subprocess.run(\n                ["git", *args],\n                capture_output=True, text=True,\n                cwd=self.repo, timeout=10\n            )\n            return result.stdout.strip()\n        except Exception as e:\n            return f"Git ошибка: {e}"\n    \n    def get_diff(self, staged: bool = False) -> str:\n        """Получает текущий diff."""\n        args = ["diff"]\n        if staged:\n            args.append("--staged")\n        return self._git(*args)\n    \n    def get_recent_commits(self, n: int = 5) -> list:\n        """Последние N коммитов."""\n        log = self._git("log", f"-{n}", "--pretty=format:%H|%an|%ad|%s", "--date=short")\n        if not log:\n            return []\n        result = []\n        for line in log.splitlines():\n            parts = line.split("|", 3)\n            if len(parts) == 4:\n                result.append({\n                    "hash": parts[0][:8],\n                    "author": parts[1],\n                    "date": parts[2],\n                    "message": parts[3]\n                })\n        return result\n    \n    def get_changed_files(self) -> list:\n        """Список изменённых файлов."""\n        status = self._git("status", "--porcelain")\n        files = []\n        for line in status.splitlines():\n            if line.strip():\n                status_code = line[:2].strip()\n                filename = line[3:].strip()\n                files.append({"status": status_code, "file": filename})\n        return files\n    \n    def generate_commit_message(self) -> str:\n        """Генерирует commit message через Claude."""\n        diff = self.get_diff(staged=True)\n        if not diff:\n            diff = self.get_diff(staged=False)\n        \n        if not diff:\n            return "Нет изменений для коммита"\n        \n        # Ограничиваем размер diff\n        diff_truncated = diff[:4000] + ("...\\n[diff обрезан]" if len(diff) > 4000 else "")\n        \n        client = anthropic.Anthropic()\n        response = client.messages.create(\n            model="claude-haiku-4-5",\n            max_tokens=200,\n            messages=[{\n                "role": "user",\n                "content": f"Напиши commit message в формате Conventional Commits "\n                           f"(feat/fix/docs/refactor/test/chore: короткое описание)\\n"\n                           f"Только одну строку.\\n\\nDiff:\\n{diff_truncated}"\n            }]\n        )\n        return response.content[0].text.strip()\n    \n    def review_diff(self) -> str:\n        """Code review текущего diff через Claude."""\n        diff = self.get_diff()\n        if not diff:\n            return "Нет изменений для ревью"\n        \n        client = anthropic.Anthropic()\n        response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=2048,\n            system="Ты опытный code reviewer. Давай конкретные замечания с номерами строк.",\n            messages=[{\n                "role": "user",\n                "content": f"Сделай code review этого diff.\\n"\n                           f"Найди: баги, проблемы безопасности, нарушения стиля.\\n\\n"\n                           f"```diff\\n{diff[:6000]}\\n```"\n            }]\n        )\n        return response.content[0].text' }
      ]
    },
    {
      id: 6,
      title: 'Архитектура code assistant',
      type: 'theory',
      content: [
        { type: 'text', value: 'Полный code assistant объединяет все инструменты в единого агента: он читает файлы, анализирует код, генерирует решения, запускает тесты и работает с git — всё в рамках одного агентного цикла.' },
        { type: 'list', items: [
          'SafeFileSystem ограничивает агента разрешённой директорией — защита от выхода за пределы проекта через path traversal',
          'CodeRunner запускает код в отдельном процессе с таймаутом — агент может проверять свой же сгенерированный код',
          'GitTools позволяет агенту читать diff, историю коммитов и статус — контекст изменений для code review',
          'Агентный цикл: агент вызывает инструменты итеративно до получения ответа — это tool_use -> tool_result -> следующий вызов',
          'search_code позволяет найти использования функции, класса — понять контекст без загрузки всех файлов'
        ]},
        { type: 'code', language: 'python', value: 'import anthropic\n\nclass CodeAssistantAgent:\n    def __init__(self, project_dir: str):\n        self.client = anthropic.Anthropic()\n        self.fs = SafeFileSystem(project_dir)\n        self.runner = CodeRunner()\n        self.git = GitTools(project_dir)\n        self.project_dir = project_dir\n        \n        # Инструменты для агента\n        self.tools = [\n            {\n                "name": "read_file",\n                "description": "Читает содержимое файла проекта",\n                "input_schema": {\n                    "type": "object",\n                    "properties": {"path": {"type": "string"}},\n                    "required": ["path"]\n                }\n            },\n            {\n                "name": "list_directory",\n                "description": "Показывает структуру директории",\n                "input_schema": {\n                    "type": "object",\n                    "properties": {"path": {"type": "string", "default": "."}},\n                    "required": []\n                }\n            },\n            {\n                "name": "write_file",\n                "description": "Записывает файл (для сохранения сгенерированного кода)",\n                "input_schema": {\n                    "type": "object",\n                    "properties": {\n                        "path": {"type": "string"},\n                        "content": {"type": "string"}\n                    },\n                    "required": ["path", "content"]\n                }\n            },\n            {\n                "name": "run_python",\n                "description": "Выполняет Python-код и возвращает результат",\n                "input_schema": {\n                    "type": "object",\n                    "properties": {"code": {"type": "string"}},\n                    "required": ["code"]\n                }\n            },\n            {\n                "name": "git_diff",\n                "description": "Показывает текущие изменения в git",\n                "input_schema": {"type": "object", "properties": {}, "required": []}\n            },\n            {\n                "name": "search_code",\n                "description": "Ищет паттерн в файлах проекта",\n                "input_schema": {\n                    "type": "object",\n                    "properties": {"pattern": {"type": "string"}},\n                    "required": ["pattern"]\n                }\n            }\n        ]\n    \n    def execute_tool(self, name: str, args: dict) -> str:\n        if name == "read_file":\n            return self.fs.read_file(args["path"])\n        elif name == "list_directory":\n            result = self.fs.list_directory(args.get("path", "."))\n            return str(result)\n        elif name == "write_file":\n            return self.fs.write_file(args["path"], args["content"])\n        elif name == "run_python":\n            stdout, stderr, code = self.runner.run_python(args["code"])\n            return f"Exit code: {code}\\nOutput: {stdout}\\nErrors: {stderr}"\n        elif name == "git_diff":\n            return self.git.get_diff() or "Нет изменений"\n        elif name == "search_code":\n            results = self.fs.search_in_files(args["pattern"])\n            return str(results[:10])\n        return f"Неизвестный инструмент: {name}"\n    \n    def ask(self, question: str) -> str:\n        """Задаём вопрос агенту о проекте."""\n        messages = [{"role": "user", "content": question}]\n        \n        system = """Ты AI code assistant. Используй инструменты для изучения кодовой базы.\nОтвечай конкретно, ссылайся на реальные файлы и строки кода."""\n        \n        for _ in range(15):\n            response = self.client.messages.create(\n                model="claude-opus-4-5",\n                max_tokens=4096,\n                system=system,\n                tools=self.tools,\n                messages=messages\n            )\n            \n            if response.stop_reason == "end_turn":\n                return next(\n                    b.text for b in response.content if hasattr(b, "text")\n                )\n            \n            messages.append({"role": "assistant", "content": response.content})\n            results = []\n            for block in response.content:\n                if block.type == "tool_use":\n                    result = self.execute_tool(block.name, block.input)\n                    results.append({\n                        "type": "tool_result",\n                        "tool_use_id": block.id,\n                        "content": result\n                    })\n            messages.append({"role": "user", "content": results})\n        \n        return "Достигнут лимит итераций"' },
        { type: 'tip', value: 'Ограничивайте инструменты write_file и run_python — они потенциально опасны. Начинайте с readonly=True для SafeFileSystem и включайте запись только когда явно нужно. Принцип минимальных привилегий применим и к AI-агентам.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Code review агент',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте агента для code review: он принимает Python-код, анализирует его, находит проблемы и предлагает улучшения с объяснениями.',
      requirements: [
        'Создайте класс CodeReviewAgent с инструментами: analyze_complexity, check_style, check_security',
        'analyze_complexity: считает цикломатическую сложность (количество if/for/while/try)',
        'check_style: проверяет длину функций (>50 строк — предупреждение), docstring',
        'check_security: ищет паттерны: eval(), exec(), shell=True, SQL без параметров',
        'Агент должен использовать эти инструменты и формировать итоговый отчёт через Claude',
        'Протестируйте на коде с намеренными проблемами'
      ],
      expectedOutput: 'Агент запускает инструменты, собирает данные и генерирует подробный code review отчёт с конкретными рекомендациями.',
      hint: 'Инструменты могут быть простыми Python-функциями с regex/ast анализом. Главное — передать их результаты агенту чтобы он мог сформулировать рекомендации.',
      solution: `import ast
import re
import anthropic

client = anthropic.Anthropic()

# === ИНСТРУМЕНТЫ ===

def analyze_complexity(code: str) -> dict:
    """Анализ сложности кода."""
    complexity_keywords = len(re.findall(r'\\b(if|elif|for|while|try|except|and|or)\\b', code))
    lines = code.strip().splitlines()
    functions = re.findall(r'^def \\w+', code, re.MULTILINE)
    return {
        "lines_total": len(lines),
        "functions_count": len(functions),
        "complexity_score": complexity_keywords,
        "verdict": "высокая" if complexity_keywords > 15 else "средняя" if complexity_keywords > 7 else "низкая"
    }

def check_style(code: str) -> list:
    """Проверка стиля кода."""
    issues = []
    lines = code.splitlines()

    # Длинные функции
    func_start = None
    func_name = None
    for i, line in enumerate(lines, 1):
        m = re.match(r'^def (\\w+)', line)
        if m:
            if func_start and (i - func_start) > 50:
                issues.append(f"Функция '{func_name}' слишком длинная: {i - func_start} строк (рекомендуется < 50)")
            func_start = i
            func_name = m.group(1)

    # Отсутствие docstring
    for match in re.finditer(r'^def (\\w+).*:\\n(?!\\s+""")', code, re.MULTILINE):
        issues.append(f"Функция '{match.group(1)}' не имеет docstring")

    # Магические числа
    magic = re.findall(r'(?<![\\w.])([2-9]\\d{2,}|[1-9]\\d)(?![\\w.])', code)
    if magic:
        issues.append(f"Магические числа в коде: {magic[:5]} — используйте именованные константы")

    return issues if issues else ["Нарушений стиля не найдено"]

def check_security(code: str) -> list:
    """Проверка безопасности."""
    issues = []
    patterns = {
        r'\\beval\\s*\\(': "Использование eval() — потенциальная инъекция кода",
        r'\\bexec\\s*\\(': "Использование exec() — потенциальная инъекция кода",
        r'shell\\s*=\\s*True': "subprocess с shell=True — риск инъекции команд",
        r'SELECT.+%s|INSERT.+%s|UPDATE.+%s': "SQL с форматированием строк — риск SQL injection",
        r'pickle\\.loads?\\(': "pickle.load() — опасно с недоверенными данными",
        r'assert\\s+': "assert-проверки удаляются при оптимизации — не используйте для безопасности",
    }
    for pattern, message in patterns.items():
        if re.search(pattern, code, re.IGNORECASE):
            issues.append(message)
    return issues if issues else ["Критических проблем безопасности не найдено"]

# === АГЕНТ ===

TOOLS = [
    {
        "name": "analyze_complexity",
        "description": "Анализирует цикломатическую сложность кода",
        "input_schema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}
    },
    {
        "name": "check_style",
        "description": "Проверяет соответствие стиля кода best practices",
        "input_schema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}
    },
    {
        "name": "check_security",
        "description": "Проверяет код на уязвимости безопасности",
        "input_schema": {"type": "object", "properties": {"code": {"type": "string"}}, "required": ["code"]}
    }
]

def execute_tool(name: str, args: dict) -> str:
    code = args.get("code", "")
    if name == "analyze_complexity":
        return str(analyze_complexity(code))
    elif name == "check_style":
        return str(check_style(code))
    elif name == "check_security":
        return str(check_security(code))
    return "Неизвестный инструмент"

def code_review(code: str) -> str:
    messages = [{
        "role": "user",
        "content": f"Проведи code review этого кода. Используй все доступные инструменты.\\n\\n\`\`\`python\\n{code}\\n\`\`\`"
    }]

    for _ in range(10):
        response = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=2048,
            system="Ты опытный code reviewer. Используй инструменты для анализа, затем напиши подробный отчёт с приоритетами.",
            tools=TOOLS,
            messages=messages
        )

        if response.stop_reason == "end_turn":
            return next(b.text for b in response.content if hasattr(b, "text"))

        messages.append({"role": "assistant", "content": response.content})
        results = []
        for block in response.content:
            if block.type == "tool_use":
                result = execute_tool(block.name, block.input)
                print(f"  [Tool] {block.name}: {result[:100]}")
                results.append({"type": "tool_result", "tool_use_id": block.id, "content": result})
        messages.append({"role": "user", "content": results})

    return "Лимит итераций"

# Тестовый код с проблемами
BAD_CODE = """
import subprocess

def process_user_data(user_input, db_conn):
    result = eval(user_input)
    query = "SELECT * FROM users WHERE name = '%s'" % user_input
    db_conn.execute(query)
    cmd = subprocess.run(user_input, shell=True)
    return result

def very_long_function(a, b, c, d, e):
    if a > 0:
        if b > 0:
            for i in range(100):
                if i % 2 == 0:
                    for j in range(50):
                        if j > 25:
                            a = a + b + c + d + e
    return a
"""

print("=== CODE REVIEW ОТЧЁТ ===\\n")
report = code_review(BAD_CODE)
print(report)`,
      explanation: 'Агент использует три специализированных инструмента: analyze_complexity собирает метрики, check_style находит нарушения стиля, check_security ищет уязвимости. Claude анализирует все результаты и формирует целостный отчёт с приоритетами и конкретными рекомендациями. Каждый инструмент реализован без AI — это обычный статический анализ, что делает систему быстрой и детерминированной.'
    }
  ]
}
