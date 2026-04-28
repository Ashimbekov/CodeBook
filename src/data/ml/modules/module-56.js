export default {
  id: 56,
  title: 'Kaggle: Titanic — первый конкурс',
  description: 'Пошаговое прохождение легендарного Kaggle-конкурса Titanic: от разведочного анализа до submission с accuracy 0.80+.',
  lessons: [
    {
      id: 1,
      title: 'Введение в Kaggle',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Что такое Kaggle'
        },
        {
          type: 'text',
          value: 'Kaggle — крупнейшая платформа для соревнований по Data Science и Machine Learning. Здесь компании публикуют реальные задачи с призовыми фондами, а тысячи специалистов со всего мира соревнуются за лучшее решение. Kaggle — лучший способ получить практический опыт в ML.'
        },
        {
          type: 'heading',
          value: 'Как устроены конкурсы'
        },
        {
          type: 'text',
          value: 'Каждый конкурс имеет: описание задачи, обучающий датасет (train.csv) с ответами, тестовый датасет (test.csv) без ответов, метрику оценки и дедлайн. Вы обучаете модель на train, делаете предсказания на test и загружаете файл submission.csv на платформу.'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Типичная структура Kaggle-конкурса\n#\n# competition/\n# ├── train.csv        # Обучающие данные с целевой переменной\n# ├── test.csv         # Тестовые данные без ответов\n# └── sample_submission.csv  # Формат файла для загрузки\n\nimport pandas as pd\n\n# Загрузка данных\ntrain = pd.read_csv("train.csv")\ntest = pd.read_csv("test.csv")\nsample = pd.read_csv("sample_submission.csv")\n\nprint(f"Train shape: {train.shape}")\nprint(f"Test shape: {test.shape}")\nprint(f"Submission format:\\n{sample.head()}")'
        },
        {
          type: 'heading',
          value: 'Система оценки: Public и Private Leaderboard'
        },
        {
          type: 'text',
          value: 'При загрузке submission ваш score рассчитывается на части тестовых данных (Public LB, обычно 30-50%). Финальный рейтинг определяется по оставшейся части (Private LB). Это предотвращает переобучение на public тест. Многие решения, хорошие на Public LB, проваливаются на Private — это называется "shake-up".'
        },
        {
          type: 'list',
          value: [
            'Competitions — конкурсы с призами от компаний',
            'Datasets — открытые датасеты для практики',
            'Notebooks — Jupyter-ноутбуки с кодом и анализами',
            'Discussions — форумы с обсуждением подходов',
            'Система рангов: Novice → Contributor → Expert → Master → Grandmaster'
          ]
        },
        {
          type: 'tip',
          value: 'Kaggle Notebooks дают бесплатный GPU/TPU для обучения моделей. Начинайте с Getting Started конкурсов (Titanic, House Prices, Digit Recognizer) — они не закрываются и имеют много обучающих материалов.'
        }
      ]
    },
    {
      id: 2,
      title: 'Загрузка и EDA Titanic',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Описание конкурса Titanic'
        },
        {
          type: 'text',
          value: 'Titanic: Machine Learning from Disaster — самый популярный конкурс для новичков. Задача: предсказать, какие пассажиры выжили при крушении Титаника. Метрика — accuracy (доля правильных предсказаний). Базовый score: 0.76 (все женщины выживают), цель: 0.80+.'
        },
        {
          type: 'heading',
          value: 'Описание признаков'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Признаки датасета Titanic\n# PassengerId  — уникальный ID пассажира\n# Survived     — целевая переменная (0 = погиб, 1 = выжил)\n# Pclass       — класс билета (1 = первый, 2 = второй, 3 = третий)\n# Name         — имя пассажира (содержит Title: Mr, Mrs, Miss...)\n# Sex          — пол (male / female)\n# Age          — возраст (есть пропуски ~20%)\n# SibSp        — кол-во братьев/сестёр/супругов на борту\n# Parch        — кол-во родителей/детей на борту\n# Ticket       — номер билета\n# Fare         — стоимость билета\n# Cabin        — номер каюты (пропущено ~77%!)\n# Embarked     — порт посадки (C = Cherbourg, Q = Queenstown, S = Southampton)\n\nimport pandas as pd\nimport numpy as np\n\n# Создаём реалистичный датасет Titanic\nnp.random.seed(42)\nn = 891\n\ntitles = np.random.choice(["Mr", "Mrs", "Miss", "Master"], n, p=[0.55, 0.15, 0.2, 0.1])\nnames = [f"{t}. Passenger_{i}" for i, t in enumerate(titles)]\n\ndf = pd.DataFrame({\n    "PassengerId": range(1, n+1),\n    "Pclass": np.random.choice([1,2,3], n, p=[0.24, 0.21, 0.55]),\n    "Name": names,\n    "Sex": np.where(np.isin(titles, ["Mr","Master"]), "male", "female"),\n    "Age": np.where(np.random.random(n)<0.2, np.nan,\n                    np.where(titles=="Master", np.random.uniform(1,14,n),\n                             np.random.uniform(16,70,n))),\n    "SibSp": np.random.choice([0,1,2,3,4], n, p=[0.6,0.2,0.1,0.05,0.05]),\n    "Parch": np.random.choice([0,1,2,3], n, p=[0.7,0.15,0.1,0.05]),\n    "Fare": np.random.exponential(30, n).round(4),\n    "Embarked": np.random.choice(["S","C","Q"], n, p=[0.72,0.19,0.09]),\n})\n\nsurvival_p = (0.2 + 0.4*(df["Sex"]=="female") - 0.08*(df["Pclass"]-1)\n              + 0.15*(titles=="Master") + 0.001*df["Fare"]).clip(0.05, 0.95)\ndf["Survived"] = (np.random.random(n) < survival_p).astype(int)\n\nprint(df.info())\nprint(f"\\nОбщая выживаемость: {df[\'Survived\'].mean():.1%}")'
        },
        {
          type: 'heading',
          value: 'Визуализация выживаемости'
        },
        {
          type: 'code',
          language: 'python',
          value: '# EDA: ключевые паттерны выживаемости\nprint("=== Выживаемость по группам ===")\n\n# По полу\nprint("\\nПо полу:")\nfor sex in ["female", "male"]:\n    rate = df[df["Sex"]==sex]["Survived"].mean()\n    print(f"  {sex}: {rate:.1%}")\n\n# По классу\nprint("\\nПо классу билета:")\nfor pclass in [1, 2, 3]:\n    rate = df[df["Pclass"]==pclass]["Survived"].mean()\n    count = (df["Pclass"]==pclass).sum()\n    print(f"  Класс {pclass}: {rate:.1%} (n={count})")\n\n# По порту посадки\nprint("\\nПо порту посадки:")\nfor emb in ["C", "Q", "S"]:\n    rate = df[df["Embarked"]==emb]["Survived"].mean()\n    print(f"  {emb}: {rate:.1%}")\n\n# Возраст\nprint(f"\\nСредний возраст выживших: {df[df[\'Survived\']==1][\'Age\'].mean():.1f}")\nprint(f"Средний возраст погибших: {df[df[\'Survived\']==0][\'Age\'].mean():.1f}")\n\n# Пропуски\nprint(f"\\nПропуски:")\nfor col in df.columns:\n    missing = df[col].isnull().sum()\n    if missing > 0:\n        print(f"  {col}: {missing} ({missing/len(df):.1%})")'
        },
        {
          type: 'note',
          value: 'Главные инсайты: женщины выживали значительно чаще мужчин (правило "women and children first"), пассажиры 1-го класса имели преимущество, дети (Master) выживали чаще. Эти паттерны — основа для feature engineering.'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: EDA Titanic',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проведите полный разведочный анализ данных Titanic: визуализация, статистики, выявление паттернов.',
      requirements: [
        'Создайте Titanic-like датасет (891 пассажир) с признаками: Pclass, Sex, Age, SibSp, Parch, Fare, Embarked, Survived',
        'Рассчитайте survival rate по полу, классу и порту посадки',
        'Найдите корреляцию числовых признаков с Survived',
        'Определите количество и процент пропусков в каждом столбце',
        'Выведите статистику по возрасту (mean, median, std) отдельно для выживших и погибших'
      ],
      hint: 'Используйте groupby для агрегации по группам. Для корреляции используйте df.corr()["Survived"]. Пропуски считайте через isnull().sum().',
      expectedOutput: 'Titanic EDA:\nВсего пассажиров: 891\nВыживаемость: XX.X%\n\nSurvival по полу:\n  female: XX.X%\n  male: XX.X%\n\nSurvival по классу:\n  1: XX.X%\n  2: XX.X%\n  3: XX.X%\n\nКорреляции с Survived:\n  Fare: X.XX\n  Pclass: -X.XX\n  ...',
      solution: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\nn = 891\ntitles = np.random.choice(["Mr","Mrs","Miss","Master"], n, p=[0.55,0.15,0.2,0.1])\ndf = pd.DataFrame({\n    "Pclass": np.random.choice([1,2,3], n, p=[0.24,0.21,0.55]),\n    "Sex": np.where(np.isin(titles, ["Mr","Master"]), "male", "female"),\n    "Age": np.where(np.random.random(n)<0.2, np.nan,\n                    np.where(titles=="Master", np.random.uniform(1,14,n),\n                             np.random.uniform(16,70,n))),\n    "SibSp": np.random.choice([0,1,2,3,4], n, p=[0.6,0.2,0.1,0.05,0.05]),\n    "Parch": np.random.choice([0,1,2,3], n, p=[0.7,0.15,0.1,0.05]),\n    "Fare": np.random.exponential(30, n).round(4),\n    "Embarked": np.random.choice(["S","C","Q"], n, p=[0.72,0.19,0.09]),\n})\nsurvival_p = (0.2 + 0.4*(df["Sex"]=="female") - 0.08*(df["Pclass"]-1)\n              + 0.15*(titles=="Master") + 0.001*df["Fare"]).clip(0.05,0.95)\ndf["Survived"] = (np.random.random(n) < survival_p).astype(int)\n\nprint("Titanic EDA:")\nprint(f"Всего пассажиров: {len(df)}")\nprint(f"Выживаемость: {df[\'Survived\'].mean():.1%}")\n\nprint("\\nSurvival по полу:")\nfor sex in ["female", "male"]:\n    rate = df[df["Sex"]==sex]["Survived"].mean()\n    print(f"  {sex}: {rate:.1%}")\n\nprint("\\nSurvival по классу:")\nfor pc in [1,2,3]:\n    rate = df[df["Pclass"]==pc]["Survived"].mean()\n    print(f"  {pc}: {rate:.1%}")\n\nprint("\\nSurvival по порту:")\nfor emb in ["C","Q","S"]:\n    rate = df[df["Embarked"]==emb]["Survived"].mean()\n    print(f"  {emb}: {rate:.1%}")\n\nprint("\\nКорреляции с Survived:")\ndf_num = df.copy()\ndf_num["Sex"] = (df_num["Sex"]=="female").astype(int)\ncorrs = df_num.select_dtypes(include=[np.number]).corr()["Survived"].drop("Survived").sort_values(ascending=False)\nfor feat, corr in corrs.items():\n    print(f"  {feat}: {corr:.3f}")\n\nprint("\\nПропуски:")\nfor col in df.columns:\n    miss = df[col].isnull().sum()\n    if miss > 0:\n        print(f"  {col}: {miss} ({miss/len(df):.1%})")\n\nprint("\\nВозраст выживших:")\nprint(f"  mean={df[df[\'Survived\']==1][\'Age\'].mean():.1f}, median={df[df[\'Survived\']==1][\'Age\'].median():.1f}, std={df[df[\'Survived\']==1][\'Age\'].std():.1f}")\nprint("Возраст погибших:")\nprint(f"  mean={df[df[\'Survived\']==0][\'Age\'].mean():.1f}, median={df[df[\'Survived\']==0][\'Age\'].median():.1f}, std={df[df[\'Survived\']==0][\'Age\'].std():.1f}")',
      explanation: 'EDA — первый и самый важный шаг на Kaggle. Он помогает понять данные, найти закономерности и определить направления для feature engineering. Ключевые паттерны Titanic: пол — сильнейший предиктор, класс каюты — второй по важности, возраст (дети) — третий.'
    },
    {
      id: 4,
      title: 'Feature Engineering для Titanic',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Извлечение Title из имени'
        },
        {
          type: 'text',
          value: 'Имя пассажира содержит обращение (Title): Mr, Mrs, Miss, Master, Dr, Rev и другие. Title кодирует пол, возраст и социальный статус. Это один из самых сильных признаков.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import pandas as pd\nimport numpy as np\n\n# Извлечение Title из имени\ndef extract_title(name):\n    """Извлекает Title из формата \'Фамилия, Title. Имя\'"""\n    if \". \" in name:\n        return name.split(\". \")[0].split(\", \")[-1].strip()\n    return \"Unknown\"\n\n# Пример\nnames = [\n    "Braund, Mr. Owen Harris",\n    "Cumings, Mrs. John Bradley",\n    "Heikkinen, Miss. Laina",\n    "Palsson, Master. Gosta Leonard",\n    "Futelle, Dr. Jacques"\n]\n\nfor name in names:\n    print(f"{name:40s} -> Title: {extract_title(name)}")\n\n# Группировка редких Title\ndef map_title(title):\n    title_map = {\n        "Mr": "Mr", "Miss": "Miss", "Mrs": "Mrs", "Master": "Master",\n        "Dr": "Rare", "Rev": "Rare", "Col": "Rare", "Major": "Rare",\n        "Mlle": "Miss", "Mme": "Mrs", "Ms": "Miss",\n        "Countess": "Rare", "Sir": "Rare", "Lady": "Rare",\n        "Don": "Rare", "Dona": "Rare", "Jonkheer": "Rare", "Capt": "Rare"\n    }\n    return title_map.get(title, "Rare")\n\nprint("\\nMapped titles:")\nfor name in names:\n    t = extract_title(name)\n    print(f"  {t:10s} -> {map_title(t)}")'
        },
        {
          type: 'heading',
          value: 'Family Size и IsAlone'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Создание семейных признаков\nnp.random.seed(42)\ndf = pd.DataFrame({\n    "SibSp": [1, 0, 3, 0, 2],\n    "Parch": [0, 0, 1, 0, 2],\n    "Survived": [1, 0, 0, 1, 0]\n})\n\n# FamilySize = SibSp + Parch + 1 (сам пассажир)\ndf["FamilySize"] = df["SibSp"] + df["Parch"] + 1\n\n# IsAlone — путешествует один\ndf["IsAlone"] = (df["FamilySize"] == 1).astype(int)\n\n# Категория размера семьи\ndef family_category(size):\n    if size == 1:\n        return "Alone"\n    elif size <= 4:\n        return "Small"\n    else:\n        return "Large"\n\ndf["FamilyCat"] = df["FamilySize"].apply(family_category)\n\nprint(df)\nprint(f"\\nВыживаемость одиночек: {df[df[\'IsAlone\']==1][\'Survived\'].mean():.2f}")\nprint(f"Выживаемость с семьёй: {df[df[\'IsAlone\']==0][\'Survived\'].mean():.2f}")'
        },
        {
          type: 'heading',
          value: 'Заполнение Age и Cabin Deck'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Умное заполнение возраста — по Title и Pclass\nnp.random.seed(42)\nn = 100\ntitles = np.random.choice(["Mr","Mrs","Miss","Master"], n, p=[0.55,0.15,0.2,0.1])\ndf = pd.DataFrame({\n    "Title": titles,\n    "Pclass": np.random.choice([1,2,3], n, p=[0.25,0.25,0.5]),\n    "Age": np.where(np.random.random(n)<0.2, np.nan,\n                    np.where(titles=="Master", np.random.uniform(1,14,n),\n                             np.random.uniform(18,65,n)))\n})\n\nprint(f"Пропусков Age до: {df[\'Age\'].isnull().sum()}")\n\n# Заполняем медианой по группе Title + Pclass\ndf["Age"] = df.groupby(["Title", "Pclass"])["Age"].transform(\n    lambda x: x.fillna(x.median())\n)\n# Оставшиеся пропуски — общей медианой\ndf["Age"].fillna(df["Age"].median(), inplace=True)\n\nprint(f"Пропусков Age после: {df[\'Age\'].isnull().sum()}")\nprint(f"\\nСредний возраст по Title:")\nfor title in ["Mr","Mrs","Miss","Master"]:\n    print(f"  {title}: {df[df[\'Title\']==title][\'Age\'].mean():.1f}")\n\n# Извлечение палубы из Cabin\ncabins = ["C85", np.nan, "E46", np.nan, "B28", np.nan, "D17", np.nan, "A23", "G6"]\ndecks = [c[0] if isinstance(c, str) else "Unknown" for c in cabins]\nprint(f"\\nDecks: {decks}")'
        },
        {
          type: 'tip',
          value: 'Ключевые фичи для Titanic: Title (из имени), FamilySize, IsAlone, AgeBin (бакетирование возраста), Deck (из Cabin), Fare per person (Fare / FamilySize). Каждая из них несёт уникальную информацию о шансах выживания.'
        }
      ]
    },
    {
      id: 5,
      title: 'Практика: Feature Engineering',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полный набор признаков для модели Titanic: Title, FamilySize, AgeBin, FarePerPerson и другие.',
      requirements: [
        'Создайте Titanic-like датасет (891 пассажир) со всеми признаками включая Name с Title',
        'Извлеките Title из Name и сгруппируйте редкие Title в категорию "Rare"',
        'Создайте FamilySize, IsAlone, FarePerPerson (Fare / FamilySize)',
        'Заполните пропуски Age по группам Title + Pclass (медиана)',
        'Создайте AgeBin (бакеты: Child, Teen, Adult, Senior) и выведите выживаемость по каждому бакету'
      ],
      hint: 'Используйте pd.cut для создания возрастных бакетов. FarePerPerson = Fare / FamilySize. Title извлекайте через split(".") от имени.',
      expectedOutput: 'Feature Engineering:\nИсходных признаков: X\nНовых признаков: X\n\nTitle distribution:\n  Mr: XXX\n  Miss: XXX\n  ...\n\nВыживаемость по AgeBin:\n  Child: XX.X%\n  Teen: XX.X%\n  Adult: XX.X%\n  Senior: XX.X%',
      solution: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\nn = 891\ntitles = np.random.choice(["Mr","Mrs","Miss","Master","Dr","Rev","Col"], n, p=[0.52,0.14,0.19,0.08,0.03,0.02,0.02])\nnames = [f"Last_{i}, {t}. First_{i}" for i, t in enumerate(titles)]\ndf = pd.DataFrame({\n    "PassengerId": range(1, n+1),\n    "Pclass": np.random.choice([1,2,3], n, p=[0.24,0.21,0.55]),\n    "Name": names,\n    "Sex": np.where(np.isin(titles, ["Mr","Master","Dr","Rev","Col"]), "male", "female"),\n    "Age": np.where(np.random.random(n)<0.2, np.nan,\n                    np.where(titles=="Master", np.random.uniform(1,14,n),\n                             np.random.uniform(16,70,n))),\n    "SibSp": np.random.choice([0,1,2,3,4], n, p=[0.6,0.2,0.1,0.05,0.05]),\n    "Parch": np.random.choice([0,1,2,3], n, p=[0.7,0.15,0.1,0.05]),\n    "Fare": np.random.exponential(30, n).round(4),\n    "Embarked": np.random.choice(["S","C","Q"], n, p=[0.72,0.19,0.09]),\n})\nsurvival_p = (0.2 + 0.4*(df["Sex"]=="female") - 0.08*(df["Pclass"]-1)\n              + 0.15*(titles=="Master") + 0.001*df["Fare"]).clip(0.05,0.95)\ndf["Survived"] = (np.random.random(n) < survival_p).astype(int)\n\norig_cols = len(df.columns)\n\n# Title extraction\ndf["Title"] = df["Name"].apply(lambda x: x.split(". ")[0].split(", ")[-1].strip())\ntitle_map = {"Mr":"Mr","Mrs":"Mrs","Miss":"Miss","Master":"Master"}\ndf["Title"] = df["Title"].map(lambda x: title_map.get(x, "Rare"))\n\n# Family features\ndf["FamilySize"] = df["SibSp"] + df["Parch"] + 1\ndf["IsAlone"] = (df["FamilySize"] == 1).astype(int)\ndf["FarePerPerson"] = df["Fare"] / df["FamilySize"]\n\n# Age filling by Title + Pclass\ndf["Age"] = df.groupby(["Title","Pclass"])["Age"].transform(lambda x: x.fillna(x.median()))\ndf["Age"].fillna(df["Age"].median(), inplace=True)\n\n# Age bins\ndf["AgeBin"] = pd.cut(df["Age"], bins=[0,12,18,50,100], labels=["Child","Teen","Adult","Senior"])\n\nnew_cols = len(df.columns) - orig_cols\n\nprint("Feature Engineering:")\nprint(f"Исходных признаков: {orig_cols}")\nprint(f"Новых признаков: {new_cols}")\n\nprint("\\nTitle distribution:")\nfor title, cnt in df["Title"].value_counts().items():\n    print(f"  {title}: {cnt}")\n\nprint("\\nВыживаемость по AgeBin:")\nfor ab in ["Child","Teen","Adult","Senior"]:\n    rate = df[df["AgeBin"]==ab]["Survived"].mean()\n    print(f"  {ab}: {rate:.1%}")\n\nprint(f"\\nВыживаемость одиночек: {df[df[\'IsAlone\']==1][\'Survived\'].mean():.1%}")\nprint(f"Выживаемость с семьёй: {df[df[\'IsAlone\']==0][\'Survived\'].mean():.1%}")\nprint(f"\\nСредний FarePerPerson: {df[\'FarePerPerson\'].mean():.2f}")',
      explanation: 'Feature Engineering — ключевой навык для Kaggle. Хорошие фичи важнее выбора модели. Title кодирует пол, возраст и статус в одном признаке. FamilySize показывает, что одиночки и очень большие семьи выживали хуже. AgeBin помогает модели уловить нелинейную зависимость от возраста.'
    },
    {
      id: 6,
      title: 'Моделирование для Titanic',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Выбор моделей для бинарной классификации'
        },
        {
          type: 'text',
          value: 'Для Titanic подходят несколько классов моделей. Начинаем с простых (LogisticRegression) и усложняем (RandomForest, XGBoost). Финальное решение — ensemble нескольких моделей.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\nfrom sklearn.preprocessing import LabelEncoder, StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier\nfrom sklearn.svm import SVC\nfrom sklearn.pipeline import Pipeline\n\n# Подготовка данных\nnp.random.seed(42)\nn = 891\ntitles = np.random.choice(["Mr","Mrs","Miss","Master"], n, p=[0.55,0.15,0.2,0.1])\ndf = pd.DataFrame({\n    "Pclass": np.random.choice([1,2,3], n, p=[0.24,0.21,0.55]),\n    "Title": titles,\n    "Sex": np.where(np.isin(titles, ["Mr","Master"]), "male", "female"),\n    "Age": np.where(titles=="Master", np.random.uniform(1,14,n), np.random.uniform(16,70,n)),\n    "SibSp": np.random.choice([0,1,2,3], n, p=[0.6,0.25,0.1,0.05]),\n    "Parch": np.random.choice([0,1,2], n, p=[0.7,0.2,0.1]),\n    "Fare": np.random.exponential(30, n),\n    "Embarked": np.random.choice(["S","C","Q"], n, p=[0.72,0.19,0.09]),\n})\nsp = (0.2+0.4*(df["Sex"]=="female")-0.08*(df["Pclass"]-1)+0.15*(titles=="Master")+0.001*df["Fare"]).clip(0.05,0.95)\ndf["Survived"] = (np.random.random(n) < sp).astype(int)\ndf["FamilySize"] = df["SibSp"] + df["Parch"] + 1\ndf["IsAlone"] = (df["FamilySize"]==1).astype(int)\n\nfor col in ["Sex","Title","Embarked"]:\n    df[col] = LabelEncoder().fit_transform(df[col])\n\nfeatures = ["Pclass","Title","Sex","Age","SibSp","Parch","Fare","FamilySize","IsAlone"]\nX = df[features].values\ny = df["Survived"].values\n\n# Сравнение моделей с кросс-валидацией\nkfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\n\nmodels = {\n    "LogisticRegression": Pipeline([\n        ("scaler", StandardScaler()),\n        ("lr", LogisticRegression(max_iter=1000, C=1.0))\n    ]),\n    "RandomForest": RandomForestClassifier(\n        n_estimators=200, max_depth=7, min_samples_leaf=5, random_state=42\n    ),\n    "GradientBoosting": GradientBoostingClassifier(\n        n_estimators=150, max_depth=4, learning_rate=0.1, random_state=42\n    ),\n    "SVC": Pipeline([\n        ("scaler", StandardScaler()),\n        ("svc", SVC(kernel="rbf", C=1.0, gamma="scale"))\n    ])\n}\n\nprint("=== Сравнение моделей (5-fold Stratified CV) ===")\nfor name, model in models.items():\n    scores = cross_val_score(model, X, y, cv=kfold, scoring="accuracy")\n    print(f"{name:25s}: {scores.mean():.4f} (+/- {scores.std():.4f})")'
        },
        {
          type: 'heading',
          value: 'Ensemble: объединение моделей'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.ensemble import VotingClassifier\n\n# Soft Voting — усредняем вероятности\nvoting_soft = VotingClassifier(\n    estimators=[\n        ("lr", Pipeline([("s", StandardScaler()), ("m", LogisticRegression(max_iter=1000))])),\n        ("rf", RandomForestClassifier(n_estimators=200, max_depth=7, random_state=42)),\n        ("gbt", GradientBoostingClassifier(n_estimators=150, max_depth=4, random_state=42)),\n    ],\n    voting="soft"  # "soft" усредняет вероятности, "hard" — голосование\n)\n\nscores = cross_val_score(voting_soft, X, y, cv=kfold, scoring="accuracy")\nprint(f"\\nSoft Voting Ensemble: {scores.mean():.4f} (+/- {scores.std():.4f})")\nprint("\\nEnsemble обычно даёт +0.5-1.5% к лучшей одиночной модели!")'
        },
        {
          type: 'note',
          value: 'На Titanic ensemble из 3-5 разных моделей обычно даёт лучший результат, чем любая одиночная модель. Важно: модели в ensemble должны быть разнообразными (разные алгоритмы), иначе ensemble не поможет.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Обучение и Ensemble',
      type: 'practice',
      difficulty: 'medium',
      description: 'Обучите несколько моделей на данных Titanic и создайте ensemble для достижения максимальной accuracy.',
      requirements: [
        'Подготовьте данные Titanic с feature engineering (Title, FamilySize, IsAlone)',
        'Обучите LogisticRegression, RandomForest, GradientBoosting, SVC с cross-validation',
        'Создайте VotingClassifier (soft voting) из 3 лучших моделей',
        'Создайте StackingClassifier с мета-моделью LogisticRegression',
        'Сравните все подходы и выведите лучший с accuracy'
      ],
      hint: 'Для StackingClassifier используйте sklearn.ensemble.StackingClassifier. Базовые модели — RF и GBT, мета-модель — LogisticRegression. Soft voting обычно лучше hard voting.',
      expectedOutput: 'Модели Titanic:\n  LogReg: 0.XXXX\n  RF: 0.XXXX\n  GBT: 0.XXXX\n  SVC: 0.XXXX\n  VotingEnsemble: 0.XXXX\n  StackingEnsemble: 0.XXXX\nЛучший подход: ...',
      solution: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\nfrom sklearn.preprocessing import LabelEncoder, StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.ensemble import (RandomForestClassifier, GradientBoostingClassifier,\n                               VotingClassifier, StackingClassifier)\nfrom sklearn.svm import SVC\nfrom sklearn.pipeline import Pipeline\n\nnp.random.seed(42)\nn = 891\ntitles = np.random.choice(["Mr","Mrs","Miss","Master"], n, p=[0.55,0.15,0.2,0.1])\ndf = pd.DataFrame({\n    "Pclass": np.random.choice([1,2,3], n, p=[0.24,0.21,0.55]),\n    "Title": titles,\n    "Sex": np.where(np.isin(titles, ["Mr","Master"]), "male", "female"),\n    "Age": np.where(titles=="Master", np.random.uniform(1,14,n), np.random.uniform(16,70,n)),\n    "SibSp": np.random.choice([0,1,2,3], n, p=[0.6,0.25,0.1,0.05]),\n    "Parch": np.random.choice([0,1,2], n, p=[0.7,0.2,0.1]),\n    "Fare": np.random.exponential(30, n),\n    "Embarked": np.random.choice(["S","C","Q"], n, p=[0.72,0.19,0.09]),\n})\nsp = (0.2+0.4*(df["Sex"]=="female")-0.08*(df["Pclass"]-1)+0.15*(titles=="Master")+0.001*df["Fare"]).clip(0.05,0.95)\ndf["Survived"] = (np.random.random(n) < sp).astype(int)\ndf["FamilySize"] = df["SibSp"] + df["Parch"] + 1\ndf["IsAlone"] = (df["FamilySize"]==1).astype(int)\n\nfor col in ["Sex","Title","Embarked"]:\n    df[col] = LabelEncoder().fit_transform(df[col])\n\nfeatures = ["Pclass","Title","Sex","Age","SibSp","Parch","Fare","FamilySize","IsAlone"]\nX = df[features].values\ny = df["Survived"].values\nkfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\n\nlr = Pipeline([("s", StandardScaler()), ("m", LogisticRegression(max_iter=1000))])\nrf = RandomForestClassifier(n_estimators=200, max_depth=7, min_samples_leaf=5, random_state=42)\ngbt = GradientBoostingClassifier(n_estimators=150, max_depth=4, learning_rate=0.1, random_state=42)\nsvc = Pipeline([("s", StandardScaler()), ("m", SVC(kernel="rbf", probability=True, random_state=42))])\n\nvoting = VotingClassifier(\n    estimators=[("rf", rf), ("gbt", gbt), ("svc", svc)],\n    voting="soft"\n)\n\nstacking = StackingClassifier(\n    estimators=[("rf", rf), ("gbt", gbt), ("svc", svc)],\n    final_estimator=LogisticRegression(max_iter=1000),\n    cv=5\n)\n\nall_models = {\n    "LogReg": lr, "RF": rf, "GBT": gbt, "SVC": svc,\n    "VotingEnsemble": voting, "StackingEnsemble": stacking\n}\n\nprint("Модели Titanic:")\nbest_name, best_score = "", 0\nfor name, model in all_models.items():\n    scores = cross_val_score(model, X, y, cv=kfold, scoring="accuracy")\n    mean_score = scores.mean()\n    print(f"  {name}: {mean_score:.4f} (+/- {scores.std():.4f})")\n    if mean_score > best_score:\n        best_score = mean_score\n        best_name = name\n\nprint(f"Лучший подход: {best_name} ({best_score:.4f})")',
      explanation: 'Stacking и Voting — два основных метода ансамблирования. Voting усредняет предсказания (soft) или голосует (hard). Stacking обучает мета-модель на предсказаниях базовых моделей — это более мощный подход, но требует аккуратной кросс-валидации для избежания утечки данных.'
    },
    {
      id: 8,
      title: 'Практика: Submission на Kaggle',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте финальный pipeline для Titanic и подготовьте файл submission.csv для загрузки на Kaggle.',
      requirements: [
        'Создайте train (891) и test (418) датасеты в формате Titanic',
        'Реализуйте полный pipeline: preprocessing, feature engineering, model training',
        'Обучите ensemble модель на всём train и предскажите на test',
        'Создайте submission DataFrame в формате: PassengerId, Survived',
        'Выведите статистику submission и CV score на train'
      ],
      hint: 'Финальную модель обучайте на ВСЁМ train (без split). CV score считайте отдельно для оценки. Submission должен содержать только PassengerId и Survived (0 или 1).',
      expectedOutput: 'Titanic Pipeline:\nTrain shape: (891, X)\nTest shape: (418, X)\nCV score: 0.XXXX\n\nSubmission:\n  Shape: (418, 2)\n  Columns: PassengerId, Survived\n  Survived distribution: 0=XXX, 1=XXX\n  Survival rate: XX.X%',
      solution: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import cross_val_score, StratifiedKFold\nfrom sklearn.preprocessing import LabelEncoder, StandardScaler\nfrom sklearn.ensemble import (RandomForestClassifier, GradientBoostingClassifier,\n                               VotingClassifier)\nfrom sklearn.svm import SVC\nfrom sklearn.pipeline import Pipeline\n\nnp.random.seed(42)\n\ndef create_titanic_data(n, seed=42):\n    np.random.seed(seed)\n    titles = np.random.choice(["Mr","Mrs","Miss","Master"], n, p=[0.55,0.15,0.2,0.1])\n    df = pd.DataFrame({\n        "PassengerId": range(1, n+1),\n        "Pclass": np.random.choice([1,2,3], n, p=[0.24,0.21,0.55]),\n        "Name": [f"Last_{i}, {t}. First_{i}" for i, t in enumerate(titles)],\n        "Sex": np.where(np.isin(titles, ["Mr","Master"]), "male", "female"),\n        "Age": np.where(np.random.random(n)<0.2, np.nan,\n                        np.where(titles=="Master", np.random.uniform(1,14,n),\n                                 np.random.uniform(16,70,n))),\n        "SibSp": np.random.choice([0,1,2,3], n, p=[0.6,0.25,0.1,0.05]),\n        "Parch": np.random.choice([0,1,2], n, p=[0.7,0.2,0.1]),\n        "Fare": np.random.exponential(30, n).round(4),\n        "Embarked": np.random.choice(["S","C","Q"], n, p=[0.72,0.19,0.09]),\n    })\n    return df, titles\n\ndef feature_engineering(df):\n    df = df.copy()\n    df["Title"] = df["Name"].apply(lambda x: x.split(". ")[0].split(", ")[-1].strip())\n    title_map = {"Mr":"Mr","Mrs":"Mrs","Miss":"Miss","Master":"Master"}\n    df["Title"] = df["Title"].map(lambda x: title_map.get(x, "Rare"))\n    df["FamilySize"] = df["SibSp"] + df["Parch"] + 1\n    df["IsAlone"] = (df["FamilySize"]==1).astype(int)\n    df["FarePerPerson"] = df["Fare"] / df["FamilySize"]\n    df["Age"] = df.groupby(["Title","Pclass"])["Age"].transform(lambda x: x.fillna(x.median()))\n    df["Age"].fillna(df["Age"].median(), inplace=True)\n    for col in ["Sex","Title","Embarked"]:\n        df[col] = LabelEncoder().fit_transform(df[col])\n    return df\n\n# Создание данных\ntrain_df, train_titles = create_titanic_data(891, seed=42)\nsp = (0.2+0.4*(train_df["Sex"]=="female")-0.08*(train_df["Pclass"]-1)\n      +0.15*(train_titles=="Master")+0.001*train_df["Fare"]).clip(0.05,0.95)\ntrain_df["Survived"] = (np.random.random(891) < sp).astype(int)\n\ntest_df, _ = create_titanic_data(418, seed=99)\ntest_ids = test_df["PassengerId"].copy()\n\ntrain_fe = feature_engineering(train_df)\ntest_fe = feature_engineering(test_df)\n\nfeatures = ["Pclass","Title","Sex","Age","SibSp","Parch","Fare","FamilySize","IsAlone","FarePerPerson"]\nX_train = train_fe[features].values\ny_train = train_fe["Survived"].values\nX_test = test_fe[features].values\n\nprint("Titanic Pipeline:")\nprint(f"Train shape: ({len(X_train)}, {X_train.shape[1]})")\nprint(f"Test shape: ({len(X_test)}, {X_test.shape[1]})")\n\n# CV оценка\nkfold = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\nensemble = VotingClassifier(\n    estimators=[\n        ("rf", RandomForestClassifier(n_estimators=300, max_depth=7, random_state=42)),\n        ("gbt", GradientBoostingClassifier(n_estimators=200, max_depth=4, learning_rate=0.1, random_state=42)),\n        ("svc", Pipeline([("s", StandardScaler()), ("m", SVC(probability=True, random_state=42))])),\n    ],\n    voting="soft"\n)\n\ncv_scores = cross_val_score(ensemble, X_train, y_train, cv=kfold, scoring="accuracy")\nprint(f"CV score: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")\n\n# Обучение на всём train и предсказание\nensemble.fit(X_train, y_train)\npredictions = ensemble.predict(X_test)\n\nsubmission = pd.DataFrame({\n    "PassengerId": test_ids,\n    "Survived": predictions\n})\n\nprint(f"\\nSubmission:")\nprint(f"  Shape: {submission.shape}")\nprint(f"  Columns: {list(submission.columns)}")\nvc = submission["Survived"].value_counts()\nprint(f"  Survived distribution: 0={vc.get(0,0)}, 1={vc.get(1,0)}")\nprint(f"  Survival rate: {submission[\'Survived\'].mean():.1%}")\nprint(f"\\n{submission.head(10)}")',
      explanation: 'Финальный pipeline для Kaggle: (1) Feature engineering на train+test одинаково, (2) CV score на train для оценки, (3) обучение на ВСЁМ train, (4) предсказание на test, (5) создание submission.csv. На реальном Kaggle этот подход даёт score 0.78-0.82. Для 0.83+ нужен stacking и более продвинутый FE.'
    }
  ]
}
