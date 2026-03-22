export default {
  id: 15,
  title: 'Промпты для анализа данных',
  description: 'Промпт-инженерия для задач анализа данных: работа с CSV/JSON, статистика, выявление трендов, описание визуализаций, генерация отчётов',
  lessons: [
    {
      id: 1,
      title: 'Промпты для анализа данных: обзор',
      type: 'theory',
      content: [
        { type: 'text', value: 'Claude — мощный аналитик данных. Он умеет интерпретировать статистику, находить паттерны, объяснять аномалии и генерировать выводы из табличных данных.' },
        { type: 'heading', value: 'Принципы аналитических промптов' },
        { type: 'list', items: [
          'Контекст данных: откуда данные, что они означают',
          'Цель анализа: что нужно выяснить',
          'Целевая аудитория: кому будет читать результат',
          'Формат вывода: числа, текст, таблица, список',
          'Временной горизонт: период, с чем сравнивать'
        ]},
        { type: 'heading', value: 'Базовый аналитический промпт' },
        { type: 'code', language: 'python', value: 'analytics_template = """\nТы аналитик данных. Проанализируй следующие данные.\n\n**Контекст:**\n{context}\n\n**Данные:**\n{data}\n\n**Задача анализа:**\n{task}\n\n**Ответь:**\n1. Ключевые наблюдения (топ-3)\n2. Аномалии или неожиданности\n3. Практические выводы\n4. Рекомендации (если применимо)\n\n**Аудитория:** {audience}\n"""' },
        { type: 'tip', value: 'Укажи Claude роль ("ты аналитик данных") — это активирует соответствующий стиль мышления и словарный запас.' }
      ]
    },
    {
      id: 2,
      title: 'Анализ CSV и JSON данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'Claude может анализировать CSV и JSON прямо в промпте. Для больших датасетов передавай агрегированную статистику или выборку.' },
        { type: 'heading', value: 'Анализ CSV данных' },
        { type: 'code', language: 'python', value: 'import csv\nimport io\nimport anthropic\n\nclient = anthropic.Anthropic()\n\ndef analyze_csv(csv_content: str, question: str) -> str:\n    # Берём первые 50 строк для экономии токенов\n    lines = csv_content.strip().split("\\n")\n    sample = "\\n".join(lines[:51])  # заголовок + 50 строк\n    total_rows = len(lines) - 1\n    \n    prompt = f"""\nПроанализируй CSV данные.\n\nОбщее строк: {total_rows}\nПоказаны первые 50 строк:\n\n```csv\n{sample}\n```\n\nВопрос: {question}\n\nПри анализе учти что это выборка из полного датасета.\n"""\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=1024,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    return response.content[0].text' },
        { type: 'heading', value: 'Предобработка перед анализом' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport json\n\ndef prepare_data_summary(df: pd.DataFrame) -> str:\n    """Создаёт краткое описание датафрейма для промпта"""\n    summary = {\n        "shape": list(df.shape),\n        "columns": list(df.columns),\n        "dtypes": df.dtypes.astype(str).to_dict(),\n        "null_counts": df.isnull().sum().to_dict(),\n        "numeric_stats": df.describe().to_dict(),\n        "sample": df.head(5).to_dict(orient="records")\n    }\n    return json.dumps(summary, ensure_ascii=False, default=str)' },
        { type: 'note', value: 'Передавай summary вместо сырых данных когда датасет большой. Claude может анализировать статистику без полного датасета.' }
      ]
    },
    {
      id: 3,
      title: 'Статистический анализ',
      type: 'theory',
      content: [
        { type: 'text', value: 'Claude понимает статистику: дескриптивная статистика, распределения, корреляции, гипотезы. Полезен для интерпретации результатов, а не только вычислений.' },
        { type: 'heading', value: 'Интерпретация статистики' },
        { type: 'code', language: 'python', value: 'stats_prompt = """\nПроинтерпретируй статистику по продажам интернет-магазина.\n\nДескриптивная статистика (выручка в тыс. тенге):\n- Среднее: 450\n- Медиана: 280\n- Стандартное отклонение: 620\n- Min: 15, Max: 4800\n- 25-й перцентиль: 120\n- 75-й перцентиль: 680\n\nОтветь:\n1. Что говорит разница среднего и медианы?\n2. Как интерпретировать высокое стандартное отклонение?\n3. Есть ли аномальные значения?\n4. Какое распределение данных (нормальное/скошенное)?\n5. Практический вывод для бизнеса\n"""' },
        { type: 'heading', value: 'Корреляционный анализ' },
        { type: 'code', language: 'python', value: 'correlation_prompt = """\nПроанализируй корреляционную матрицу маркетинговых данных.\n\nКорреляции:\n- CTR vs Конверсия: 0.72\n- Бюджет vs Клики: 0.89\n- CTR vs Бюджет: 0.21\n- Конверсия vs Бюджет: 0.18\n\nОтветь:\n1. Какие метрики сильно связаны? Почему это логично?\n2. Какие неожиданные (слабые) связи?\n3. Корреляция означает причинность? Объясни\n4. Что это значит для оптимизации кампаний?\n"""' }
      ]
    },
    {
      id: 4,
      title: 'Выявление трендов и аномалий',
      type: 'theory',
      content: [
        { type: 'text', value: 'Выявление паттернов — одна из сильнейших способностей Claude при анализе данных. Модель умеет видеть тренды, сезонность, аномалии в числовых рядах.' },
        { type: 'heading', value: 'Анализ временного ряда' },
        { type: 'code', language: 'python', value: 'trend_prompt = """\nПроанализируй динамику пользователей мобильного приложения.\n\nЕжемесячные активные пользователи (тыс.):\nЯнв: 45, Фев: 48, Мар: 52\nАпр: 58, Май: 71, Июн: 68\nИюл: 65, Авг: 63, Сен: 72\nОкт: 89, Ноя: 95, Дек: 78\n\nКонтекст: Приложение запущено в январе.\nСезонность: лето — каникулы, декабрь — праздники.\n\nОпредели:\n1. Общий тренд (рост/падение/стагнация)\n2. Сезонные паттерны\n3. Аномальные точки и их возможные причины\n4. Прогноз на следующий квартал\n5. Ключевые вопросы для дальнейшего исследования\n"""' },
        { type: 'heading', value: 'Детекция аномалий' },
        { type: 'code', language: 'python', value: 'anomaly_prompt = """\nНайди аномалии в данных транзакций.\n\nДанные (дата | сумма | кол-во транзакций):\n2024-01-01 | 125000 | 450\n2024-01-02 | 118000 | 430\n2024-01-03 | 8500   | 28\n2024-01-04 | 132000 | 470\n2024-01-05 | 945000 | 12\n\nДля каждой аномалии:\n- Метрика и значение\n- Почему это аномалия\n- Возможные объяснения\n- Требуемые действия\n"""' },
        { type: 'tip', value: 'Всегда давай Claude контекст о нормальном диапазоне значений — без этого он может не знать что считать аномалией в вашем домене.' }
      ]
    },
    {
      id: 5,
      title: 'Описание визуализаций для отчётов',
      type: 'theory',
      content: [
        { type: 'text', value: 'Claude может генерировать код для визуализаций (matplotlib, plotly) и писать текстовое описание графиков — полезно для автоматических отчётов.' },
        { type: 'heading', value: 'Генерация кода визуализации' },
        { type: 'code', language: 'python', value: 'viz_prompt = """\nНапиши Python-код для создания дашборда с 4 графиками.\n\nДанные: ежемесячные продажи по регионам за год.\nКолонки: month, region, revenue, units_sold, avg_check\n\nГрафики:\n1. Line chart — динамика revenue по регионам\n2. Bar chart — сравнение регионов за последний месяц\n3. Scatter plot — зависимость avg_check от units_sold\n4. Heatmap — revenue по месяцам и регионам\n\nБиблиотека: matplotlib + seaborn\nРазмер: 12x10 дюймов, 2x2 сетка\nСтиль: профессиональный, цвета для дальтоников\n"""' },
        { type: 'heading', value: 'Автоматические инсайты по графику' },
        { type: 'code', language: 'python', value: 'chart_insight_prompt = """\nНа основе описания графика напиши 3-4 предложения для executive summary.\n\nГрафик: line chart выручки по кварталам 2023-2024\nQ1 2023: 12М, Q2: 15М, Q3: 14М, Q4: 18М\nQ1 2024: 16М, Q2: 21М, Q3: 19М, Q4: 25М\n\nСтиль: деловой, без жаргона, с конкретными цифрами\nАудитория: совет директоров\n"""' }
      ]
    },
    {
      id: 6,
      title: 'Практика: Генератор аналитического отчёта',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создай функцию generate_sales_report(), которая принимает данные о продажах (список словарей) и генерирует полный аналитический отчёт: executive summary, ключевые метрики, тренды, аномалии и рекомендации.',
      requirements: [
        'Функция generate_sales_report(sales_data: list, period: str) -> dict',
        'Вычисли базовую статистику в Python перед отправкой в Claude',
        'Промпт передаёт статистику, не сырые данные',
        'Возвращает dict: executive_summary, key_metrics, trends, anomalies, recommendations',
        'Тест на датасете из 12 месяцев продаж'
      ],
      expectedOutput: '{\n  "executive_summary": "За 2024 год выручка выросла на 34%...",\n  "key_metrics": {"total_revenue": 145000000, ...},\n  "trends": ["Устойчивый рост в Q3-Q4", ...],\n  "anomalies": ["Провал в марте: -40%", ...],\n  "recommendations": ["Усилить маркетинг в низкий сезон", ...]\n}',
      hint: 'Вычисли sum, mean, max, min, growth rate в Python. Передай в промпт готовую статистику. Используй XML-теги для структуры ответа и парсируй их.',
      solution: 'import json\nimport re\nfrom typing import List\nimport anthropic\n\nclient = anthropic.Anthropic()\n\ndef calculate_stats(sales_data: List[dict]) -> dict:\n    revenues = [m["revenue"] for m in sales_data]\n    units = [m["units"] for m in sales_data]\n    \n    sorted_rev = sorted(revenues)\n    n = len(revenues)\n    median = sorted_rev[n//2] if n % 2 else (sorted_rev[n//2-1] + sorted_rev[n//2]) / 2\n    \n    growth = ((revenues[-1] - revenues[0]) / revenues[0] * 100) if revenues[0] else 0\n    monthly_growth = [(revenues[i] - revenues[i-1]) / revenues[i-1] * 100\n                      for i in range(1, len(revenues))]\n    \n    return {\n        "total_revenue": sum(revenues),\n        "avg_monthly_revenue": sum(revenues) / n,\n        "median_revenue": median,\n        "max_revenue": max(revenues),\n        "min_revenue": min(revenues),\n        "total_units": sum(units),\n        "overall_growth_pct": round(growth, 1),\n        "best_month": sales_data[revenues.index(max(revenues))]["month"],\n        "worst_month": sales_data[revenues.index(min(revenues))]["month"],\n        "monthly_growth_pct": [round(g, 1) for g in monthly_growth]\n    }\n\ndef generate_sales_report(sales_data: List[dict], period: str) -> dict:\n    stats = calculate_stats(sales_data)\n    months_summary = "\\n".join(\n        f"{m[\'month\']}: {m[\'revenue\']:,} тг ({m[\'units\']} ед.)" \n        for m in sales_data\n    )\n    \n    prompt = f"""\nСоздай аналитический отчёт о продажах за {period}.\n\nСтатистика:\n{json.dumps(stats, ensure_ascii=False)}\n\nПомесячные данные:\n{months_summary}\n\nФормат ответа (используй XML-теги):\n<executive_summary>2-3 предложения для руководства</executive_summary>\n<trends>список трендов, каждый на новой строке</trends>\n<anomalies>аномальные периоды и возможные причины</anomalies>\n<recommendations>3-5 конкретных рекомендаций</recommendations>\n"""\n    response = client.messages.create(\n        model="claude-sonnet-4-5",\n        max_tokens=1024,\n        messages=[{"role": "user", "content": prompt}]\n    )\n    text = response.content[0].text\n    \n    def extract(tag):\n        m = re.search(f\'<{tag}>(.*?)</{tag}>\', text, re.DOTALL)\n        return m.group(1).strip() if m else ""\n    \n    return {\n        "executive_summary": extract("executive_summary"),\n        "key_metrics": stats,\n        "trends": [t.strip("- ") for t in extract("trends").split("\\n") if t.strip()],\n        "anomalies": [a.strip("- ") for a in extract("anomalies").split("\\n") if a.strip()],\n        "recommendations": [r.strip("- ") for r in extract("recommendations").split("\\n") if r.strip()]\n    }\n\nsales_2024 = [\n    {"month": "Янв", "revenue": 8500000, "units": 340},\n    {"month": "Фев", "revenue": 9200000, "units": 368},\n    {"month": "Мар", "revenue": 5100000, "units": 204},\n    {"month": "Апр", "revenue": 10500000, "units": 420},\n    {"month": "Май", "revenue": 12800000, "units": 512},\n    {"month": "Июн", "revenue": 11200000, "units": 448},\n    {"month": "Июл", "revenue": 9800000, "units": 392},\n    {"month": "Авг", "revenue": 10100000, "units": 404},\n    {"month": "Сен", "revenue": 13500000, "units": 540},\n    {"month": "Окт", "revenue": 15200000, "units": 608},\n    {"month": "Ноя", "revenue": 18900000, "units": 756},\n    {"month": "Дек", "revenue": 16800000, "units": 672}\n]\n\nreport = generate_sales_report(sales_2024, "2024 год")\nprint("Резюме:", report["executive_summary"])\nprint("\\nТренды:", report["trends"][:2])\nprint("Рекомендации:", report["recommendations"][:2])',
      explanation: 'Разделение на calculate_stats() и generate_sales_report() важно: статистика вычисляется детерминировано в Python, а Claude интерпретирует. Это надёжнее чем просить Claude вычислять числа. XML-теги структурируют длинный ответ и позволяют извлекать отдельные секции. Разбивка рекомендаций по строкам даёт удобный список.'
    }
  ]
}
