export default {
  id: 48,
  title: 'Тестирование AI-приложений',
  description: 'Проблемы тестирования AI, метрики оценки, golden datasets, A/B тестирование промптов, регрессионное тестирование и автоматическая оценка с Claude как судьёй.',
  lessons: [
    {
      id: 1,
      title: 'Проблемы тестирования AI-приложений',
      type: 'theory',
      content: [
        { type: 'text', value: 'Тестирование AI-приложений принципиально отличается от тестирования обычного ПО. Нет детерминированного вывода, нет чёткой границы "правильно/неправильно", и одинаковые тесты дают разные результаты.' },
        { type: 'heading', value: 'Ключевые отличия от обычного тестирования' },
        { type: 'list', value: [
          'Нет детерминированного вывода: один и тот же промпт даёт разные ответы',
          'Нет чёткого критерия правильности: "хороший ответ" субъективен',
          'Высокая стоимость тестирования: каждый тест = API вызов = деньги',
          'Регрессии незаметны: обновление модели может ухудшить старые случаи',
          'Контекстуальность: качество зависит от комбинации промпт + данные + модель',
          'Latency вариативность: время ответа непредсказуемо'
        ]},
        { type: 'heading', value: 'Что мы можем тестировать' },
        { type: 'code', language: 'python', value: '# МОЖНО тестировать детерминированно:\n# 1. Формат вывода (JSON парсится, поля присутствуют)\n# 2. Длина ответа (в разумных пределах)\n# 3. Наличие/отсутствие ключевых слов\n# 4. Время ответа (не превышает N секунд)\n# 5. Стоимость (токены в пределах лимита)\n# 6. Обработка ошибок (API возвращает ошибку -> обрабатываем)\n\n# НУЖНА ОЦЕНКА (не детерминировано):\n# 1. Качество содержания ответа\n# 2. Релевантность к вопросу\n# 3. Отсутствие галлюцинаций\n# 4. Тон и стиль\n# 5. Следование инструкциям\n\n# Подход: разделяем "structural tests" и "quality evals"\n\nimport anthropic\nimport json\nimport time\n\nclient = anthropic.Anthropic()\n\nclass StructuralTest:\n    """Детерминированные проверки структуры вывода."""\n    \n    def test_json_output(self, prompt: str) -> dict:\n        """Проверяем что модель возвращает валидный JSON."""\n        response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=500,\n            messages=[{"role": "user", "content": prompt + "\\nОтвечай строго в JSON."}]\n        )\n        text = response.content[0].text.strip()\n        \n        try:\n            data = json.loads(text)\n            return {"passed": True, "data": data}\n        except json.JSONDecodeError as e:\n            return {"passed": False, "error": str(e), "raw": text[:200]}\n    \n    def test_response_length(self, prompt: str, \n                              min_words: int = 10, max_words: int = 500) -> dict:\n        """Проверяем разумную длину ответа."""\n        start = time.time()\n        response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=1024,\n            messages=[{"role": "user", "content": prompt}]\n        )\n        latency = time.time() - start\n        \n        word_count = len(response.content[0].text.split())\n        return {\n            "passed": min_words <= word_count <= max_words,\n            "word_count": word_count,\n            "latency_ms": int(latency * 1000),\n            "tokens": response.usage.output_tokens\n        }\n    \n    def test_keyword_presence(self, prompt: str, \n                               required_keywords: list) -> dict:\n        """Проверяем наличие ключевых слов в ответе."""\n        response = client.messages.create(\n            model="claude-opus-4-5",\n            max_tokens=500,\n            messages=[{"role": "user", "content": prompt}]\n        )\n        text = response.content[0].text.lower()\n        \n        found = [kw for kw in required_keywords if kw.lower() in text]\n        missing = [kw for kw in required_keywords if kw.lower() not in text]\n        \n        return {\n            "passed": len(missing) == 0,\n            "found": found,\n            "missing": missing\n        }' },
        { type: 'tip', value: 'Начинайте с детерминированных тестов (формат, структура, ключевые слова). Они дёшевы и стабильны. Добавляйте качественные оценки только для критически важных случаев.' }
      ]
    },
    {
      id: 2,
      title: 'Метрики оценки и Golden Dataset',
      type: 'theory',
      content: [
        { type: 'text', value: 'Golden dataset — набор вопросов с эталонными ответами, по которому вы оцениваете систему. Это самый надёжный способ измерить качество AI-приложения и обнаруживать регрессии.' },
        { type: 'heading', value: 'Создание golden dataset' },
        { type: 'code', language: 'python', value: 'import json\nfrom dataclasses import dataclass, field\nfrom typing import Optional\n\n@dataclass\nclass GoldenExample:\n    """Одна запись в golden dataset."""\n    id: str\n    input: str               # запрос пользователя\n    expected_output: str     # эталонный ответ\n    context: Optional[str] = None  # дополнительный контекст (RAG документы)\n    tags: list = field(default_factory=list)  # категории (factual, creative, code...)\n    min_score: float = 7.0   # минимальная допустимая оценка (0-10)\n    metadata: dict = field(default_factory=dict)\n\nclass GoldenDataset:\n    def __init__(self):\n        self.examples = []\n    \n    def add(self, example: GoldenExample):\n        self.examples.append(example)\n    \n    def save(self, path: str):\n        data = [e.__dict__ for e in self.examples]\n        with open(path, "w", encoding="utf-8") as f:\n            json.dump(data, f, ensure_ascii=False, indent=2)\n    \n    @classmethod\n    def load(cls, path: str) -> "GoldenDataset":\n        with open(path, encoding="utf-8") as f:\n            data = json.load(f)\n        ds = cls()\n        ds.examples = [GoldenExample(**ex) for ex in data]\n        return ds\n    \n    def filter_by_tag(self, tag: str) -> list:\n        return [ex for ex in self.examples if tag in ex.tags]\n\n# Создаём пример golden dataset для customer support бота\ndataset = GoldenDataset()\n\ndataset.add(GoldenExample(\n    id="returns_001",\n    input="Сколько дней у меня есть чтобы вернуть товар?",\n    expected_output="14 дней",\n    context="Согласно политике компании, возврат возможен в течение 14 дней.",\n    tags=["factual", "returns"],\n    min_score=8.0\n))\n\ndataset.add(GoldenExample(\n    id="greeting_001",\n    input="Привет!",\n    expected_output="Дружелюбное приветствие с предложением помочь",\n    tags=["social", "greeting"],\n    min_score=6.0  # для приветствий требования ниже\n))\n\ndataset.add(GoldenExample(\n    id="offopic_001",\n    input="Расскажи анекдот",\n    expected_output="Вежливый отказ, переадресация к теме магазина",\n    tags=["offtopic", "boundaries"],\n    min_score=7.0\n))\n\nprint(f"Dataset создан: {len(dataset.examples)} примеров")' },
        { type: 'tip', value: 'Минимальный рабочий golden dataset: 30-50 примеров. Для серьёзного production: 200-500 примеров, охватывающих все важные сценарии. Регулярно добавляйте реальные случаи из production.' }
      ]
    },
    {
      id: 3,
      title: 'A/B тестирование промптов',
      type: 'theory',
      content: [
        { type: 'text', value: 'A/B тестирование промптов — это сравнение двух версий системного промпта на одном наборе данных. Позволяет измерить реальное улучшение качества перед деплоем.' },
        { type: 'code', language: 'python', value: 'import anthropic\nimport statistics\nfrom typing import Callable\n\nclient = anthropic.Anthropic()\n\ndef run_ab_test(\n    dataset: list,            # список {"input": str, "expected": str}\n    prompt_a: str,\n    prompt_b: str,\n    judge_fn: Callable,       # функция оценки (input, expected, actual) -> float\n    model: str = "claude-opus-4-5"\n) -> dict:\n    """A/B тест промптов на golden dataset."""\n    \n    scores_a, scores_b = [], []\n    \n    for i, example in enumerate(dataset):\n        print(f"Тест {i+1}/{len(dataset)}...")\n        user_input = example["input"]\n        expected = example.get("expected", "")\n        \n        # Получаем ответы обоих промптов\n        def get_response(system_prompt: str) -> str:\n            resp = client.messages.create(\n                model=model,\n                max_tokens=500,\n                system=system_prompt,\n                messages=[{"role": "user", "content": user_input}]\n            )\n            return resp.content[0].text\n        \n        response_a = get_response(prompt_a)\n        response_b = get_response(prompt_b)\n        \n        # Оцениваем\n        score_a = judge_fn(user_input, expected, response_a)\n        score_b = judge_fn(user_input, expected, response_b)\n        \n        scores_a.append(score_a)\n        scores_b.append(score_b)\n        \n        print(f"  A: {score_a:.2f}, B: {score_b:.2f}")\n    \n    # Статистика\n    avg_a = statistics.mean(scores_a)\n    avg_b = statistics.mean(scores_b)\n    \n    # Простой t-test (нужен scipy для полноценного)\n    improvement = (avg_b - avg_a) / avg_a * 100 if avg_a > 0 else 0\n    \n    return {\n        "prompt_a": {"avg_score": avg_a, "scores": scores_a},\n        "prompt_b": {"avg_score": avg_b, "scores": scores_b},\n        "improvement_percent": improvement,\n        "winner": "B" if avg_b > avg_a else "A",\n        "samples": len(dataset)\n    }\n\n# Пример судьи (claude-as-judge)\ndef llm_judge(question: str, expected: str, actual: str) -> float:\n    resp = client.messages.create(\n        model="claude-haiku-4-5",\n        max_tokens=50,\n        messages=[{\n            "role": "user",\n            "content": f"Оцени ответ от 1 до 10.\\n"\n                       f"Вопрос: {question}\\nОжидаемое: {expected}\\n"\n                       f"Фактическое: {actual}\\nТолько цифра:"\n        }]\n    )\n    try:\n        return float(resp.content[0].text.strip().split()[0])\n    except:\n        return 5.0' }
      ]
    },
    {
      id: 4,
      title: 'Регрессионное тестирование',
      type: 'theory',
      content: [
        { type: 'text', value: 'Регрессионное тестирование обнаруживает что обновление системы (новый промпт, новая модель) не ухудшило качество для уже работавших случаев. Запускается автоматически при каждом изменении.' },
        { type: 'code', language: 'python', value: 'import json\nimport os\nfrom datetime import datetime\nfrom pathlib import Path\n\nclass RegressionTester:\n    """Автоматическое регрессионное тестирование AI-приложения."""\n    \n    def __init__(self, results_dir: str = "./test_results"):\n        self.results_dir = Path(results_dir)\n        self.results_dir.mkdir(exist_ok=True)\n    \n    def run_test_suite(\n        self,\n        test_cases: list,\n        system_prompt: str,\n        model: str,\n        suite_name: str = "default"\n    ) -> dict:\n        """Запускает набор тестов и сохраняет результаты."""\n        results = {\n            "suite_name": suite_name,\n            "timestamp": datetime.utcnow().isoformat(),\n            "model": model,\n            "prompt_hash": hash(system_prompt),\n            "cases": [],\n            "passed": 0,\n            "failed": 0\n        }\n        \n        client = anthropic.Anthropic()\n        \n        for case in test_cases:\n            response = client.messages.create(\n                model=model,\n                max_tokens=500,\n                system=system_prompt,\n                messages=[{"role": "user", "content": case["input"]}]\n            )\n            actual = response.content[0].text\n            \n            # Структурные проверки\n            passed = True\n            failures = []\n            \n            for check in case.get("checks", []):\n                if check["type"] == "contains":\n                    if check["value"].lower() not in actual.lower():\n                        passed = False\n                        failures.append(f"Не содержит: \'{check[\'value\']}\\\'")\n                elif check["type"] == "not_contains":\n                    if check["value"].lower() in actual.lower():\n                        passed = False\n                        failures.append(f"Содержит запрещённое: \'{check[\'value\']}\\\'")\n                elif check["type"] == "length_max":\n                    if len(actual.split()) > check["value"]:\n                        passed = False\n                        failures.append(f"Слишком длинный: {len(actual.split())} слов")\n            \n            case_result = {\n                "id": case["id"],\n                "input": case["input"],\n                "actual": actual[:200],\n                "passed": passed,\n                "failures": failures\n            }\n            results["cases"].append(case_result)\n            if passed:\n                results["passed"] += 1\n            else:\n                results["failed"] += 1\n        \n        # Сохраняем результаты\n        filename = f"{suite_name}_{datetime.utcnow().strftime(\'%Y%m%d_%H%M%S\')}.json"\n        with open(self.results_dir / filename, "w", encoding="utf-8") as f:\n            json.dump(results, f, ensure_ascii=False, indent=2)\n        \n        return results\n    \n    def compare_with_baseline(self, current: dict, baseline_file: str) -> dict:\n        """Сравниваем с предыдущим базовым запуском."""\n        with open(baseline_file) as f:\n            baseline = json.load(f)\n        \n        baseline_pass_rate = baseline["passed"] / len(baseline["cases"])\n        current_pass_rate = current["passed"] / len(current["cases"])\n        \n        # Находим регрессии\n        baseline_passed = {c["id"] for c in baseline["cases"] if c["passed"]}\n        current_passed = {c["id"] for c in current["cases"] if c["passed"]}\n        \n        regressions = baseline_passed - current_passed  # были OK, теперь нет\n        improvements = current_passed - baseline_passed  # были плохо, теперь OK\n        \n        return {\n            "baseline_pass_rate": baseline_pass_rate,\n            "current_pass_rate": current_pass_rate,\n            "delta": current_pass_rate - baseline_pass_rate,\n            "regressions": list(regressions),\n            "improvements": list(improvements),\n            "regression_detected": len(regressions) > 0\n        }' }
      ]
    },
    {
      id: 5,
      title: 'Claude как судья (LLM-as-Judge)',
      type: 'theory',
      content: [
        { type: 'text', value: 'LLM-as-Judge — использование языковой модели для автоматической оценки качества ответов другой модели. Это масштабируемый способ оценки когда человеческая разметка дорога или медленна.' },
        { type: 'code', language: 'python', value: 'import anthropic\nimport json\nfrom dataclasses import dataclass\n\nclient = anthropic.Anthropic()\n\n@dataclass\nclass EvaluationResult:\n    score: float        # 0-10\n    reasoning: str\n    passed: bool\n    criteria_scores: dict\n\ndef claude_judge(\n    question: str,\n    actual_answer: str,\n    expected_answer: str = None,\n    criteria: list = None\n) -> EvaluationResult:\n    """\n    Использует Claude для оценки качества ответа.\n    \n    criteria: список критериев оценки\n    Например: ["точность", "полнота", "стиль"]\n    """\n    if criteria is None:\n        criteria = ["точность", "полнота", "соответствие вопросу"]\n    \n    criteria_text = "\\n".join(f"- {c}: 0-10" for c in criteria)\n    \n    expected_section = ""\n    if expected_answer:\n        expected_section = f"\\nОжидаемый ответ (для сравнения): {expected_answer}"\n    \n    prompt = f"""Оцени качество ответа AI-ассистента.\n\nВопрос пользователя: {question}\nОтвет ассистента: {actual_answer}{expected_section}\n\nОцени по критериям:\n{criteria_text}\n\nОтвечай строго в JSON:\n{{\n  "criteria_scores": {{{", ".join(f\'"{c}": 8\' for c in criteria)}}},\n  "reasoning": "краткое объяснение",\n  "overall_score": 8.5\n}}"""\n    \n    response = client.messages.create(\n        model="claude-haiku-4-5",\n        max_tokens=400,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    \n    text = response.content[0].text.strip()\n    \n    try:\n        # Убираем markdown если есть\n        import re\n        match = re.search(r\'\\{.*\\}\', text, re.DOTALL)\n        if match:\n            data = json.loads(match.group())\n            score = float(data.get("overall_score", 5))\n            return EvaluationResult(\n                score=score,\n                reasoning=data.get("reasoning", ""),\n                passed=score >= 7.0,\n                criteria_scores=data.get("criteria_scores", {})\n            )\n    except:\n        pass\n    \n    return EvaluationResult(score=5.0, reasoning=text, passed=False, criteria_scores={})\n\n# Батч оценка\ndef batch_evaluate(\n    test_cases: list,  # [{question, answer, expected?}]\n    batch_size: int = 5\n) -> dict:\n    """Оцениваем несколько ответов и собираем статистику."""\n    results = []\n    \n    for case in test_cases:\n        result = claude_judge(\n            question=case["question"],\n            actual_answer=case["answer"],\n            expected_answer=case.get("expected")\n        )\n        results.append({"case": case, "eval": result})\n    \n    scores = [r["eval"].score for r in results]\n    import statistics\n    \n    return {\n        "results": results,\n        "avg_score": statistics.mean(scores),\n        "pass_rate": sum(1 for r in results if r["eval"].passed) / len(results),\n        "min_score": min(scores),\n        "max_score": max(scores)\n    }' },
        { type: 'warning', value: 'Claude-as-judge имеет свои bias: предпочитает длинные ответы, "уверенный" тон, числа и конкретику. Калибруйте судью на примерах где вы знаете правильный ответ.' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Автоматизированный evaluation pipeline',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полный evaluation pipeline: golden dataset, тестирование промпта, LLM-as-judge оценка, финальный отчёт с pass rate и рекомендациями.',
      requirements: [
        'Создайте golden dataset из 5 вопросов с ожидаемыми ответами для support-бота магазина',
        'Напишите run_evaluation(system_prompt, test_cases) — запускает бота и оценивает ответы',
        'Используйте Claude Haiku как судью (дешевле) с критериями: точность, полнота, стиль',
        'Генерируйте отчёт: общий score, pass rate, худшие случаи',
        'Сравните два промпта: базовый и улучшенный'
      ],
      expectedOutput: 'Отчёт с оценками для каждого теста, средним score и сравнением двух промптов.',
      hint: 'Для сравнения промптов запустите evaluation дважды с разными system_prompt. Судья должен быть строгим — минимальная оценка 7/10 для прохождения.',
      solution: `import anthropic
import json
import re
import statistics

client = anthropic.Anthropic()

# === GOLDEN DATASET ===
TEST_CASES = [
    {
        "id": "returns",
        "question": "Сколько дней можно вернуть товар?",
        "expected": "14 дней с чеком",
        "context": "Возврат возможен в течение 14 дней при наличии чека."
    },
    {
        "id": "delivery",
        "question": "Сколько идёт доставка?",
        "expected": "2-3 рабочих дня",
        "context": "Доставка занимает 2-3 рабочих дня."
    },
    {
        "id": "warranty",
        "question": "Какая гарантия на телефоны?",
        "expected": "12 месяцев",
        "context": "Гарантийный срок на электронику — 12 месяцев."
    },
    {
        "id": "greeting",
        "question": "Привет!",
        "expected": "Дружелюбное приветствие и готовность помочь",
        "context": None
    },
    {
        "id": "offtopic",
        "question": "Расскажи анекдот про программистов",
        "expected": "Вежливый отказ и предложение помочь с покупками",
        "context": None
    },
]

# === JUDGE ===
def llm_judge(question: str, expected: str, actual: str) -> dict:
    prompt = f"""Оцени ответ поддержки от 1 до 10 по критериям:
- точность (правильность информации)
- полнота (охвачено ли главное)
- тон (вежливость и профессионализм)

Вопрос: {question}
Ожидаемое: {expected}
Фактический ответ: {actual}

JSON: {{"accuracy": 8, "completeness": 7, "tone": 9, "overall": 8.0, "reasoning": "..."}}"""

    resp = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    text = resp.content[0].text.strip()
    match = re.search(r'\\{.*\\}', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except:
            pass
    return {"accuracy": 5, "completeness": 5, "tone": 5, "overall": 5.0, "reasoning": "Не удалось распарсить"}

# === EVALUATION ===
def run_evaluation(system_prompt: str, label: str = "Промпт") -> dict:
    print(f"\\n=== Оцениваем: {label} ===")
    results = []

    for case in TEST_CASES:
        context_part = f"\\n\\nКонтекст: {case['context']}" if case["context"] else ""

        resp = client.messages.create(
            model="claude-opus-4-5",
            max_tokens=300,
            system=system_prompt,
            messages=[{"role": "user", "content": case["question"] + context_part}]
        )
        actual = resp.content[0].text

        eval_result = llm_judge(case["question"], case["expected"], actual)
        score = eval_result.get("overall", 5.0)
        passed = score >= 7.0

        results.append({
            "id": case["id"],
            "question": case["question"],
            "actual": actual[:150],
            "score": score,
            "passed": passed,
            "reasoning": eval_result.get("reasoning", "")
        })

        status = "OK" if passed else "FAIL"
        print(f"  [{status}] {case['id']}: {score:.1f}/10")

    scores = [r["score"] for r in results]
    avg = statistics.mean(scores)
    pass_rate = sum(1 for r in results if r["passed"]) / len(results)

    # Худшие случаи
    worst = sorted(results, key=lambda x: x["score"])[:2]

    print(f"\\nИтого: avg={avg:.2f}/10, pass_rate={pass_rate*100:.0f}%")

    return {
        "label": label,
        "avg_score": round(avg, 2),
        "pass_rate": round(pass_rate, 2),
        "results": results,
        "worst_cases": [{"id": w["id"], "score": w["score"]} for w in worst]
    }

# === ДВА ПРОМПТА ===
PROMPT_A = "Ты ассистент магазина. Помогай клиентам."

PROMPT_B = """Ты Алиса — дружелюбный ассистент интернет-магазина.
Отвечай точно и кратко на основе предоставленного контекста.
Если вопрос не относится к покупкам — вежливо переадресуй к теме магазина.
Всегда предлагай помочь ещё чем-нибудь."""

eval_a = run_evaluation(PROMPT_A, "Базовый промпт")
eval_b = run_evaluation(PROMPT_B, "Улучшенный промпт")

print("\\n===== СРАВНИТЕЛЬНЫЙ ОТЧЁТ =====")
print(f"{eval_a['label']}: avg={eval_a['avg_score']}/10, pass={eval_a['pass_rate']*100:.0f}%")
print(f"{eval_b['label']}: avg={eval_b['avg_score']}/10, pass={eval_b['pass_rate']*100:.0f}%")
delta = eval_b['avg_score'] - eval_a['avg_score']
winner = eval_b['label'] if delta > 0 else eval_a['label']
print(f"Победитель: {winner} (delta: {delta:+.2f})")
print(f"\\nХудшие случаи промпта B: {eval_b['worst_cases']}")`,
      explanation: 'Evaluation pipeline работает в четыре шага: 1) golden dataset определяет ожидания для ключевых сценариев, 2) run_evaluation запускает бота на всех тестах, 3) llm_judge оценивает каждый ответ по трём критериям, 4) сравнительный отчёт показывает что изменилось. Использование Claude Haiku как судьи экономит затраты при массовом тестировании.'
    }
  ]
}
