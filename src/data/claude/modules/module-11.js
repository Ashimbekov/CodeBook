export default {
  id: 11,
  title: 'Техника Chain of Thought',
  description: 'Метод пошагового рассуждения Chain of Thought: теория, применение, XML-теги thinking, использование для математики, логики и отладки кода',
  lessons: [
    {
      id: 1,
      title: 'Что такое Chain of Thought?',
      type: 'theory',
      content: [
        { type: 'text', value: 'Chain of Thought (CoT) — техника промптинга, при которой модель явно выстраивает цепочку рассуждений перед тем как дать финальный ответ. Вместо немедленного вывода результата модель "думает вслух", шаг за шагом.' },
        { type: 'tip', value: 'Представьте шахматного гроссмейстера: он не называет ход мгновенно, а просчитывает варианты. CoT заставляет модель делать то же самое — раскладывать задачу на части.' },
        { type: 'heading', value: 'Пример без CoT и с CoT' },
        { type: 'code', language: 'python', value: '# Без CoT — модель отвечает сразу\nprompt_without_cot = """\nВ магазине было 50 яблок. Продали 30%, затем добавили 10 штук.\nСколько яблок стало?\n"""\n# Риск ошибки: модель может посчитать неправильно\n\n# С CoT — шаги явные\nprompt_with_cot = """\nВ магазине было 50 яблок. Продали 30%, затем добавили 10 штук.\nСколько яблок стало?\n\nРешите шаг за шагом:\n"""\n# Ответ модели:\n# Шаг 1: 30% от 50 = 0.30 * 50 = 15 яблок продано\n# Шаг 2: Осталось: 50 - 15 = 35 яблок\n# Шаг 3: Добавили 10: 35 + 10 = 45 яблок\n# Итого: 45 яблок' },
        { type: 'heading', value: 'Почему это работает' },
        { type: 'list', items: [
          'Промежуточные шаги уменьшают вероятность арифметических ошибок',
          'Модель "проверяет сама себя" на каждом шаге',
          'Пользователь видит ход мысли и может найти ошибку',
          'Сложные задачи разбиваются на простые подзадачи'
        ]},
        { type: 'note', value: 'CoT особенно эффективен для больших моделей (Sonnet, Opus). На малых моделях (Haiku) прирост меньше, но всё равно заметен.' }
      ]
    },
    {
      id: 2,
      title: 'Пошаговое рассуждение: базовые паттерны',
      type: 'theory',
      content: [
        { type: 'text', value: 'Существует несколько устоявшихся способов попросить модель рассуждать пошагово. Каждый формат немного меняет стиль вывода, но все они активируют одну и ту же способность модели.' },
        { type: 'heading', value: 'Паттерн 1: Нумерованные шаги' },
        { type: 'code', language: 'python', value: 'prompt = """\nЗадача: Найди все простые числа от 1 до 30.\n\nИнструкция: Реши задачу, нумеруя каждый шаг рассуждения.\n"""' },
        { type: 'heading', value: 'Паттерн 2: Явный разбор' },
        { type: 'code', language: 'python', value: 'prompt = """\nУсловие задачи: Поезд едет 120 км/ч, расстояние 360 км.\n\n1. Что дано?\n2. Что нужно найти?\n3. Какая формула?\n4. Вычисление:\n5. Ответ:\n"""' },
        { type: 'heading', value: 'Паттерн 3: Внутреннее рассуждение' },
        { type: 'code', language: 'python', value: 'prompt = """\nПрежде чем ответить, рассуди вслух:\n- Что я знаю?\n- Что мне нужно?\n- Какой подход выбрать?\n- Каков ответ?\n\nВопрос: Стоит ли инвестировать в стартап без revenue?\n"""' },
        { type: 'tip', value: 'Выбирайте паттерн в зависимости от задачи. Для математики хорош нумерованный разбор, для аналитики — внутреннее рассуждение, для алгоритмов — поэтапное решение.' }
      ]
    },
    {
      id: 3,
      title: '"Think step by step" — магическая фраза',
      type: 'theory',
      content: [
        { type: 'text', value: 'Фраза "think step by step" (думай шаг за шагом) вошла в историю NLP после исследования Google Brain 2022 года. Добавление этой фразы к промпту резко улучшало результаты на задачах рассуждения.' },
        { type: 'heading', value: 'Оригинальная формула' },
        { type: 'code', language: 'python', value: '# Исходная английская формула\nprompt_en = "Let\'s think step by step."\n\n# Русские эквиваленты\nprompt_ru_1 = "Давай подумаем шаг за шагом."\nprompt_ru_2 = "Решите это задание пошагово."\nprompt_ru_3 = "Разберём задачу по шагам."\nprompt_ru_4 = "Объясни своё рассуждение поэтапно."' },
        { type: 'heading', value: 'Сравнение с и без формулы' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\ndef ask(prompt):\n    message = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=512,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    return message.content[0].text\n\nquestion = "Если у Алибека в 3 раза больше яблок чем у Дины, а у Дины 12, то сколько у обоих вместе?"\n\n# Без CoT\nresult1 = ask(question)\n\n# С CoT\nresult2 = ask(question + " Давай подумаем шаг за шагом.")\n\nprint("Без CoT:", result1)\nprint("С CoT:", result2)' },
        { type: 'note', value: 'В экспериментах добавление "Let\'s think step by step" улучшало точность на math word problems с 17% до 78% на модели PaLM.' },
        { type: 'tip', value: 'Эта фраза работает потому, что тренировочные данные содержат тексты где умные люди объясняют решения пошагово. Фраза "триггерит" этот паттерн.' }
      ]
    },
    {
      id: 4,
      title: 'XML-теги thinking для структурированного размышления',
      type: 'theory',
      content: [
        { type: 'text', value: 'Claude хорошо реагирует на XML-теги в промптах. Специальный тег <thinking> позволяет попросить модель вынести рассуждения в отдельный блок, а затем дать чистый финальный ответ.' },
        { type: 'heading', value: 'Базовое использование thinking-тегов' },
        { type: 'code', language: 'python', value: 'prompt = """\nОтветь на вопрос. Сначала используй тег <thinking> для рассуждений,\nзатем дай финальный ответ в теге <answer>.\n\nВопрос: Какой алгоритм сортировки выбрать для почти отсортированного\nмассива из 10000 элементов?\n\n<thinking>\n[Здесь Claude запишет своё рассуждение]\n</thinking>\n\n<answer>\n[Здесь финальный ответ]\n</answer>\n"""' },
        { type: 'heading', value: 'Парсинг ответа с тегами' },
        { type: 'code', language: 'python', value: 'import re\nimport anthropic\n\nclient = anthropic.Anthropic()\n\ndef ask_with_thinking(question):\n    prompt = f"""\nОтветь на вопрос используя теги:\n<thinking>рассуждение</thinking>\n<answer>финальный ответ</answer>\n\nВопрос: {question}\n"""\n    response = client.messages.create(\n        model="claude-opus-4-5",\n        max_tokens=1024,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    text = response.content[0].text\n    thinking = re.search(r\'<thinking>(.*?)</thinking>\', text, re.DOTALL)\n    answer = re.search(r\'<answer>(.*?)</answer>\', text, re.DOTALL)\n    return {\n        "thinking": thinking.group(1).strip() if thinking else "",\n        "answer": answer.group(1).strip() if answer else text\n    }\n\nresult = ask_with_thinking("Стоит ли использовать NoSQL для финансовых транзакций?")\nprint("Рассуждение:", result["thinking"])\nprint("\\nОтвет:", result["answer"])' },
        { type: 'warning', value: 'Не путайте XML-теги thinking в промпте с API-параметром thinking у Claude Opus. Теги в промпте — это просто форматирование ответа, API thinking — отдельная функция Extended Thinking.' }
      ]
    },
    {
      id: 5,
      title: 'Когда CoT помогает, а когда нет',
      type: 'theory',
      content: [
        { type: 'text', value: 'Chain of Thought — мощная техника, но не серебряная пуля. Важно понимать, в каких случаях она даёт прирост качества, а когда лишь увеличивает длину ответа.' },
        { type: 'heading', value: 'CoT ПОМОГАЕТ' },
        { type: 'list', items: [
          'Многошаговые математические задачи (арифметика, алгебра)',
          'Логические задачи с несколькими условиями',
          'Анализ кода и поиск ошибок',
          'Юридический и медицинский анализ',
          'Планирование с зависимостями',
          'Задачи где надо взвесить несколько факторов'
        ]},
        { type: 'heading', value: 'CoT НЕ ПОМОГАЕТ' },
        { type: 'list', items: [
          'Простые фактические вопросы ("Какая столица Франции?")',
          'Творческие задачи без однозначного ответа',
          'Краткие классификации (да/нет)',
          'Переводы коротких фраз',
          'Когда нужен быстрый ответ, а не обоснование'
        ]},
        { type: 'code', language: 'python', value: '# Хорошо — CoT нужен\nprompt_good = """\nКоманда: 5 человек. Задача: сделать MVP за 3 месяца.\nБюджет: 500k руб. Есть ли риски?\n\nПроанализируй шаг за шагом: ресурсы, сроки, риски, рекомендации.\n"""\n\n# Лишнее — CoT не нужен\nprompt_bad = """\nСколько букв в слове "привет"? Подумай шаг за шагом.\n"""' },
        { type: 'tip', value: 'Правило: используйте CoT когда вы сами решая задачу делали бы промежуточные вычисления или заметки.' }
      ]
    },
    {
      id: 6,
      title: 'CoT для математики и логики',
      type: 'theory',
      content: [
        { type: 'text', value: 'Математические и логические задачи — классическая область применения CoT. Здесь особенно важна точность каждого промежуточного шага.' },
        { type: 'heading', value: 'Шаблон для математических задач' },
        { type: 'code', language: 'python', value: 'math_cot_template = """\nРеши задачу, строго следуя формату:\n\n**Дано:**\n- [перечисли все данные]\n\n**Найти:**\n- [что нужно вычислить]\n\n**Решение:**\nШаг 1: [действие и вычисление]\nШаг 2: [действие и вычисление]\n...\n\n**Проверка:**\n[подставь ответ обратно или проверь иначе]\n\n**Ответ:** [финальное число с единицей измерения]\n\nЗадача: {task}\n"""' },
        { type: 'heading', value: 'Логические цепочки' },
        { type: 'code', language: 'python', value: 'logic_prompt = """\nЗадача:\nВсе программисты знают Python или Java.\nАлибек не знает Java.\nДина знает только Java.\n\nВопрос: Что можно утверждать о знаниях Алибека и Дины?\n\nИспользуй формальную логику:\n1. Запиши предпосылки\n2. Примени правила логики\n3. Сделай вывод\n"""' },
        { type: 'code', language: 'python', value: 'import anthropic\n\nclient = anthropic.Anthropic()\n\ndef solve_math(task):\n    prompt = f"""\nРеши задачу шаг за шагом. Каждый шаг начинай с новой строки.\nПокажи все вычисления. В конце напиши "Ответ:".\n\nЗадача: {task}\n"""\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=1024,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    return response.content[0].text\n\nresult = solve_math(\n    "Скорость первого поезда 80 км/ч, второго — 60 км/ч. "\n    "Они едут навстречу друг другу. Расстояние между ними 280 км. "\n    "Через сколько часов они встретятся?"\n)\nprint(result)' },
        { type: 'note', value: 'Для задач с числами попросите модель также выполнить проверку — подставить ответ обратно в условие. Это резко снижает количество ошибок.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: CoT для отладки кода',
      type: 'practice',
      difficulty: 'medium',
      description: 'Напиши функцию debug_with_cot(), которая принимает код с ошибкой и описание проблемы, формирует CoT-промпт для Claude и возвращает структурированный анализ: место ошибки, причина, исправление.',
      requirements: [
        'Функция debug_with_cot(code: str, error_description: str) -> dict',
        'Промпт должен требовать пошагового анализа через XML-теги',
        'Парсить ответ и возвращать dict с ключами: analysis, bug_location, fix',
        'Использовать model="claude-haiku-4-5"',
        'Протестировать на примере с реальной ошибкой в Python-коде'
      ],
      expectedOutput: '{\n  "analysis": "Шаг 1: ... Шаг 2: ...",\n  "bug_location": "строка 3: ...",\n  "fix": "исправленный код"\n}',
      hint: 'В промпте используй теги <analysis>, <bug_location>, <fix>. Для парсинга используй re.search с флагом re.DOTALL.',
      solution: 'import re\nimport anthropic\n\nclient = anthropic.Anthropic()\n\ndef debug_with_cot(code: str, error_description: str) -> dict:\n    prompt = f"""\nПроанализируй код и найди ошибку. Используй пошаговое рассуждение.\n\nКод:\n```python\n{code}\n```\n\nОписание проблемы: {error_description}\n\nОтветь строго в формате:\n<analysis>\nШаг 1: [что делает код]\nШаг 2: [где может быть ошибка]\nШаг 3: [почему возникает проблема]\n</analysis>\n\n<bug_location>\n[номер строки и описание]\n</bug_location>\n\n<fix>\n[исправленный код]\n</fix>\n"""\n    response = client.messages.create(\n        model="claude-haiku-4-5",\n        max_tokens=1024,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    text = response.content[0].text\n\n    def extract(tag):\n        m = re.search(f\'<{tag}>(.*?)</{tag}>\', text, re.DOTALL)\n        return m.group(1).strip() if m else ""\n\n    return {\n        "analysis": extract("analysis"),\n        "bug_location": extract("bug_location"),\n        "fix": extract("fix")\n    }\n\nbuggy_code = """\ndef calculate_average(numbers):\n    total = 0\n    for n in numbers:\n        total += n\n    return total / len(numbers)\n\nresult = calculate_average([])\nprint(result)\n"""\n\nresult = debug_with_cot(buggy_code, "ZeroDivisionError при пустом списке")\nprint("Анализ:", result["analysis"])\nprint("\\nОшибка:", result["bug_location"])\nprint("\\nИсправление:", result["fix"])',
      explanation: 'XML-теги структурируют ответ модели и позволяют легко парсить отдельные части. CoT в промпте (Шаг 1, Шаг 2, Шаг 3) заставляет модель системно анализировать код, а не сразу прыгать к исправлению. re.DOTALL нужен потому что ответ занимает несколько строк.'
    }
  ]
}
