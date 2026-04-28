export default {
  id: 5,
  title: 'Python для ML: Pandas',
  description: 'Pandas — библиотека для работы с табличными данными: DataFrame, Series, загрузка, очистка, группировка и трансформация данных.',
  lessons: [
    {
      id: 1,
      title: 'DataFrame и Series',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Основные структуры Pandas'
        },
        {
          type: 'text',
          value: 'Pandas — главная библиотека для работы с табличными данными в Python. Series — одномерный массив с индексами (один столбец). DataFrame — двумерная таблица (набор Series). В ML Pandas используется для загрузки, исследования и предобработки данных.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import pandas as pd\nimport numpy as np\n\n# Создание DataFrame\ndata = {\n    "имя": ["Анна", "Борис", "Виктор", "Галина", "Дмитрий"],\n    "возраст": [25, 30, 35, 28, 42],\n    "зарплата": [50000, 70000, 90000, 65000, 120000],\n    "город": ["Москва", "СПб", "Москва", "Казань", "СПб"]\n}\n\ndf = pd.DataFrame(data)\nprint(df)\nprint(f"\\nФорма: {df.shape}")       # (5, 4)\nprint(f"Столбцы: {list(df.columns)}")\nprint(f"Типы данных:\\n{df.dtypes}")\n\n# Базовая статистика\nprint(f"\\n{df.describe()}")\n\n# Series — один столбец\nages = df["возраст"]\nprint(f"\\nТип: {type(ages)}")  # pandas.core.series.Series\nprint(f"Средний возраст: {ages.mean():.1f}")\n\n# Доступ к данным\nprint(f"\\nПервые 2 строки:\\n{df.head(2)}")\nprint(f"\\nСтрока 0: {df.iloc[0].to_dict()}")  # по номеру\nprint(f"Зарплаты: {df[\'зарплата\'].values}")  # numpy массив'
        },
        {
          type: 'tip',
          value: 'df.info() — быстрый способ узнать типы данных, количество непустых значений и использование памяти. Запускайте в начале каждого анализа.'
        }
      ]
    },
    {
      id: 2,
      title: 'Загрузка и исследование данных',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'EDA с Pandas'
        },
        {
          type: 'text',
          value: 'Exploratory Data Analysis (EDA) — первый и важнейший этап ML-проекта. С помощью Pandas мы загружаем данные, изучаем их структуру, находим проблемы (пропуски, выбросы, дубликаты).'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import pandas as pd\nimport numpy as np\n\n# Загрузка данных (используем встроенный датасет)\nfrom sklearn.datasets import load_iris\niris = load_iris()\ndf = pd.DataFrame(iris.data, columns=iris.feature_names)\ndf["target"] = iris.target\n\n# Первый взгляд\nprint(df.head())\nprint(f"\\nФорма: {df.shape}")\nprint(f"\\nИнформация:")\nprint(df.info())\n\n# Статистика\nprint(f"\\nОписательная статистика:\\n{df.describe()}")\n\n# Проверка пропусков\nprint(f"\\nПропуски:\\n{df.isnull().sum()}")\n\n# Проверка дубликатов\nprint(f"Дубликатов: {df.duplicated().sum()}")\n\n# Распределение целевой переменной\nprint(f"\\nРаспределение классов:\\n{df[\'target\'].value_counts()}")\n\n# Уникальные значения\nprint(f"Уникальных классов: {df[\'target\'].nunique()}")\n\n# Корреляция\nprint(f"\\nКорреляция с target:\\n{df.corr()[\'target\'].sort_values()}")'
        },
        {
          type: 'note',
          value: 'Стандартный чек-лист EDA: shape, info(), describe(), isnull().sum(), duplicated().sum(), value_counts() для категориальных, corr() для числовых.'
        }
      ]
    },
    {
      id: 3,
      title: 'Фильтрация и выборка данных',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Выборка подмножеств данных'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import pandas as pd\nimport numpy as np\n\n# Создаём датасет\nnp.random.seed(42)\ndf = pd.DataFrame({\n    "возраст": np.random.randint(18, 65, 100),\n    "зарплата": np.random.randint(30000, 200000, 100),\n    "город": np.random.choice(["Москва", "СПб", "Казань"], 100),\n    "опыт": np.random.randint(0, 20, 100)\n})\n\n# Фильтрация по условию\nhigh_salary = df[df["зарплата"] > 150000]\nprint(f"Зарплата > 150k: {len(high_salary)} человек")\n\n# Множественные условия\nmoscow_senior = df[(df["город"] == "Москва") & (df["опыт"] > 10)]\nprint(f"Москва + опыт > 10: {len(moscow_senior)} человек")\n\n# isin — одно из нескольких значений\nbig_cities = df[df["город"].isin(["Москва", "СПб"])]\nprint(f"Москва или СПб: {len(big_cities)} человек")\n\n# query — SQL-подобный синтаксис\nresult = df.query("зарплата > 100000 and возраст < 30")\nprint(f"Молодые и высокооплачиваемые: {len(result)}")\n\n# loc и iloc\nprint(f"\\nloc (по имени): {df.loc[0, \'возраст\']}")        # значение\nprint(f"iloc (по номеру): {df.iloc[0:3, 0:2]}")            # срез\n\n# Сортировка\ntop_paid = df.nlargest(5, "зарплата")\nprint(f"\\nТоп-5 по зарплате:\\n{top_paid}")\n\n# Случайная выборка (для ML)\nsample = df.sample(n=10, random_state=42)\nprint(f"\\nСлучайная выборка (10 строк):\\n{sample.head()}")'
        }
      ]
    },
    {
      id: 4,
      title: 'Обработка пропусков и группировка',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Работа с пропущенными значениями и агрегация'
        },
        {
          type: 'text',
          value: 'Пропуски в данных — частая проблема в ML. Pandas предоставляет инструменты для обнаружения и обработки пропусков. Группировка (groupby) позволяет агрегировать данные по категориям.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import pandas as pd\nimport numpy as np\n\n# Данные с пропусками\ndf = pd.DataFrame({\n    "имя": ["Анна", "Борис", "Виктор", "Галина", "Дмитрий"],\n    "возраст": [25, np.nan, 35, 28, np.nan],\n    "зарплата": [50000, 70000, np.nan, 65000, 120000],\n    "отдел": ["IT", "IT", "HR", "HR", "IT"]\n})\n\n# Обнаружение пропусков\nprint(f"Пропуски:\\n{df.isnull().sum()}")\nprint(f"\\n% пропусков:\\n{(df.isnull().sum() / len(df) * 100).round(1)}")\n\n# Стратегии заполнения\ndf_filled = df.copy()\ndf_filled["возраст"] = df_filled["возраст"].fillna(df["возраст"].median())\ndf_filled["зарплата"] = df_filled["зарплата"].fillna(df["зарплата"].mean())\nprint(f"\\nПосле заполнения:\\n{df_filled}")\n\n# Удаление строк с пропусками\ndf_dropped = df.dropna()\nprint(f"\\nПосле удаления пропусков: {len(df_dropped)} строк")\n\n# GroupBy — агрегация по группам\ngrouped = df_filled.groupby("отдел").agg({\n    "возраст": "mean",\n    "зарплата": ["mean", "max", "count"]\n})\nprint(f"\\nГруппировка по отделам:\\n{grouped}")\n\n# Несколько агрегаций\nstats = df_filled.groupby("отдел")["зарплата"].describe()\nprint(f"\\nСтатистика зарплат по отделам:\\n{stats}")'
        },
        {
          type: 'warning',
          value: 'Выбор стратегии заполнения пропусков влияет на качество модели! Медиана — для числовых с выбросами, среднее — для нормально распределённых, мода — для категориальных.'
        }
      ]
    },
    {
      id: 5,
      title: 'Трансформация данных',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Apply, map и создание новых признаков'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\ndf = pd.DataFrame({\n    "имя": ["Анна", "Борис", "Виктор", "Галина", "Дмитрий"],\n    "дата_рождения": pd.to_datetime(["1998-05-15", "1993-11-20", "1988-03-10", \n                                      "1995-07-22", "1981-12-01"]),\n    "зарплата": [50000, 70000, 90000, 65000, 120000],\n    "город": ["Москва", "СПб", "Москва", "Казань", "СПб"]\n})\n\n# Apply — применение функции к столбцу\ndf["зарплата_тыс"] = df["зарплата"].apply(lambda x: x / 1000)\nprint(df[["имя", "зарплата_тыс"]])\n\n# Map — замена значений\ncity_map = {"Москва": "MSK", "СПб": "SPB", "Казань": "KZN"}\ndf["город_код"] = df["город"].map(city_map)\n\n# Извлечение из даты\ndf["год_рождения"] = df["дата_рождения"].dt.year\ndf["возраст"] = 2025 - df["год_рождения"]\n\n# Бинирование (binning)\ndf["зарплата_категория"] = pd.cut(\n    df["зарплата"], \n    bins=[0, 60000, 100000, float("inf")],\n    labels=["низкая", "средняя", "высокая"]\n)\n\nprint(f"\\n{df[[\'имя\', \'возраст\', \'зарплата_категория\', \'город_код\']]}")\n\n# One-Hot Encoding — для ML\ndf_encoded = pd.get_dummies(df[["город"]], prefix="город")\nprint(f"\\nOne-Hot Encoding:\\n{df_encoded}")\n\n# Merge — объединение таблиц\ndepartments = pd.DataFrame({\n    "город": ["Москва", "СПб", "Казань"],\n    "офис": ["Центральный", "Невский", "Кремлёвский"]\n})\ndf_merged = df.merge(departments, on="город")\nprint(f"\\nПосле merge:\\n{df_merged[[\'имя\', \'город\', \'офис\']]}")'
        },
        {
          type: 'tip',
          value: 'pd.get_dummies() — быстрый способ сделать One-Hot Encoding для категориальных признаков. Но для ML-пайплайна лучше использовать sklearn.preprocessing.OneHotEncoder, который запоминает категории.'
        }
      ]
    },
    {
      id: 6,
      title: 'Практика: Подготовка данных для ML',
      type: 'practice',
      difficulty: 'medium',
      description: 'Подготовьте датасет для обучения ML модели: обработайте пропуски, закодируйте категории, создайте новые признаки.',
      requirements: [
        'Создайте DataFrame с 6 сотрудниками: имя, возраст (с пропуском), зарплата, отдел (IT/HR/Sales), опыт_лет',
        'Заполните пропуск возраста медианой',
        'Создайте признак зарплата_на_год_опыта = зарплата / опыт_лет',
        'Сделайте One-Hot Encoding для отдела',
        'Выведите финальный DataFrame, готовый для ML (только числовые столбцы)'
      ],
      hint: 'Используйте fillna() для пропусков, pd.get_dummies() для кодирования, и обратите внимание на деление на 0 если опыт = 0.',
      expectedOutput: 'Пропуски до обработки:\nвозраст    1\n...\nФинальный DataFrame (числовые столбцы):\n   возраст  зарплата  опыт_лет  зп_на_год  отдел_HR  отдел_IT  отдел_Sales\n...',
      solution: 'import pandas as pd\nimport numpy as np\n\ndf = pd.DataFrame({\n    "имя": ["Анна", "Борис", "Виктор", "Галина", "Дмитрий", "Елена"],\n    "возраст": [25, 30, np.nan, 28, 42, 35],\n    "зарплата": [50000, 70000, 90000, 65000, 120000, 80000],\n    "отдел": ["IT", "HR", "IT", "Sales", "IT", "HR"],\n    "опыт_лет": [2, 5, 8, 3, 15, 7]\n})\n\n# Пропуски\nprint(f"Пропуски до обработки:\\n{df.isnull().sum()}")\ndf["возраст"] = df["возраст"].fillna(df["возраст"].median())\n\n# Новый признак\ndf["зп_на_год"] = (df["зарплата"] / df["опыт_лет"]).round(0)\n\n# One-Hot Encoding\ndf_encoded = pd.get_dummies(df, columns=["отдел"], prefix="отдел")\n\n# Только числовые столбцы для ML\nnumeric_cols = df_encoded.select_dtypes(include=[np.number]).columns\ndf_ml = df_encoded[numeric_cols]\n\nprint(f"\\nФинальный DataFrame (числовые столбцы):\\n{df_ml}")',
      explanation: 'Подготовка данных — ключевой этап ML. Пропуски заполняем медианой (устойчива к выбросам). Feature Engineering: зарплата_на_год_опыта может быть более информативным признаком, чем зарплата и опыт по отдельности. One-Hot Encoding превращает категорию в бинарные столбцы, понятные ML-алгоритмам. select_dtypes() удобно отбирает только числовые столбцы.'
    }
  ]
}
