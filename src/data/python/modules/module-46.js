export default {
  id: 46,
  title: 'Pandas: продвинутый',
  description: 'groupby, merge/join, pivot_table, resample — мощные инструменты для агрегации и объединения данных',
  lessons: [
    {
      id: 1,
      title: 'groupby: группировка и агрегация',
      type: 'theory',
      content: [
        { type: 'text', value: 'groupby разделяет DataFrame на группы и применяет агрегатные функции к каждой. Принцип split-apply-combine: разделить -> применить -> объединить.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\n\ndf = pd.DataFrame({\n    \'отдел\': [\'IT\', \'HR\', \'IT\', \'Finance\', \'HR\', \'IT\', \'Finance\'],\n    \'уровень\': [\'senior\', \'junior\', \'middle\', \'senior\', \'middle\', \'junior\', \'junior\'],\n    \'зарплата\': [90000, 50000, 70000, 95000, 65000, 55000, 60000],\n    \'стаж\': [5, 1, 3, 7, 4, 2, 1]\n})\n\n# Базовая группировка\nby_dept = df.groupby(\'отдел\')\n\n# Агрегация\nprint(by_dept[\'зарплата\'].mean())    # среднее по отделам\nprint(by_dept[\'зарплата\'].sum())     # сумма\nprint(by_dept[\'стаж\'].max())         # максимум\n\n# Несколько агрегаций сразу\nresult = by_dept[\'зарплата\'].agg([\'mean\', \'min\', \'max\', \'count\'])\nprint(result)\n\n# Разные функции для разных столбцов\nresult2 = by_dept.agg({\n    \'зарплата\': [\'mean\', \'max\'],\n    \'стаж\': \'mean\'\n})\nprint(result2)\n\n# Группировка по нескольким столбцам\nby_dept_level = df.groupby([\'отдел\', \'уровень\'])[\'зарплата\'].mean()\nprint(by_dept_level)\n\n# as_index=False — результат как обычный DataFrame\nresult3 = df.groupby(\'отдел\', as_index=False)[\'зарплата\'].mean()\nprint(result3)' },
        { type: 'tip', value: 'После groupby.agg() может возникнуть MultiIndex. Используй reset_index() для сброса или as_index=False в groupby.' }
      ]
    },
    {
      id: 2,
      title: 'groupby: transform и filter',
      type: 'theory',
      content: [
        { type: 'text', value: 'transform возвращает данные той же формы что и исходный DataFrame (не сворачивает). filter отбирает группы по условию.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\n\ndf = pd.DataFrame({\n    \'отдел\': [\'IT\', \'HR\', \'IT\', \'Finance\', \'HR\', \'IT\'],\n    \'зарплата\': [90000, 50000, 70000, 95000, 65000, 55000]\n})\n\n# transform — сохраняет форму DataFrame\n# Добавляем средние зарплаты по отделам как новый столбец\ndf[\'ср_зп_отдела\'] = df.groupby(\'отдел\')[\'зарплата\'].transform(\'mean\')\nprint(df)\n\n# Нормализация внутри группы\ndf[\'зп_norm\'] = df.groupby(\'отдел\')[\'зарплата\'].transform(\n    lambda x: (x - x.mean()) / x.std()\n)\n\n# Ранг внутри группы\ndf[\'ранг\'] = df.groupby(\'отдел\')[\'зарплата\'].rank(ascending=False)\n\n# filter — оставляет только группы, где условие True\nbig_depts = df.groupby(\'отдел\').filter(lambda x: len(x) >= 2)\nprint(big_depts)  # только IT (3 чел.) и HR (2 чел.)\n\nhigh_avg_depts = df.groupby(\'отдел\').filter(\n    lambda x: x[\'зарплата\'].mean() > 70000\n)\nprint(high_avg_depts)  # только отделы со средней зп > 70000\n\n# apply — максимальная гибкость\ndef top_earner(group):\n    return group.nlargest(1, \'зарплата\')\n\nresult = df.groupby(\'отдел\').apply(top_earner)\nprint(result)  # лучший сотрудник в каждом отделе' }
      ]
    },
    {
      id: 3,
      title: 'merge и join',
      type: 'theory',
      content: [
        { type: 'text', value: 'pd.merge объединяет DataFrame как SQL JOIN. Поддерживает inner, left, right, outer. pd.concat просто склеивает таблицы.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\n\nemployees = pd.DataFrame({\n    \'id\': [1, 2, 3, 4, 5],\n    \'имя\': [\'Алиса\', \'Боб\', \'Вася\', \'Дина\', \'Егор\'],\n    \'отдел_id\': [1, 2, 1, 3, 2]\n})\n\ndepartments = pd.DataFrame({\n    \'id\': [1, 2, 3],\n    \'название\': [\'IT\', \'HR\', \'Finance\'],\n    \'руководитель\': [\'Иван\', \'Мария\', \'Пётр\']\n})\n\n# inner join (пересечение)\nresult = pd.merge(employees, departments,\n                  left_on=\'отдел_id\', right_on=\'id\',\n                  how=\'inner\', suffixes=(\'_emp\', \'_dept\'))\nprint(result)\n\n# left join (все из левой таблицы)\nresult_left = pd.merge(employees, departments,\n                       left_on=\'отдел_id\', right_on=\'id\', how=\'left\')\n\n# merge по одноимённым столбцам\ndf1 = pd.DataFrame({\'ключ\': [\'A\', \'B\', \'C\'], \'val1\': [1, 2, 3]})\ndf2 = pd.DataFrame({\'ключ\': [\'B\', \'C\', \'D\'], \'val2\': [4, 5, 6]})\nprint(pd.merge(df1, df2, on=\'ключ\'))  # inner по умолчанию\n\n# concat — склеивание\ndf_all = pd.concat([df1, df2], ignore_index=True)  # по строкам\ndf_wide = pd.concat([df1, df2], axis=1)            # по столбцам\n\n# join по индексу\nresult2 = df1.set_index(\'ключ\').join(df2.set_index(\'ключ\'), how=\'outer\')' },
        { type: 'tip', value: 'Используй suffixes=() в merge когда в обеих таблицах есть столбцы с одинаковыми именами (кроме ключа). Иначе Pandas добавит _x и _y автоматически.' }
      ]
    },
    {
      id: 4,
      title: 'pivot_table',
      type: 'theory',
      content: [
        { type: 'text', value: 'pivot_table создаёт сводные таблицы: аналог Excel PivotTable. Группирует по строкам и столбцам, вычисляет агрегатные функции.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\n    \'регион\': [\'Север\', \'Юг\', \'Север\', \'Юг\', \'Север\', \'Юг\'],\n    \'товар\': [\'Яблоки\', \'Яблоки\', \'Груши\', \'Груши\', \'Яблоки\', \'Груши\'],\n    \'квартал\': [\'Q1\', \'Q1\', \'Q1\', \'Q2\', \'Q2\', \'Q2\'],\n    \'продажи\': [100, 150, 80, 90, 120, 110]\n})\n\n# Базовая сводная таблица\npivot = pd.pivot_table(\n    df,\n    values=\'продажи\',    # что агрегировать\n    index=\'регион\',      # строки\n    columns=\'товар\',     # столбцы\n    aggfunc=\'sum\',       # функция агрегации\n    fill_value=0         # заполнить NaN нулями\n)\nprint(pivot)\n# товар     Груши  Яблоки\n# регион\n# Север        80     220\n# Юг          200     150\n\n# Несколько значений и функций\npivot2 = pd.pivot_table(\n    df,\n    values=\'продажи\',\n    index=[\'регион\', \'квартал\'],  # несколько строк\n    aggfunc=[\'sum\', \'mean\']\n)\n\n# Margins — итоговые строки/столбцы\npivot3 = pd.pivot_table(\n    df, values=\'продажи\', index=\'регион\',\n    columns=\'товар\', aggfunc=\'sum\', margins=True\n)\nprint(pivot3)  # Добавит строку и столбец "All"' }
      ]
    },
    {
      id: 5,
      title: 'melt и stack/unstack',
      type: 'theory',
      content: [
        { type: 'text', value: 'melt преобразует "широкий" формат в "длинный". stack/unstack работают с MultiIndex. Полезны для изменения структуры данных.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\n\n# Широкий формат -> длинный\ndf_wide = pd.DataFrame({\n    \'имя\': [\'Алиса\', \'Боб\', \'Вася\'],\n    \'январь\': [50000, 60000, 55000],\n    \'февраль\': [52000, 62000, 57000],\n    \'март\': [54000, 64000, 59000]\n})\n\ndf_long = pd.melt(\n    df_wide,\n    id_vars=[\'имя\'],        # столбцы-идентификаторы\n    value_vars=[\'январь\', \'февраль\', \'март\'],  # что "плавить"\n    var_name=\'месяц\',       # имя для бывших столбцов\n    value_name=\'зарплата\'   # имя для значений\n)\nprint(df_long.head())\n# имя    месяц   зарплата\n# Алиса  январь  50000\n# Боб    январь  60000\n# ...\n\n# Обратное: pivot\ndf_back = df_long.pivot(index=\'имя\', columns=\'месяц\', values=\'зарплата\')\nprint(df_back)\n\n# stack/unstack с MultiIndex\npivot = pd.pivot_table(df_long, values=\'зарплата\',\n                       index=\'имя\', columns=\'месяц\')\nstacked = pivot.stack()   # колонки -> индекс\nprint(stacked.head())\nunstacked = stacked.unstack(\'месяц\')  # индекс -> колонки' }
      ]
    },
    {
      id: 6,
      title: 'Работа с временными рядами',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pandas отлично работает с временными данными. DatetimeIndex, resample, rolling — основные инструменты.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport numpy as np\n\n# Создание временного ряда\ndates = pd.date_range(\'2024-01-01\', periods=12, freq=\'M\')\nts = pd.Series(np.random.randint(100, 200, 12), index=dates)\nprint(ts)\n\n# Парсинг дат при чтении\ndf = pd.read_csv(\'sales.csv\', parse_dates=[\'date\'])\n\n# Работа с компонентами\ndf[\'дата\'] = pd.to_datetime(df[\'дата_строка\'])\ndf[\'год\'] = df[\'дата\'].dt.year\ndf[\'месяц\'] = df[\'дата\'].dt.month\ndf[\'день\'] = df[\'дата\'].dt.day\ndf[\'день_недели\'] = df[\'дата\'].dt.dayofweek  # 0=понедельник\n\n# Resample — перегруппировка по времени\ndaily_data = ts.resample(\'D\').mean()   # по дням\nweekly = ts.resample(\'W\').sum()        # по неделям\nmonthly = ts.resample(\'M\').mean()      # по месяцам\n\n# Rolling — скользящее окно\nrolling_mean = ts.rolling(window=3).mean()   # скользящее среднее за 3 периода\nrolling_std = ts.rolling(window=3).std()\n\n# Shift — сдвиг данных\nts_shifted = ts.shift(1)   # сдвиг на 1 период вперёд\nts_diff = ts - ts.shift(1)  # изменение за период' },
        { type: 'tip', value: 'Для работы с временными рядами обязательно установи datetime столбец как индекс: df = df.set_index("дата"). Тогда resample и многие другие операции работают напрямую.' }
      ]
    },
    {
      id: 7,
      title: 'Практика: Анализ продаж с groupby и merge',
      type: 'practice',
      difficulty: 'medium',
      description: 'Объедини таблицы продаж и товаров, выполни группировку и создай сводную таблицу.',
      requirements: [
        'Создай DataFrame products: id(1-5), название, категория(Электроника/Одежда/Еда), цена',
        'Создай DataFrame sales: id(1-20), product_id(1-5 случайно), количество(1-10), дата(2024-01 по 2024-06)',
        'Объедини sales и products через merge (left join по product_id=id)',
        'Добавь столбец "выручка" = количество * цена',
        'Через groupby найди: топ категорию по выручке, средний чек по месяцам',
        'Создай pivot_table: строки=месяц, столбцы=категория, значения=выручка (sum)'
      ],
      expectedOutput: 'Выручка по категориям:\n...\nСредний чек по месяцам:\n...\nPivot table:\nкатегория  Еда  Одежда  Электроника\nмесяц\n...',
      hint: 'pd.date_range для дат. После merge: merged["выручка"] = merged["количество"] * merged["цена"]. Для месяца: merged["месяц"] = merged["дата"].dt.month.',
      solution: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\n\nproducts = pd.DataFrame({\n    \'id\': [1, 2, 3, 4, 5],\n    \'название\': [\'Ноутбук\', \'Футболка\', \'Хлеб\', \'Телефон\', \'Джинсы\'],\n    \'категория\': [\'Электроника\', \'Одежда\', \'Еда\', \'Электроника\', \'Одежда\'],\n    \'цена\': [75000, 1500, 80, 45000, 3000]\n})\n\ndates = pd.date_range(\'2024-01-01\', \'2024-06-30\', periods=20)\nsales = pd.DataFrame({\n    \'id\': range(1, 21),\n    \'product_id\': np.random.randint(1, 6, 20),\n    \'количество\': np.random.randint(1, 11, 20),\n    \'дата\': np.random.choice(dates, 20)\n})\n\nmerged = pd.merge(sales, products, left_on=\'product_id\', right_on=\'id\', how=\'left\')\nmerged[\'выручка\'] = merged[\'количество\'] * merged[\'цена\']\nmerged[\'месяц\'] = merged[\'дата\'].dt.month\n\nprint("Выручка по категориям:")\nprint(merged.groupby(\'категория\')[\'выручка\'].sum().sort_values(ascending=False))\n\nprint("\\nСредний чек по месяцам:")\nprint(merged.groupby(\'месяц\')[\'выручка\'].mean().round(0))\n\npivot = pd.pivot_table(merged, values=\'выручка\', index=\'месяц\',\n                       columns=\'категория\', aggfunc=\'sum\', fill_value=0)\nprint("\\nPivot table:")\nprint(pivot)',
      explanation: 'merge(how="left") сохраняет все строки из sales даже если товар не найден. dt.month извлекает номер месяца из datetime. pivot_table с fill_value=0 заменяет NaN нулями там, где не было продаж.'
    }
  ]
}
