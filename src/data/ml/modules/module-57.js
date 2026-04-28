export default {
  id: 57,
  title: 'Kaggle: House Prices — регрессия',
  description: 'Пошаговое прохождение конкурса House Prices: Advanced Regression Techniques — от EDA 80 фичей до stacking ensemble с RMSLE < 0.12.',
  lessons: [
    {
      id: 1,
      title: 'Описание конкурса House Prices',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Ames Housing Dataset'
        },
        {
          type: 'text',
          value: 'House Prices: Advanced Regression Techniques — второй по популярности Kaggle-конкурс для обучения. Задача: предсказать цену дома по 79 признакам (площадь, качество, район, год постройки и т.д.). Датасет описывает дома в городе Ames, штат Iowa.'
        },
        {
          type: 'heading',
          value: 'Метрика: RMSLE'
        },
        {
          type: 'text',
          value: 'Root Mean Squared Logarithmic Error — метрика, устойчивая к выбросам в ценах. Штрафует больше за недооценку, чем за переоценку. Эквивалентна RMSE на log-трансформированных ценах. Хороший score: < 0.12, топ-10%: < 0.115.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\n\n# RMSLE — Root Mean Squared Logarithmic Error\ndef rmsle(y_true, y_pred):\n    """Вычисляет RMSLE"""\n    return np.sqrt(np.mean((np.log1p(y_pred) - np.log1p(y_true)) ** 2))\n\n# Эквивалентно: RMSE на log(1 + y)\ndef rmsle_via_log(y_true, y_pred):\n    return np.sqrt(np.mean((np.log1p(y_pred) - np.log1p(y_true)) ** 2))\n\n# Пример\ny_true = np.array([200000, 150000, 300000, 100000, 450000])\ny_pred = np.array([210000, 140000, 280000, 110000, 420000])\n\nprint(f"RMSLE: {rmsle(y_true, y_pred):.4f}")\nprint(f"RMSE:  {np.sqrt(np.mean((y_true - y_pred)**2)):.0f}")\n\n# Почему RMSLE, а не RMSE?\n# RMSLE не штрафует за ошибки на дорогих домах так сильно\ny_true2 = np.array([100000, 500000])\ny_pred2 = np.array([120000, 480000])  # ошибка 20k на обоих\nprint(f"\\nОшибка 20k на дешёвом доме (RMSLE): {rmsle(np.array([100000]), np.array([120000])):.4f}")\nprint(f"Ошибка 20k на дорогом доме (RMSLE): {rmsle(np.array([500000]), np.array([480000])):.4f}")\nprint("RMSLE штрафует больше за относительную ошибку!")'
        },
        {
          type: 'heading',
          value: 'Категории признаков'
        },
        {
          type: 'list',
          value: [
            'Площадь: GrLivArea, TotalBsmtSF, 1stFlrSF, 2ndFlrSF, GarageArea, LotArea',
            'Качество: OverallQual (1-10), OverallCond, ExterQual, KitchenQual',
            'Возраст: YearBuilt, YearRemodAdd, GarageYrBlt',
            'Комнаты: TotRmsAbvGrd, BedroomAbvGr, FullBath, HalfBath',
            'Район: Neighborhood (25 районов), MSZoning',
            'Тип дома: BldgType, HouseStyle, MSSubClass',
            'Подвал: BsmtQual, BsmtCond, BsmtFinSF1, BsmtUnfSF',
            'Гараж: GarageType, GarageCars, GarageArea, GarageQual'
          ]
        },
        {
          type: 'tip',
          value: 'Самые важные признаки: OverallQual, GrLivArea, GarageCars, TotalBsmtSF, YearBuilt. OverallQual — самый сильный предиктор цены (корреляция ~0.79).'
        }
      ]
    },
    {
      id: 2,
      title: 'EDA: анализ 80 фичей',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Стратегия EDA для большого числа признаков'
        },
        {
          type: 'text',
          value: 'С 79 признаками нельзя визуализировать каждый отдельно. Стратегия: (1) корреляции с целевой, (2) распределение SalePrice, (3) scatter-plots топ-признаков, (4) пропуски, (5) выбросы.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import pandas as pd\nimport numpy as np\n\n# Создаём реалистичный датасет Ames Housing\nnp.random.seed(42)\nn = 1460\n\ndf = pd.DataFrame({\n    "Id": range(1, n+1),\n    "OverallQual": np.random.choice(range(1,11), n, p=[0.01,0.02,0.04,0.08,0.15,0.22,0.2,0.15,0.08,0.05]),\n    "GrLivArea": np.random.normal(1500, 400, n).clip(400, 4000).astype(int),\n    "GarageCars": np.random.choice([0,1,2,3,4], n, p=[0.05,0.15,0.55,0.2,0.05]),\n    "GarageArea": np.random.normal(470, 150, n).clip(0, 1200).astype(int),\n    "TotalBsmtSF": np.random.normal(1050, 350, n).clip(0, 3000).astype(int),\n    "1stFlrSF": np.random.normal(1100, 300, n).clip(400, 3000).astype(int),\n    "FullBath": np.random.choice([0,1,2,3], n, p=[0.01,0.35,0.55,0.09]),\n    "TotRmsAbvGrd": np.random.choice(range(3,13), n),\n    "YearBuilt": np.random.randint(1880, 2011, n),\n    "YearRemodAdd": np.random.randint(1950, 2011, n),\n    "LotArea": np.random.lognormal(9.1, 0.5, n).astype(int),\n    "Neighborhood": np.random.choice(["NAmes","CollgCr","OldTown","Edwards","Somerst",\n                                       "NridgHt","Gilbert","Sawyer","NWAmes","BrkSide"], n),\n    "ExterQual": np.random.choice(["Ex","Gd","TA","Fa"], n, p=[0.05,0.35,0.5,0.1]),\n    "KitchenQual": np.random.choice(["Ex","Gd","TA","Fa"], n, p=[0.08,0.40,0.42,0.10]),\n})\n\n# Генерация реалистичной цены\nqual_price = {1:50,2:60,3:70,4:80,5:100,6:120,7:140,8:170,9:200,10:250}\nneighb_mult = {"NAmes":0.9,"CollgCr":1.1,"OldTown":0.75,"Edwards":0.8,\n               "Somerst":1.15,"NridgHt":1.4,"Gilbert":1.05,"Sawyer":0.85,\n               "NWAmes":1.0,"BrkSide":0.7}\n\ndf["SalePrice"] = (\n    df["OverallQual"].map(qual_price) * df["GrLivArea"] * 0.1 +\n    df["GarageArea"] * 30 + df["TotalBsmtSF"] * 25 +\n    (2010 - df["YearBuilt"]) * (-200) +\n    df["Neighborhood"].map(neighb_mult) * 30000 +\n    np.random.normal(0, 15000, n)\n).clip(35000).astype(int)\n\n# Распределение SalePrice\nprint("=== Распределение SalePrice ===")\nprint(f"Mean:   ${df[\'SalePrice\'].mean():,.0f}")\nprint(f"Median: ${df[\'SalePrice\'].median():,.0f}")\nprint(f"Std:    ${df[\'SalePrice\'].std():,.0f}")\nprint(f"Min:    ${df[\'SalePrice\'].min():,.0f}")\nprint(f"Max:    ${df[\'SalePrice\'].max():,.0f}")\nprint(f"Skew:   {df[\'SalePrice\'].skew():.2f}")\n\n# Log-transform SalePrice\ndf["LogPrice"] = np.log1p(df["SalePrice"])\nprint(f"\\nLog SalePrice skew: {df[\'LogPrice\'].skew():.2f} (должно быть ближе к 0)")'
        },
        {
          type: 'heading',
          value: 'Корреляции и выбросы'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Топ корреляции с SalePrice\nnum_cols = df.select_dtypes(include=[np.number]).columns.drop(["Id","SalePrice","LogPrice"])\ncorrelations = df[num_cols].corrwith(df["SalePrice"]).sort_values(ascending=False)\n\nprint("=== Топ корреляции с SalePrice ===")\nfor feat, corr in correlations.head(10).items():\n    print(f"  {feat:20s}: {corr:.3f}")\n\n# Выбросы\nprint("\\n=== Выбросы ===")\nprint(f"Дома > $500k: {(df[\'SalePrice\'] > 500000).sum()}")\nprint(f"GrLivArea > 3500: {(df[\'GrLivArea\'] > 3500).sum()}")\nprint(f"LotArea > 50000: {(df[\'LotArea\'] > 50000).sum()}")\n\n# Удаление экстремальных выбросов (рекомендация от конкурса)\noutliers = df[(df["GrLivArea"] > 3500) & (df["SalePrice"] < 300000)]\nprint(f"\\nОпасные выбросы (большая площадь, низкая цена): {len(outliers)}")\nprint("Эти точки стоит удалить — они портят модель!")\n\n# Пропуски (в реальном датасете)\nmissing_example = {\n    "PoolQC": "99.5%", "MiscFeature": "96.3%", "Alley": "93.8%",\n    "Fence": "80.8%", "FireplaceQu": "47.3%", "LotFrontage": "17.7%",\n    "GarageYrBlt": "5.5%", "MasVnrArea": "0.5%"\n}\nprint("\\n=== Пропуски в реальном Ames Housing ===")\nfor col, pct in missing_example.items():\n    print(f"  {col:20s}: {pct}")'
        },
        {
          type: 'warning',
          value: 'В Ames Housing есть 2 известных выброса: дома с GrLivArea > 4000, но низкой ценой. Автор датасета рекомендует их удалить. Всегда проверяйте scatter-plot GrLivArea vs SalePrice!'
        }
      ]
    },
    {
      id: 3,
      title: 'Практика: Полный EDA',
      type: 'practice',
      difficulty: 'easy',
      description: 'Проведите полный EDA для датасета House Prices: распределения, корреляции, пропуски, выбросы.',
      requirements: [
        'Создайте датасет из 1460 домов с 15+ числовыми и 5+ категориальными признаками',
        'Рассчитайте и выведите топ-10 корреляций числовых признаков с SalePrice',
        'Проверьте скошенность (skew) SalePrice и примените log-transform',
        'Найдите признаки с пропусками (имитируйте 5+ столбцов с пропусками)',
        'Выявите выбросы по GrLivArea и LotArea (> 3 std от среднего)'
      ],
      hint: 'Используйте df.skew() для проверки скошенности. Log-transform: np.log1p(). Выбросы: значения за пределами mean +/- 3*std.',
      expectedOutput: 'House Prices EDA:\nВсего: 1460 домов, XX признаков\nМедианная цена: $XXX,XXX\n\nТоп-10 корреляций:\n  OverallQual: 0.XX\n  GrLivArea: 0.XX\n  ...\n\nSkew SalePrice: X.XX -> Log: X.XX\nПропуски: X столбцов\nВыбросы: X домов',
      solution: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\nn = 1460\n\ndf = pd.DataFrame({\n    "OverallQual": np.random.choice(range(1,11), n, p=[0.01,0.02,0.04,0.08,0.15,0.22,0.2,0.15,0.08,0.05]),\n    "GrLivArea": np.random.normal(1500, 400, n).clip(400, 4500).astype(int),\n    "GarageCars": np.random.choice([0,1,2,3], n, p=[0.05,0.2,0.55,0.2]),\n    "GarageArea": np.random.normal(470, 150, n).clip(0, 1200).astype(int),\n    "TotalBsmtSF": np.random.normal(1050, 350, n).clip(0, 3000).astype(int),\n    "1stFlrSF": np.random.normal(1100, 300, n).clip(400, 3000).astype(int),\n    "FullBath": np.random.choice([0,1,2,3], n, p=[0.01,0.35,0.55,0.09]),\n    "TotRmsAbvGrd": np.random.choice(range(3,13), n),\n    "YearBuilt": np.random.randint(1880, 2011, n),\n    "YearRemodAdd": np.random.randint(1950, 2011, n),\n    "LotArea": np.random.lognormal(9.1, 0.5, n).astype(int),\n    "LotFrontage": np.where(np.random.random(n)<0.18, np.nan, np.random.normal(69, 20, n)),\n    "MasVnrArea": np.where(np.random.random(n)<0.01, np.nan, np.random.exponential(50, n)),\n    "BsmtFinSF1": np.random.normal(400, 200, n).clip(0, 2000).astype(int),\n    "WoodDeckSF": np.where(np.random.random(n)<0.3, 0, np.random.normal(100, 60, n).clip(0,500)),\n    "Neighborhood": np.random.choice(["NAmes","CollgCr","OldTown","Edwards","Somerst",\n                                       "NridgHt","Gilbert","Sawyer","NWAmes","BrkSide"], n),\n    "ExterQual": np.random.choice(["Ex","Gd","TA","Fa"], n, p=[0.05,0.35,0.5,0.1]),\n    "KitchenQual": np.random.choice(["Ex","Gd","TA","Fa"], n, p=[0.08,0.40,0.42,0.10]),\n    "GarageType": np.where(np.random.random(n)<0.05, np.nan,\n                           np.random.choice(["Attchd","Detchd","BuiltIn","None"], n)),\n    "BsmtQual": np.where(np.random.random(n)<0.03, np.nan,\n                         np.random.choice(["Ex","Gd","TA","Fa"], n, p=[0.1,0.4,0.4,0.1])),\n    "FireplaceQu": np.where(np.random.random(n)<0.47, np.nan,\n                            np.random.choice(["Ex","Gd","TA","Fa","Po"], n)),\n})\n\nqual_price = {1:50,2:60,3:70,4:80,5:100,6:120,7:140,8:170,9:200,10:250}\ndf["SalePrice"] = (\n    df["OverallQual"].map(qual_price) * df["GrLivArea"] * 0.1 +\n    df["GarageArea"]*30 + df["TotalBsmtSF"]*25 +\n    (2010-df["YearBuilt"])*(-200) +\n    np.random.normal(0, 15000, n)\n).clip(35000).astype(int)\n\nprint("House Prices EDA:")\nprint(f"Всего: {len(df)} домов, {len(df.columns)-1} признаков")\nprint(f"Медианная цена: ${df[\'SalePrice\'].median():,.0f}")\n\n# Корреляции\nnum_cols = df.select_dtypes(include=[np.number]).columns.drop("SalePrice")\ncorrs = df[num_cols].corrwith(df["SalePrice"]).sort_values(ascending=False)\nprint("\\nТоп-10 корреляций:")\nfor feat, c in corrs.head(10).items():\n    print(f"  {feat:20s}: {c:.3f}")\n\n# Skew\nskew_before = df["SalePrice"].skew()\nlog_skew = np.log1p(df["SalePrice"]).skew()\nprint(f"\\nSkew SalePrice: {skew_before:.2f} -> Log: {log_skew:.2f}")\n\n# Пропуски\nprint("\\nПропуски:")\nmissing_cols = 0\nfor col in df.columns:\n    miss = df[col].isnull().sum()\n    if miss > 0:\n        missing_cols += 1\n        print(f"  {col:20s}: {miss} ({miss/len(df):.1%})")\nprint(f"Столбцов с пропусками: {missing_cols}")\n\n# Выбросы\nfor col in ["GrLivArea", "LotArea"]:\n    mean, std = df[col].mean(), df[col].std()\n    outliers = ((df[col] > mean + 3*std) | (df[col] < mean - 3*std)).sum()\n    print(f"\\nВыбросы {col} (>3 std): {outliers}")\n\ntotal_outliers = ((df["GrLivArea"] > df["GrLivArea"].mean() + 3*df["GrLivArea"].std()) |\n                  (df["LotArea"] > df["LotArea"].mean() + 3*df["LotArea"].std())).sum()\nprint(f"Всего домов-выбросов: {total_outliers}")',
      explanation: 'EDA для 80 признаков требует систематического подхода: сначала числовые корреляции, потом распределение целевой переменной (log-transform для скошенных цен), анализ пропусков (решить: удалить/заполнить/отдельный признак), выбросы (удалить опасные). Это фундамент для хорошего score.'
    },
    {
      id: 4,
      title: 'Продвинутый Feature Engineering',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Polynomial Features и Interactions'
        },
        {
          type: 'text',
          value: 'Для House Prices Feature Engineering — главный рычаг улучшения score. Создаём комбинации признаков, полиномы, кодируем ордиальные и категориальные переменные, применяем target encoding.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport pandas as pd\n\nnp.random.seed(42)\nn = 100\ndf = pd.DataFrame({\n    "OverallQual": np.random.choice(range(1,11), n),\n    "GrLivArea": np.random.normal(1500, 400, n).astype(int),\n    "TotalBsmtSF": np.random.normal(1050, 350, n).clip(0).astype(int),\n    "GarageArea": np.random.normal(470, 150, n).clip(0).astype(int),\n    "YearBuilt": np.random.randint(1950, 2011, n),\n    "YearRemodAdd": np.random.randint(1960, 2011, n),\n    "1stFlrSF": np.random.normal(1100, 300, n).astype(int),\n    "2ndFlrSF": np.where(np.random.random(n)<0.4, 0, np.random.normal(600,150,n).astype(int)),\n    "BsmtFinSF1": np.random.normal(400, 200, n).clip(0).astype(int),\n    "WoodDeckSF": np.random.exponential(80, n).astype(int),\n    "OpenPorchSF": np.random.exponential(40, n).astype(int),\n    "FullBath": np.random.choice([1,2,3], n),\n    "HalfBath": np.random.choice([0,1], n),\n})\n\n# 1. Interactions — комбинации признаков\ndf["TotalSF"] = df["GrLivArea"] + df["TotalBsmtSF"]           # общая площадь\ndf["TotalBath"] = df["FullBath"] + 0.5 * df["HalfBath"]       # всего ванных\ndf["TotalPorchSF"] = df["WoodDeckSF"] + df["OpenPorchSF"]     # площадь веранд\ndf["QualArea"] = df["OverallQual"] * df["GrLivArea"]          # качество * площадь\ndf["HasRemod"] = (df["YearRemodAdd"] > df["YearBuilt"]).astype(int)\ndf["Age"] = 2011 - df["YearBuilt"]\ndf["RemodAge"] = 2011 - df["YearRemodAdd"]\ndf["Has2ndFloor"] = (df["2ndFlrSF"] > 0).astype(int)\ndf["HasBsmt"] = (df["TotalBsmtSF"] > 0).astype(int)\n\nprint("=== Новые признаки ===")\nnew_feats = ["TotalSF","TotalBath","TotalPorchSF","QualArea","Age","Has2ndFloor"]\nfor feat in new_feats:\n    print(f"  {feat}: mean={df[feat].mean():.1f}, std={df[feat].std():.1f}")'
        },
        {
          type: 'heading',
          value: 'Target Encoding и ордиальное кодирование'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport pandas as pd\n\nnp.random.seed(42)\nn = 200\ndf = pd.DataFrame({\n    "Neighborhood": np.random.choice(["NAmes","NridgHt","OldTown","CollgCr","Edwards"], n),\n    "ExterQual": np.random.choice(["Ex","Gd","TA","Fa"], n, p=[0.05,0.35,0.5,0.1]),\n    "KitchenQual": np.random.choice(["Ex","Gd","TA","Fa"], n, p=[0.08,0.40,0.42,0.10]),\n    "BsmtQual": np.random.choice(["Ex","Gd","TA","Fa","NA"], n, p=[0.1,0.3,0.35,0.15,0.1]),\n    "SalePrice": np.random.normal(180000, 50000, n).clip(50000).astype(int)\n})\n\n# Ордиальное кодирование качественных признаков\nqual_map = {"Ex": 5, "Gd": 4, "TA": 3, "Fa": 2, "Po": 1, "NA": 0}\nfor col in ["ExterQual", "KitchenQual", "BsmtQual"]:\n    df[f"{col}_ord"] = df[col].map(qual_map)\n\nprint("=== Ордиальное кодирование ===")\nprint(df[["ExterQual", "ExterQual_ord", "KitchenQual", "KitchenQual_ord"]].head())\n\n# Target Encoding — средняя цена по категории\nprint("\\n=== Target Encoding (Neighborhood) ===")\ntarget_enc = df.groupby("Neighborhood")["SalePrice"].mean().sort_values(ascending=False)\nfor neigh, price in target_enc.items():\n    print(f"  {neigh:12s}: ${price:,.0f}")\n\n# Применение target encoding с регуляризацией\nglobal_mean = df["SalePrice"].mean()\nalpha = 10  # сила регуляризации\n\ndef smooth_target_encode(group_mean, count, global_mean, alpha):\n    """Сглаженный target encoding"""\n    return (count * group_mean + alpha * global_mean) / (count + alpha)\n\nstats = df.groupby("Neighborhood")["SalePrice"].agg(["mean", "count"])\ndf["Neigh_target"] = df["Neighborhood"].map(\n    stats.apply(lambda x: smooth_target_encode(x["mean"], x["count"], global_mean, alpha), axis=1)\n)\n\nprint(f"\\nGlobal mean: ${global_mean:,.0f}")\nprint(f"Target encoded (smoothed):")\nfor neigh in ["NridgHt", "NAmes", "OldTown"]:\n    val = df[df["Neighborhood"]==neigh]["Neigh_target"].iloc[0]\n    print(f"  {neigh}: ${val:,.0f}")'
        },
        {
          type: 'warning',
          value: 'Target encoding создаёт утечку данных (data leakage)! Всегда применяйте его внутри кросс-валидации: кодируйте на train-фолдах, применяйте на validation-фолде. Или используйте сглаживание (smoothing) с регуляризацией.'
        }
      ]
    },
    {
      id: 5,
      title: 'Практика: Feature Pipeline',
      type: 'practice',
      difficulty: 'medium',
      description: 'Создайте полный pipeline feature engineering для House Prices: преобразования, новые признаки, кодирование.',
      requirements: [
        'Создайте датасет из 1460 домов с 15+ признаками и SalePrice',
        'Реализуйте функцию feature_engineering(): TotalSF, QualArea, Age, TotalBath, ордиальное кодирование',
        'Примените log-transform к скошенным числовым признакам (skew > 0.75)',
        'Заполните пропуски: числовые — медианой, категориальные — "None"',
        'Выведите итоговое число признаков и топ-5 по корреляции с LogPrice'
      ],
      hint: 'Для массового log-transform: для каждого числового столбца проверьте skew(), если > 0.75 — примените np.log1p(). Ордиальные качественные признаки: Ex=5, Gd=4, TA=3, Fa=2, Po=1.',
      expectedOutput: 'Feature Pipeline:\nИсходных признаков: XX\nПосле FE: XX\n\nПропуски заполнены: XX столбцов\nLog-transform: XX столбцов (skew > 0.75)\n\nТоп-5 корреляций с LogPrice:\n  ...',
      solution: 'import pandas as pd\nimport numpy as np\n\nnp.random.seed(42)\nn = 1460\n\ndf = pd.DataFrame({\n    "OverallQual": np.random.choice(range(1,11), n, p=[0.01,0.02,0.04,0.08,0.15,0.22,0.2,0.15,0.08,0.05]),\n    "GrLivArea": np.random.normal(1500, 400, n).clip(400, 4000).astype(int),\n    "TotalBsmtSF": np.random.normal(1050, 350, n).clip(0, 3000).astype(int),\n    "GarageArea": np.random.normal(470, 150, n).clip(0, 1200).astype(int),\n    "GarageCars": np.random.choice([0,1,2,3], n, p=[0.05,0.2,0.55,0.2]),\n    "1stFlrSF": np.random.normal(1100, 300, n).clip(400, 3000).astype(int),\n    "2ndFlrSF": np.where(np.random.random(n)<0.4, 0, np.random.normal(600,150,n).clip(0).astype(int)),\n    "FullBath": np.random.choice([1,2,3], n),\n    "HalfBath": np.random.choice([0,1], n),\n    "YearBuilt": np.random.randint(1880, 2011, n),\n    "YearRemodAdd": np.random.randint(1950, 2011, n),\n    "LotArea": np.random.lognormal(9.1, 0.5, n).astype(int),\n    "LotFrontage": np.where(np.random.random(n)<0.18, np.nan, np.random.normal(69,20,n)),\n    "MasVnrArea": np.where(np.random.random(n)<0.01, np.nan, np.random.exponential(50,n)),\n    "WoodDeckSF": np.random.exponential(80, n).astype(int),\n    "OpenPorchSF": np.random.exponential(40, n).astype(int),\n    "ExterQual": np.random.choice(["Ex","Gd","TA","Fa"], n, p=[0.05,0.35,0.5,0.1]),\n    "KitchenQual": np.random.choice(["Ex","Gd","TA","Fa"], n, p=[0.08,0.40,0.42,0.10]),\n    "BsmtQual": np.where(np.random.random(n)<0.03, np.nan,\n                         np.random.choice(["Ex","Gd","TA","Fa"], n)),\n    "Neighborhood": np.random.choice(["NAmes","CollgCr","OldTown","Edwards","NridgHt"], n),\n})\n\nqual_p = {1:50,2:60,3:70,4:80,5:100,6:120,7:140,8:170,9:200,10:250}\ndf["SalePrice"] = (df["OverallQual"].map(qual_p)*df["GrLivArea"]*0.1 +\n                   df["GarageArea"]*30 + df["TotalBsmtSF"]*25 +\n                   np.random.normal(0,15000,n)).clip(35000).astype(int)\n\norig_count = len(df.columns) - 1\n\ndef feature_engineering(df):\n    df = df.copy()\n    df["TotalSF"] = df["GrLivArea"] + df["TotalBsmtSF"]\n    df["QualArea"] = df["OverallQual"] * df["GrLivArea"]\n    df["Age"] = 2011 - df["YearBuilt"]\n    df["RemodAge"] = 2011 - df["YearRemodAdd"]\n    df["TotalBath"] = df["FullBath"] + 0.5 * df["HalfBath"]\n    df["TotalPorchSF"] = df["WoodDeckSF"] + df["OpenPorchSF"]\n    df["Has2ndFloor"] = (df["2ndFlrSF"] > 0).astype(int)\n    df["HasGarage"] = (df["GarageArea"] > 0).astype(int)\n    qual_map = {"Ex":5, "Gd":4, "TA":3, "Fa":2, "Po":1}\n    for col in ["ExterQual", "KitchenQual", "BsmtQual"]:\n        df[f"{col}_ord"] = df[col].map(qual_map)\n    return df\n\ndf = feature_engineering(df)\n\n# Заполнение пропусков\nfilled = 0\nfor col in df.columns:\n    if df[col].isnull().sum() > 0:\n        if df[col].dtype == "object":\n            df[col].fillna("None", inplace=True)\n        else:\n            df[col].fillna(df[col].median(), inplace=True)\n        filled += 1\n\n# Log-transform skewed features\ndf["LogPrice"] = np.log1p(df["SalePrice"])\nnum_cols = df.select_dtypes(include=[np.number]).columns.drop(["SalePrice","LogPrice"])\nskewed_count = 0\nfor col in num_cols:\n    if df[col].skew() > 0.75:\n        df[col] = np.log1p(df[col])\n        skewed_count += 1\n\nfinal_count = len(df.columns) - 2  # minus SalePrice and LogPrice\n\nprint("Feature Pipeline:")\nprint(f"Исходных признаков: {orig_count}")\nprint(f"После FE: {final_count}")\nprint(f"\\nПропуски заполнены: {filled} столбцов")\nprint(f"Log-transform: {skewed_count} столбцов (skew > 0.75)")\n\ncorrs = df.select_dtypes(include=[np.number]).drop(columns=["SalePrice"]).corrwith(df["LogPrice"]).sort_values(ascending=False)\nprint("\\nТоп-5 корреляций с LogPrice:")\nfor feat, c in corrs.head(5).items():\n    print(f"  {feat:20s}: {c:.3f}")',
      explanation: 'Feature pipeline для House Prices включает: создание агрегированных признаков (TotalSF, TotalBath), взаимодействия (QualArea = качество * площадь), ордиальное кодирование качественных оценок, log-transform скошенных распределений. Этот pipeline — основа для score < 0.13.'
    },
    {
      id: 6,
      title: 'Стекинг моделей для регрессии',
      type: 'theory',
      content: [
        {
          type: 'heading',
          value: 'Стратегия моделирования для House Prices'
        },
        {
          type: 'text',
          value: 'В House Prices лучше всего работают: (1) регуляризованные линейные модели (Ridge, Lasso, ElasticNet) — они хороши при многих фичах, (2) gradient boosting (XGBoost, LightGBM) — ловят нелинейности, (3) stacking — объединяет преимущества разных моделей.'
        },
        {
          type: 'code',
          language: 'python',
          value: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import cross_val_score, KFold\nfrom sklearn.preprocessing import StandardScaler, LabelEncoder\nfrom sklearn.linear_model import Ridge, Lasso, ElasticNet\nfrom sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor\nfrom sklearn.pipeline import Pipeline\n\n# Подготовка данных\nnp.random.seed(42)\nn = 1460\ndf = pd.DataFrame({\n    "OverallQual": np.random.choice(range(1,11), n, p=[0.01,0.02,0.04,0.08,0.15,0.22,0.2,0.15,0.08,0.05]),\n    "GrLivArea": np.random.normal(1500,400,n).clip(400,4000).astype(int),\n    "TotalBsmtSF": np.random.normal(1050,350,n).clip(0,3000).astype(int),\n    "GarageArea": np.random.normal(470,150,n).clip(0,1200).astype(int),\n    "YearBuilt": np.random.randint(1880,2011,n),\n    "FullBath": np.random.choice([1,2,3], n),\n    "Neighborhood": np.random.choice(["NAmes","NridgHt","OldTown","CollgCr","Edwards"], n),\n})\nneigh_enc = LabelEncoder().fit_transform(df["Neighborhood"])\ndf["Neigh_enc"] = neigh_enc\n\nqp = {1:50,2:60,3:70,4:80,5:100,6:120,7:140,8:170,9:200,10:250}\ndf["SalePrice"] = (df["OverallQual"].map(qp)*df["GrLivArea"]*0.1 +\n                   df["GarageArea"]*30 + df["TotalBsmtSF"]*25 +\n                   np.random.normal(0,15000,n)).clip(35000).astype(int)\n\ndf["TotalSF"] = df["GrLivArea"] + df["TotalBsmtSF"]\ndf["QualArea"] = df["OverallQual"] * df["GrLivArea"]\ndf["Age"] = 2011 - df["YearBuilt"]\n\nfeats = ["OverallQual","GrLivArea","TotalBsmtSF","GarageArea","YearBuilt",\n         "FullBath","Neigh_enc","TotalSF","QualArea","Age"]\nX = df[feats].values\ny = np.log1p(df["SalePrice"].values)  # log-transform\n\nkfold = KFold(n_splits=5, shuffle=True, random_state=42)\n\nmodels = {\n    "Ridge": Pipeline([("s", StandardScaler()), ("m", Ridge(alpha=10))]),\n    "Lasso": Pipeline([("s", StandardScaler()), ("m", Lasso(alpha=0.001))]),\n    "ElasticNet": Pipeline([("s", StandardScaler()), ("m", ElasticNet(alpha=0.001, l1_ratio=0.5))]),\n    "GBR": GradientBoostingRegressor(n_estimators=300, max_depth=4, learning_rate=0.05, random_state=42),\n    "RF": RandomForestRegressor(n_estimators=200, max_depth=10, random_state=42),\n}\n\nprint("=== Модели (5-fold CV, RMSE на log-ценах) ===")\nfor name, model in models.items():\n    neg_mse = cross_val_score(model, X, y, cv=kfold, scoring="neg_mean_squared_error")\n    rmse = np.sqrt(-neg_mse)\n    print(f"  {name:12s}: RMSLE = {rmse.mean():.4f} (+/- {rmse.std():.4f})")'
        },
        {
          type: 'heading',
          value: 'Stacking: как это работает'
        },
        {
          type: 'code',
          language: 'python',
          value: '# Stacking регрессия — пошаговое объяснение\n# 1. Базовые модели делают out-of-fold предсказания\n# 2. Эти предсказания — входные признаки для мета-модели\n# 3. Мета-модель учится оптимально комбинировать базовые модели\n\nfrom sklearn.model_selection import cross_val_predict\n\n# Шаг 1: Out-of-fold предсказания базовых моделей\nbase_models = {\n    "Ridge": Pipeline([("s", StandardScaler()), ("m", Ridge(alpha=10))]),\n    "GBR": GradientBoostingRegressor(n_estimators=300, max_depth=4,\n                                      learning_rate=0.05, random_state=42),\n}\n\n# Out-of-fold: каждое предсказание сделано моделью, которая НЕ видела эту точку\noof_preds = {}\nfor name, model in base_models.items():\n    oof = cross_val_predict(model, X, y, cv=kfold)\n    oof_preds[name] = oof\n    rmse = np.sqrt(np.mean((oof - y) ** 2))\n    print(f"OOF {name}: RMSLE = {rmse:.4f}")\n\n# Шаг 2: Мета-признаки\nmeta_X = np.column_stack([oof_preds["Ridge"], oof_preds["GBR"]])\nprint(f"\\nМета-признаки shape: {meta_X.shape}")\n\n# Шаг 3: Мета-модель (обычно простая линейная)\nmeta_model = Ridge(alpha=1.0)\nmeta_scores = cross_val_score(meta_model, meta_X, y, cv=kfold, scoring="neg_mean_squared_error")\nmeta_rmse = np.sqrt(-meta_scores)\nprint(f"Stacking RMSLE: {meta_rmse.mean():.4f}")\nprint("\\nStacking обычно лучше любой отдельной модели!")'
        },
        {
          type: 'note',
          value: 'Для House Prices типичный топ-подход: stacking из Ridge + Lasso + ElasticNet + XGBoost + LightGBM с мета-моделью Ridge. Это даёт RMSLE ~0.11-0.12, что входит в топ-10%.'
        }
      ]
    },
    {
      id: 7,
      title: 'Практика: Stacking Ensemble',
      type: 'practice',
      difficulty: 'hard',
      description: 'Реализуйте stacking ensemble из 4+ моделей для предсказания цен домов.',
      requirements: [
        'Подготовьте датасет House Prices с feature engineering (1460 домов)',
        'Реализуйте stacking вручную: out-of-fold предсказания 4 базовых моделей (Ridge, Lasso, GBR, RF)',
        'Обучите мета-модель (Ridge) на OOF предсказаниях',
        'Сравните RMSLE: каждая отдельная модель vs stacking',
        'Выведите вклад каждой базовой модели (коэффициенты мета-модели)'
      ],
      hint: 'Используйте cross_val_predict для out-of-fold предсказаний. Мета-модель обучайте на столбцах OOF предсказаний. Нормализуйте OOF предсказания перед мета-моделью.',
      expectedOutput: 'Stacking Ensemble:\nБазовые модели (RMSLE):\n  Ridge: 0.XXXX\n  Lasso: 0.XXXX\n  GBR: 0.XXXX\n  RF: 0.XXXX\n\nStacking RMSLE: 0.XXXX\nУлучшение: X.XX%\n\nВеса мета-модели:\n  Ridge: X.XX\n  ...',
      solution: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import cross_val_score, cross_val_predict, KFold\nfrom sklearn.preprocessing import StandardScaler, LabelEncoder\nfrom sklearn.linear_model import Ridge, Lasso\nfrom sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor\nfrom sklearn.pipeline import Pipeline\n\nnp.random.seed(42)\nn = 1460\ndf = pd.DataFrame({\n    "OverallQual": np.random.choice(range(1,11), n, p=[0.01,0.02,0.04,0.08,0.15,0.22,0.2,0.15,0.08,0.05]),\n    "GrLivArea": np.random.normal(1500,400,n).clip(400,4000).astype(int),\n    "TotalBsmtSF": np.random.normal(1050,350,n).clip(0,3000).astype(int),\n    "GarageArea": np.random.normal(470,150,n).clip(0,1200).astype(int),\n    "YearBuilt": np.random.randint(1880,2011,n),\n    "FullBath": np.random.choice([1,2,3], n),\n    "Neighborhood": np.random.choice(["NAmes","NridgHt","OldTown","CollgCr","Edwards"], n),\n})\ndf["Neigh_enc"] = LabelEncoder().fit_transform(df["Neighborhood"])\nqp = {1:50,2:60,3:70,4:80,5:100,6:120,7:140,8:170,9:200,10:250}\ndf["SalePrice"] = (df["OverallQual"].map(qp)*df["GrLivArea"]*0.1 +\n                   df["GarageArea"]*30 + df["TotalBsmtSF"]*25 +\n                   np.random.normal(0,15000,n)).clip(35000).astype(int)\n\ndf["TotalSF"] = df["GrLivArea"] + df["TotalBsmtSF"]\ndf["QualArea"] = df["OverallQual"] * df["GrLivArea"]\ndf["Age"] = 2011 - df["YearBuilt"]\n\nfeats = ["OverallQual","GrLivArea","TotalBsmtSF","GarageArea","YearBuilt",\n         "FullBath","Neigh_enc","TotalSF","QualArea","Age"]\nX = df[feats].values\ny = np.log1p(df["SalePrice"].values)\n\nkfold = KFold(n_splits=5, shuffle=True, random_state=42)\n\nbase_models = {\n    "Ridge": Pipeline([("s", StandardScaler()), ("m", Ridge(alpha=10))]),\n    "Lasso": Pipeline([("s", StandardScaler()), ("m", Lasso(alpha=0.001, max_iter=5000))]),\n    "GBR": GradientBoostingRegressor(n_estimators=300, max_depth=4, learning_rate=0.05, random_state=42),\n    "RF": RandomForestRegressor(n_estimators=200, max_depth=10, random_state=42),\n}\n\nprint("Stacking Ensemble:")\nprint("Базовые модели (RMSLE):")\noof_predictions = {}\nbest_single_rmse = float("inf")\nfor name, model in base_models.items():\n    oof = cross_val_predict(model, X, y, cv=kfold)\n    oof_predictions[name] = oof\n    rmse = np.sqrt(np.mean((oof - y) ** 2))\n    if rmse < best_single_rmse:\n        best_single_rmse = rmse\n    print(f"  {name}: {rmse:.4f}")\n\n# Мета-признаки\nmeta_X = np.column_stack(list(oof_predictions.values()))\n\n# Мета-модель\nscaler = StandardScaler()\nmeta_X_scaled = scaler.fit_transform(meta_X)\nmeta_model = Ridge(alpha=1.0)\nmeta_oof = cross_val_predict(meta_model, meta_X_scaled, y, cv=kfold)\nstack_rmse = np.sqrt(np.mean((meta_oof - y) ** 2))\n\nprint(f"\\nStacking RMSLE: {stack_rmse:.4f}")\nimprovement = (best_single_rmse - stack_rmse) / best_single_rmse * 100\nprint(f"Улучшение: {improvement:.2f}%")\n\n# Веса мета-модели\nmeta_model.fit(meta_X_scaled, y)\nprint("\\nВеса мета-модели:")\nfor name, coef in zip(base_models.keys(), meta_model.coef_):\n    print(f"  {name}: {coef:.3f}")',
      explanation: 'Stacking работает, потому что разные модели ошибаются на разных точках. Ridge/Lasso хороши для линейных зависимостей, GBR ловит нелинейности, RF устойчив к выбросам. Мета-модель учится, когда доверять какой модели. Обычно stacking даёт +1-3% к лучшей одиночной модели.'
    },
    {
      id: 8,
      title: 'Практика: Топ-10% решение',
      type: 'practice',
      difficulty: 'hard',
      description: 'Создайте полный pipeline для House Prices конкурса, нацеленный на RMSLE < 0.12 (топ-10% на Kaggle).',
      requirements: [
        'Создайте train (1460) и test (1459) датасеты с полным набором признаков',
        'Реализуйте полный pipeline: outlier removal, FE, encoding, log-transforms',
        'Обучите stacking из Ridge, Lasso, ElasticNet, GBR (4+ модели)',
        'Рассчитайте CV RMSLE и сформируйте submission',
        'Выведите итоговый RMSLE и статистику предсказанных цен'
      ],
      hint: 'Удалите 2 выброса (GrLivArea > 4000, низкая цена). Используйте ElasticNet с alpha=0.001, l1_ratio=0.5. Для stacking: OOF + простое усреднение (weighted average) часто работает не хуже мета-модели.',
      expectedOutput: 'House Prices — Топ-10% Pipeline:\nTrain: 1458 (после удаления выбросов)\nTest: 1459\nПризнаков: XX\n\nCV RMSLE: 0.XXXX\n\nSubmission:\n  Средняя цена: $XXX,XXX\n  Мин/Макс: $XX,XXX / $XXX,XXX',
      solution: 'import numpy as np\nimport pandas as pd\nfrom sklearn.model_selection import cross_val_predict, KFold\nfrom sklearn.preprocessing import StandardScaler, LabelEncoder\nfrom sklearn.linear_model import Ridge, Lasso, ElasticNet\nfrom sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor\nfrom sklearn.pipeline import Pipeline\n\nnp.random.seed(42)\n\ndef create_house_data(n, seed):\n    np.random.seed(seed)\n    df = pd.DataFrame({\n        "Id": range(1, n+1),\n        "OverallQual": np.random.choice(range(1,11), n, p=[0.01,0.02,0.04,0.08,0.15,0.22,0.2,0.15,0.08,0.05]),\n        "GrLivArea": np.random.normal(1500,400,n).clip(400,4500).astype(int),\n        "TotalBsmtSF": np.random.normal(1050,350,n).clip(0,3000).astype(int),\n        "GarageArea": np.random.normal(470,150,n).clip(0,1200).astype(int),\n        "GarageCars": np.random.choice([0,1,2,3], n, p=[0.05,0.2,0.55,0.2]),\n        "1stFlrSF": np.random.normal(1100,300,n).clip(400,3000).astype(int),\n        "2ndFlrSF": np.where(np.random.random(n)<0.4, 0, np.random.normal(600,150,n).clip(0).astype(int)),\n        "FullBath": np.random.choice([1,2,3], n),\n        "HalfBath": np.random.choice([0,1], n),\n        "YearBuilt": np.random.randint(1880,2011,n),\n        "YearRemodAdd": np.random.randint(1950,2011,n),\n        "LotArea": np.random.lognormal(9.1,0.5,n).astype(int),\n        "LotFrontage": np.where(np.random.random(n)<0.18, np.nan, np.random.normal(69,20,n)),\n        "WoodDeckSF": np.random.exponential(80,n).astype(int),\n        "OpenPorchSF": np.random.exponential(40,n).astype(int),\n        "ExterQual": np.random.choice(["Ex","Gd","TA","Fa"], n, p=[0.05,0.35,0.5,0.1]),\n        "KitchenQual": np.random.choice(["Ex","Gd","TA","Fa"], n, p=[0.08,0.40,0.42,0.10]),\n        "BsmtQual": np.where(np.random.random(n)<0.03, np.nan,\n                             np.random.choice(["Ex","Gd","TA","Fa"], n)),\n        "Neighborhood": np.random.choice(["NAmes","NridgHt","OldTown","CollgCr","Edwards",\n                                           "Somerst","Gilbert","Sawyer","NWAmes","BrkSide"], n),\n    })\n    return df\n\ndef full_pipeline(df):\n    df = df.copy()\n    # Feature Engineering\n    df["TotalSF"] = df["GrLivArea"] + df["TotalBsmtSF"]\n    df["QualArea"] = df["OverallQual"] * df["GrLivArea"]\n    df["Age"] = 2011 - df["YearBuilt"]\n    df["RemodAge"] = 2011 - df["YearRemodAdd"]\n    df["TotalBath"] = df["FullBath"] + 0.5 * df["HalfBath"]\n    df["TotalPorchSF"] = df["WoodDeckSF"] + df["OpenPorchSF"]\n    df["Has2ndFloor"] = (df["2ndFlrSF"] > 0).astype(int)\n    df["HasGarage"] = (df["GarageArea"] > 0).astype(int)\n    # Ordinal encoding\n    qual_map = {"Ex":5,"Gd":4,"TA":3,"Fa":2,"Po":1}\n    for col in ["ExterQual","KitchenQual","BsmtQual"]:\n        df[f"{col}_ord"] = df[col].map(qual_map)\n    # Label encoding\n    df["Neigh_enc"] = LabelEncoder().fit_transform(df["Neighborhood"])\n    # Fill missing\n    for col in df.select_dtypes(include=[np.number]).columns:\n        df[col].fillna(df[col].median(), inplace=True)\n    # Log-transform skewed\n    num_cols = df.select_dtypes(include=[np.number]).columns\n    for col in num_cols:\n        if df[col].skew() > 0.75 and col not in ["Id"]:\n            df[col] = np.log1p(df[col].clip(0))\n    return df\n\n# Создание данных\ntrain_raw = create_house_data(1460, seed=42)\nqp = {1:50,2:60,3:70,4:80,5:100,6:120,7:140,8:170,9:200,10:250}\ntrain_raw["SalePrice"] = (train_raw["OverallQual"].map(qp)*train_raw["GrLivArea"]*0.1 +\n                          train_raw["GarageArea"]*30 + train_raw["TotalBsmtSF"]*25 +\n                          np.random.normal(0,15000,1460)).clip(35000).astype(int)\n\ntest_raw = create_house_data(1459, seed=99)\ntest_ids = test_raw["Id"].copy()\n\n# Удаление выбросов\noutlier_mask = (train_raw["GrLivArea"] > 4000) & (train_raw["SalePrice"] < 300000)\ntrain_raw = train_raw[~outlier_mask].reset_index(drop=True)\n\n# Pipeline\ntrain_fe = full_pipeline(train_raw)\ntest_fe = full_pipeline(test_raw)\n\nfeats = ["OverallQual","GrLivArea","TotalBsmtSF","GarageArea","GarageCars",\n         "1stFlrSF","2ndFlrSF","FullBath","YearBuilt","LotArea","LotFrontage",\n         "WoodDeckSF","TotalSF","QualArea","Age","RemodAge","TotalBath",\n         "TotalPorchSF","Has2ndFloor","HasGarage","ExterQual_ord",\n         "KitchenQual_ord","BsmtQual_ord","Neigh_enc"]\n\nX = train_fe[feats].values\ny = np.log1p(train_fe["SalePrice"].values)\nX_test = test_fe[feats].values\n\nkfold = KFold(n_splits=5, shuffle=True, random_state=42)\n\nmodels = {\n    "Ridge": Pipeline([("s", StandardScaler()), ("m", Ridge(alpha=10))]),\n    "Lasso": Pipeline([("s", StandardScaler()), ("m", Lasso(alpha=0.0005, max_iter=5000))]),\n    "ElasticNet": Pipeline([("s", StandardScaler()), ("m", ElasticNet(alpha=0.001, l1_ratio=0.5, max_iter=5000))]),\n    "GBR": GradientBoostingRegressor(n_estimators=500, max_depth=4, learning_rate=0.03, random_state=42),\n}\n\nprint("House Prices — Топ-10% Pipeline:")\nprint(f"Train: {len(X)} (после удаления выбросов)")\nprint(f"Test: {len(X_test)}")\nprint(f"Признаков: {len(feats)}")\n\n# Stacking\noof_preds = {}\ntest_preds = {}\nprint("\\nБазовые модели:")\nfor name, model in models.items():\n    oof = cross_val_predict(model, X, y, cv=kfold)\n    oof_preds[name] = oof\n    rmse = np.sqrt(np.mean((oof - y) ** 2))\n    print(f"  {name}: RMSLE = {rmse:.4f}")\n    model.fit(X, y)\n    test_preds[name] = model.predict(X_test)\n\n# Weighted average stacking\nweights = {"Ridge": 0.2, "Lasso": 0.2, "ElasticNet": 0.2, "GBR": 0.4}\noof_stack = sum(oof_preds[n] * w for n, w in weights.items())\nstack_rmse = np.sqrt(np.mean((oof_stack - y) ** 2))\nprint(f"\\nCV RMSLE: {stack_rmse:.4f}")\n\n# Final predictions\nfinal_pred_log = sum(test_preds[n] * w for n, w in weights.items())\nfinal_pred = np.expm1(final_pred_log)\n\nsubmission = pd.DataFrame({"Id": test_ids, "SalePrice": final_pred.astype(int)})\nprint(f"\\nSubmission:")\nprint(f"  Средняя цена: ${submission[\'SalePrice\'].mean():,.0f}")\nprint(f"  Мин/Макс: ${submission[\'SalePrice\'].min():,.0f} / ${submission[\'SalePrice\'].max():,.0f}")',
      explanation: 'Топ-10% решение House Prices: удаление выбросов, агрессивный FE (15+ новых фичей), log-transforms, ордиальное кодирование, stacking из 4 моделей с weighted average. На реальном Kaggle этот подход даёт RMSLE 0.11-0.12. Для топ-1% нужны LightGBM, CatBoost, target encoding и более тонкий FE.'
    }
  ]
}
