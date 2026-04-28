export default {
  id: 7,
  title: 'Предобработка данных',
  description: 'Полный цикл предобработки данных для ML: очистка, кодирование категорий, масштабирование, feature engineering, работа с дисбалансом.',
  lessons: [
    {
      id: 1,
      title: 'Очистка данных',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Data Cleaning — первый этап'
        },
        {
          type: 'text',
          value: 'Качество данных напрямую определяет качество модели. Правило "Garbage In — Garbage Out" — если подать мусорные данные, модель выдаст мусорные предсказания. Очистка включает обработку пропусков, дубликатов, выбросов и некорректных значений.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import pandas as pd\nimport numpy as np\n\n# Грязные данные\ndf = pd.DataFrame({\n    "возраст": [25, 30, -5, 150, np.nan, 28, 35, np.nan, 40, 33],\n    "зарплата": [50000, np.nan, 70000, 80000, 60000, np.nan, 90000, 55000, 0, 75000],\n    "город": ["Москва", "СПб", "москва", "  СПб ", "Москва", "Казань", "СПб", "Москва", "москва", "Москва"],\n    "email": ["a@b.com", "c@d.com", "bad_email", "e@f.com", "g@h.com", "i@j.com", np.nan, "k@l.com", "m@n.com", "o@p.com"]\n})\n\nprint("Исходные данные:")\nprint(df)\nprint(f"\\nПропуски:\\n{df.isnull().sum()}")\n\n# 1. Стандартизация текста\ndf["город"] = df["город"].str.strip().str.title()\nprint(f"\\nУникальные города: {df[\'город\'].unique()}")\n\n# 2. Обработка выбросов (возраст < 0 или > 120)\ndf.loc[df["возраст"] < 0, "возраст"] = np.nan\ndf.loc[df["возраст"] > 120, "возраст"] = np.nan\n\n# 3. Обработка невалидных значений\ndf.loc[df["зарплата"] == 0, "зарплата"] = np.nan\n\n# 4. Заполнение пропусков\ndf["возраст"] = df["возраст"].fillna(df["возраст"].median())\ndf["зарплата"] = df["зарплата"].fillna(df["зарплата"].median())\ndf["email"] = df["email"].fillna("unknown@email.com")\n\n# 5. Удаление дубликатов\nprint(f"\\nДо удаления дубликатов: {len(df)}")\ndf = df.drop_duplicates()\nprint(f"После: {len(df)}")\n\nprint(f"\\nОчищенные данные:\\n{df}")'
        },
        {
          type: 'warning',
          value: 'Всегда обрабатывайте пропуски ДО разделения на train/test. Но параметры заполнения (среднее, медиана) вычисляйте только по train, чтобы избежать data leakage.'
        }
      ]
    },
    {
      id: 2,
      title: 'Кодирование категориальных признаков',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Encoding: от текста к числам'
        },
        {
          type: 'text',
          value: 'ML-алгоритмы работают с числами. Категориальные признаки (город, цвет, тип) необходимо преобразовать. Основные методы: Label Encoding, One-Hot Encoding, Ordinal Encoding, Target Encoding.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import pandas as pd\nimport numpy as np\nfrom sklearn.preprocessing import LabelEncoder, OneHotEncoder, OrdinalEncoder\n\ndf = pd.DataFrame({\n    "цвет": ["красный", "синий", "зелёный", "красный", "синий"],\n    "размер": ["S", "M", "L", "XL", "M"],\n    "город": ["Москва", "СПб", "Казань", "Москва", "СПб"],\n    "цена": [100, 200, 150, 120, 180]\n})\n\n# 1. Label Encoding — для порядковых категорий\nle = LabelEncoder()\ndf["цвет_encoded"] = le.fit_transform(df["цвет"])\nprint(f"Label Encoding:\\n{df[[\'цвет\', \'цвет_encoded\']]}")\nprint(f"Классы: {le.classes_}\\n")\n\n# 2. One-Hot Encoding — для номинальных категорий\nohe = OneHotEncoder(sparse_output=False)\ncity_encoded = ohe.fit_transform(df[["город"]])\nprint(f"One-Hot Encoding:")\nprint(f"Категории: {ohe.categories_[0]}")\nprint(f"Данные:\\n{city_encoded}\\n")\n\n# Или через Pandas (проще)\ndf_ohe = pd.get_dummies(df, columns=["город"], prefix="город")\nprint(f"pd.get_dummies:\\n{df_ohe}\\n")\n\n# 3. Ordinal Encoding — для упорядоченных категорий\nsize_order = [["S", "M", "L", "XL"]]\noe = OrdinalEncoder(categories=size_order)\ndf["размер_encoded"] = oe.fit_transform(df[["размер"]])\nprint(f"Ordinal Encoding:\\n{df[[\'размер\', \'размер_encoded\']]}")\n\n# 4. Frequency Encoding\nfreq = df["цвет"].value_counts(normalize=True)\ndf["цвет_freq"] = df["цвет"].map(freq)\nprint(f"\\nFrequency Encoding:\\n{df[[\'цвет\', \'цвет_freq\']]}")'
        },
        {
          type: 'list',
          value: [
            'Label Encoding: для порядковых данных (размер, рейтинг) или для деревьев',
            'One-Hot Encoding: для номинальных данных (город, цвет), если категорий немного',
            'Ordinal Encoding: когда есть естественный порядок (S < M < L < XL)',
            'Frequency/Target Encoding: для высококардинальных категорий (тысячи уникальных значений)'
          ]
        }
      ]
    },
    {
      id: 3,
      title: 'Масштабирование признаков',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Feature Scaling'
        },
        {
          type: 'text',
          value: 'Многие ML-алгоритмы чувствительны к масштабу признаков: KNN, SVM, нейросети, линейная/логистическая регрессия. Если один признак в диапазоне [0, 1], а другой [0, 1000000], модель будет ориентироваться на второй. Деревья решений и Random Forest к масштабу нечувствительны.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nfrom sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler\nfrom sklearn.model_selection import train_test_split\n\n# Данные с разным масштабом\nnp.random.seed(42)\nX = np.column_stack([\n    np.random.normal(100, 15, 100),     # возраст: ~70-130\n    np.random.normal(50000, 20000, 100),  # зарплата: 10k-90k\n    np.random.normal(5, 2, 100)           # опыт: 0-10\n])\ny = np.random.randint(0, 2, 100)\n\n# ВАЖНО: fit на train, transform на train и test!\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n\n# 1. StandardScaler (Z-score): mean=0, std=1\nscaler_std = StandardScaler()\nX_train_std = scaler_std.fit_transform(X_train)  # fit + transform\nX_test_std = scaler_std.transform(X_test)         # только transform!\nprint(f"StandardScaler:")\nprint(f"  Train mean: {X_train_std.mean(axis=0).round(4)}")  # [0, 0, 0]\nprint(f"  Train std:  {X_train_std.std(axis=0).round(4)}")   # [1, 1, 1]\n\n# 2. MinMaxScaler: диапазон [0, 1]\nscaler_mm = MinMaxScaler()\nX_train_mm = scaler_mm.fit_transform(X_train)\nprint(f"\\nMinMaxScaler:")\nprint(f"  Train min: {X_train_mm.min(axis=0)}")  # [0, 0, 0]\nprint(f"  Train max: {X_train_mm.max(axis=0)}")  # [1, 1, 1]\n\n# 3. RobustScaler: устойчив к выбросам (медиана и IQR)\nscaler_rb = RobustScaler()\nX_train_rb = scaler_rb.fit_transform(X_train)\nprint(f"\\nRobustScaler:")\nprint(f"  Train median: {np.median(X_train_rb, axis=0).round(4)}")\n\nprint(f"\\nИсходные диапазоны: {X_train.min(axis=0).round(0)} .. {X_train.max(axis=0).round(0)}")\nprint(f"После StandardScaler: {X_train_std.min(axis=0).round(2)} .. {X_train_std.max(axis=0).round(2)}")'
        },
        {
          type: 'warning',
          value: 'НИКОГДА не вызывайте fit_transform на тестовых данных! Используйте fit_transform только на train, а для test — только transform. Иначе — data leakage!'
        }
      ]
    },
    {
      id: 4,
      title: 'Feature Engineering',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Создание новых признаков'
        },
        {
          type: 'text',
          value: 'Feature Engineering — искусство создания информативных признаков из сырых данных. Хороший feature engineering может улучшить модель больше, чем выбор алгоритма. Типы: числовые трансформации, взаимодействия, агрегации, временные признаки.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import pandas as pd\nimport numpy as np\n\n# Исходные данные\ndf = pd.DataFrame({\n    "площадь": [50, 80, 120, 200, 45],\n    "комнаты": [1, 2, 3, 4, 1],\n    "этаж": [3, 5, 10, 15, 1],\n    "всего_этажей": [9, 16, 20, 25, 5],\n    "дата_постройки": pd.to_datetime(["2010-01-01", "2005-06-15", "2020-03-10", \n                                      "2015-11-20", "1990-05-01"]),\n    "район": ["центр", "спальный", "центр", "бизнес", "спальный"]\n})\n\n# 1. Числовые трансформации\ndf["площадь_на_комнату"] = df["площадь"] / df["комнаты"]\ndf["лог_площадь"] = np.log1p(df["площадь"])  # log(1+x) — стабилен для 0\n\n# 2. Взаимодействия (interactions)\ndf["этаж_относительный"] = df["этаж"] / df["всего_этажей"]\ndf["последний_этаж"] = (df["этаж"] == df["всего_этажей"]).astype(int)\ndf["первый_этаж"] = (df["этаж"] == 1).astype(int)\n\n# 3. Временные признаки\ndf["возраст_дома"] = 2025 - df["дата_постройки\"].dt.year\ndf["новостройка"] = (df["возраст_дома"] <= 5).astype(int)\n\n# 4. Бинирование\ndf["площадь_категория"] = pd.cut(df["площадь\"], \n    bins=[0, 50, 100, float(\"inf\")], \n    labels=[\"малая\", \"средняя\", \"большая\"])\n\n# 5. Полиномиальные признаки\nfrom sklearn.preprocessing import PolynomialFeatures\nX_num = df[[\"площадь\", \"комнаты\"]].values\npoly = PolynomialFeatures(degree=2, include_bias=False)\nX_poly = poly.fit_transform(X_num)\nprint(f\"Полиномиальные признаки: {poly.get_feature_names_out()}\")\nprint(f\"Исходные: {X_num.shape[1]} -> Полиномиальные: {X_poly.shape[1]}\")\n\nprint(f\"\\nНовые признаки:\\n{df[[\'площадь_на_комнату\', \'этаж_относительный\', \'возраст_дома\']]}")'
        },
        {
          type: 'tip',
          value: 'Лучшие признаки часто приходят из доменных знаний. Для недвижимости: цена за м², относительный этаж. Для финансов: скользящие средние, волатильность. Для NLP: длина текста, количество заглавных букв.'
        }
      ]
    },
    {
      id: 5,
      title: 'Pipeline в scikit-learn',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Автоматизация предобработки'
        },
        {
          type: 'text',
          value: 'Pipeline объединяет все шаги предобработки и модель в единый объект. Это предотвращает data leakage, упрощает код и гарантирует одинаковую обработку train и test данных.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.pipeline import Pipeline\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import train_test_split, cross_val_score\nimport pandas as pd\nimport numpy as np\n\n# Данные с числовыми и категориальными признаками\nnp.random.seed(42)\nn = 200\ndf = pd.DataFrame({\n    "возраст": np.random.randint(18, 65, n).astype(float),\n    "зарплата": np.random.randint(20000, 200000, n).astype(float),\n    "город": np.random.choice(["Москва", "СПб", "Казань"], n),\n    "образование": np.random.choice(["среднее", "высшее", "PhD"], n),\n})\ndf.loc[np.random.choice(n, 20), "возраст"] = np.nan\ndf.loc[np.random.choice(n, 15), "зарплата"] = np.nan\ny = np.random.randint(0, 2, n)\n\n# Определяем типы столбцов\nnum_features = ["возраст", "зарплата"]\ncat_features = ["город", "образование"]\n\n# Pipeline для числовых: заполнение пропусков -> масштабирование\nnum_pipeline = Pipeline([\n    ("imputer", SimpleImputer(strategy="median")),\n    ("scaler", StandardScaler())\n])\n\n# Pipeline для категориальных: заполнение -> кодирование\ncat_pipeline = Pipeline([\n    ("imputer", SimpleImputer(strategy="most_frequent")),\n    ("encoder", OneHotEncoder(handle_unknown="ignore"))\n])\n\n# Объединяем\npreprocessor = ColumnTransformer([\n    ("num", num_pipeline, num_features),\n    ("cat", cat_pipeline, cat_features)\n])\n\n# Полный pipeline: предобработка + модель\nfull_pipeline = Pipeline([\n    ("preprocessor", preprocessor),\n    ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))\n])\n\n# Кросс-валидация — всё работает автоматически!\nscores = cross_val_score(full_pipeline, df, y, cv=5, scoring="accuracy")\nprint(f"CV Accuracy: {scores.mean():.4f} (+/- {scores.std():.4f})")\n\n# Обучение и предсказание\nX_train, X_test, y_train, y_test = train_test_split(df, y, test_size=0.2, random_state=42)\nfull_pipeline.fit(X_train, y_train)\nprint(f"Test Accuracy: {full_pipeline.score(X_test, y_test):.4f}")'
        },
        {
          type: 'note',
          value: 'Pipeline гарантирует, что fit вызывается только на train данных, а transform — на test. Это главная защита от data leakage.'
        }
      ]
    },
    {
      id: 6,
      title: 'Feature Selection',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Отбор признаков'
        },
        {
          type: 'text',
          value: 'Не все признаки полезны для модели. Лишние признаки могут ухудшить модель (проклятие размерности), замедлить обучение и усложнить интерпретацию. Feature Selection — выбор наиболее информативных признаков.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'from sklearn.datasets import load_breast_cancer\nfrom sklearn.feature_selection import (\n    SelectKBest, f_classif, mutual_info_classif, RFE\n)\nfrom sklearn.ensemble import RandomForestClassifier\nimport numpy as np\n\n# Загрузка данных\ndata = load_breast_cancer()\nX, y = data.data, data.target\nprint(f"Исходные признаки: {X.shape[1]}")  # 30\n\n# 1. Filter: SelectKBest (по статистическому тесту)\nselector_kb = SelectKBest(f_classif, k=10)\nX_kb = selector_kb.fit_transform(X, y)\nselected = np.array(data.feature_names)[selector_kb.get_support()]\nprint(f"\\nSelectKBest (top 10):\\n{selected}")\n\n# 2. Mutual Information\nselector_mi = SelectKBest(mutual_info_classif, k=10)\nX_mi = selector_mi.fit_transform(X, y)\nselected_mi = np.array(data.feature_names)[selector_mi.get_support()]\nprint(f"\\nMutual Information (top 10):\\n{selected_mi}")\n\n# 3. Wrapper: Recursive Feature Elimination (RFE)\nmodel = RandomForestClassifier(n_estimators=100, random_state=42)\nrfe = RFE(model, n_features_to_select=10)\nX_rfe = rfe.fit_transform(X, y)\nselected_rfe = np.array(data.feature_names)[rfe.support_]\nprint(f"\\nRFE (top 10):\\n{selected_rfe}")\n\n# 4. Embedded: Feature Importance из Random Forest\nmodel.fit(X, y)\nimportances = model.feature_importances_\ntop_10_idx = np.argsort(importances)[::-1][:10]\nprint(f"\\nRandom Forest importance (top 10):")\nfor idx in top_10_idx:\n    print(f"  {data.feature_names[idx]}: {importances[idx]:.4f}")'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Полная предобработка данных',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте полный pipeline предобработки данных для задачи классификации, включая обработку пропусков, кодирование и масштабирование.',
      requirements: [
        'Создайте датасет из 100 записей: возраст (с 10% пропусков), зарплата (с 5% пропусков), город (Москва/СПб/Казань), образование (среднее/высшее/PhD), target (0/1)',
        'Создайте Pipeline с ColumnTransformer для числовых и категориальных признаков',
        'Числовые: SimpleImputer(median) -> StandardScaler',
        'Категориальные: SimpleImputer(most_frequent) -> OneHotEncoder',
        'Обучите RandomForestClassifier через Pipeline и оцените кросс-валидацией (5 fold)'
      ],
      hint: 'Используйте ColumnTransformer для параллельной обработки разных типов столбцов. Pipeline объединяет предобработку и модель. cross_val_score выполняет кросс-валидацию.',
      expectedOutput: 'Размер данных: (100, 4)\nПропуски: возраст=10, зарплата=5\nCV Accuracy: 0.XXXX (+/- 0.XXXX)\nPipeline работает корректно!',
      solution: 'import pandas as pd\nimport numpy as np\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.compose import ColumnTransformer\nfrom sklearn.preprocessing import StandardScaler, OneHotEncoder\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import cross_val_score\n\nnp.random.seed(42)\nn = 100\n\n# Создание данных\ndf = pd.DataFrame({\n    "возраст": np.random.randint(18, 65, n).astype(float),\n    "зарплата": np.random.randint(30000, 150000, n).astype(float),\n    "город": np.random.choice(["Москва", "СПб", "Казань"], n),\n    "образование": np.random.choice(["среднее", "высшее", "PhD"], n),\n})\ny = np.random.randint(0, 2, n)\n\n# Добавляем пропуски\ndf.loc[np.random.choice(n, 10, replace=False), "возраст"] = np.nan\ndf.loc[np.random.choice(n, 5, replace=False), "зарплата"] = np.nan\n\nprint(f"Размер данных: {df.shape}")\nprint(f"Пропуски: возраст={df[\'возраст\'].isna().sum()}, зарплата={df[\'зарплата\'].isna().sum()}")\n\n# Pipeline\nnum_features = ["возраст", "зарплата"]\ncat_features = ["город", "образование"]\n\npreprocessor = ColumnTransformer([\n    ("num", Pipeline([\n        ("imputer", SimpleImputer(strategy="median")),\n        ("scaler", StandardScaler())\n    ]), num_features),\n    ("cat", Pipeline([\n        ("imputer", SimpleImputer(strategy="most_frequent")),\n        ("encoder", OneHotEncoder(handle_unknown="ignore"))\n    ]), cat_features)\n])\n\npipeline = Pipeline([\n    ("preprocessor", preprocessor),\n    ("classifier", RandomForestClassifier(n_estimators=100, random_state=42))\n])\n\nscores = cross_val_score(pipeline, df, y, cv=5, scoring="accuracy")\nprint(f"CV Accuracy: {scores.mean():.4f} (+/- {scores.std():.4f})")\nprint("Pipeline работает корректно!")',
      explanation: 'ColumnTransformer позволяет применять разные трансформации к разным типам столбцов параллельно. Pipeline гарантирует корректный порядок: на каждом fold кросс-валидации fit выполняется только на train части, а transform — на validation. Это предотвращает data leakage. RandomForestClassifier работает с результатом предобработки автоматически.'
    }
  ]
}
