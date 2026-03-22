export default {
  id: 45,
  title: 'Pandas: основы',
  description: 'Series, DataFrame, чтение данных через read_csv, базовые операции с табличными данными',
  lessons: [
    {
      id: 1,
      title: 'Series: одномерные данные',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pandas Series — одномерный массив с метками (индексом). Подобен словарю, но оптимизирован для числовых операций и работы с пропущенными значениями.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport numpy as np\n\n# Создание Series\ns1 = pd.Series([10, 20, 30, 40, 50])\nprint(s1)\n# 0    10\n# 1    20\n# dtype: int64\n\n# С именованным индексом\ns2 = pd.Series([85, 92, 78, 96], index=[\'Алиса\', \'Боб\', \'Вася\', \'Дина\'])\nprint(s2[\'Алиса\'])  # 85\nprint(s2[\'Боб\':\'Вася\'])  # срез по меткам (включительно!)\n\n# Из словаря\ndata = {\'яблоки\': 5, \'груши\': 3, \'бананы\': 8}\nfruit = pd.Series(data)\nprint(fruit.index)   # Index([\'яблоки\', \'груши\', \'бананы\'])\nprint(fruit.values)  # [5 3 8]\n\n# Арифметика (выравнивание по индексу)\na = pd.Series([1, 2, 3], index=[\'x\', \'y\', \'z\'])\nb = pd.Series([10, 20, 30], index=[\'y\', \'z\', \'w\'])\nprint(a + b)\n# x     NaN  — x есть только в a\n# y    12.0  — y есть в обоих\n# z    23.0\n# w     NaN  — w есть только в b\n\n# NaN — Not a Number, пропущенное значение\nprint(pd.isna(a + b))  # [True, False, False, True]' },
        { type: 'tip', value: 'Series автоматически выравнивает данные по индексу при арифметических операциях. Это мощная функция, но следи за NaN — они "заражают" результат.' }
      ]
    },
    {
      id: 2,
      title: 'DataFrame: двумерные данные',
      type: 'theory',
      content: [
        { type: 'text', value: 'DataFrame — таблица с именованными столбцами и строками. Каждый столбец — это Series с общим индексом. Основная структура данных в Pandas.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\n\n# Из словаря списков\ndf = pd.DataFrame({\n    \'имя\': [\'Алиса\', \'Боб\', \'Вася\', \'Дина\'],\n    \'возраст\': [25, 30, 22, 28],\n    \'зарплата\': [60000, 80000, 55000, 75000],\n    \'отдел\': [\'IT\', \'HR\', \'IT\', \'Finance\']\n})\n\nprint(df)\nprint(df.shape)       # (4, 4)\nprint(df.dtypes)      # типы данных каждого столбца\nprint(df.columns)     # Index([\'имя\', \'возраст\', ...])\nprint(df.index)       # RangeIndex(start=0, stop=4, step=1)\n\n# Информация о DataFrame\nprint(df.info())      # типы, количество не-NaN\nprint(df.describe())  # статистика числовых столбцов\n\n# Из списка словарей (JSON-like)\nrecords = [\n    {\'товар\': \'Ноутбук\', \'цена\': 75000},\n    {\'товар\': \'Телефон\', \'цена\': 45000},\n]\ndf2 = pd.DataFrame(records)\nprint(df2)' },
        { type: 'heading', value: 'Работа с индексом DataFrame' },
        { type: 'code', language: 'python', value: 'import pandas as pd\n\ndf = pd.DataFrame({\n    \'имя\': [\'Алиса\', \'Боб\', \'Вася\'],\n    \'зарплата\': [60000, 80000, 55000]\n})\n\n# Установить столбец как индекс\ndf = df.set_index(\'имя\')\nprint(df)\n#           зарплата\n# имя\n# Алиса     60000\n# Боб       80000\n# Вася      55000\n\n# Доступ по индексу\nprint(df.loc[\'Алиса\'])       # серия с данными Алисы\nprint(df.loc[\'Боб\', \'зарплата\'])  # 80000\n\n# Сброс индекса обратно в столбец\ndf_reset = df.reset_index()  # имя снова становится столбцом\n\n# MultiIndex — иерархический индекс\ndf2 = pd.DataFrame({\n    \'продажи\': [100, 150, 200, 250]\n}, index=pd.MultiIndex.from_tuples(\n    [(\'2024\', \'Q1\'), (\'2024\', \'Q2\'), (\'2025\', \'Q1\'), (\'2025\', \'Q2\')],\n    names=[\'год\', \'квартал\']\n))\nprint(df2.loc[\'2024\'])   # все кварталы 2024\nprint(df2.loc[(\'2024\', \'Q1\')])  # конкретный период' },
        { type: 'tip', value: 'Используй осмысленный индекс (set_index) когда часто обращаешься к данным по конкретному ключу — это ускоряет операцию loc. Для временных рядов установи DatetimeIndex через pd.to_datetime().' }
      ]
    },
    {
      id: 3,
      title: 'Выбор данных: loc, iloc, []',
      type: 'theory',
      content: [
        { type: 'text', value: 'Три способа выбора данных: [] для столбцов, .loc для выбора по меткам, .iloc для выбора по позиции.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\n\ndf = pd.DataFrame({\n    \'имя\': [\'Алиса\', \'Боб\', \'Вася\', \'Дина\'],\n    \'возраст\': [25, 30, 22, 28],\n    \'зарплата\': [60000, 80000, 55000, 75000]\n})\n\n# Выбор столбца — возвращает Series\nprint(df[\'имя\'])      # Series с именами\nprint(df[\'возраст\'])\n\n# Несколько столбцов — возвращает DataFrame\nprint(df[[\'имя\', \'зарплата\']])\n\n# .loc[строки, столбцы] — по меткам (включительно с обеих сторон)\nprint(df.loc[0, \'имя\'])          # \'Алиса\'\nprint(df.loc[1:3, \'имя\':\'возраст\'])  # строки 1-3, столбцы имя и возраст\nprint(df.loc[df[\'возраст\'] > 25])    # фильтрация по условию\n\n# .iloc[строки, столбцы] — по позиции (не включает конечный!)\nprint(df.iloc[0, 1])      # 25 — первая строка, второй столбец\nprint(df.iloc[:2, 1:])    # первые 2 строки, столбцы с 1 по конец\nprint(df.iloc[-1])        # последняя строка\n\n# Присвоение\ndf.loc[df[\'имя\'] == \'Боб\', \'зарплата\'] = 90000\nprint(df.loc[df[\'имя\'] == \'Боб\', \'зарплата\'])  # 90000' },
        { type: 'warning', value: 'Никогда не используй df[\'col\'][row] — это "цепное индексирование" и может привести к SettingWithCopyWarning. Всегда используй df.loc[row, \'col\'] для изменения данных.' }
      ]
    },
    {
      id: 4,
      title: 'read_csv и запись данных',
      type: 'theory',
      content: [
        { type: 'text', value: 'pd.read_csv — основная функция для загрузки данных. Поддерживает множество параметров для настройки чтения.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\n\n# Базовое чтение\ndf = pd.read_csv(\'data.csv\')\n\n# Параметры\ndf = pd.read_csv(\n    \'data.csv\',\n    sep=\',\',           # разделитель (;  \\t для TSV)\n    header=0,          # строка с заголовками (None — без заголовков)\n    index_col=\'id\',    # столбец как индекс\n    usecols=[\'name\', \'age\'],  # только эти столбцы\n    dtype={\'age\': int, \'salary\': float},  # явные типы\n    na_values=[\'N/A\', \'-\', \'\'],  # что считать NaN\n    encoding=\'utf-8\',  # кодировка\n    nrows=1000         # читать только первые N строк\n)\n\n# Другие форматы\ndf_excel = pd.read_excel(\'data.xlsx\', sheet_name=\'Sheet1\')\ndf_json = pd.read_json(\'data.json\')\ndf_sql = pd.read_sql(\'SELECT * FROM users\', conn)\n\n# Запись\ndf.to_csv(\'output.csv\', index=False)  # index=False — не записывать индекс\ndf.to_excel(\'output.xlsx\', index=False)\ndf.to_json(\'output.json\', orient=\'records\')\n\n# Быстрый просмотр\nprint(df.head(5))    # первые 5 строк\nprint(df.tail(3))    # последние 3 строки\nprint(df.sample(3))  # 3 случайные строки' },
        { type: 'tip', value: 'Для больших файлов используй chunksize: for chunk in pd.read_csv("big.csv", chunksize=10000): process(chunk) — обработка по частям без загрузки всего файла в память.' }
      ]
    },
    {
      id: 5,
      title: 'Пропущенные значения',
      type: 'theory',
      content: [
        { type: 'text', value: 'Работа с NaN — одна из ключевых задач в Data Science. Pandas предоставляет инструменты для обнаружения, удаления и заполнения пропущенных значений.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\n    \'имя\': [\'Алиса\', \'Боб\', None, \'Дина\'],\n    \'возраст\': [25, np.nan, 22, 28],\n    \'зарплата\': [60000, 80000, np.nan, np.nan]\n})\n\n# Обнаружение NaN\nprint(df.isnull())           # DataFrame булевых значений\nprint(df.isnull().sum())     # количество NaN в каждом столбце\nprint(df.isnull().sum().sum())  # всего NaN\nprint(df.notnull().sum())    # количество не-NaN\n\n# Удаление строк с NaN\ndf_clean = df.dropna()            # строки с любым NaN\ndf_clean2 = df.dropna(subset=[\'возраст\'])  # NaN только в возрасте\ndf_clean3 = df.dropna(how=\'all\')  # строки где ВСЕ значения NaN\n\n# Заполнение NaN\ndf_filled = df.fillna(0)              # все NaN -> 0\ndf_filled2 = df.fillna({\'возраст\': df[\'возраст\'].mean(),\n                         \'зарплата\': df[\'зарплата\'].median()})\n\n# Forward fill и backward fill\ndf[\'зарплата\'].fillna(method=\'ffill\')  # заполнить предыдущим значением\ndf[\'зарплата\'].fillna(method=\'bfill\')  # заполнить следующим значением\n\n# interpolate для временных рядов\ndf[\'возраст\'] = df[\'возраст\'].interpolate()  # линейная интерполяция' },
        { type: 'heading', value: 'Стратегии заполнения пропущенных значений' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport numpy as np\n\n# Заполнение значением группы (например, медиана по отделу)\ndf = pd.DataFrame({\n    \'отдел\': [\'IT\', \'IT\', \'HR\', \'HR\', \'IT\'],\n    \'зарплата\': [70000, np.nan, 55000, np.nan, 80000]\n})\n\n# Заполнить NaN медианной зарплатой того же отдела\ndf[\'зарплата\'] = df.groupby(\'отдел\')[\'зарплата\'].transform(\n    lambda x: x.fillna(x.median())\n)\nprint(df)\n# IT: NaN заменён на медиану IT (75000)\n# HR: NaN заменён на медиану HR (55000)\n\n# Проверка паттерна пропущенных значений\ndef missing_report(df):\n    """Сводка о пропущенных значениях"""\n    missing = df.isnull().sum()\n    percent = (missing / len(df) * 100).round(2)\n    return pd.DataFrame({\n        \'пропущено\': missing,\n        \'процент\': percent\n    }).sort_values(\'процент\', ascending=False)\n\ndf_test = pd.DataFrame({\n    \'a\': [1, None, 3, None],\n    \'b\': [1, 2, None, 4]\n})\nprint(missing_report(df_test))' },
        { type: 'note', value: 'groupby().transform(fillna) заполняет NaN значением из группы — более точная стратегия чем глобальная медиана. Например, зарплата джуниора должна заполняться медианой джуниоров, а не всех сотрудников.' }
      ]
    },
    {
      id: 6,
      title: 'Операции с DataFrame',
      type: 'theory',
      content: [
        { type: 'text', value: 'Pandas поддерживает создание новых столбцов, применение функций, фильтрацию и базовые преобразования данных.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\n\ndf = pd.DataFrame({\n    \'имя\': [\'Алиса\', \'Боб\', \'Вася\', \'Дина\'],\n    \'зарплата\': [60000, 80000, 55000, 75000],\n    \'отдел\': [\'IT\', \'HR\', \'IT\', \'Finance\']\n})\n\n# Создание нового столбца\ndf[\'бонус\'] = df[\'зарплата\'] * 0.1\ndf[\'уровень\'] = df[\'зарплата\'].apply(lambda x: \'senior\' if x > 65000 else \'junior\')\n\n# apply с функцией\ndef classify(row):\n    if row[\'зарплата\'] > 70000 and row[\'отдел\'] == \'IT\':\n        return \'Топ IT\'\n    return \'Обычный\'\n\ndf[\'класс\'] = df.apply(classify, axis=1)\n\n# Фильтрация\nit_dept = df[df[\'отдел\'] == \'IT\']\nhigh_salary = df[df[\'зарплата\'].between(60000, 80000)]\n\n# Сортировка\ndf_sorted = df.sort_values(\'зарплата\', ascending=False)\ndf_multi = df.sort_values([\'отдел\', \'зарплата\'], ascending=[True, False])\n\n# Переименование и удаление\ndf = df.rename(columns={\'имя\': \'name\', \'зарплата\': \'salary\'})\ndf = df.drop(columns=[\'бонус\'])  # удалить столбец\ndf = df.drop(index=[0, 2])       # удалить строки\n\n# Сброс индекса\ndf = df.reset_index(drop=True)' },
        { type: 'tip', value: 'Используй .assign() для "pipeline" стиля: df.assign(бонус=df.salary*0.1).assign(итого=lambda x: x.salary + x.бонус). Это удобнее цепочек присваиваний.' }
      ]
    },
    {
      id: 7,
      title: 'value_counts, unique, sort_values',
      type: 'theory',
      content: [
        { type: 'text', value: 'Функции для исследования данных: value_counts показывает частоту значений, unique — уникальные значения, nunique — их количество.' },
        { type: 'code', language: 'python', value: 'import pandas as pd\n\ndf = pd.DataFrame({\n    \'отдел\': [\'IT\', \'HR\', \'IT\', \'IT\', \'Finance\', \'HR\', \'IT\'],\n    \'уровень\': [\'senior\', \'junior\', \'middle\', \'senior\', \'junior\', \'senior\', \'middle\'],\n    \'зарплата\': [90000, 50000, 70000, 95000, 55000, 80000, 72000]\n})\n\n# value_counts\nprint(df[\'отдел\'].value_counts())\n# IT         4\n# HR         2\n# Finance    1\n\nprint(df[\'отдел\'].value_counts(normalize=True))  # в долях (0 до 1)\n\n# unique и nunique\nprint(df[\'отдел\'].unique())    # [\'IT\' \'HR\' \'Finance\']\nprint(df[\'отдел\'].nunique())   # 3\n\n# Статистика по числовым столбцам\nprint(df[\'зарплата\'].describe())\n# count      7.000000\n# mean   73142.857143\n# std    17033.170792\n# min    50000.000000\n# 25%    55000.000000\n# 50%    72000.000000\n# 75%    90000.000000\n# max    95000.000000\n\n# crosstab — перекрёстная таблица\nct = pd.crosstab(df[\'отдел\'], df[\'уровень\'])\nprint(ct)\n\n# Условные операции\ndf[\'высокая_зп\'] = df[\'зарплата\'] > df[\'зарплата\'].median()\nprint(df[\'высокая_зп\'].value_counts())' },
        { type: 'heading', value: 'pd.cut, pd.qcut и категоризация данных' },
        { type: 'code', language: 'python', value: 'import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\n    \'зарплата\': [45000, 62000, 78000, 95000, 120000, 55000, 88000]\n})\n\n# pd.cut — разбивка по заданным границам\ndf[\'категория\'] = pd.cut(\n    df[\'зарплата\'],\n    bins=[0, 60000, 80000, float(\'inf\')],\n    labels=[\'низкая\', \'средняя\', \'высокая\']\n)\nprint(df[\'категория\'].value_counts())\n# средняя    3\n# высокая    2\n# низкая     2\n\n# pd.qcut — разбивка по квантилям (равные группы)\ndf[\'квантиль\'] = pd.qcut(\n    df[\'зарплата\'],\n    q=3,  # 3 равные группы\n    labels=[\'нижняя треть\', \'средняя треть\', \'верхняя треть\']\n)\nprint(df[\'квантиль\'].value_counts())\n\n# Получить границы интервалов\n_, bins = pd.cut(df[\'зарплата\'], bins=3, retbins=True)\nprint(bins.round())' },
        { type: 'tip', value: 'pd.cut разбивает по фиксированным диапазонам (удобно когда смысл имеют конкретные границы). pd.qcut разбивает по квантилям — группы получаются примерно одинакового размера.' }
      ]
    },
    {
      id: 8,
      title: 'Практика: Анализ CSV файла',
      type: 'practice',
      difficulty: 'easy',
      description: 'Загрузи, очисти и исследуй датасет с данными о сотрудниках.',
      requirements: [
        'Создай DataFrame из 20 строк данных о сотрудниках: имя, отдел, зарплата, стаж, рейтинг (от 1 до 5)',
        'Добавь 3-4 значения NaN в разные столбцы',
        'Выведи основную статистику: info(), describe(), isnull().sum()',
        'Заполни NaN в зарплате медианным значением, в рейтинге — средним',
        'Создай столбец "уровень": junior (<2 лет), middle (2-5), senior (>5)',
        'Найди топ-5 сотрудников по зарплате и выведи их имена и зарплаты',
        'Подсчитай количество сотрудников в каждом отделе через value_counts()'
      ],
      expectedOutput: 'Пропущенных значений:\nзарплата    2\nрейтинг     1\n...\nТоп-5 по зарплате:\n...\nРаспределение по отделам:\nIT         N\nHR         N\n...',
      hint: 'Используй pd.cut() или np.select() для создания столбца уровней по стажу. sort_values(ascending=False).head(5) для топ-5.',
      solution: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\nn = 20\ndf = pd.DataFrame({\n    \'имя\': [f\'Сотрудник_{i}\' for i in range(n)],\n    \'отдел\': np.random.choice([\'IT\', \'HR\', \'Finance\', \'Marketing\'], n),\n    \'зарплата\': np.random.randint(50000, 120000, n).astype(float),\n    \'стаж\': np.random.randint(0, 15, n),\n    \'рейтинг\': np.random.uniform(1, 5, n)\n})\n\n# Добавим NaN\ndf.loc[[3, 7], \'зарплата\'] = np.nan\ndf.loc[12, \'рейтинг\'] = np.nan\n\nprint(df.info())\nprint(df.describe())\nprint("\\nПропущенных:")\nprint(df.isnull().sum())\n\ndf[\'зарплата\'].fillna(df[\'зарплата\'].median(), inplace=True)\ndf[\'рейтинг\'].fillna(df[\'рейтинг\'].mean(), inplace=True)\n\ndef get_level(years):\n    if years < 2: return \'junior\'\n    if years <= 5: return \'middle\'\n    return \'senior\'\n\ndf[\'уровень\'] = df[\'стаж\'].apply(get_level)\n\ntop5 = df.sort_values(\'зарплата\', ascending=False).head(5)\nprint("\\nТоп-5 по зарплате:")\nprint(top5[[\'имя\', \'зарплата\']])\n\nprint("\\nРаспределение по отделам:")\nprint(df[\'отдел\'].value_counts())',
      explanation: 'fillna(inplace=True) изменяет DataFrame на месте. apply(func) применяет функцию к каждому элементу Series. sort_values().head() — идиоматичный способ получить топ-N.'
    }
  ]
}
